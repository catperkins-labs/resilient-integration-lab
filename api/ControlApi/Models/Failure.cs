using System.ComponentModel.DataAnnotations;

namespace ControlApi.Models;

/// <summary>Represents a recorded failure for a run item.</summary>
public class Failure
{
    public int Id { get; set; }

    public int RunId { get; set; }
    public Run Run { get; set; } = null!;

    public int? RunItemId { get; set; }
    public RunItem? RunItem { get; set; }

    [Required, MaxLength(500)]
    public string Message { get; set; } = string.Empty;

    public string? StackTrace { get; set; }

    public bool IsDeadLettered { get; set; } = false;

    public DateTime OccurredAt { get; set; } = DateTime.UtcNow;
}
