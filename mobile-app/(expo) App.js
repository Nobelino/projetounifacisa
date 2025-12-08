import React, { useState } from 'react';
import { View, TextInput, Button, Text, ScrollView } from 'react-native';

const API = 'http://10.0.2.2:4000/api';

export default function App() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [step, setStep] = useState(0);
	const [code, setCode] = useState('');
	const [token, setToken] = useState(null);
	const [products, setProducts] = useState([]);

	const login = async () => {
		const res = await fetch(`${API}/auth/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'x-app-version': '1.0' },
			body: JSON.stringify({ email, password })
		});
		const data = await res.json();
		if (data.twoFactorId) setStep(1);
	};

	const verify2FA = async () => {
		const res = await fetch(`${API}/auth/verify-2fa`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'x-app-version': '1.0' },
			body: JSON.stringify({ email, code })
		});
		const data = await res.json();
		if (data.token) {
			setToken(data.token);
			loadProducts(data.token);
		}
	};

	const loadProducts = async (jwtToken) => {
		const res = await fetch(`${API}/products`, {
			headers: { Authorization: 'Bearer ' + jwtToken, 'x-app-version': '1.0' }
		});
		const data = await res.json();
		setProducts(data.products || []);
	};

	if (!token) {
		if (step === 0) {
			return (
				<View style={{ padding: 20 }}>
					<TextInput placeholder="email" value={email} onChangeText={setEmail} />
					<TextInput placeholder="senha" secureTextEntry value={password} onChangeText={setPassword} />
					<Button title="Login" onPress={login} />
				</View>
			);
		}

		return (
			<View style={{ padding: 20 }}>
				<Text>Insira o código 2FA</Text>
				<TextInput placeholder="Código" value={code} onChangeText={setCode} />
				<Button title="Verificar 2FA" onPress={verify2FA} />
			</View>
		);
	}

	return (
		<ScrollView style={{ padding: 20 }}>
			<Text>Produtos</Text>
			{products.map((p) => (
				<View key={p._id} style={{ marginBottom: 10 }}>
					<Text>{`${p.name} - R$ ${p.price}`}</Text>
					<Text>{`Promo personalizada: ${p.personalizedPromotion ? 'Sim' : 'Não'}`}</Text>
				</View>
			))}
		</ScrollView>
	);
}
