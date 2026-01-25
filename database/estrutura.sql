CREATE DATABASE DesafioA;
GO
-- 1. Criar tabela Contatos
CREATE TABLE Contatos (
    idPessoa INT IDENTITY(1,1) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    dataNascimento DATE NOT NULL,
    observacoes VARCHAR(240) 
);
GO

-- 2. Alterar tabela para adicionar telefone e email
ALTER TABLE Contatos 
ADD telefone VARCHAR(20),
    email VARCHAR(100);
GO

-- 3. Adicionar índices de pesquisa
CREATE INDEX IDX_Contatos_Nome ON Contatos (nome);
CREATE INDEX IDX_Contatos_DataNasc ON Contatos (dataNascimento);
GO

-- 4. Adicionar chave única para o telefone
ALTER TABLE Contatos ADD CONSTRAINT UQ_Contatos_Telefone UNIQUE (telefone);
GO
 