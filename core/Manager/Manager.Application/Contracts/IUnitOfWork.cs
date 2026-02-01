namespace Manager.Application.Contracts;

public interface IUnitOfWork
{
    Task<int> SaveChangesAsync(CancellationToken token);
}
