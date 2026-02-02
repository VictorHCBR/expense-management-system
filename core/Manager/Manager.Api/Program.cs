using Manager.Api.Middleware;
using Manager.Application.Services;
using Manager.Infrastructure;
using Manager.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using QuestPDF.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .ConfigureApiBehaviorOptions(opt =>
    {
        opt.SuppressModelStateInvalidFilter = true;
    });

// OpenAPI
builder.Services.AddOpenApi();

builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddScoped<PeopleService>();
builder.Services.AddScoped<CategoriesService>();
builder.Services.AddScoped<TransactionsService>();
builder.Services.AddScoped<ReportsService>();
builder.Services.AddScoped<ExceptionHandlingMiddleware>();

QuestPDF.Settings.License = LicenseType.Community;

var app = builder.Build();

// Applies migrations on startup when enabled (default: true in docker-compose)
await ApplyMigrationsIfEnabledAsync(app);

app.UseMiddleware<ExceptionHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// IMPORTANT: In local Docker / reverse-proxy scenarios, HTTPS redirection often breaks.
// Enable it only if you explicitly want it.
if (app.Configuration.GetValue<bool>("HttpsRedirection:Enabled"))
{
    app.UseHttpsRedirection();
}

app.MapControllers();

app.Run();

static async Task ApplyMigrationsIfEnabledAsync(WebApplication app)
{
    var enabled = app.Configuration.GetValue<bool>("RUN_MIGRATIONS");
    if (!enabled) return;

    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>().CreateLogger("Migrations");

    const int maxAttempts = 20;

    for (var attempt = 1; attempt <= maxAttempts; attempt++)
    {
        try
        {
            logger.LogInformation("Applying EF Core migrations (attempt {Attempt}/{Max})...", attempt, maxAttempts);
            await db.Database.MigrateAsync();
            logger.LogInformation("Migrations applied successfully.");
            return;
        }
        catch (Exception ex) when (ex is NpgsqlException || ex is TimeoutException)
        {
            logger.LogWarning(ex, "Database not ready yet.");
            await Task.Delay(TimeSpan.FromSeconds(2));
        }
    }

    // last attempt (let it throw if it fails)
    await db.Database.MigrateAsync();
}
