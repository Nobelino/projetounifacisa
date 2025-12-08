// Admin functions for managing promotions

async function loadAdminProducts() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Você precisa estar logado.");
        window.location.href = "index.html";
        return;
    }

    try {
        const res = await fetch(`${API_URL}/products/admin/all`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "x-app-version": "1.0"
            }
        });

        if (!res.ok) {
            alert("Erro ao carregar produtos. Verifique se você tem permissão.");
            return;
        }

        const data = await res.json();
        const products = data.products || [];

        const tbody = document.getElementById("productsTableBody");
        tbody.innerHTML = "";

        products.forEach(p => {
            const promoActive = p.promotion && p.promotion.active;
            const discount = (p.promotion && p.promotion.discountPercent) || 0;
            const forTypes = (p.promotion && p.promotion.forTypes && p.promotion.forTypes.join(", ")) || "";

            tbody.innerHTML += `
                <tr>
                    <td><strong>${p.name}</strong></td>
                    <td>${p.type}</td>
                    <td>R$ ${p.price.toFixed(2)}</td>
                    <td>
                        <span class="promo-badge ${promoActive ? 'promo-active' : 'promo-inactive'}">
                            ${promoActive ? 'Ativa' : 'Inativa'}
                        </span>
                    </td>
                    <td>${discount}%</td>
                    <td>
                        <div class="actions-cell">
                            <button onclick="openPromoModal('${p._id}', ${promoActive}, ${discount}, '${forTypes}')" class="primary-btn">
                                Editar
                            </button>
                            <button onclick="deleteProductConfirm('${p._id}', '${p.name}')" class="danger">
                                Deletar
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
    } catch (err) {
        console.error("Erro ao carregar produtos:", err);
        alert("Erro ao carregar produtos.");
    }
}

function openPromoModal(productId, isActive, discount, forTypes) {
    document.getElementById("productIdInput").value = productId;
    document.getElementById("promoActive").checked = isActive;
    document.getElementById("discountPercent").value = discount;
    document.getElementById("forTypes").value = forTypes;
    document.getElementById("promoModal").classList.add("active");
}

function closeModal() {
    document.getElementById("promoModal").classList.remove("active");
}

document.getElementById("promoForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const productId = document.getElementById("productIdInput").value;
    const active = document.getElementById("promoActive").checked;
    const discountPercent = parseInt(document.getElementById("discountPercent").value);
    const forTypesStr = document.getElementById("forTypes").value;

    const forTypes = forTypesStr
        .split(",")
        .map(t => t.trim())
        .filter(t => t.length > 0);

    if (active && (discountPercent < 0 || discountPercent > 100)) {
        alert("Percentual deve estar entre 0 e 100.");
        return;
    }

    if (active && forTypes.length === 0) {
        alert("Selecione pelo menos um tipo de cliente para a promoção ativa.");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/products/${productId}/promotion`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "x-app-version": "1.0"
            },
            body: JSON.stringify({ active, discountPercent, forTypes })
        });

        if (res.ok) {
            closeModal();
            await loadAdminProducts();
            alert("Promoção atualizada com sucesso!");
        } else {
            const err = await res.json();
            alert("Erro: " + (err.message || "Falha ao atualizar"));
        }
    } catch (err) {
        console.error("Erro ao atualizar promoção:", err);
        alert("Erro ao atualizar promoção.");
    }
});

function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}

function deleteProductConfirm(productId, productName) {
    if (confirm(`Tem certeza que deseja deletar "${productName}"? Esta ação não pode ser desfeita.`)) {
        deleteProduct(productId);
    }
}

async function deleteProduct(productId) {
    const token = localStorage.getItem("token");
    
    try {
        const res = await fetch(`${API_URL}/products/${productId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "x-app-version": "1.0"
            }
        });

        if (res.ok) {
            await loadAdminProducts();
            alert("Produto deletado com sucesso!");
        } else {
            const err = await res.json();
            alert("Erro ao deletar: " + (err.message || "Falha ao deletar"));
        }
    } catch (err) {
        console.error("Erro ao deletar produto:", err);
        alert("Erro ao deletar produto.");
    }
}
