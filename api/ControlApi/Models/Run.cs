using System.ComponentModel.DataAnnotations;

namespace ControlApi.Models;

/// <summary>Represents a single top-level processing run.</summary>
public class Run
{
    public int Id { get; set; }

    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    public string Status { get; set; } = "pending"; // pending | running | completed | failed

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? CompletedAt { get; set; }

    public ICollection<RunItem> Items { get; set; } = new List<RunItem>();
    public ICollection<Failure> Failures { get; set; } = new List<Failure>();
}
