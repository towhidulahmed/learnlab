import { UNIX_SECURITY_STUDY } from "@/lib/unix-security-study-data";
import { LinuxStudyClient } from "@/components/linux-study-client";
import { PageFooter } from "@/components/page-footer";

export const dynamic = "force-static";

export default function UnixSecurityStudyPage() {
  return (
    <main>
      <LinuxStudyClient
        domains={UNIX_SECURITY_STUDY as any}
        title="Unix Security Study Guide"
        backHref="/unix-security"
        flashcardsBasePath="/unix-security/flashcards"
        accent="blue"
      />
      <PageFooter />
    </main>
  );
}
