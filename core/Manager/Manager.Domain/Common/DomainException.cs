namespace Manager.Domain.Common;

/// <summary>
/// O propósito desta classe é ser usada quando 
/// houver uma violação de alguma das regras de negócio
/// definidas no domínio.
/// </summary>
public sealed class DomainException(string message) : Exception(message)
{
}
