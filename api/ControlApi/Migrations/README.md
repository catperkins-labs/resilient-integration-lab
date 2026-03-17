# Migrations

EF Core migrations are generated here via:

```bash
cd api/ControlApi
dotnet ef migrations add InitialSchema
dotnet ef database update
```

In Docker (dev), migrations are applied automatically at startup via `db.Database.Migrate()` in `Program.cs`.
