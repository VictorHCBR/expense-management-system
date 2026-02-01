using Manager.Application.Contracts;
using Manager.Application.DTOs;
using Manager.Domain.Entities;

namespace Manager.Application.Services;

public sealed class PeopleService(IPersonRepository people, IUnitOfWork uow)
{
    private readonly IPersonRepository _people = people;
    private readonly IUnitOfWork _uow = uow;

    public async Task<PersonResponse> CreateAsync(CreatePersonRequest request, CancellationToken token)
    {
        var person = new Person(request.Name, request.Age);
        await _people.AddAsync(person, token);
        await _uow.SaveChangesAsync(token);

        return new PersonResponse(person.Id, person.Name, person.Age);
    }

    public async Task<PersonResponse?> GetAsync(Guid id, CancellationToken token)
    {
        var person = await _people.GetByIdAsync(id, token);
        return person is null ? null : new PersonResponse(person.Id, person.Name, person.Age);
    }

    public async Task<(IReadOnlyList<PersonResponse> Items, int TotalItems)> ListAsync(string? name, int? minAge, int? maxAge, int page, int pageSize, CancellationToken token)
    {
        var paged = await _people.ListAsync(name, minAge, maxAge, page, pageSize, token);
        return (paged.Items.Select(p => new PersonResponse(p.Id, p.Name, p.Age)).ToList(), paged.TotalItems);
    }

    public async Task<bool> UpdateAsync(Guid id, UpdatePersonRequest request, CancellationToken token)
    {
        var person = await _people.GetByIdAsync(id, token);
        if (person is null)
            return false;

        person.Update(request.Name, request.Age);
        await _uow.SaveChangesAsync(token);
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken token)
    {
        var person = await _people.GetByIdAsync(id, token);
        if (person is null)
            return false;

        _people.Remove(person);
        await _uow.SaveChangesAsync(token);
        return true;
    }
}
