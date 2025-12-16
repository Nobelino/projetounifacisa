# 🏪 Sistema de Promoções Personalizadas para Supermercado

**Projeto Final da Disciplina:** Programar em Frontend e Analisar e Modelar Aplicações WEB e Mobile 2023.2

---

## 📋 Descrição do Projeto

Sistema completo que permite a um supermercado enviar promoções específicas baseadas no gosto e histórico de compras de seus clientes. O sistema é capaz de cadastrar produtos e promoções, permitindo que usuários vejam ofertas personalizadas quando logados no site.

### Problema Abordado
Um supermercado enfrenta o desafio de oferecer as melhores promoções de forma personalizada. Se um cliente frequentemente compra carnes, deve receber ofertas de descontos em carnes quando estiver navegando pela plataforma, aumentando a relevância e a taxa de conversão.

---

## 🎯 Funcionalidades Principais

### Backend (Node.js + MongoDB)
- ✅ Autenticação de usuários com email e senha
- ✅ Verificação de dois fatores (2FA) com autenticador
- ✅ Cadastro e gerenciamento de produtos
- ✅ Sistema de promoções personalizadas
- ✅ Middlewares de autenticação e validação
- ✅ API RESTful com rotas protegidas
- ✅ Conexão com banco de dados MongoDB

### Frontend Web
- ✅ Página de registro de usuários
- ✅ Sistema de login com email e senha
- ✅ Verificação 2FA na interface web
- ✅ Dashboard com listagem de produtos
- ✅ Exibição de promoções personalizadas
- ✅ Interface responsiva e intuitiva
- ✅ Proteção de rotas autenticadas

### Aplicação Mobile
- ✅ Tela de login
- ✅ Página principal (home) com produtos
- ✅ Exibição de promoções por tipo de produto
- ✅ Interface otimizada para dispositivos móveis

---

## 🏗️ Arquitetura do Sistema

```
supermarket-project/
├── backend/                    # API Node.js
│   ├── src/
│   │   ├── config/            # Configuração de banco de dados
│   │   ├── controllers/       # Lógica de negócio (Auth, Product, Purchase)
│   │   ├── middlewares/       # Autenticação e filtros de requisição
│   │   ├── models/            # Schemas do MongoDB (User, Product, Purchase)
│   │   ├── routes/            # Rotas da API
│   │   ├── utils/             # Utilitários (2FA)
│   │   └── server.js          # Arquivo principal
│   ├── package.json
│   └── .env                   # Variáveis de ambiente
│
├── web-frontend/              # Interface Web
│   ├── index.html            # Página de login/registro
│   ├── home.html             # Página principal
│   ├── admin.html            # Painel administrativo
│   ├── app.js                # Lógica frontend
│   ├── styles.css            # Estilos
│   └── home.css              # Estilos da home
│
├── mobile-app/               # Aplicação Mobile (Expo)
│   └── App.js                # Componente principal
│
└── diagrams.puml             # Diagramas UML
```

---

## 📊 Diagramas

### Diagrama de Sequência - Login com 2FA
```
Usuário -> Frontend: Insere email/senha
Frontend -> Backend: POST /auth/login
Backend -> Backend: Valida credenciais
Backend -> Autenticador: Gera código 2FA
Backend -> Frontend: Retorna código (simulado)
Usuário -> Frontend: Insere código 2FA
Frontend -> Backend: POST /auth/verify-2fa
Backend -> Backend: Valida código
Backend -> Frontend: Retorna JWT Token
Frontend -> Frontend: Redireciona para Home
```

### Diagrama de Casos de Uso
- **Ator:** Usuário
  - Registrar conta
  - Fazer login
  - Verificar 2FA
  - Visualizar promoções
  - Adicionar ao carrinho
  - Fazer compra

- **Ator:** Administrador
  - Cadastrar produtos
  - Criar promoções
  - Gerenciar usuários

### Diagrama de Classes

**Usuário**
- id: ObjectId
- email: String
- senha: String (hash)
- nome: String
- cpf: String
- dataRegistro: Date

**Produto**
- id: ObjectId
- nome: String
- preco: Number
- tipo: String (carne, laticínios, padaria, etc)
- descricao: String
- dataValidade: Date

**Promoção**
- id: ObjectId
- produtoId: ObjectId (referência)
- desconto: Number
- dataCriacao: Date

**Compra**
- id: ObjectId
- usuarioId: ObjectId (referência)
- produtos: Array
- total: Number
- data: Date

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js v14+
- MongoDB v4.4+
- Git
- Expo CLI (para mobile)

### Instalação do Backend

```bash
# Acesse a pasta do backend
cd backend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas configurações

# Inicie o servidor
npm start
# O servidor rodará em http://localhost:3000
```

### Variáveis de Ambiente (.env)
```
MONGODB_URI=mongodb://localhost:27017/supermarket
JWT_SECRET=sua_chave_secreta_aqui
PORT=3000
NODE_ENV=development
```

### Instalação do Frontend Web

```bash
# Acesse a pasta do frontend
cd web-frontend

# Abra o arquivo index.html em um navegador
# Ou use um servidor local:
python -m http.server 8000
# Acesse http://localhost:8000
```

### Instalação da Aplicação Mobile

```bash
# Acesse a pasta mobile
cd mobile-app

# Instale as dependências
npm install

# Inicie o Expo
expo start

# Escaneie o QR code com seu telefone (Expo Go app)
```

---

## 🔐 Autenticação e Segurança

### Processo de Login
1. Usuário insere email e senha
2. Backend valida credenciais no banco de dados
3. Se válido, backend gera código 2FA aleatório
4. Usuário insere o código no aplicativo
5. Se correto, backend emite JWT Token
6. Frontend armazena token e acessa rotas protegidas

### Proteção de Rotas
Todas as rotas da API requerem:
- JWT Token válido no header `Authorization`
- Middleware de autenticação valida o token
- Apenas usuários autenticados acessam recursos

---

## 📦 Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação baseada em tokens
- **bcryptjs** - Hash de senhas
- **Dotenv** - Variáveis de ambiente
- **Cors** - Controle de origem cruzada

### Frontend Web
- **HTML5** - Estrutura
- **CSS3** - Estilos responsivos
- **JavaScript (Vanilla)** - Lógica
- **Fetch API** - Requisições HTTP

### Mobile
- **React Native** - Framework mobile
- **Expo** - Plataforma de desenvolvimento
- **Axios** - Cliente HTTP

---

## 📝 Requisitos Atendidos

### Requisitos do Sistema WEB
- ✅ Cadastrar novos usuários no sistema
- ✅ Permitir que um usuário faça login
- ✅ Listar itens na home

### Requisitos do Sistema Mobile
- ✅ Permitir que um usuário faça login
- ✅ Abrir uma página principal (home)

### Requisitos de Projeto
- ✅ Organizar código com boas práticas (controllers, routers, models)
- ✅ Separar código por tipo de dado
- ✅ Conectar backend ao MongoDB
- ✅ Proteger recursos com autenticação
- ✅ Usuário tem: identificador, nome, CPF
- ✅ Produto tem: nome, preço, tipo, descrição, validade
- ✅ Middleware para filtrar requisições
- ✅ Diagramas: sequência, casos de uso, classes

### Requisitos de Diagramas
- ✅ Diagrama de sequência (login com 2FA)
- ✅ Simulação de autenticação de dois fatores
- ✅ Diagrama de classes (backend)
- ✅ Diagrama de casos de uso (toda aplicação)

---

## 🧪 Como Testar

### Teste de Cadastro
1. Acesse a página de registro
2. Preencha: nome, email, CPF e senha
3. Clique em "Registrar"
4. Você será redirecionado para login

### Teste de Login
1. Use as credenciais criadas
2. Email: `seu_email@example.com`
3. Senha: `sua_senha`
4. Clique em "Entrar"

### Teste de 2FA
1. Um código de 6 dígitos será gerado
2. Digite o código no campo de verificação
3. Se correto, será redirecionado para home

### Teste de Promoções
1. Na home, visualize os produtos
2. Produtos de carnes têm 15% de desconto
3. Laticínios têm 10% de desconto
4. Padaria tem 5% de desconto

---

## 📄 Licença

Este projeto é destinado para fins acadêmicos.