namespace AO3W.Domain.Entities
{
  public class UserFic
  {
    public long UserId { get; set; }
    public long FicId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastReadAt { get; set; }
  }
}
