using Manager.Api.Pdf;
using Manager.Application.Services;
using Manager.Domain.Enums;
using Microsoft.AspNetCore.Mvc;

namespace Manager.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ReportsController(ReportsService service) : ControllerBase
{
    private readonly ReportsService _service = service;

    //Relatórios que contém os totais por pessoa
    [HttpGet("people")]
    public async Task<ActionResult> TotalsByPerson(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? personName = null,
        CancellationToken token = default)
    {
        var report = await _service.TotalsByPersonAsync(page, pageSize, personName, token);

        return Ok(new
        {
            items = report.Items,
            grandTotal = report.GrandTotal,
            page = report.Page,
            pageSize = report.PageSize,
            totalItems = report.TotalItems
        });
    }

    [HttpGet("people/pdf")]
    public async Task<ActionResult> TotalsByPersonPdf(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 200,
        [FromQuery] string? personName = null,
        CancellationToken token = default)
    {
        var report = await _service.TotalsByPersonAsync(page, pageSize, personName, token);
        var bytes = ReportsPdfBuilder.BuildTotalReport("Relatório • Totais por Pessoa", report);

        return File(bytes, "application/pdf", "relatorio-totais-por-pessoa.pdf");
    }

    //Relatórios que contém os totais por categoria
    [HttpGet("categories")]
    public async Task<ActionResult> TotalsByCategory(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? categoryDescription = null,
        [FromQuery] CategoryPurpose? purpose = null,
        CancellationToken token = default)
    {
        var report = await _service.TotalsByCategoryAsync(page, pageSize, categoryDescription, purpose, token);
        return Ok(new
        {
            items = report.Items,
            grandTotal = report.GrandTotal,
            page = report.Page,
            pageSize = report.PageSize,
            totalItems = report.TotalItems
        });
    }

    [HttpGet("categories/pdf")]
    public async Task<ActionResult> TotalsByCategoryPdf(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 200,
        [FromQuery] string? categoryDescription = null,
        [FromQuery] CategoryPurpose? purpose = null,
        CancellationToken token = default)
    {
        var report = await _service.TotalsByCategoryAsync(page, pageSize, categoryDescription, purpose, token);
        var bytes = ReportsPdfBuilder.BuildTotalReport("Relatório • Totais por Categoria", report);

        return File(bytes, "application/pdf", "relatorio-totais-por-categoria.pdf");
    }

}
