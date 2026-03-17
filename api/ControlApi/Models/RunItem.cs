using System.ComponentModel.DataAnnotations;

namespace ControlApi.Models;

/// <summary>Represents an individual item within a run.</summary>
public class RunItem
{
    public int Id { get; set; }

    public int RunId { get; set; }
    public Run Run { get; set; } = null!;

    [Required, MaxLength(200)]
    public string ExternalId { get; set; } = string.Empty;

    public string Status { get; set; } = "pending"; // pending | processing | done | failed

    public int RetryCount { get; set; } = 0;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? ProcessedAt { get; set; }
}
