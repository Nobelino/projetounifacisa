const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema(
	{
		userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
		productType: { type: String, required: true },
		quantity: { type: Number, default: 1 },
		totalPrice: { type: Number, required: true },
		purchasedAt: { type: Date, default: Date.now }
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Purchase', purchaseSchema);
