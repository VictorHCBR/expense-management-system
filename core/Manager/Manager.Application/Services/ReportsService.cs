using Manager.Application.DTOs;
using Manager.Domain.Enums;

namespace Manager.Application.Services;

public sealed class ReportsService(IReportsQueries queries)
{
    private readonly IReportsQueries _queries = queries;

    public Task<TotalsReportResponse> TotalsByPersonAsync(int page, int pageSize, string? personName, CancellationToken token)
        => _queries.TotalsByPersonAsync(page, pageSize, personName, token);

    public Task<TotalsReportResponse> TotalsByCategoryAsync(int page, int pageSize, string? categoryDescription, CategoryPurpose? purpose, CancellationToken token) 
        => _queries.TotalsByCategoryAsync(page, pageSize, categoryDescription, purpose, token);
}

///<summary>
///O único propósito dessas consultas é ser usada pelos relatórios
///</summary>
public interface IReportsQueries
{
    Task<TotalsReportResponse> TotalsByPersonAsync(int page, int pageSize, string? personName, CancellationToken token);
    Task<TotalsReportResponse> TotalsByCategoryAsync(int page, int pageSize, string? categoryDescription, CategoryPurpose? purpose, CancellationToken token);
}
