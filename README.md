## Expense Management System

O objetivo deste sistema é permitir ao usuário gerenciar as despesas domésticas que ele ou membros da mesma
residência que ele possam ter.

### Rodando com Docker (recomendado)

Primeiro de tudo, clone o repositório, depois:

```bash
# Dev (padrão)
docker compose up --build

# ou escolhendo outro arquivo de ambiente
# docker compose --env-file .env.staging up --build
```

- Web: http://localhost:3000
- API: http://localhost:8080

> Observação: por padrão o container da API roda `EF Core migrations` no startup (variável `RUN_MIGRATIONS=true`) para evitar erro de tabela inexistente.

> Caso não queira usar docker, é necessário que se tenha o PostgreSQL instalado na máquina e é necessário alterar o appsettings.json para criar a sua string de conexão de maneira direta.
```json
"ConnectionStrings: {
    Default": "Host=localhost;Port=5432;Database=NOME_DO_BANCO;Username=SUA_SENHA;
}
```

> Ou ainda, usar o 'dotnet-secrets init' para que o .Net reconheça a string de conexão de maneira automática.
```bash
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:Default" "Host=localhost;Port=5432;Database=NOME_DO_BANCO;Username=SEU_NOME_DE_USUARIO;Password=SUA_SENHA;"
```

Assim, quando tiver algo como:
```csharp
//O nome default é só um exemplo, desde que haja coerência pode ser qualquer nome
var connectionString = builder.Services.GetConnectionString("Default");
```
O .NET encontrará de maneira automática e então fará a conexão com o banco

Os endpoints são os mesmo com ou sem docker