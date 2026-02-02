using Manager.Application.DTOs;
using Manager.Application.Services;
using Manager.Domain.Enums;
using Manager.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Manager.Infrastructure.Reports;

public sealed class ReportsQueries(AppDbContext dbContext) : IReportsQueries
{
    private readonly AppDbContext _dbContext = dbContext;

    public async Task<TotalsReportResponse> TotalsByPersonAsync(int page, int pageSize, string? personName, CancellationToken token)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 200);

        var peopleQuery = _dbContext.People.AsNoTracking().AsQueryable();
        if (!string.IsNullOrWhiteSpace(personName))
            peopleQuery = peopleQuery.Where(p => p.Name.Contains(personName.Trim(), StringComparison.CurrentCultureIgnoreCase));

        var totalItems = await peopleQuery.CountAsync(token);

        var peoplePage = await peopleQuery.OrderBy(person => person.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(person => new { person.Id, person.Name })
            .ToListAsync(token);
        
        var ids = peoplePage.Select(person => person.Id).ToList();

        var sums = await _dbContext.Transactions.AsNoTracking()
            .Where(trans => ids.Contains(trans.PersonId))
            .GroupBy(trans => trans.PersonId)
            .Select(aggreg => new
            {
                PersonId = aggreg.Key,
                Income = aggreg.Where(x => x.Type == TransactionType.Income).Sum(x => (decimal?)x.Amount) ?? 0,
                Expense = aggreg.Where(x => x.Type == TransactionType.Expense).Sum(x => (decimal?)x.Amount) ?? 0
            }).ToListAsync(token);

        var rows = peoplePage.Select(person => {
            var sum = sums.FirstOrDefault(x => x.PersonId == person.Id);
            var income = sum?.Income ?? 0;
            var expense = sum?.Expense ?? 0;
            return new TotalsRowResponse(person.Id, person.Name, income, expense, income - expense);
        }).ToList();

        var grand = await _dbContext.Transactions.AsNoTracking()
            .Join(peopleQuery, trans => trans.PersonId, person => person.Id, (trans, person) => trans)
            .GroupBy(_ => 1)
            .Select(aggreg => new
            {
                Income = aggreg.Where(el => el.Type == TransactionType.Income).Sum(el => (decimal?)el.Amount) ?? 0,
                Expense = aggreg.Where(el => el.Type == TransactionType.Expense).Sum(el => (decimal?)el.Amount) ?? 0
            }).FirstOrDefaultAsync(token);

        var grandIncome = grand?.Income ?? 0;
        var grandExpense = grand?.Expense ?? 0;

        return new TotalsReportResponse(
            rows,
            new TotalsRowResponse(Guid.Empty, "TOTAL GERAL", grandIncome, grandExpense, grandIncome - grandExpense),
            totalItems,
            page,
            pageSize
        );
    }

    public async Task<TotalsReportResponse> TotalsByCategoryAsync(int page, int pageSize, string? categoryDescription, CategoryPurpose? purpose, CancellationToken token)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 200);

        var categoryQuery = _dbContext.Categories.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(categoryDescription))
            categoryQuery = categoryQuery.Where(cat => cat.Description.Contains(categoryDescription.Trim(), StringComparison.CurrentCultureIgnoreCase));

        if (purpose is not null)
            categoryQuery = categoryQuery.Where(cat => cat.Purpose == purpose);

        var totalItems = await categoryQuery.CountAsync(token);

        var categoryPage = await categoryQuery.OrderBy(cat => cat.Description)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(cat => new { cat.Id, cat.Description })
            .ToListAsync(token);

        var ids = categoryPage.Select(cat => cat.Id).ToList();

        var sums = await _dbContext.Transactions.AsNoTracking()
            .Where(trans => ids.Contains(trans.CategoryId))
            .GroupBy(trans => trans.CategoryId)
            .Select(aggreg => new
            {
                CategoryId = aggreg.Key,
                Income = aggreg.Where(x => x.Type == TransactionType.Income).Sum(x => (decimal?)x.Amount) ?? 0,
                Expense = aggreg.Where(x => x.Type == TransactionType.Expense).Sum(x => (decimal?)x.Amount) ?? 0
            }).ToListAsync(token);

        var rows = categoryPage.Select(cat =>
        {
            var sum = sums.FirstOrDefault(x => x.CategoryId == cat.Id);
            var income = sum?.Income ?? 0;
            var expense = sum?.Expense ?? 0;
            return new TotalsRowResponse(cat.Id, cat.Description, income, expense, income - expense);
        }).ToList();

        var grand = await _dbContext.Transactions.AsNoTracking()
            .Join(categoryQuery, trans => trans.CategoryId, cat => cat.Id, (trans, cat) => trans)
            .GroupBy(_ => 1)
            .Select(aggreg => new
            {
                Income = aggreg.Where(el => el.Type == TransactionType.Income).Sum(el => (decimal?)el.Amount) ?? 0,
                Expense = aggreg.Where(el => el.Type == TransactionType.Expense).Sum(el => (decimal?)el.Amount) ?? 0,
            }).FirstOrDefaultAsync(token);

        var grandIncome = grand?.Income ?? 0;
        var grandExpense = grand?.Expense ?? 0;

        return new TotalsReportResponse(
            rows,
            new TotalsRowResponse(Guid.Empty, "TOTAL GERAL", grandIncome, grandExpense, grandIncome - grandExpense),
            totalItems,
            page,
            pageSize
        );
    }
}
