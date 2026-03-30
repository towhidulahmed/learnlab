import Link from "next/link";
import { TerminalEmulator } from "@/components/terminal-emulator";
import { PageFooter } from "@/components/page-footer";

export default function UnixSecurityTerminalPage() {
  return (
    <main className="space-y-4 px-3 pt-4 sm:space-y-6 sm:px-0 sm:pt-0">
      {/* Header */}
      <section className="rounded-2xl border border-[#1a2438]/70 bg-gradient-to-br from-blue-950/50 via-[#080c16] to-[#080b10] p-5 sm:rounded-xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Security Terminal Practice</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              A simulated system with real security artifacts — failed logins, open ports, active sessions. Practice threat detection commands without a live system.
            </p>
          </div>
          <Link
            href="/unix-security"
            className="flex-shrink-0 rounded-lg bg-zinc-800 px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700 active:bg-zinc-600"
          >
            ← Back
          </Link>
        </div>
      </section>

      {/* Terminal */}
      <TerminalEmulator mode="security" />

      {/* Scenarios */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:rounded-xl sm:p-5">
        <h3 className="mb-3 text-sm font-semibold text-zinc-400 uppercase tracking-wider">Practice Scenarios</h3>
        <div className="space-y-3">
          {[
            {
              title: "1. Check for failed login attempts",
              cmds: ["cat /var/log/auth.log", "grep 'Failed password' /var/log/auth.log", "grep 'Invalid user' /var/log/auth.log"],
            },
            {
              title: "2. Identify open network services",
              cmds: ["netstat -tlnp", "ss -tlnp", "lsof"],
            },
            {
              title: "3. Audit active sessions and logins",
              cmds: ["who", "w", "last"],
            },
            {
              title: "4. Inspect running processes",
              cmds: ["ps aux", "pgrep apache2", "pgrep sshd"],
            },
            {
              title: "5. Review suspicious cron jobs",
              cmds: ["cat /etc/crontab", "ls -la /etc"],
            },
            {
              title: "6. Check user accounts",
              cmds: ["cat /etc/passwd", "grep '/bin/bash' /etc/passwd", "grep -v 'nologin' /etc/passwd"],
            },
          ].map((scenario) => (
            <div key={scenario.title} className="rounded-xl border border-zinc-700/40 bg-zinc-800/40 p-3">
              <p className="mb-2 text-sm font-semibold text-zinc-300">{scenario.title}</p>
              <div className="flex flex-wrap gap-2">
                {scenario.cmds.map((cmd) => (
                  <code key={cmd} className="rounded bg-zinc-700/60 px-1.5 py-0.5 text-xs text-blue-300 font-mono">{cmd}</code>
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
          <li>Use <code className="rounded bg-zinc-700/60 px-1 text-xs text-blue-300 font-mono">↑ / ↓</code> arrows to navigate command history</li>
          <li>Use <code className="rounded bg-zinc-700/60 px-1 text-xs text-blue-300 font-mono">Tab</code> to autocomplete command names</li>
          <li><code className="rounded bg-zinc-700/60 px-1 text-xs text-blue-300 font-mono">clear</code> or <code className="rounded bg-zinc-700/60 px-1 text-xs text-blue-300 font-mono">Ctrl+L</code> clears the screen</li>
          <li>The log files contain simulated brute-force activity — use <code className="rounded bg-zinc-700/60 px-1 text-xs text-blue-300 font-mono">grep</code> to find the attacker IP</li>
          <li>On mobile: use the <strong className="text-zinc-300">run ↵</strong> button or tap the terminal to focus keyboard</li>
        </ul>
      </section>

      <PageFooter />
    </main>
  );
}
