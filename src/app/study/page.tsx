import { StudyModule } from "@/components/study-module";
import { STATIC_SYLLABUS } from "@/lib/static-syllabus";

export const dynamic = "force-static";

export default function StudyPage() {
  const payload = STATIC_SYLLABUS.map((domain) => ({
    ...domain,
    topics: domain.topics.map((topic) => ({
      ...topic,
      keyTerms: JSON.stringify(topic.keyTerms),
      examples: JSON.stringify(topic.examples),
      tips: JSON.stringify(topic.tips),
      progress: null,
    })),
  }));

  return (
    <main>
      <StudyModule domains={payload} />
    </main>
  );
}
