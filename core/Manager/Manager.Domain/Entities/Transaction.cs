using Manager.Domain.Common;
using Manager.Domain.Enums;

namespace Manager.Domain.Entities;

/// <summary>
/// Transação financeira.
/// Regras de domínio principais são validadas no Application Service (caso de uso),
/// pois dependem de consulta de Pessoa/Categoria (ex.: idade, finalidade).
/// Aqui valido somente invariantes "locais", que são descrição e valor positivo.
/// </summary>
public sealed class Transaction
{
    public Guid Id { get; private set; } = Guid.CreateVersion7();
    public string Description { get; private set; } = string.Empty;
    public decimal Amount { get; private set; }
    public TransactionType Type { get; private set; }

    public Guid PersonId { get; private set; }
    public Guid CategoryId { get; private set; }

    public Person? Person { get; private set; }
    public Category? Category { get; set; }

    //EF Core
    private Transaction() { }

    public Transaction(string description, decimal amount, TransactionType type, Guid personId, Guid categoryId)
    {
        Description = ValidationHelper.SetDescription(description);
        Amount = ValidationHelper.SetAmount(amount);
        Type = type;
        PersonId = personId;
        CategoryId = categoryId;
    }
}
