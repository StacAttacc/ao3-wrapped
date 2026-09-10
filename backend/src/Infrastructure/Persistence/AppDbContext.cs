using AO3W.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AO3W.Infrastructure.Persistence
{
  public class AppDbContext : DbContext
  {
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

    public DbSet<Fic> Fics { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<UserFic> UserFics { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      base.OnModelCreating(modelBuilder);
      modelBuilder.Entity<UserFic>().HasKey(uf => new {
        uf.UserId, uf.FicId
      });
    }
  }
}
