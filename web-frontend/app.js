const API_URL = "http://localhost:4000/api";

// LOGIN
async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-app-version": "1.0" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.twoFactorId) {
        const code = prompt("Digite o código 2FA (demo): " + data.debugCode);
        if (code) {
            await verify2FA(email, code);
        }
    } else {
        alert("Erro no login!");
    }
}

async function verify2FA(email, code) {
    const res = await fetch(`${API_URL}/auth/verify-2fa`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-app-version": "1.0" },
        body: JSON.stringify({ email, code })
    });

    const data = await res.json();

    if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "home.html";
    } else {
        alert("Código incorreto ou expirado!");
    }
}

// REGISTER
async function register() {
    const user = {
        name: document.getElementById("name").value,
        cpf: document.getElementById("cpf").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-app-version": "1.0" },
        body: JSON.stringify(user)
    });

    const data = await res.json();

    if (data.userId) {
        alert("Cadastro realizado com sucesso!");
        window.location.href = "index.html";
    } else {
        alert("Erro ao cadastrar: " + (data.message || ""));
    }
}

// HOME – LISTAR PRODUTOS
async function loadProducts() {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/products`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "x-app-version": "1.0"
        }
    });

    const data = await res.json();
    const products = data.products || [];

    const div = document.getElementById("productList");
    div.innerHTML = "";

    products.forEach(p => {
        const promo = p.personalizedPromotion;
        const discount = promo ? promo.discountPercent : 0;
        const finalPrice = p.price * (1 - discount / 100);

        const promoBadge = promo ? 
            `<span class="promo-badge">🎯 Promoção para você!</span>` : 
            '';

        div.innerHTML += `
            <div class="product-box ${promo ? 'product-with-promo' : ''}">
                <h3>${p.name}</h3>
                ${promoBadge}
                <p>${p.description || 'Sem descrição'}</p>
                <div class="price-section">
                    ${discount > 0 ? `<p class="original-price">R$ ${p.price.toFixed(2)}</p>` : ''}
                    <p class="final-price"><b>R$ ${finalPrice.toFixed(2)}</b></p>
                    ${discount > 0 ? `<p class="discount-text">${discount}% OFF</p>` : ''}
                </div>
                <p><small>Tipo: ${p.type}</small></p>
                <button onclick="buyProduct('${p._id}', '${p.name}', '${p.type}', ${p.price})" class="buy-btn">
                    Comprar
                </button>
            </div>
        `;
    });
}

// HOME – CRIAR PRODUTO
async function createProduct(event) {
    event.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
        alert("Você precisa estar logado para criar produtos.");
        return;
    }

    const name = document.getElementById("prodName").value.trim();
    const price = parseFloat(document.getElementById("prodPrice").value);
    const type = document.getElementById("prodType").value.trim();
    const description = document.getElementById("prodDesc").value.trim();

    if (!name || !type || Number.isNaN(price)) {
        alert("Preencha nome, preço e tipo corretamente.");
        return;
    }

    const payload = { name, price, type, description };

    const res = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "x-app-version": "1.0"
        },
        body: JSON.stringify(payload)
    });

    if (res.ok) {
        document.getElementById("createProductForm").reset();
        await loadProducts();
        alert("Produto criado com sucesso!");
    } else {
        const err = await res.json().catch(() => ({}));
        alert("Erro ao criar produto: " + (err.message || res.status));
    }
}

// HOME – REGISTRAR COMPRA
async function buyProduct(productId, productName, productType, price) {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Você precisa estar logado.");
        return;
    }

    const quantity = prompt(`Quantos(as) ${productName}(s) deseja comprar?`, "1");
    if (!quantity || isNaN(quantity) || quantity <= 0) {
        return;
    }

    const qty = parseInt(quantity);
    const totalPrice = price * qty;

    try {
        const res = await fetch(`${API_URL}/purchases`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "x-app-version": "1.0"
            },
            body: JSON.stringify({
                productId,
                productType,
                quantity: qty,
                totalPrice
            })
        });

        if (res.ok) {
            alert(`Compra registrada! ${qty}x ${productName} por R$ ${totalPrice.toFixed(2)}`);
            await loadPurchaseHistory();
            await loadTopCategories();
            await loadProducts(); // Recarrega produtos com novas recomendações
        } else {
            const err = await res.json();
            alert("Erro ao registrar compra: " + (err.message || ""));
        }
    } catch (err) {
        console.error("Erro ao registrar compra:", err);
        alert("Erro ao registrar compra.");
    }
}

// HOME – HISTÓRICO DE COMPRAS
async function loadPurchaseHistory() {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch(`${API_URL}/purchases/history`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "x-app-version": "1.0"
            }
        });

        const data = await res.json();
        const purchases = data.purchases || [];

        const div = document.getElementById("purchaseHistory");
        
        if (purchases.length === 0) {
            div.innerHTML = '<p style="color: #999;">Nenhuma compra registrada ainda. Comece comprando produtos!</p>';
            return;
        }

        div.innerHTML = '<table class="purchase-table"><tr><th>Produto</th><th>Tipo</th><th>Quantidade</th><th>Total</th><th>Data</th></tr>';

        purchases.forEach(p => {
            const date = new Date(p.purchasedAt).toLocaleDateString('pt-BR');
            const productName = p.productId?.name || 'Produto removido';
            
            div.innerHTML += `
                <tr>
                    <td>${productName}</td>
                    <td>${p.productType}</td>
                    <td>${p.quantity}</td>
                    <td>R$ ${p.totalPrice.toFixed(2)}</td>
                    <td>${date}</td>
                </tr>
            `;
        });

        div.innerHTML += '</table>';
    } catch (err) {
        console.error("Erro ao carregar histórico:", err);
    }
}

// HOME – CATEGORIAS TOP
async function loadTopCategories() {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch(`${API_URL}/purchases/top-categories`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "x-app-version": "1.0"
            }
        });

        const data = await res.json();
        const categories = data.topCategories || [];

        const div = document.getElementById("topCategoriesDiv");
            
        if (categories.length === 0) {
            div.innerHTML = '<p style="color: #999;">Nenhuma compra registrada ainda.</p>';
            return;
        }

        div.innerHTML = '';
        categories.slice(0, 5).forEach(cat => {
            div.innerHTML += `
                <div class="category-chip">
                    <strong>${cat.type}</strong>
                    <span>${cat.count} item(ns) comprado(s)</span>
                </div>
            `;
        });
    } catch (err) {
        console.error("Erro ao carregar categorias:", err);
    }
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}

// Adiciona listener ao formulário de criar produto
if (document.getElementById("createProductForm")) {
    document.getElementById("createProductForm").addEventListener("submit", createProduct);
}