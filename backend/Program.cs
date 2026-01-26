var builder = WebApplication.CreateBuilder(args);

// Ativa o suporte para os Controllers (suas APIs de Contatos)
builder.Services.AddControllers();

// Configura o CORS para o Angular conseguir conversar com o C#
builder.Services.AddCors(options => {
    options.AddDefaultPolicy(policy => {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Ordem correta de ativação
app.UseCors(); 
app.UseAuthorization();
app.MapControllers();

app.Run();