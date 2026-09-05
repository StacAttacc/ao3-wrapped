namespace AO3W.Domain.Entities
{
  public class Fic
  {
    public long Id { get; set; }
    public long Ao3id { get; set; }
    public string Title { get; set; }
    public string Author { get; set; }
    public string Rating { get; set; }
    public string Warning { get; set; }
    public string Category { get; set; }
    public string Language { get; set; }

    public List<string> Fandoms { get; set; }
    public List<string> Relationships { get; set; }
    public List<string> Characters { get; set; }
    public List<string> AdditionalTags { get; set; }

    public DateTime Published { get; set; }
    public int Words { get; set; }
    public int Chapters { get; set; }
    public int Kudos { get; set; }
    public int Hits { get; set; }
    public int Comments { get; set; }
    public int Bookmarks { get; set; }
  }
}
