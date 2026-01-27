using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Dapper;
using System.Data;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContatosController : ControllerBase
{
    // CONECTA AO COM O BANCO DE DADOS SQL SERVER
    private const string ConnectionString = "Server=localhost\\SQLEXPRESS;Database=BancoDeContatos;Trusted_Connection=True;TrustServerCertificate=True;";

    // 1. LISTAR TODOS (GET)
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        using var connection = new SqlConnection(ConnectionString);
        var contatos = await connection.QueryAsync<Contato>("sp_SelecionarTodos", commandType: CommandType.StoredProcedure);
        Console.WriteLine("Dados retornados pela procedure sp_SelecionarTodos."); 
        return Ok(contatos);
    }

    // 2. SALVAR NOVO (POST) 
    [HttpPost]
    public async Task<IActionResult> Post([FromBody] Contato contato)
    {
        using var connection = new SqlConnection(ConnectionString);
        
        // Mapeamos os nomes das propriedades para os parâmetros que a Procedure espera
        var parametros = new { 
            nome = contato.Nome, 
            dataNascimento = contato.DataNascimento, 
            observacoes = contato.Observacoes, 
            telefone = contato.Telefone, 
            email = contato.Email 
        };

        var id = await connection.ExecuteScalarAsync<int>("sp_InserirContato", parametros, commandType: CommandType.StoredProcedure);
        
        Console.WriteLine($"ID retornado pela procedure de criação: {id}"); 
        return Ok(new { id });
    }

    // 3. ATUALIZAR (PUT) - Rota corrigida com {id} para evitar erro 405
    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] Contato contato)
    {
        using var connection = new SqlConnection(ConnectionString);
        
        var parametros = new { 
            idPessoa = id, // Garante que o ID da URL seja o usado na atualização
            nome = contato.Nome, 
            dataNascimento = contato.DataNascimento, 
            observacoes = contato.Observacoes, 
            telefone = contato.Telefone, 
            email = contato.Email 
        };

        var texto = await connection.ExecuteScalarAsync<string>("sp_AtualizarContato", parametros, commandType: CommandType.StoredProcedure);
        
        Console.WriteLine($"Retorno da procedure de atualização: {texto}"); 
        return Ok(new { mensagem = texto });
    }

    // 4. REMOVER (DELETE)
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        using var connection = new SqlConnection(ConnectionString);
        var texto = await connection.ExecuteScalarAsync<string>("sp_RemoverContato", new { idPessoa = id }, commandType: CommandType.StoredProcedure);
        Console.WriteLine($"Retorno da procedure de remoção: {texto}"); 
        return Ok(new { mensagem = texto });
    }

    // 5. OBTER POR ID (GET)
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        using var connection = new SqlConnection(ConnectionString);
        var contato = await connection.QueryFirstOrDefaultAsync<Contato>("sp_ObterContato", new { idPessoa = id }, commandType: CommandType.StoredProcedure);
        return contato != null ? Ok(contato) : NotFound();
    }
}

// Classe de modelo ajustada para aceitar Datas Nulas
public class Contato
{
    public int IdPessoa { get; set; } 
    public string Nome { get; set; }
    
    // O '?' resolve o erro "SqlDateTime overflow" enviando NULL em vez de data zerada
    public DateTime? DataNascimento { get; set; } 
    
    public string Observacoes { get; set; }
    public string Telefone { get; set; }
    public string Email { get; set; }
}