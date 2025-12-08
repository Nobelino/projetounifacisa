const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		price: { type: Number, required: true },
		type: { type: String, required: true },
		description: String,
		expiryDate: Date,
		promotion: {
			active: { type: Boolean, default: false },
			discountPercent: Number,
			forTypes: [String]
		}
	}
);

module.exports = mongoose.model('Product', productSchema);
