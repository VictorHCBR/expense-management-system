using Manager.Application.Common;
using Manager.Application.Contracts;
using Manager.Domain.Entities;
using Manager.Domain.Enums;
using Manager.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Manager.Infrastructure.Repositories;

public sealed class CategoryRepository(AppDbContext dbContext) : ICategoryRepository
{
    private readonly AppDbContext _dbContext = dbContext;

    public Task<Category?> GetByIdAsync(Guid id, CancellationToken token)
        =>  _dbContext.Categories.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, token);

    public async Task<PagedResult<Category>> ListAsync(string? description, CategoryPurpose? purpose, int page, int pageSize, CancellationToken token)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 200);

        var query = _dbContext.Categories.AsNoTracking().AsQueryable();

        if(!string.IsNullOrWhiteSpace(description))
            query = query.Where(x => x.Description.Contains(description.Trim(), StringComparison.CurrentCultureIgnoreCase));

        if (purpose is not null)
            query = query.Where(c => c.Purpose == purpose);

        var total = await query.CountAsync(token);
        var items = await query.OrderBy(item => item.Description)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(token);

        return new PagedResult<Category>
        {
            Items = items,
            Page = page,
            PageSize = pageSize,
            TotalItems = total
        };
    }

    public Task AddAsync(Category category, CancellationToken token)
        => _dbContext.Categories.AddAsync(category, token).AsTask();
}
