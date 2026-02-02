## Expense Management System

O objetivo deste sistema é permitir ao usuário gerenciar as despesas domésticas que ele ou membros da mesma
residência que ele possam ter. 

### Rodando com Docker (recomendado)

```bash
# Dev (padrão)
docker compose up --build

# ou escolhendo outro arquivo de ambiente
# docker compose --env-file .env.staging up --build
```

- Web: http://localhost:3000
- API: http://localhost:8080

> Observação: por padrão o container da API roda `EF Core migrations` no startup (variável `RUN_MIGRATIONS=true`) para evitar erro de tabela inexistente.
