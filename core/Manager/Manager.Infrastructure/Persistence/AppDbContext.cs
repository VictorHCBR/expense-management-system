using Manager.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Manager.Infrastructure.Persistence;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Person> People => Set<Person>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Transaction> Transactions => Set<Transaction>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Person>(builder => 
        {
            builder.ToTable("people");
            builder.HasKey(key => key.Id);
            builder.Property(x => x.Name).HasMaxLength(200).IsRequired();
            builder.Property(x => x.Age).IsRequired();
        });

        modelBuilder.Entity<Category>(builder =>
        {
            builder.ToTable("categories");
            builder.HasKey(key => key.Id);
            builder.Property(x => x.Description).HasMaxLength(400).IsRequired();
            builder.Property(x => x.Purpose).IsRequired();
        });

        modelBuilder.Entity<Transaction>(builder =>
        {
            builder.ToTable("transactions");
            builder.HasKey(key => key.Id);
            builder.Property(x => x.Description).HasMaxLength(400).IsRequired();
            builder.Property(x => x.Amount).HasColumnType("numeric(18,2)").IsRequired();
            builder.Property(x => x.Type).IsRequired();

            builder.HasOne(x => x.Person)
                .WithMany()
                .HasForeignKey(x => x.PersonId)
                .OnDelete(DeleteBehavior.Cascade); //Como foi especificado, essa parte aqui do EF garante que, ao ser deletada uma pessoa,
                                                   //as transação que eu tiver definido com ela também serão excluidas

            builder.HasOne(x => x.Category)
                .WithMany()
                .HasForeignKey()
                .OnDelete(DeleteBehavior.Restrict); //Como pode haver mais de uma transação com a mesma categoria,
                                                    //então não faz sentido deletar a categoria de vez
        });
    }
}
