using Manager.Application.DTOs;
using Manager.Application.Services;
using Manager.Domain.Enums;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace Manager.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CategoriesController(CategoriesService service) : ControllerBase
{
    private readonly CategoriesService _service = service;

    [HttpPost]
    public async Task<ActionResult<CategoryResponse>> Create([FromBody] CreateCategoryRequest request, CancellationToken token)
    {
        var created = await _service.CreateAsync(request, token);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpGet("{id:guid}")]
    public async Task <ActionResult<CategoryResponse>> GetById(Guid id, CancellationToken token)
    {
        var category = await _service.GetAsync(id, token);
        return category is null ? NotFound() : Ok(category);
    }

    [HttpGet]
    public async Task<ActionResult> List(
        [FromQuery] string? description,
        [FromQuery] CategoryPurpose? purpose,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        CancellationToken token = default)
    {
        var (items, total) = await _service.ListAsync(description, purpose, page, pageSize, token);
        return Ok(new { items, page, pageSize, totalItems = total });
    }
}
