require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const requestFilter = require('./middlewares/requestFilter');

const purchaseRoutes = require('./routes/purchaseRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestFilter);

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/purchases', purchaseRoutes);

const PORT = process.env.PORT || 4000;

connectDB(process.env.MONGO_URI)
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Server rodando em http://localhost:${PORT}`);
		});
	})
	.catch((err) => {
		console.error('Erro ao conectar no banco', err);
		process.exit(1);
	});
