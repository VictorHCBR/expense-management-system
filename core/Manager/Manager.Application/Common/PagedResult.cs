namespace Manager.Application.Common;

public sealed class PagedResult<T>
{
    public required IReadOnlyList<T> Items { get; init; }
    public required int Page { get; init; }
    public required int PageSize { get; init; }
    public required int TotalItems { get; init; }

    public int TotalPages => (int)Math.Ceiling((double)TotalItems / PageSize);
}
