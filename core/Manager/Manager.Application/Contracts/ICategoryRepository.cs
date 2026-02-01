using Manager.Application.Common;
using Manager.Domain.Entities;
using Manager.Domain.Enums;

namespace Manager.Application.Contracts;

public interface ICategoryRepository
{
    Task<Category?> GetByIdAsync(Guid id, CancellationToken token);
    Task<PagedResult<Category>> ListAsync(string? description, CategoryPurpose? purpose, int page, int pageSize, CancellationToken token);
    Task AddAsync(Category category, CancellationToken token);
}
