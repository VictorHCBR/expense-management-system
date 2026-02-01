using Manager.Application.Contracts;

namespace Manager.Infrastructure.Persistence;

public class UnitOfWork(AppDbContext db) : IUnitOfWork
{
    private readonly AppDbContext _db = db;

    public Task<int> SaveChangesAsync(CancellationToken token) => _db.SaveChangesAsync(token);
}
