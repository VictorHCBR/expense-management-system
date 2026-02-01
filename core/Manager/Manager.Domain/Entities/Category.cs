using Manager.Domain.Common;
using Manager.Domain.Enums;

namespace Manager.Domain.Entities;

///<summary>
/// Categoria usada na classificação das transações.
/// - Descrição com no máximo 400 caracteres
/// - Finalidade define o tipo de transação que está sendo feita
///</summary>
public sealed class Category
{
    //O UUID v7 tem performance melhor em bancos de dados
    //principalmente se formos usar índices índices quando
    //comparado com o UUID v4 que é o usual.
    public Guid Id { get; private set; } = Guid.CreateVersion7(); 
    public string Description { get; private set; } = string.Empty;
    public CategoryPurpose Purpose { get; private set; }

    /**
     * O construtor privado e sem argumentos é necessário para o mapeamento 
     * do Entity Framework Core na minha aplicação. Isto vale para todas 
     * as entidades do domínio.
    */
    private Category() { }

    public Category(string description, CategoryPurpose purpose)
    {
        SetDescription(description);
        Purpose = purpose;
    }

    public void Update(string description, CategoryPurpose purpose)
    {
        SetDescription(description);
        Purpose = purpose;
    }

    /* Método auxiliar para definir a descrição da categoria,
     * aplicando as regras de negócio necessárias.
    */
    private void SetDescription(string description)
    {
        if (string.IsNullOrWhiteSpace(description))
            throw new DomainException("A descrição da categoria é obrigatória.");

        if (description.Length > 400)
            throw new DomainException("A descrição da categoria não pode exceder 400 caracteres.");

        Description = description;
    }
}
