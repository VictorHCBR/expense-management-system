using Manager.Application.DTOs;
using Manager.Application.Services;
using Manager.Domain.Enums;
using Microsoft.AspNetCore.Mvc;

namespace Manager.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TransactionsController(TransactionsService service) : ControllerBase
{
    private readonly TransactionsService _service = service;

    [HttpPost]
    public async Task<ActionResult<TransactionResponse>> Create([FromBody] CreateTransactionRequest request, CancellationToken token)
    {
        var created = await _service.CreateAsync(request, token);
        return CreatedAtAction(nameof(List), new { id = created.Id }, created);
    }

    [HttpGet]
    public async Task<ActionResult> List(
        [FromQuery] Guid? personId,
        [FromQuery] Guid? categoryId,
        [FromQuery] TransactionType? type,
        [FromQuery] string? description,
        [FromQuery] decimal? minAmount,
        [FromQuery] decimal? maxAmount,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        CancellationToken token = default)
    {
        var paged = await _service.ListRawAsync(
            personId, categoryId, type, description, 
            minAmount, maxAmount, page, pageSize, 
            token);

        var items = paged.Items.Select(trans => new TransactionResponse(
            trans.Id,
            trans.Description,
            trans.Amount,
            trans.Type,
            trans.PersonId,
            trans.Person?.Name ?? "",
            trans.CategoryId,
            trans.Category?.Description ?? ""
        )).ToList();

        return Ok(new { items, page = paged.Page, pageSize = paged.PageSize, totalItems = paged.TotalItems });
    }
}
