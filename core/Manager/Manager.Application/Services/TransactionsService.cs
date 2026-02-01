using Manager.Application.Common;
using Manager.Application.Contracts;
using Manager.Application.DTOs;
using Manager.Domain.Common;
using Manager.Domain.Entities;
using Manager.Domain.Enums;

namespace Manager.Application.Services;

public sealed class TransactionsService(
    ITransactionRepository transactions, IPersonRepository people,
    ICategoryRepository categories, IUnitOfWork uow)
{
    private readonly ITransactionRepository _transactions = transactions;
    private readonly IPersonRepository _people = people;
    private readonly ICategoryRepository _categories = categories;
    private readonly IUnitOfWork _uow = uow;

    public async Task<TransactionResponse> CreateAsync(CreateTransactionRequest request, CancellationToken token) { 
        var person = await _people.GetByIdAsync(request.PersonId, token)
            ?? throw new DomainException("Pessoa não encontrada");


        var category = await _categories.GetByIdAsync(request.CategoryId, token)
            ?? throw new DomainException("Categoria não encontrada.");

        if (person.Age < 18 && request.Type != Domain.Enums.TransactionType.Expense)
            throw new DomainException("Pessoaz menores de 18 anos só podem registrar despesas.");

        var isAllowed = category.Purpose switch
        {
            Domain.Enums.CategoryPurpose.Expense => request.Type == Domain.Enums.TransactionType.Expense,
            Domain.Enums.CategoryPurpose.Income => request.Type == Domain.Enums.TransactionType.Income,
            _ => false
        };

        if (!isAllowed)
            throw new DomainException("Tipo de transação não é compatível com a categoria.");

        var transaction = new Transaction(
            request.Description,
            request.Amount,
            request.Type,
            request.PersonId,
            request.CategoryId
        );

        await _transactions.AddAsync(transaction, token);
        await _uow.SaveChangesAsync(token);

        return new TransactionResponse(
            transaction.Id,
            transaction.Description,
            transaction.Amount,
            transaction.Type,
            person.Id,
            person.Name,
            category.Id,
            category.Description
        );
    }

    public Task<PagedResult<Transaction>> ListRawAsync(
        Guid? personId, Guid? categoryId, 
        TransactionType? type, 
        string? description,
        decimal? minAmount, decimal? maxAmount, 
        int page, int pageSize, 
        CancellationToken token)
        => _transactions.ListAsync(personId, categoryId, type, description, minAmount, maxAmount, page, pageSize, token);
}
