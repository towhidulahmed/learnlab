import { STATIC_SYLLABUS } from "./static-syllabus";
import type { LinuxDomain } from "./linux-study-data";

/**
 * Generate flashcards from Security+ syllabus data.
 * Each topic produces flashcards from keyTerms and tips.
 */
function generateFlashcards(topic: (typeof STATIC_SYLLABUS)[number]["topics"][number]): { front: string; back: string }[] {
  const cards: { front: string; back: string }[] = [];

  // Key terms as flashcards
  for (const term of topic.keyTerms) {
    const definition = extractDefinition(topic.content, term);
    if (definition) {
      cards.push({
        front: `What is ${term}?`,
        back: cleanMarkdown(definition),
      });
    }
  }

  // Tips as flashcards — use only tips that contain a clear question stem
  for (const tip of topic.tips) {
    const colonIdx = tip.indexOf(":");
    const periodIdx = tip.indexOf(".");
    const splitIdx = colonIdx > 0 && colonIdx < 80 ? colonIdx : periodIdx > 0 && periodIdx < 80 ? periodIdx : -1;
    if (splitIdx > 10) {
      cards.push({
        front: tip.slice(0, splitIdx).trim().replace(/\?$/, "") + "?",
        back: cleanMarkdown(tip),
      });
    }
  }

  return cards;
}

/** Strip markdown formatting from a string for clean flashcard display */
function cleanMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .replace(/^[#\-*>]+\s*/gm, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\n{2,}/g, " ")
    .trim();
}

/**
 * Extract a definition for a term from markdown content.
 * Uses 3 strategies in order of reliability.
 */
function extractDefinition(content: string, term: string): string {
  const lines = content.split("\n");
  const termLower = term.toLowerCase();
  // Also try the first word of multi-word/slash terms (e.g. "FIDO2/WebAuthn" → "FIDO2")
  const termBase = termLower.split(/[\/\s]/)[0];

  // Strategy 1: Look for bold-formatted term in a bullet: "**Term**," or "**Term (...)** —"
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineLower = line.toLowerCase();
    if (
      (lineLower.includes(`**${termLower}**`) || lineLower.includes(`**${termBase}`)) &&
      line.trim().length > 15
    ) {
      let result = line.replace(/^[\s\-*]+/, "").trim();
      // If the line itself is short (just the bold header), grab the next line too
      if (result.replace(/\*\*/g, "").length < 60 && i + 1 < lines.length) {
        const next = lines[i + 1].replace(/^[\s\-*#]+/, "").trim();
        if (next.length > 0) result += " " + next;
      }
      if (result.replace(/\*\*/g, "").length > 20) return result.slice(0, 350);
    }
  }

  // Strategy 2: Any line containing the term that is long enough to be a definition
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineLower = line.toLowerCase();
    if (
      (lineLower.includes(termLower) || lineLower.includes(termBase)) &&
      line.trim().length > 40 &&
      !line.trim().startsWith("#")
    ) {
      let result = line.replace(/^[\s\-*]+/, "").trim();
      if (result.replace(/\*\*/g, "").length < 80 && i + 1 < lines.length) {
        const next = lines[i + 1].replace(/^[\s\-*#]+/, "").trim();
        if (next.length > 0) result += " " + next;
      }
      return result.slice(0, 350);
    }
  }

  // Strategy 3: Return the first meaningful non-header sentence from the topic content
  for (const line of lines) {
    const cleaned = line.replace(/^[#\s\-*]+/, "").replace(/\*\*/g, "").trim();
    if (cleaned.length > 50 && !cleaned.startsWith("##") && !cleaned.startsWith("###")) {
      return cleaned.slice(0, 350);
    }
  }

  return "";
}

/**
 * Convert STATIC_SYLLABUS into LinuxDomain-compatible structure for FlashcardRunner
 */
export const SECPLUS_FLASHCARD_DOMAINS: LinuxDomain[] = STATIC_SYLLABUS.map((domain) => ({
  key: domain.key,
  name: domain.name,
  level: "intermediate" as const,
  topics: domain.topics.map((topic) => ({
    slug: topic.slug,
    title: topic.title,
    content: topic.content,
    commands: [],
    tips: topic.tips,
    flashcards: generateFlashcards(topic),
  })),
}));

export const SECPLUS_TOTAL_FLASHCARDS = SECPLUS_FLASHCARD_DOMAINS.reduce(
  (sum, d) => sum + d.topics.reduce((s, t) => s + t.flashcards.length, 0),
  0
);
