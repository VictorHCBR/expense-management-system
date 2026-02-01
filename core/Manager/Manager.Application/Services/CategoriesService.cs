using Manager.Application.Contracts;
using Manager.Application.DTOs;
using Manager.Domain.Entities;
using Manager.Domain.Enums;

namespace Manager.Application.Services;

public sealed class CategoriesService(ICategoryRepository categories, IUnitOfWork uow)
{
    private readonly ICategoryRepository _categories = categories;
    private readonly IUnitOfWork _uow = uow;

    public async Task<CategoryResponse> CreateAsync(CreateCategoryRequest request, CancellationToken token)
    {
        var category = new Category(request.Description, request.Purpose);
        await _categories.AddAsync(category, token);
        await _uow.SaveChangesAsync(token);

        return new CategoryResponse(category.Id, category.Description, category.Purpose);
    }

    public async Task<CategoryResponse?> GetAsync(Guid id, CancellationToken token)
    {
        var category = await _categories.GetByIdAsync(id, token);
        return category is null ? null : new CategoryResponse(category.Id, category.Description, category.Purpose);
    }

    public async Task<(IReadOnlyList<CategoryResponse> Items, int TotalItems)> ListAsync(
        string? description, CategoryPurpose? purpose, int page, int pageSize, CancellationToken token)
    {

        var paged = await _categories.ListAsync(description, purpose, page, pageSize, token);
        return (paged.Items.Select(cat => new CategoryResponse(cat.Id, cat.Description, cat.Purpose)).ToList(), paged.TotalItems);
    }
}
