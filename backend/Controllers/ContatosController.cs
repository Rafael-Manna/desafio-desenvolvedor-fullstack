using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Dapper;
using System.Data;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContatosController : ControllerBase
{
    private const string ConnectionString = "Server=localhost\\SQLEXPRESS;Database=DesafioA;Trusted_Connection=True;TrustServerCertificate=True;";

    // 5. Selecionar todos os registros (GET)
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        try
        {
            using var connection = new SqlConnection(ConnectionString);
            var contatos = await connection.QueryAsync<Contato>("sp_SelecionarTodos", commandType: CommandType.StoredProcedure);
            
            Console.WriteLine("Dados retornados pela procedure sp_SelecionarTodos."); // Requisito do item 5
            return Ok(contatos);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Erro ao acessar o banco: {ex.Message}");
        }
    }

    // 2. Criar registros (POST)
    [HttpPost]
    public async Task<IActionResult> Post([FromBody] Contato contato)
    {
        using var connection = new SqlConnection(ConnectionString);
        var id = await connection.ExecuteScalarAsync<int>("sp_InserirContato", 
            new { nome = contato.Nome, dataNascimento = contato.DataNascimento, observacoes = contato.Observacoes, telefone = contato.Telefone, email = contato.Email }, 
            commandType: CommandType.StoredProcedure);
        
        Console.WriteLine($"ID retornado pela procedure de criação: {id}"); // Requisito do item 2
        return Ok(new { id });
    }

    // 3. Atualizar registros (PUT)
    [HttpPut]
    public async Task<IActionResult> Put([FromBody] Contato contato)
    {
        using var connection = new SqlConnection(ConnectionString);
        var texto = await connection.ExecuteScalarAsync<string>("sp_AtualizarContato", 
            new { idPessoa = contato.IdPessoa, nome = contato.Nome, dataNascimento = contato.DataNascimento, observacoes = contato.Observacoes, telefone = contato.Telefone, email = contato.Email }, 
            commandType: CommandType.StoredProcedure);
        
        Console.WriteLine($"Retorno da procedure de atualização: {texto}"); // Requisito do item 3
        return Ok(new { mensagem = texto });
    }

    // 4. Remover registros (DELETE)
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        using var connection = new SqlConnection(ConnectionString);
        var texto = await connection.ExecuteScalarAsync<string>("sp_RemoverContato", 
            new { idPessoa = id }, commandType: CommandType.StoredProcedure);
        
        Console.WriteLine($"Retorno da procedure de remoção: {texto}"); // Requisito do item 4
        return Ok(new { mensagem = texto });
    }

    // 6. Selecionar um registro específico (GET por ID)
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        using var connection = new SqlConnection(ConnectionString);
        var contato = await connection.QueryFirstOrDefaultAsync<Contato>("sp_ObterContato", 
            new { idPessoa = id }, commandType: CommandType.StoredProcedure);
        
        if (contato != null) 
            Console.WriteLine($"Dados do registro ID {id} retornados pela procedure."); // Requisito do item 6
            
        return contato != null ? Ok(contato) : NotFound();
    }
}

public class Contato
{
    public int IdPessoa { get; set; } 
    public string Nome { get; set; }
    public DateTime DataNascimento { get; set; }
    public string Observacoes { get; set; }
    public string Telefone { get; set; }
    public string Email { get; set; }
}