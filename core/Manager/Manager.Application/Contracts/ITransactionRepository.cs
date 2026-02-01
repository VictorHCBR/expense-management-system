using Manager.Application.Common;
using Manager.Domain.Entities;
using Manager.Domain.Enums;

namespace Manager.Application.Contracts;

public interface ITransactionRepository
{
    Task<PagedResult<Transaction>> ListAsync(
        Guid? personId,
        Guid? categoryId,
        TransactionType? type,
        string? description,
        decimal? minAmount,
        decimal? maxAmount,
        int page,
        int pageSize,
        CancellationToken token
    );

    Task AddAsync(Transaction transaction, CancellationToken token);
}
