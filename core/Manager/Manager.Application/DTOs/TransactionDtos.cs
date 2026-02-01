using Manager.Domain.Enums;

namespace Manager.Application.DTOs;

public sealed record CreateTransactionRequest(
    string Description,
    decimal Amount,
    TransactionType Type,
    Guid PersonId,
    Guid CategoryId
);

public sealed record TransactionResponse(
    Guid Id,
    string Description,
    decimal Amount,
    TransactionType Type,
    Guid PersonId,
    string PersonName,
    Guid CategoryId,
    string CategoryDescription
);