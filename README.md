
---

# 👥 Gestão de Contatos — Fullstack Challenge

Este projeto é uma aplicação **web Fullstack** para gerenciamento de contatos, desenvolvida com o objetivo de demonstrar habilidades práticas em **Angular**, **ASP.NET Core** e **SQL Server**.

---

🛠️ Tecnologias e Ferramentas
Frontend: Angular 14+

Backend: .NET Web API 

Banco de Dados: SQL Server 2019 Express 

🚀 Como Configurar e Rodar

1. Configuração do Banco de Dados (SQL Server)
⚠️ Importante: Antes de rodar os scripts, você deve conectar seu gerenciador (VS Code ou SSMS) ao servidor SQL local (geralmente localhost\SQLEXPRESS ou .\SQLEXPRESS).

Para configurar o banco BancoDeContatos, siga esta ordem:

Conectar ao Servidor: No VS Code (extensão mssql) ou SSMS, crie uma conexão com o servidor local usando Windows Authentication.

Executar estrutura.sql:

Abra este arquivo e execute-o. Ele criará o banco de dados BancoDeContatos e a tabela Contatos.

Nota: Este script muda automaticamente o contexto para o novo banco.

Executar funções.sql:

Com o banco já criado, Este arquivo instala as Stored Procedures (sp_InserirContato, sp_SelecionarTodos, etc.) que a API utiliza para o CRUD.

2. Backend (API)
Navegue até a pasta: cd backend.

Inicie o servidor:

Bash
dotnet run
A API estará ativa em http://localhost:5100/api/contatos

3. Frontend (Angular)
Navegue até a pasta: cd frontend.

Instale as dependências: npm install.

Inicie a aplicação: npm start.

Acesse http://localhost:4200 no seu navegador.


## 👨‍💻 Autor

**Desenvolvido por Rafael Santos Manna**
