namespace AO3W.DomainEntities
{
  public class Fic
  {
    public long id { get; set; }
    public long AO3id { get; set; }
    public string title { get; set; }
    public string author { get; set; }
    public string rating { get; set; }
    public string warning { get; set; }
    public string category { get; set; }
    public List<string> fandoms { get; set; }
  }
}
