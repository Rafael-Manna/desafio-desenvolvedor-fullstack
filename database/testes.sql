-- 10. Testar Inserção
EXEC sp_InserirContato 'Teste', '1998-01-01', 'Teste de inserção', '1199149944', 'teste@email.com';

-- 11. Testar Atualização (ajuste o ID conforme o que foi gerado acima)
EXEC sp_AtualizarContato 1, 'Nome Atualizado', '2000-01-01', 'Observação nova', '11999999999', 'novo@email.com';

-- 13. Testar Seleção de Todos
EXEC sp_SelecionarTodos;

-- 14. Testar Obter um Registro
EXEC sp_ObterContato 1; -- numero do id ( se for 1 vai ser rafael)

-- 12. Testar Remoção
EXEC sp_RemoverContato 10;
