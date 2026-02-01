using Manager.Application.Common;
using Manager.Application.Contracts;
using Manager.Domain.Entities;
using Manager.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Manager.Infrastructure.Repositories;

public sealed class PersonRepository(AppDbContext dbContext) : IPersonRepository
{
    private readonly AppDbContext _dbContext = dbContext;

    public Task<Person?> GetByIdAsync(Guid id, CancellationToken token)
        => _dbContext.People.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, token);

    public async Task<PagedResult<Person>> ListAsync(string? name, int? minAge, int? maxAge, int page, int pageSize, CancellationToken token)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 200);

        var query = _dbContext.People.AsNoTracking().AsQueryable();

        if (!string.IsNullOrEmpty(name))
            query = query.Where(x => x.Name.Contains(name.Trim(), StringComparison.CurrentCultureIgnoreCase));

        if (minAge is not null)
            query = query.Where(x => x.Age >= minAge);

        if (maxAge is not null)
            query = query.Where(x => x.Age <= maxAge);

        var total = await query.CountAsync();
        var items = await query.OrderBy(x => x.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(token);

        return new PagedResult<Person>
        {
            Items = items,
            Page = page,
            PageSize = pageSize,
            TotalItems = total
        };
    }

    public Task AddAsync(Person person, CancellationToken token)
        => _dbContext.People.AddAsync(person, token).AsTask();

    public void Remove(Person person)
    {
        _dbContext.People.Attach(person);
        _dbContext.People.Remove(person);
    }
}
