var builder = WebApplication.CreateBuilder(args);

// Adiciona a regra de CORS (Libera acesso para o Angular)
builder.Services.AddCors(options => {
    options.AddPolicy("AllowAngular", policy => {
        policy.WithOrigins("http://localhost:4200").AllowAnyHeader().AllowAnyMethod();
    });
});

builder.Services.AddControllers();
var app = builder.Build();

app.UseCors("AllowAngular"); // Ativa a permissão de acesso
app.MapControllers();
app.Run();