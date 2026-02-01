using Manager.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Manager.Application.DTOs;

public sealed record CreateCategoryRequest(string Description, CategoryPurpose Purpose);

public sealed record CategoryResponse(Guid Id, string Description, CategoryPurpose Purpose);
