using ControlApi.Models;
using Microsoft.EntityFrameworkCore;

namespace ControlApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Run> Runs => Set<Run>();
    public DbSet<RunItem> RunItems => Set<RunItem>();
    public DbSet<Failure> Failures => Set<Failure>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Run>(e =>
        {
            e.ToTable("runs");
            e.HasKey(r => r.Id);
            e.Property(r => r.Name).IsRequired().HasMaxLength(100);
            e.Property(r => r.Status).IsRequired().HasDefaultValue("pending");
            e.Property(r => r.CreatedAt).HasDefaultValueSql("now()");
        });

        modelBuilder.Entity<RunItem>(e =>
        {
            e.ToTable("run_items");
            e.HasKey(i => i.Id);
            e.Property(i => i.ExternalId).IsRequired().HasMaxLength(200);
            e.Property(i => i.Status).IsRequired().HasDefaultValue("pending");
            e.Property(i => i.CreatedAt).HasDefaultValueSql("now()");
            e.HasOne(i => i.Run)
             .WithMany(r => r.Items)
             .HasForeignKey(i => i.RunId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Failure>(e =>
        {
            e.ToTable("failures");
            e.HasKey(f => f.Id);
            e.Property(f => f.Message).IsRequired().HasMaxLength(500);
            e.Property(f => f.OccurredAt).HasDefaultValueSql("now()");
            e.HasOne(f => f.Run)
             .WithMany(r => r.Failures)
             .HasForeignKey(f => f.RunId)
             .OnDelete(DeleteBehavior.Cascade);
            e.HasOne(f => f.RunItem)
             .WithMany()
             .HasForeignKey(f => f.RunItemId)
             .OnDelete(DeleteBehavior.SetNull);
        });
    }
}
