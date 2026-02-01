using Manager.Application.Common;
using Manager.Domain.Entities;

namespace Manager.Application.Contracts;

public interface IPersonRepository
{
    Task<Person?> GetByIdAsync(Guid id, CancellationToken token);
    Task<PagedResult<Person>> ListAsync(string? name, int? minAge, int? maxAge, int page, int pageSize, CancellationToken token);
    Task AddAsync(Person person, CancellationToken token);
    void Remove(Person person);
}
