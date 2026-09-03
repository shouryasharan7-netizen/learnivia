import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-user";
import { revalidatePath } from "next/cache";

async function togglePublishStory(id: string, currentStatus: boolean) {
  "use server";
  await requireAdmin();
  await prisma.story.update({
    where: { id },
    data: { isPublished: !currentStatus },
  });
  revalidatePath("/admin/stories");
}

export default async function AdminStoriesPage() {
  const stories = await prisma.story.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div>
      <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-navy)", marginBottom: "2rem" }}>
        Stories Management
      </h1>

      {stories.length === 0 ? (
        <div style={{ background: "white", padding: "3rem", borderRadius: "1rem", textAlign: "center", border: "1px solid var(--color-border)" }}>
          <p style={{ color: "var(--color-text-muted)" }}>No stories in the database.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {stories.map((story) => (
            <div key={story.id} style={{ background: "white", padding: "1.5rem", borderRadius: "1rem", border: "1px solid var(--color-border)", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--color-navy)" }}>{story.name}</h3>
                  <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem" }}>{story.subject}</p>
                </div>
                <span style={{ 
                  background: story.isPublished ? "var(--color-success-bg)" : "var(--color-cream)", 
                  color: story.isPublished ? "var(--color-success)" : "var(--color-text-muted)", 
                  padding: "0.25rem 0.75rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" 
                }}>
                  {story.isPublished ? "Published" : "Draft"}
                </span>
              </div>
              
              <div style={{ background: "var(--color-cream)", padding: "1rem", borderRadius: "0.5rem" }}>
                <p style={{ fontSize: "1rem", fontStyle: "italic", color: "var(--color-navy)" }}>"{story.quote}"</p>
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <form action={togglePublishStory.bind(null, story.id, story.isPublished)}>
                  <button type="submit" style={{ 
                    background: story.isPublished ? "white" : "var(--color-teal)", 
                    color: story.isPublished ? "var(--color-text-muted)" : "white", 
                    border: story.isPublished ? "1px solid var(--color-border)" : "none", 
                    padding: "0.75rem 1.5rem", borderRadius: "0.5rem", fontWeight: 600, cursor: "pointer" 
                  }}>
                    {story.isPublished ? "Unpublish" : "Publish"}
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
