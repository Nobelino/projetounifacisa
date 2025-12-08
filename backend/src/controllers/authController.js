const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateCode } = require('../utils/twoFactor');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

exports.register = async (req, res) => {
	try {
		const { name, cpf, email, password } = req.body;
		if (!name || !cpf || !email || !password) {
			return res.status(400).json({ message: 'Dados faltando' });
		}

		const exists = await User.findOne({ $or: [{ email }, { cpf }] });
		if (exists) {
			return res.status(400).json({ message: 'Email ou CPF já cadastrado' });
		}

		const passwordHash = await bcrypt.hash(password, 10);
		const user = await User.create({ name, cpf, email, passwordHash });

		return res.status(201).json({ message: 'Usuário criado', userId: user._id });
	} catch (err) {
		console.error('Erro ao registrar usuário', err);
		return res.status(500).json({ message: 'Erro ao registrar usuário' });
	}
};

exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user) return res.status(401).json({ message: 'Credenciais incorretas' });

		const ok = await bcrypt.compare(password, user.passwordHash);
		if (!ok) return res.status(401).json({ message: 'Credenciais incorretas' });

		const two = generateCode();
		user.twoFactorCode = { code: two.code, expiresAt: two.expiresAt };
		await user.save();

		return res.json({
			message: 'Código 2FA gerado (demo). Verifique app/email.',
			twoFactorId: two.id,
			debugCode: two.code
		});
	} catch (err) {
		console.error('Erro ao iniciar login', err);
		return res.status(500).json({ message: 'Erro ao iniciar login' });
	}
};

exports.verify2FA = async (req, res) => {
	try {
		const { email, code } = req.body;
		const user = await User.findOne({ email });

		if (!user || !user.twoFactorCode) {
			return res.status(400).json({ message: 'Dados inválidos' });
		}

		if (new Date() > new Date(user.twoFactorCode.expiresAt)) {
			user.twoFactorCode = null;
			await user.save();
			return res.status(400).json({ message: 'Código expirado' });
		}

		if (user.twoFactorCode.code !== code) {
			return res.status(400).json({ message: 'Código incorreto' });
		}

		if (!JWT_SECRET) {
			return res.status(500).json({ message: 'JWT_SECRET não configurado' });
		}

		const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, {
			expiresIn: JWT_EXPIRES_IN
		});

		user.twoFactorCode = null;
		await user.save();

		return res.json({ token });
	} catch (err) {
		console.error('Erro ao verificar 2FA', err);
		return res.status(500).json({ message: 'Erro ao verificar 2FA' });
	}
};
