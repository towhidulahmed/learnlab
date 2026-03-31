import { LINUX_STUDY } from "@/lib/linux-study-data";
import { LinuxStudyClient } from "@/components/linux-study-client";

export const dynamic = "force-static";

export default function LinuxStudyPage() {
  return (
    <main>
      <LinuxStudyClient domains={LINUX_STUDY} />
    </main>
  );
}
