# 🎉 Vivere ERP

> **Sistema oficial da [Vivere Entretenimento](https://www.vivereentretenimento.com.br/)**  
> Gestão de eventos, inventário e operações — feito para organizar, crescer e brilhar.

---

## 💡 O que é?

O *Vivere ERP* é uma plataforma web desenvolvida para gerenciar:

✅ Eventos (planejamento, status, clientes)  
✅ Inventário (materiais, categorias, status)  
✅ Depósitos (localizações, estoque)  
✅ Usuários (acesso, permissões)

Tudo com uma interface moderna e intuitiva, permitindo à equipe da Vivere controle total das operações em tempo real.

---

## 🏗 Tecnologias Usadas

| Tecnologia        | Função no projeto                                           |
|-------------------|-------------------------------------------------------------|
| *Bun.js*       | Gerenciador de pacotes e runtime ultrarrápido para backend  |
| *Node.js*      | Execução do servidor local e integração com banco de dados  |
| *ESLint*       | Código limpo e padronizado com linting automático           |
| *shadcn/ui*    | Componentes de interface estilizados com Tailwind CSS       |
| *Tailwind CSS* | Framework de utilitários para design responsivo e ágil      |

---

## 📂 Estrutura do Projeto

- *Dashboard* → Resumo de eventos, solicitações, depósitos, taxa de ocupação  
- *Eventos* → Criar, listar e gerenciar status (Confirmado, Em Andamento, Concluído, Pendente)  
- *Inventário* → Cadastro de materiais, categorias, status e filtros  
- *Depósitos* → Gestão de locais, endereços e alocação de materiais  
- *Configurações* → Cadastro de usuários e permissões (administrador, comum)

---

## 🚀 Como Rodar o Projeto

1️⃣ Clone o repositório:
bash
git clone <REPO_URL>


2️⃣ Acesse a pasta:
bash
cd Project-Vivere--main


3️⃣ Instale as dependências:
bash
bun install
# ou, se preferir:
npm install


4️⃣ Inicie o servidor:
bash
bun run dev
# ou:
npm run dev


5️⃣ Abra no navegador:

http://localhost:3000


---

## ⚙ Arquivos Importantes

- .gitignore → Ignora arquivos não versionados (ex.: logs, node_modules)  
- bun.lockb → Registro exato das dependências (lockfile Bun.js)  
- components.json → Lista e configura os componentes de UI ativos  
- eslint.config.js → Regras de lint e boas práticas para o código

---

## 🤝 Como Contribuir

1️⃣ Faça um fork  
2️⃣ Crie uma branch:
bash
git checkout -b feature/minha-funcionalidade


3️⃣ Commit suas alterações:
bash
git commit -m "feat: adiciona nova funcionalidade"


4️⃣ Push para o repositório:
bash
git push origin feature/minha-funcionalidade


5️⃣ Abra um Pull Request!

---

## ✨ Por que isso importa

O Vivere ERP foi feito *para transformar o jeito que a Vivere gerencia seus eventos e operações*, garantindo:

✅ Mais organização  
✅ Menos retrabalho  
✅ Crescimento sustentável

É tecnologia que conecta produção, equipe e público — com foco em eficiência e impacto.

---

## 📣 Contato

Dúvidas ou sugestões?  
👉 [vivereentretenimento.com.br](https://www.vivereentretenimento.com.br)


---


# 📘 Manual do Usuário - Vivere ERP

Bem-vindo ao Vivere ERP! Este manual vai te ajudar a navegar e usar a plataforma como um mestre.

---

## 🏠 Dashboard

Aqui você vê um resumo das operações:
- Eventos ativos
- Novas solicitações
- Depósitos cadastrados
- Taxa de ocupação

Use o calendário para visualizar os eventos por data e clique em cada evento para detalhes.

---

## 📅 Eventos

- Adicione novos eventos com nome, cliente, datas e status.  
- Acompanhe o andamento (Confirmado, Em Andamento, Concluído, Pendente).  
- Edite ou remova eventos conforme necessário.

---

## 📦 Inventário

- Consulte materiais cadastrados por nome ou categoria.  
- Cadastre novos materiais clicando em *Novo Material*.  
- Edite ou remova materiais usando os ícones de ação.

---

## 🏬 Depósitos

- Veja todos os depósitos da empresa, com endereço e status.  
- Adicione novos depósitos ou aloque materiais entre depósitos.

---

## 👥 Configurações (Usuários)

- Cadastre novos usuários: nome, e-mail, senha e tipo de acesso (Comum ou Administrador).  
- Visualize usuários cadastrados e remova, se necessário.

---

## 🔒 Login e Segurança

- Apenas usuários cadastrados conseguem acessar.  
- Administradores têm acesso total; usuários comuns têm acesso limitado.

---

## 💡 Dicas rápidas

✅ Mantenha sempre os status atualizados.  
✅ Use os filtros para encontrar rapidamente o que precisa.  
✅ Revise permissões de usuários periodicamente.

---

