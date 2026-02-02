using Manager.Application.DTOs;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace Manager.Api.Pdf;

public static class ReportsPdfBuilder
{
    public static byte[] BuildTotalReport(string title, TotalsReportResponse report)
    {
        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Margin(30);
                page.Size(PageSizes.A4);
                page.DefaultTextStyle(x => x.FontSize(10));

                page.Header()
                    .Row(row =>
                    {
                        row.RelativeItem().Column(col =>
                        {
                            col.Item().Text(title).FontSize(10).SemiBold();
                            col.Item().Text($"Gerado em: {DateTimeOffset.Now:dd/MM/yyyy HH:mm}");
                        });
                    });

                page.Content()
                    .PaddingTop(15)
                    .Column(col =>
                    {
                        col.Item().Text("Totais").FontSize(12).SemiBold();
                        col.Item().PaddingTop(8).Element(c => BuildTable(c, report.Items, includeTotalRow: false));

                        col.Item().PaddingTop(16).Text("Total geral").FontSize(12).SemiBold();
                        col.Item().PaddingTop(8).Element(c => BuildTable(c, [report.GrandTotal], includeTotalRow: false));
                    });

                page.Footer()
                    .AlignCenter()
                    .Text(x =>
                    {
                        x.Span("Despesas Residenciais • ");
                        x.Span("Página ");
                        x.CurrentPageNumber();
                        x.Span(" de ");
                        x.TotalPages();
                    });

            });
        });

        return document.GeneratePdf();
    }

    private static IContainer BuildTable(IContainer container, IEnumerable<TotalsRowResponse> rows, bool includeTotalRow)
    {
        container.Table(table =>
        {
            table.ColumnsDefinition(column => {
                column.RelativeColumn(4);
                column.RelativeColumn(2);
                column.RelativeColumn(2);
                column.RelativeColumn(2);
            });

            table.Header(header =>
            {
                header.Cell().Element(HeaderCellStyle).Text("Nome");
                header.Cell().Element(HeaderCellStyle).AlignCenter().Text("Receitas");
                header.Cell().Element(HeaderCellStyle).AlignCenter().Text("Despesas");
                header.Cell().Element(HeaderCellStyle).AlignCenter().Text("Saldo");

                static IContainer HeaderCellStyle(IContainer cont) => cont
                    .DefaultTextStyle(x => x.SemiBold())
                    .PaddingVertical(6)
                    .PaddingHorizontal(6)
                    .Background(Colors.Grey.Lighten3);

            });

            foreach (var row in rows)
            {
                table.Cell().Element(CellStyle).Text(row.Name);
                table.Cell().Element(CellStyle).Text(ToMoney(row.TotalIncome));
                table.Cell().Element(CellStyle).Text(ToMoney(row.TotalExpense));
                table.Cell().Element(CellStyle).Text(ToMoney(row.Balance));

                static IContainer CellStyle(IContainer cont) => cont
                    .BorderBottom(1)
                    .BorderColor(Colors.Grey.Lighten2)
                    .PaddingVertical(6)
                    .PaddingHorizontal(6);
            }

            static string ToMoney(decimal value) => value.ToString("C2");
        });

        return container;
    }
}
