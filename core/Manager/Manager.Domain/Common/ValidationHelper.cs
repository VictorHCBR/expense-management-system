using System.Xml.Linq;

namespace Manager.Domain.Common;

public class ValidationHelper
{
    public static string SetDescription(string description)
    {
        if (string.IsNullOrWhiteSpace(description))
            throw new DomainException("Descrição é obrigatória.");

        if (description.Length > 400)
            throw new DomainException("Descrição deve ter no máximo 400 caracteres.");

        return description.Trim();
    }

    public static int SetAge(int age)
    {
        if (age < 0)
            throw new DomainException("Idade deve ser maior ou igual a 0.");

        return age;
    }

    public static decimal SetAmount(decimal amount)
    {
        if (amount <= 0)
            throw new DomainException("Valor deve ser positivo.");

        return amount;
    }

    public static string SetName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new DomainException("O nome deve ser informado!");

        if (name.Length > 200)
            throw new DomainException("O nome deve ter no máximo 200 caracteres!");

        return name.Trim();
    }
}
