# 🛒 Sistema de Promoções Personalizadas para Supermercado

Um sistema completo e profissional que permite um supermercado enviar promoções personalizadas para clientes baseado no seu histórico de compras.

## 🎯 O Problema

Um supermercado precisa de uma forma para enviar promoções específicas para seus clientes baseadas no que eles mais compram. Por exemplo: se um cliente compra muita carne, ele deveria receber promoções de carne quando fizer login no site.

## ✅ A Solução

Sistema inteligente que:
1. **Rastreia** cada compra do cliente (produto, tipo, quantidade)
2. **Aprende** as preferências automaticamente
3. **Recomenda** promoções relevantes por cliente
4. **Oferece** interface admin para gerenciar promoções

## 🚀 Quick Start (5 minutos)

### 1. Instalar dependências
```bash
cd backend
npm install
```

### 2. Configurar banco de dados
```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar .env se necessário (MongoDB URI, etc)
```

### 3. Iniciar servidor
```bash
npm start
```

O servidor estará em `http://localhost:4000`

### 4. Abrir frontend
```
Abra em seu navegador:
web-frontend/index.html
```

## 📋 Fluxo de Uso

### 1️⃣ Cliente se Registra
```
register.html → Preenche dados → Conta criada
```

### 2️⃣ Cliente Faz Login
```
index.html → Email + Senha → Código 2FA → home.html
```

### 3️⃣ Cliente Compra Produto
```
home.html → Clica "Comprar" → Escolhe quantidade → Compra registrada
```

### 4️⃣ Admin Configura Promoções
```
admin.html → Seleciona produto → Define desconto e tipos → Salva
```

### 5️⃣ Cliente Vê Recomendações
```
home.html → Próximo login → Vê promoções personalizadas destacadas
```

## 📁 Estrutura do Projeto

```
supermarket-project/
├── backend/
│   ├── src/
│   │   ├── server.js              # Entrada da API
│   │   ├── config/
│   │   │   └── db.js              # Conexão MongoDB
│   │   ├── models/
│   │   │   ├── User.js            # Usuário
│   │   │   ├── Product.js         # Produto
│   │   │   └── Purchase.js        # Compra (NOVO)
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── productController.js
│   │   │   └── purchaseController.js  # NOVO
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   └── purchaseRoutes.js      # NOVO
│   │   ├── middlewares/
│   │   └── utils/
│   ├── package.json
│   ├── .env                       # Variáveis de ambiente
│   └── .env.example               # Referência
│
├── web-frontend/
│   ├── index.html                 # Login
│   ├── register.html              # Cadastro
│   ├── home.html                  # Principal (cliente)
│   ├── admin.html                 # Gerenciar promoções (NOVO)
│   ├── app.js                     # Lógica principal
│   ├── admin.js                   # Lógica admin (NOVO)
│   ├── home.css                   # Estilos home
│   └── styles.css                 # Estilos auth
│
└── mobile-app/
    └── App.js                     # App React Native
```

## 🔑 Funcionalidades Principais

### Para Cliente
- ✅ Registrar conta com CPF
- ✅ Login com 2FA (segurança)
- ✅ Ver lista de produtos
- ✅ **Comprar produtos** (novo)
- ✅ **Ver histórico de compras** (novo)
- ✅ **Ver categorias preferidas** (novo)
- ✅ **Ver promoções personalizadas** (novo)
- ✅ Logout

### Para Admin
- ✅ Criar produtos
- ✅ **Editar promoções** (desconto, tipos de cliente)
- ✅ **Deletar produtos** (novo)
- ✅ Ver todos os produtos
- ✅ Logout

### Sistema
- ✅ Rastreamento automático de compras
- ✅ Atualização automática de preferências
- ✅ Algoritmo de personalização em tempo real
- ✅ Autenticação JWT
- ✅ Two-Factor Authentication (2FA)

## 📡 API Endpoints

### Autenticação
```
POST   /api/auth/register              Criar conta
POST   /api/auth/login                 Login
POST   /api/auth/verify-2fa            Verificar 2FA
```

### Produtos
```
GET    /api/products                   Listar (com personalização)
POST   /api/products                   Criar novo
PUT    /api/products/:id/promotion     Editar promoção
DELETE /api/products/:id               Deletar produto
GET    /api/products/admin/all         Listar para admin
```

### Compras
```
POST   /api/purchases                  Registrar compra
GET    /api/purchases/history          Histórico do cliente
GET    /api/purchases/top-categories   Categorias mais compradas
```

## 🔐 Segurança

- ✅ Senhas criptografadas com bcryptjs
- ✅ JWT para autenticação de endpoints
- ✅ 2FA (código de 6 dígitos)
- ✅ CORS configurado
- ✅ Validação de entrada em todos os endpoints
- ✅ Cada cliente só acessa seus dados

## 💡 Como Funciona a Personalização

```
1. Cliente compra "Carne Premium" (tipo: "carne")
   ↓
2. Sistema registra Purchase com tipo "carne"
   ↓
3. User.preferences é atualizado: +="carne"
   ↓
4. Próxima vez que cliente acessa home:
   ↓
5. GET /api/products busca histórico
   ↓
6. Sistema conta compras por tipo: carne (5x), leite (2x)
   ↓
7. Procura por promoções ativas para "carne"
   ↓
8. Encontra: Carne com 20% OFF para tipo "carne"
   ↓
9. Retorna produto com flag personalizedPromotion
   ↓
10. Frontend renderiza com badge e desconto destacado
```

## 🧪 Teste Rápido

### 1. Registrar
1. Abra `register.html`
2. Preencha: Nome, CPF, Email, Senha
3. Clique "Cadastrar"

### 2. Login
1. Abra `index.html`
2. Email e Senha
3. Use o código 2FA exibido
4. Entra na `home.html`

### 3. Criar Produto
1. Na home, preencha o formulário:
   - Nome: "Carne Premium"
   - Preço: 50
   - Tipo: "carne"
2. Clique "Adicionar produto"

### 4. Gerenciar Promoção
1. Clique "Admin"
2. Tabela mostra produtos
3. Clique "Editar" em um produto
4. Ative promoção: desconto 20%, tipos: "carne"
5. Salve

### 5. Comprar e Ver Recomendação
1. Volte para home.html
2. Clique "Comprar" na Carne
3. Digite: 5
4. Recarregue a página
5. Veja: Carne com badge "🎯 Promoção para você!" e 20% OFF

## 📊 Exemplo Real

**Cenário: João é um cliente novo**

**Dia 1 - Sem histórico:**
- Login → Vê produtos sem promoção especial
- Nenhuma compra registrada

**Dia 2 - Faz primeira compra:**
- Clica "Comprar" em Carne (R$50)
- Compra 5 unidades
- Sistema registra: 5x Carne = R$250

**Dia 3 - Com histórico:**
- Login
- Sistema vê: João comprou carne 5x
- Admin tinha criado: Carne 20% OFF para tipo "carne"
- João vê: "🎯 Promoção para você!" em Carne
- Preço: ~~R$50~~ → **R$40 (20% OFF)**
- João compra novamente com desconto!

**Resultado:**
- João economiza R$50 (R$10 x 5)
- Supermercado vende mais
- Todos ganham! ✅

## 🛠️ Tecnologias

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- bcryptjs (criptografia)
- jsonwebtoken (JWT)
- dotenv

### Frontend
- HTML5
- CSS3
- JavaScript Vanilla
- Fetch API

### Padrões
- RESTful API
- MVC Architecture
- JWT Authentication
- Two-Factor Authentication

## ⚙️ Configuração (.env)

```
# Banco de dados
MONGO_URI=mongodb://localhost:27017/supermarket

# Segurança
JWT_SECRET=sua_chave_secreta_muito_longa
JWT_EXPIRES_IN=1d

# Servidor
PORT=4000
NODE_ENV=development
```

## 📈 Fluxo de Dados

```
Cliente
  ↓
Frontend (HTML/CSS/JS)
  ↓
API REST (Express)
  ↓
Middleware (Auth)
  ↓
Controllers (Lógica)
  ↓
Models (MongoDB)
  ↓
Respostas JSON
  ↓
Frontend atualiza
```

## 🎓 Conceitos Implementados

- ✅ MVC Architecture
- ✅ RESTful API Design
- ✅ JWT Authentication
- ✅ Two-Factor Authentication
- ✅ Database Modeling
- ✅ Data Aggregation & Analytics
- ✅ Personalization Algorithm
- ✅ Error Handling
- ✅ Input Validation
- ✅ CORS Security
- ✅ Responsive Design

## 📚 Documentação Completa

Veja os arquivos de documentação para mais detalhes:
- `README.md` - Este arquivo
- `QUICKSTART.md` - Como começar (passo a passo)
- `RESUMO_PT_BR.md` - Explicação simples em português
- `TECHNICAL_SUMMARY.md` - Detalhes técnicos
- `TEST_DATA.md` - Dados e exemplos de teste
- `CHANGELOG.md` - O que foi alterado
- `START_HERE.md` - Guia de entrada rápida

## 🐛 Troubleshooting

### Erro: "Cannot connect to MongoDB"
```
Solução: Certifique-se que MongoDB está rodando
Windows: mongod
Linux: sudo systemctl start mongod
```

### Erro: "Port 4000 already in use"
```
Solução: Matar processos node em uso
ps aux | grep node
kill -9 <PID>
```

### Produtos não aparecem
```
Solução: Verificar se está logado e criou produtos
1. Verificar token no localStorage
2. Abrir DevTools (F12) → Console
3. Ver mensagens de erro
```

### Promoção não aparece
```
Solução: Verificar configuração
1. Ativar promo em admin.html
2. Definir desconto > 0
3. Adicionar tipos de cliente
4. Fazer uma compra do tipo
5. Recarregar página
```

## 🤝 Contribuindo

Este é um projeto educacional. Para melhorias:
1. Faça alterações
2. Teste completamente
3. Documente as mudanças
4. Atualize este README

## 📞 Suporte

Dúvidas ou problemas?
- Consulte `QUICKSTART.md` para setup
- Consulte `TEST_DATA.md` para exemplos
- Consulte `TECHNICAL_SUMMARY.md` para detalhes técnicos

## ✨ Funcionalidades Futuras

- [ ] Carrinho de compras
- [ ] Checkout com integração de pagamento
- [ ] Notificações por email
- [ ] Dashboard de analytics
- [ ] Cupons e vouchers
- [ ] Avaliações de produtos
- [ ] Wishlist/Favoritos
- [ ] Mobile app nativo
- [ ] Múltiplas lojas
- [ ] Recomendações com IA/ML

## 📝 Licença

Projeto educacional - uso livre.

## 👨‍💻 Desenvolvido

Sistema de Promoções Personalizadas para Supermercado
- **Data:** Dezembro de 2024
- **Status:** ✅ Completo e Funcional
- **Versão:** 1.0.0

---

**Pronto para começar? Abra `web-frontend/index.html` no seu navegador!** 🚀

Para um guia de setup detalhado, veja: `QUICKSTART.md`
