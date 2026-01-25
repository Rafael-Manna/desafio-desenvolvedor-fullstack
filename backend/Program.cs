var builder = WebApplication.CreateBuilder(args);

// Adiciona suporte apenas para Controllers
builder.Services.AddControllers();

var app = builder.Build();

// Configura o mapeamento das rotas
app.MapControllers();

app.Run();