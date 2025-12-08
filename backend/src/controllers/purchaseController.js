const Purchase = require('../models/Purchase');
const User = require('../models/User');

exports.recordPurchase = async (req, res) => {
	try {
		const { productId, productType, quantity, totalPrice } = req.body;
		const userId = req.user._id;

		if (!productId || !productType || !quantity || totalPrice === undefined) {
			return res.status(400).json({ message: 'Dados incompletos' });
		}

		const purchase = await Purchase.create({
			userId,
			productId,
			productType,
			quantity,
			totalPrice
		});

		// Atualizar preferências do usuário com base no tipo de produto
		const user = await User.findById(userId);
		if (!user.preferences.includes(productType)) {
			user.preferences.push(productType);
			await user.save();
		}

		return res.status(201).json({ message: 'Compra registrada', purchase });
	} catch (err) {
		console.error('Erro ao registrar compra', err);
		return res.status(500).json({ message: 'Erro ao registrar compra' });
	}
};

exports.getPurchaseHistory = async (req, res) => {
	try {
		const userId = req.user._id;
		const purchases = await Purchase.find({ userId })
			.populate('productId', 'name price type')
			.sort({ purchasedAt: -1 });

		return res.json({ purchases });
	} catch (err) {
		console.error('Erro ao buscar histórico de compras', err);
		return res.status(500).json({ message: 'Erro ao buscar histórico' });
	}
};

exports.getTopCategories = async (req, res) => {
	try {
		const userId = req.user._id;
		const purchases = await Purchase.find({ userId });

		const categoryCount = {};
		purchases.forEach((p) => {
			categoryCount[p.productType] = (categoryCount[p.productType] || 0) + p.quantity;
		});

		const sorted = Object.entries(categoryCount)
			.sort((a, b) => b[1] - a[1])
			.map(([type, count]) => ({ type, count }));

		return res.json({ topCategories: sorted });
	} catch (err) {
		console.error('Erro ao buscar categorias top', err);
		return res.status(500).json({ message: 'Erro ao buscar categorias' });
	}
};
