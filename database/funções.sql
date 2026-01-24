-- 5. Procedure de Inserção (Retorna o idPessoa)
CREATE PROCEDURE sp_InserirContato
    @nome VARCHAR(100),
    @dataNascimento DATE,
    @observacoes VARCHAR(MAX),
    @telefone VARCHAR(20),
    @email VARCHAR(100)
AS
BEGIN
    INSERT INTO Contatos (nome, dataNascimento, observacoes, telefone, email)
    VALUES (@nome, @dataNascimento, @observacoes, @telefone, @email);
    
    SELECT SCOPE_IDENTITY() AS idPessoa; 
END;
GO

-- 6. Procedure de Atualização (Retorna OK)
CREATE PROCEDURE sp_AtualizarContato
    @idPessoa INT,
    @nome VARCHAR(100),
    @dataNascimento DATE,
    @observacoes VARCHAR(MAX),
    @telefone VARCHAR(20),
    @email VARCHAR(100)
AS
BEGIN
    UPDATE Contatos 
    SET nome = @nome, dataNascimento = @dataNascimento, observacoes = @observacoes, 
        telefone = @telefone, email = @email
    WHERE idPessoa = @idPessoa;
    
    SELECT 'OK' AS Retorno; 
END;
GO

-- 7. Procedure de Remoção (Retorna OK)
CREATE PROCEDURE sp_RemoverContato
    @idPessoa INT
AS
BEGIN
    DELETE FROM Contatos WHERE idPessoa = @idPessoa;
    SELECT 'OK' AS Retorno; 
END;
GO

-- 8. Procedure de Seleção de Todos
CREATE PROCEDURE sp_SelecionarTodos
AS
BEGIN
    SELECT * FROM Contatos; 
END;
GO

-- 9. Procedure de Obter um Registro Específico
CREATE PROCEDURE sp_ObterContato
    @idPessoa INT
AS
BEGIN
    SELECT * FROM Contatos WHERE idPessoa = @idPessoa; 
END;
GO