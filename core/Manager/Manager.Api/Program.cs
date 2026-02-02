using Manager.Api.Middleware;
using Manager.Application.Services;
using Manager.Infrastructure;
using QuestPDF.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .ConfigureApiBehaviorOptions(opt =>
    {
        opt.SuppressModelStateInvalidFilter = true;
    });
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddScoped<PeopleService>();
builder.Services.AddScoped<CategoriesService>();
builder.Services.AddScoped<TransactionsService>();
builder.Services.AddScoped<ReportsService>();
builder.Services.AddScoped<ExceptionHandlingMiddleware>();

// TODO: verify license compliance 

QuestPDF.Settings.License = LicenseType.Community;

var app = builder.Build();

app.UseMiddleware<ExceptionHandlingMiddleware>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.MapControllers();

app.Run();
