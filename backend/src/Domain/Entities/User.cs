namespace AO3W.Domain.Entities
{
  public class User 
  {
    public long Id { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    public DateTime CreatedAt { get; set; }
  }
}
