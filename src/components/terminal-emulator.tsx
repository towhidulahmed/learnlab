"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  executeCommand,
  createInitialState,
  getFS,
  type OutputLine,
  type TerminalState,
  type FS,
} from "@/lib/terminal-engine";

type HistoryEntry = {
  prompt: string;
  input: string;
  output: OutputLine[];
};

type Props = {
  mode: "linux" | "security";
};

const WELCOME_LINUX = [
  { text: "Stuick Linux Terminal — interactive practice environment", type: "info" as const },
  { text: "Virtual filesystem loaded. Type 'help' to see available commands.", type: "info" as const },
  { text: "Try: ls, pwd, cat /etc/passwd, ps aux, grep root /etc/passwd", type: "info" as const },
  { text: "─".repeat(56), type: "info" as const },
];

const WELCOME_SECURITY = [
  { text: "Stuick Unix Security Terminal — threat detection practice", type: "info" as const },
  { text: "Simulated system with suspicious activity in the logs.", type: "info" as const },
  { text: "Try: cat /var/log/auth.log, netstat -tlnp, last, lsof, ss", type: "info" as const },
  { text: "─".repeat(56), type: "info" as const },
];

function lineColor(type: OutputLine["type"]): string {
  switch (type) {
    case "command": return "text-emerald-400";
    case "error":   return "text-red-400";
    case "info":    return "text-zinc-500";
    case "success": return "text-emerald-300";
    default:        return "text-zinc-200";
  }
}

export function TerminalEmulator({ mode }: Props) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [cmdHistoryIdx, setCmdHistoryIdx] = useState(-1);
  const [termState, setTermState] = useState<TerminalState>(createInitialState);
  const [fs, setFs] = useState<FS>(getFS);
  const [cleared, setCleared] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const welcome = mode === "security" ? WELCOME_SECURITY : WELCOME_LINUX;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, cleared]);

  const prompt = `${termState.user}@${termState.hostname}:${termState.cwd.replace("/home/user", "~")}$ `;

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) { setInput(""); return; }

    const { output, newState, newFS } = executeCommand(trimmed, termState, fs, mode);

    if (output.length === 1 && output[0].text === "__CLEAR__") {
      setHistory([]);
      setCleared((c) => !c);
    } else {
      setHistory((h) => [...h, { prompt, input: trimmed, output }]);
    }

    setTermState(newState);
    setFs(newFS);
    setCmdHistory((h) => [trimmed, ...h]);
    setCmdHistoryIdx(-1);
    setInput("");
  }, [input, termState, fs, mode, prompt]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSubmit();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const nextIdx = Math.min(cmdHistoryIdx + 1, cmdHistory.length - 1);
        setCmdHistoryIdx(nextIdx);
        if (cmdHistory[nextIdx] !== undefined) setInput(cmdHistory[nextIdx]);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const nextIdx = cmdHistoryIdx - 1;
        if (nextIdx < 0) { setCmdHistoryIdx(-1); setInput(""); }
        else { setCmdHistoryIdx(nextIdx); setInput(cmdHistory[nextIdx]); }
      } else if (e.key === "Tab") {
        e.preventDefault();
        // Basic tab completion for known commands
        const cmds = ["ls", "cd", "cat", "grep", "find", "ps", "top", "pwd", "echo", "chmod", "chown", "mkdir", "touch", "rm", "cp", "mv", "man", "help", "history", "clear", "whoami", "uname", "hostname", "date", "uptime", "df", "free", "stat", "file", "head", "tail", "wc", "id", "env", "who", "last", "netstat", "ss", "lsof", "w", "kill", "pgrep"];
        const parts = input.split(" ");
        if (parts.length === 1) {
          const matches = cmds.filter((c) => c.startsWith(input));
          if (matches.length === 1) setInput(matches[0] + " ");
          else if (matches.length > 1) {
            setHistory((h) => [...h, { prompt, input, output: [{ text: matches.join("  "), type: "output" }] }]);
          }
        }
      } else if (e.key === "c" && e.ctrlKey) {
        e.preventDefault();
        setHistory((h) => [...h, { prompt, input: input + "^C", output: [] }]);
        setInput("");
        setCmdHistoryIdx(-1);
      } else if (e.key === "l" && e.ctrlKey) {
        e.preventDefault();
        setHistory([]);
      }
    },
    [handleSubmit, cmdHistory, cmdHistoryIdx, input, prompt]
  );

  const focusInput = () => inputRef.current?.focus();

  return (
    <div className="flex flex-col rounded-2xl border border-zinc-700/60 bg-[#0c0e10] shadow-2xl sm:rounded-xl overflow-hidden">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-900/80 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-500/70" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
          <span className="h-3 w-3 rounded-full bg-emerald-500/70" />
        </div>
        <span className="ml-2 flex-1 text-center text-xs font-medium text-zinc-500">
          {termState.user}@{termState.hostname} — bash
        </span>
        <button
          onClick={() => { setHistory([]); setTermState(createInitialState()); setFs(getFS()); setInput(""); setCmdHistory([]); setCmdHistoryIdx(-1); }}
          className="rounded px-2 py-0.5 text-[10px] text-zinc-600 transition-colors hover:bg-zinc-800 hover:text-zinc-400 active:bg-zinc-700"
          title="Reset terminal"
        >
          reset
        </button>
      </div>

      {/* Output area */}
      <div
        ref={containerRef}
        onClick={focusInput}
        className="h-[360px] overflow-y-auto scroll-smooth px-3 pt-3 pb-1 font-mono text-xs leading-5 sm:h-[420px] sm:text-[13px] sm:leading-6 cursor-text select-text"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {/* Welcome */}
        {welcome.map((line, i) => (
          <div key={`w${i}`} className={`${lineColor(line.type)} whitespace-pre-wrap break-all`}>{line.text}</div>
        ))}

        {/* Command history */}
        {history.map((entry, i) => (
          <div key={i}>
            <div className="mt-1 flex flex-wrap items-start gap-x-0">
              <span className="text-emerald-500 break-all">{entry.prompt}</span>
              <span className="text-zinc-100 break-all">{entry.input}</span>
            </div>
            {entry.output.map((line, j) => (
              <div key={j} className={`${lineColor(line.type)} whitespace-pre-wrap break-all`}>
                {line.text}
              </div>
            ))}
          </div>
        ))}

        {/* Current input line */}
        <div className="mt-1 flex flex-wrap items-center gap-x-0">
          <span className="text-emerald-500 break-all">{prompt}</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-w-0 flex-1 bg-transparent text-zinc-100 outline-none caret-emerald-400 break-all"
            style={{ caretColor: "#34d399" }}
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            inputMode="text"
            aria-label="terminal input"
          />
          <span className="animate-pulse text-emerald-400">▋</span>
        </div>

        <div ref={bottomRef} className="h-3" />
      </div>

      {/* Mobile send button row */}
      <div className="flex items-center gap-2 border-t border-zinc-800 bg-zinc-900/60 px-3 py-2 sm:hidden">
        <button
          onTouchEnd={(e) => { e.preventDefault(); setCmdHistoryIdx((i) => { const next = Math.min(i + 1, cmdHistory.length - 1); if (cmdHistory[next] !== undefined) setInput(cmdHistory[next]); return next; }); }}
          className="rounded bg-zinc-800 px-3 py-1.5 text-xs text-zinc-400 active:bg-zinc-700"
        >↑ prev</button>
        <button
          onTouchEnd={(e) => { e.preventDefault(); setCmdHistoryIdx((i) => { const next = i - 1; if (next < 0) { setInput(""); return -1; } setInput(cmdHistory[next]); return next; }); }}
          className="rounded bg-zinc-800 px-3 py-1.5 text-xs text-zinc-400 active:bg-zinc-700"
        >↓ next</button>
        <div className="flex-1" />
        <button
          onTouchEnd={(e) => { e.preventDefault(); inputRef.current?.focus(); }}
          className="rounded bg-zinc-800 px-3 py-1.5 text-xs text-zinc-400 active:bg-zinc-700"
        >focus</button>
        <button
          onTouchEnd={(e) => { e.preventDefault(); handleSubmit(); }}
          className="rounded bg-emerald-800/60 px-4 py-1.5 text-xs font-semibold text-emerald-300 active:bg-emerald-700/60"
        >run ↵</button>
      </div>
    </div>
  );
}
