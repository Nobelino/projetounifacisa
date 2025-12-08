const Product = require('../models/Product');
const Purchase = require('../models/Purchase');

exports.listProducts = async (req, res) => {
	try {
		const userId = req.user?._id;
		const all = await Product.find().lean();

		// Se não há usuário autenticado, retorna todos os produtos sem promoções
		if (!userId) {
			return res.json({ products: all.map(p => ({ ...p, personalizedPromotion: null })) });
		}

		// Buscar histórico de compras do usuário para recomendações mais precisas
		const purchases = await Purchase.find({ userId }).lean();
		const purchasedTypes = {};
		purchases.forEach((p) => {
			purchasedTypes[p.productType] = (purchasedTypes[p.productType] || 0) + p.quantity;
		});

		// Ordenar tipos por quantidade de compras
		const topTypes = Object.entries(purchasedTypes)
			.sort((a, b) => b[1] - a[1])
			.map(([type]) => type);

		const personalized = all.map((p) => {
			const promoActive = p.promotion && p.promotion.active;
			const forTypes = (p.promotion && p.promotion.forTypes) || [];
			
			// Promo é oferecida se está ativa E o tipo está na lista de promos E (produto é do tipo preferido do usuário OU não há preferências)
			const receivesPromo = promoActive && forTypes.length > 0 && forTypes.includes(p.type);

			return {
				...p,
				personalizedPromotion: receivesPromo ? p.promotion : null,
				isFromTopCategory: topTypes.includes(p.type)
			};
		});

		return res.json({ products: personalized, topCategories: topTypes });
	} catch (err) {
		console.error('Erro ao listar produtos', err);
		return res.status(500).json({ message: 'Erro ao listar produtos' });
	}
};

exports.createProduct = async (req, res) => {
	try {
		const prod = await Product.create(req.body);
		return res.status(201).json(prod);
	} catch (err) {
		console.error('Erro ao criar produto', err);
		return res.status(500).json({ message: 'Erro ao criar produto' });
	}
};

exports.updatePromotion = async (req, res) => {
	try {
		const { productId } = req.params;
		const { active, discountPercent, forTypes } = req.body;

		if (discountPercent < 0 || discountPercent > 100) {
			return res.status(400).json({ message: 'Percentual de desconto inválido' });
		}

		const product = await Product.findByIdAndUpdate(
			productId,
			{
				promotion: {
					active,
					discountPercent,
					forTypes: Array.isArray(forTypes) ? forTypes : []
				}
			},
			{ new: true }
		);

		if (!product) {
			return res.status(404).json({ message: 'Produto não encontrado' });
		}

		return res.json({ message: 'Promoção atualizada', product });
	} catch (err) {
		console.error('Erro ao atualizar promoção', err);
		return res.status(500).json({ message: 'Erro ao atualizar promoção' });
	}
};

exports.getAllProducts = async (req, res) => {
	try {
		const products = await Product.find().lean();
		return res.json({ products });
	} catch (err) {
		console.error('Erro ao listar produtos', err);
		return res.status(500).json({ message: 'Erro ao listar produtos' });
	}
};

exports.deleteProduct = async (req, res) => {
	try {
		const { productId } = req.params;

		const product = await Product.findByIdAndDelete(productId);

		if (!product) {
			return res.status(404).json({ message: 'Produto não encontrado' });
		}

		return res.json({ message: 'Produto deletado com sucesso', product });
	} catch (err) {
		console.error('Erro ao deletar produto', err);
		return res.status(500).json({ message: 'Erro ao deletar produto' });
	}
};
