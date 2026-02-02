namespace Manager.Application.DTOs;

public sealed record TotalsRowResponse(
    Guid Id,
    string Name,
    decimal TotalIncome,
    decimal TotalExpense,
    decimal Balance
);

/// <summary>
/// Relatório paginado e metadados de paginação
/// </summary>
public sealed record TotalsReportResponse(
    IReadOnlyList<TotalsRowResponse> Items,
    TotalsRowResponse GrandTotal,
    int TotalItems,
    int Page,
    int PageSize
);
