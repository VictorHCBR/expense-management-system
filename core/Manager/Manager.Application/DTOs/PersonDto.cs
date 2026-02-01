namespace Manager.Application.DTOs;

public sealed record CreatePersonRequest(string Name, int Age);
public sealed record UpdatePersonRequest(string Name, int Age);

public sealed record PersonResponse(Guid Id, string Name, int Age);
