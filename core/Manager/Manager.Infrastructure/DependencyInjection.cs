using Manager.Application.Contracts;
using Manager.Application.Services;
using Manager.Infrastructure.Persistence;
using Manager.Infrastructure.Reports;
using Manager.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Manager.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration config)
    {
        services.AddDbContext<AppDbContext>(options =>
        {
            options.UseNpgsql(config.GetConnectionString("Default"));
        });

        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IPersonRepository, PersonRepository>();
        services.AddScoped<ICategoryRepository, CategoryRepository>();
        services.AddScoped<ITransactionRepository, TransactionRepository>();
        services.AddScoped<IReportsQueries, ReportsQueries>();

        return services;
    }
}
