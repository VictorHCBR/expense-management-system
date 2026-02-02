using Manager.Application.DTOs;
using Manager.Application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Manager.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PeopleController(PeopleService service) : ControllerBase
{
    private readonly PeopleService _service = service;

    [HttpPost]
    public async Task<ActionResult<PersonResponse>> Create([FromBody] CreatePersonRequest request, CancellationToken token)
    {
        var created = await _service.CreateAsync(request, token);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<PersonResponse>> GetById(Guid id, CancellationToken token)
    {
        var person = await _service.GetAsync(id, token);
        return person is null ? NotFound() : Ok(person);
    }

    [HttpGet]
    public async Task<ActionResult> List(
        [FromQuery] string? name,
        [FromQuery] int? minAge,
        [FromQuery] int? maxAge,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken token = default)
    {
        var (items, total) = await _service.ListAsync(name, minAge, maxAge, page, pageSize, token);
        return Ok(new { items, page, pageSize, totalItems = total });
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult> Update(Guid id, [FromBody] UpdatePersonRequest request, CancellationToken token)
    {
        var updated = await _service.UpdateAsync(id, request, token);
        return updated ? NoContent() : NotFound();
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Delete(Guid id, CancellationToken token)
    {
        var deleted = await _service.DeleteAsync(id, token);
        return deleted ? NoContent() : NotFound();
    }
}

