using Manager.Domain.Common;

namespace Manager.Domain.Entities;

///<summary>
/// Entidade que representa a pessoa relacionada com as transações.
///</summary>
public sealed class Person
{
    public Guid Id { get; private set; } = Guid.CreateVersion7();
    public string Name { get; private set; } = string.Empty;
    public int Age { get; private set; }

    // EF Core
    private Person() { }

    public Person(string name, int age)
    {
        Name = ValidationHelper.SetName(name);
        Age = ValidationHelper.SetAge(age);
    }

    public void Update(string name, int age)
    {
        Name = ValidationHelper.SetName(name);
        Age = ValidationHelper.SetAge(age);
    }
}
