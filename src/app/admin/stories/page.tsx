import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-user";
import { revalidatePath } from "next/cache";
import { Trash2, BookOpen } from "lucide-react";

async function togglePublishStory(id: string, currentStatus: boolean) {
  "use server";
  await requireAdmin();
  await prisma.story.update({
    where: { id },
    data: { isPublished: !currentStatus },
  });
  revalidatePath("/admin/stories");
  revalidatePath("/stories");
}

async function deleteStory(id: string) {
  "use server";
  await requireAdmin();
  await prisma.story.delete({
    where: { id },
  });
  revalidatePath("/admin/stories");
  revalidatePath("/stories");
}

async function purgeAllStories() {
  "use server";
  await requireAdmin();
  await prisma.story.deleteMany({});
  revalidatePath("/admin/stories");
  revalidatePath("/stories");
}

export default async function AdminStoriesPage() {
  const stories = await prisma.story.findMany({
    orderBy: { createdAt: "desc" },
    take: 100
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 700, color: "var(--wa-ink)", margin: 0 }}>
            Stories Management
          </h1>
          <p style={{ color: "var(--wa-muted)", fontSize: "0.9rem", margin: "0.25rem 0 0 0" }}>
            Real-time stories and testimonials submitted by the community. Mock stories have been removed.
          </p>
        </div>
        {stories.length > 0 && (
          <form action={purgeAllStories}>
            <button
              type="submit"
              style={{
                background: "var(--wa-white)",
                color: "var(--wa-terracotta)",
                border: "1px solid var(--wa-border)",
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <Trash2 size={13} aria-hidden="true" />
              <span>Delete All Stories</span>
            </button>
          </form>
        )}
      </div>

      {stories.length === 0 ? (
        <div style={{ background: "var(--wa-white)", padding: "3.5rem 2rem", borderRadius: "8px", textAlign: "center", border: "1px solid var(--wa-border)" }}>
          <div style={{ marginBottom: "0.75rem", color: "var(--wa-forest)", display: "flex", justifyContent: "center" }}>
            <BookOpen size={32} aria-hidden="true" />
          </div>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", fontWeight: 700, color: "var(--wa-ink)", marginBottom: "0.5rem" }}>
            All Stories Removed
          </h3>
          <p style={{ color: "var(--wa-muted)", maxWidth: "480px", margin: "0 auto", fontSize: "0.9rem" }}>
            All mock and draft stories have been completely purged from the system. As authentic learners and tutors share real-time feedback, they will appear here.
          </p>
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
                  padding: "0.25rem 0.75rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" 
                }}>
                  {story.isPublished ? "Published" : "Draft"}
                </span>
              </div>
              
              <div style={{ background: "var(--color-cream)", padding: "1rem", borderRadius: "0.5rem" }}>
                <p style={{ fontSize: "1rem", fontStyle: "italic", color: "var(--color-navy)" }}>"{story.quote}"</p>
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                <form action={togglePublishStory.bind(null, story.id, story.isPublished)}>
                  <button type="submit" style={{ 
                    background: story.isPublished ? "white" : "var(--color-teal)", 
                    color: story.isPublished ? "var(--color-text-muted)" : "white", 
                    border: story.isPublished ? "1px solid var(--color-border)" : "none", 
                    padding: "0.6rem 1.25rem", borderRadius: "0.5rem", fontWeight: 600, cursor: "pointer", fontSize: "0.85rem"
                  }}>
                    {story.isPublished ? "Unpublish" : "Publish"}
                  </button>
                </form>
                <form action={deleteStory.bind(null, story.id)}>
                  <button type="submit" style={{ 
                    background: "white", 
                    color: "var(--color-error)", 
                    border: "1px solid var(--color-error)", 
                    padding: "0.6rem 1.25rem", borderRadius: "0.5rem", fontWeight: 600, cursor: "pointer", fontSize: "0.85rem"
                  }}>
                    Delete
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
