import Link from "next/link";
import { TerminalEmulator } from "@/components/terminal-emulator";
import { PageFooter } from "@/components/page-footer";

export default function LinuxTerminalPage() {
  return (
    <main className="space-y-4 px-3 pt-4 sm:space-y-6 sm:px-0 sm:pt-0">
      {/* Header */}
      <section className="rounded-2xl border border-[#1a3028]/70 bg-gradient-to-br from-emerald-950/50 via-[#091510] to-[#080b10] p-5 sm:rounded-xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Linux Terminal Practice</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              A simulated Linux environment running in your browser. Practice real commands against a virtual filesystem — no setup needed.
            </p>
          </div>
          <Link
            href="/linux"
            className="flex-shrink-0 rounded-lg bg-zinc-800 px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700 active:bg-zinc-600"
          >
            ← Back
          </Link>
        </div>
      </section>

      {/* Terminal */}
      <TerminalEmulator mode="linux" />

      {/* Quick reference */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:rounded-xl sm:p-5">
        <h3 className="mb-3 text-sm font-semibold text-zinc-400 uppercase tracking-wider">Quick Reference</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { label: "Navigation", cmds: ["pwd", "ls -la", "cd /etc", "find . -name '*.sh'"] },
            { label: "File Viewing", cmds: ["cat /etc/passwd", "head -5 /var/log/syslog", "grep root /etc/passwd", "wc -l /etc/hosts"] },
            { label: "Processes", cmds: ["ps aux", "top", "pgrep sshd", "kill 1200"] },
            { label: "Permissions", cmds: ["ls -la /home/user", "chmod 755 scripts/backup.sh", "id", "whoami"] },
            { label: "System Info", cmds: ["uname -a", "uptime", "df -h", "free"] },
            { label: "Scripts", cmds: ["cat scripts/backup.sh", "cat scripts/monitor.sh", "file scripts/backup.sh"] },
          ].map((section) => (
            <div key={section.label} className="rounded-xl border border-zinc-700/40 bg-zinc-800/40 p-3">
              <p className="mb-1.5 text-xs font-semibold text-zinc-400">{section.label}</p>
              <div className="space-y-1">
                {section.cmds.map((cmd) => (
                  <code key={cmd} className="block text-xs text-emerald-400 font-mono">{cmd}</code>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tips */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:rounded-xl sm:p-5">
        <h3 className="mb-2 text-sm font-semibold text-zinc-400 uppercase tracking-wider">Tips</h3>
        <ul className="space-y-1.5 text-sm text-zinc-400">
          <li>Use <code className="rounded bg-zinc-700/60 px-1 text-xs text-emerald-400 font-mono">↑ / ↓</code> arrows to navigate command history</li>
          <li>Use <code className="rounded bg-zinc-700/60 px-1 text-xs text-emerald-400 font-mono">Tab</code> to autocomplete command names</li>
          <li><code className="rounded bg-zinc-700/60 px-1 text-xs text-emerald-400 font-mono">Ctrl+C</code> cancels the current input</li>
          <li><code className="rounded bg-zinc-700/60 px-1 text-xs text-emerald-400 font-mono">clear</code> or <code className="rounded bg-zinc-700/60 px-1 text-xs text-emerald-400 font-mono">Ctrl+L</code> clears the screen</li>
          <li>On mobile: use the <strong className="text-zinc-300">run ↵</strong> button or tap the terminal area to focus</li>
        </ul>
      </section>

      <PageFooter />
    </main>
  );
}
