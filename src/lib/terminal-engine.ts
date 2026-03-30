export type FileEntry = {
  type: "file" | "dir";
  content?: string;
  permissions?: string;
  owner?: string;
  size?: number;
  modified?: string;
};

export type FS = Record<string, FileEntry>;

export type TerminalState = {
  cwd: string;
  user: string;
  hostname: string;
  history: string[];
  env: Record<string, string>;
};

export type OutputLine = {
  text: string;
  type: "command" | "output" | "error" | "info" | "success";
};

const BASE_FS: FS = {
  "/": { type: "dir", permissions: "drwxr-xr-x", owner: "root", modified: "Jan 10 09:00" },
  "/home": { type: "dir", permissions: "drwxr-xr-x", owner: "root", modified: "Jan 10 09:00" },
  "/home/user": { type: "dir", permissions: "drwxr-xr-x", owner: "user", modified: "Jan 10 09:00" },
  "/home/user/documents": { type: "dir", permissions: "drwxr-xr-x", owner: "user", modified: "Jan 15 14:32" },
  "/home/user/scripts": { type: "dir", permissions: "drwxr-xr-x", owner: "user", modified: "Jan 18 11:20" },
  "/home/user/.bashrc": {
    type: "file", permissions: "-rw-r--r--", owner: "user", size: 312, modified: "Jan 10 09:00",
    content: `# .bashrc
export PATH=$HOME/bin:$HOME/.local/bin:$PATH
alias ll='ls -la'
alias la='ls -A'
alias l='ls -CF'
PS1='\\u@\\h:\\w\\$ '
HISTSIZE=1000
HISTFILESIZE=2000
`
  },
  "/home/user/documents/readme.txt": {
    type: "file", permissions: "-rw-r--r--", owner: "user", size: 148, modified: "Jan 15 14:32",
    content: `Linux Administration Notes
==========================
This folder contains study notes and documentation.
Topics: file system, permissions, processes, networking.
Use 'man <command>' for help on any command.
`
  },
  "/home/user/documents/notes.txt": {
    type: "file", permissions: "-rw-r--r--", owner: "user", size: 230, modified: "Jan 16 10:05",
    content: `Key Linux Commands
==================
Navigation : cd, ls, pwd, find
Files      : cp, mv, rm, touch, mkdir
Viewing    : cat, head, tail, less, grep
Permissions: chmod, chown, ls -la
Processes  : ps aux, top, kill, pgrep
Network    : ip addr, ss, netstat, ping
Logs       : /var/log/syslog, journalctl
`
  },
  "/home/user/scripts/backup.sh": {
    type: "file", permissions: "-rwxr-xr-x", owner: "user", size: 185, modified: "Jan 18 11:20",
    content: `#!/bin/bash
# Backup script
SRC="/home/user/documents"
DEST="/tmp/backup_$(date +%Y%m%d)"
echo "Starting backup from $SRC"
mkdir -p "$DEST"
cp -r "$SRC"/* "$DEST/"
echo "Backup complete: $DEST"
`
  },
  "/home/user/scripts/monitor.sh": {
    type: "file", permissions: "-rwxr-xr-x", owner: "user", size: 210, modified: "Jan 19 09:45",
    content: `#!/bin/bash
# System monitor script
echo "=== System Status ==="
echo "Uptime: $(uptime -p)"
echo "CPU usage: $(top -bn1 | grep 'Cpu(s)' | awk '{print $2}')%"
echo "Memory:"
free -h
echo "Disk:"
df -h /
echo "Top processes:"
ps aux --sort=-%cpu | head -5
`
  },
  "/etc": { type: "dir", permissions: "drwxr-xr-x", owner: "root", modified: "Jan 10 09:00" },
  "/etc/passwd": {
    type: "file", permissions: "-rw-r--r--", owner: "root", size: 1420, modified: "Jan 10 09:00",
    content: `root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
sshd:x:110:65534::/run/sshd:/usr/sbin/nologin
user:x:1000:1000:User,,,:/home/user:/bin/bash
`
  },
  "/etc/hosts": {
    type: "file", permissions: "-rw-r--r--", owner: "root", size: 195, modified: "Jan 10 09:00",
    content: `127.0.0.1   localhost
127.0.1.1   stuick-lab
::1         localhost ip6-localhost ip6-loopback
ff02::1     ip6-allnodes
ff02::2     ip6-allrouters
192.168.1.1   router.local
192.168.1.10  webserver.local
`
  },
  "/etc/crontab": {
    type: "file", permissions: "-rw-r--r--", owner: "root", size: 340, modified: "Jan 12 08:15",
    content: `# /etc/crontab - system-wide crontab
SHELL=/bin/sh
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin

# m h dom mon dow user  command
17 *    * * *   root    cd / && run-parts --report /etc/cron.hourly
25 6    * * *   root    test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.daily )
0  0    * * 0   root    /home/user/scripts/backup.sh
`
  },
  "/etc/sudoers": {
    type: "file", permissions: "-r--r-----", owner: "root", size: 755, modified: "Jan 10 09:00",
    content: `# This file MUST be edited with the 'visudo' command as root.
Defaults  env_reset
Defaults  mail_badpass
Defaults  secure_path="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
root      ALL=(ALL:ALL) ALL
%admin    ALL=(ALL) ALL
%sudo     ALL=(ALL:ALL) ALL
user      ALL=(ALL) NOPASSWD: /usr/bin/apt
`
  },
  "/var": { type: "dir", permissions: "drwxr-xr-x", owner: "root", modified: "Jan 10 09:00" },
  "/var/log": { type: "dir", permissions: "drwxr-xr-x", owner: "root", modified: "Jan 20 06:00" },
  "/var/log/syslog": {
    type: "file", permissions: "-rw-r--r--", owner: "syslog", size: 48200, modified: "Jan 20 06:25",
    content: `Jan 20 06:00:01 stuick-lab CRON[1234]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Jan 20 06:10:32 stuick-lab sshd[1456]: Accepted publickey for user from 192.168.1.5 port 54321 ssh2
Jan 20 06:10:32 stuick-lab sshd[1456]: pam_unix(sshd:session): session opened for user user
Jan 20 06:15:44 stuick-lab sudo[1502]: user : TTY=pts/0 ; PWD=/home/user ; USER=root ; COMMAND=/usr/bin/apt update
Jan 20 06:15:55 stuick-lab systemd[1]: Starting Daily apt download activities...
Jan 20 06:16:02 stuick-lab kernel: [12345.678] eth0: renamed from veth3a2b1c
Jan 20 06:20:11 stuick-lab sshd[1598]: Failed password for invalid user admin from 203.0.113.42 port 41234 ssh2
Jan 20 06:20:12 stuick-lab sshd[1598]: Failed password for invalid user admin from 203.0.113.42 port 41235 ssh2
Jan 20 06:20:13 stuick-lab sshd[1598]: Failed password for invalid user admin from 203.0.113.42 port 41236 ssh2
Jan 20 06:20:14 stuick-lab sshd[1599]: error: maximum authentication attempts exceeded for invalid user admin from 203.0.113.42
Jan 20 06:25:01 stuick-lab CRON[1620]: (user) CMD (/home/user/scripts/monitor.sh)
`
  },
  "/var/log/auth.log": {
    type: "file", permissions: "-rw-r-----", owner: "syslog", size: 21400, modified: "Jan 20 06:25",
    content: `Jan 20 05:45:11 stuick-lab sshd[1201]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.0.0.5 user=root
Jan 20 05:45:13 stuick-lab sshd[1201]: Failed password for root from 10.0.0.5 port 32145 ssh2
Jan 20 06:10:32 stuick-lab sshd[1456]: Accepted publickey for user from 192.168.1.5 port 54321 ssh2
Jan 20 06:10:32 stuick-lab systemd-logind[401]: New session 12 of user user.
Jan 20 06:15:44 stuick-lab sudo[1502]: pam_unix(sudo:session): session opened for user root by user(uid=1000)
Jan 20 06:15:50 stuick-lab sudo[1502]: pam_unix(sudo:session): session closed for user root
Jan 20 06:20:11 stuick-lab sshd[1598]: Invalid user admin from 203.0.113.42 port 41234
Jan 20 06:20:12 stuick-lab sshd[1598]: Invalid user admin from 203.0.113.42 port 41235
Jan 20 06:20:13 stuick-lab sshd[1598]: Invalid user admin from 203.0.113.42 port 41236
`
  },
  "/tmp": { type: "dir", permissions: "drwxrwxrwt", owner: "root", modified: "Jan 20 06:00" },
  "/tmp/session_data": {
    type: "file", permissions: "-rw-r--r--", owner: "user", size: 64, modified: "Jan 20 06:10",
    content: `session_id=abc123
user=user
login_time=2024-01-20T06:10:32Z
`
  },
  "/proc": { type: "dir", permissions: "dr-xr-xr-x", owner: "root", modified: "Jan 20 06:25" },
  "/proc/version": {
    type: "file", permissions: "-r--r--r--", owner: "root", size: 155, modified: "Jan 20 06:00",
    content: `Linux version 6.1.0-17-amd64 (debian-kernel@lists.debian.org) (gcc-12 (Debian 12.2.0-14) 12.2.0, GNU ld (GNU Binutils for Debian) 2.40) #1 SMP PREEMPT_DYNAMIC Debian 6.1.69-1 (2023-12-30)
`
  },
  "/usr": { type: "dir", permissions: "drwxr-xr-x", owner: "root", modified: "Jan 10 09:00" },
  "/usr/bin": { type: "dir", permissions: "drwxr-xr-x", owner: "root", modified: "Jan 10 09:00" },
};

export function createInitialState(): TerminalState {
  return {
    cwd: "/home/user",
    user: "user",
    hostname: "stuick-lab",
    history: [],
    env: { HOME: "/home/user", SHELL: "/bin/bash", USER: "user", TERM: "xterm-256color" },
  };
}

export function getFS(): FS {
  return { ...BASE_FS };
}

function resolvePath(cwd: string, target: string): string {
  if (!target) return cwd;
  if (target === "~") return "/home/user";
  if (target.startsWith("~/")) return "/home/user" + target.slice(1);
  if (target.startsWith("/")) return normalizePath(target);
  return normalizePath(cwd + "/" + target);
}

function normalizePath(p: string): string {
  const parts = p.split("/").filter(Boolean);
  const result: string[] = [];
  for (const part of parts) {
    if (part === ".") continue;
    if (part === "..") result.pop();
    else result.push(part);
  }
  return "/" + result.join("/");
}

function listDir(path: string, fs: FS, flags: string): string[] {
  const showHidden = flags.includes("a") || flags.includes("A");
  const longFormat = flags.includes("l");

  const children = Object.keys(fs).filter((k) => {
    if (k === path) return false;
    const parent = k.substring(0, k.lastIndexOf("/")) || "/";
    return parent === path;
  });

  const names = children.map((k) => k.split("/").pop()!);
  const dotfiles = showHidden ? [".", ".."] : [];
  const all = [...dotfiles, ...names].filter((n) => showHidden || !n.startsWith("."));

  if (!longFormat) return [all.join("  ")];

  const lines: string[] = [`total ${children.length * 4}`];
  if (showHidden) {
    const dirEntry = fs[path];
    lines.push(`${dirEntry?.permissions ?? "drwxr-xr-x"}  2 ${dirEntry?.owner ?? "user"} ${dirEntry?.owner ?? "user"}  4096 ${dirEntry?.modified ?? "Jan 10 09:00"} .`);
    const parentPath = normalizePath(path + "/..");
    const parentEntry = fs[parentPath] ?? fs[path];
    lines.push(`${parentEntry?.permissions ?? "drwxr-xr-x"}  2 ${parentEntry?.owner ?? "user"} ${parentEntry?.owner ?? "user"}  4096 ${parentEntry?.modified ?? "Jan 10 09:00"} ..`);
  }
  for (const child of children) {
    const entry = fs[child];
    const name = child.split("/").pop()!;
    if (!showHidden && name.startsWith(".")) continue;
    const size = entry.size ?? (entry.type === "dir" ? 4096 : 128);
    lines.push(`${entry.permissions ?? "-rw-r--r--"}  1 ${entry.owner ?? "user"} ${entry.owner ?? "user"} ${String(size).padStart(5)} ${entry.modified ?? "Jan 10 09:00"} ${name}`);
  }
  return lines;
}

const PS_PROCESSES = [
  { pid: 1,    ppid: 0,  user: "root",    cpu: "0.0", mem: "0.1", stat: "Ss", cmd: "/sbin/init" },
  { pid: 245,  ppid: 1,  user: "root",    cpu: "0.0", mem: "0.0", stat: "S",  cmd: "/lib/systemd/systemd-journald" },
  { pid: 310,  ppid: 1,  user: "root",    cpu: "0.0", mem: "0.1", stat: "Ss", cmd: "/lib/systemd/systemd-udevd" },
  { pid: 512,  ppid: 1,  user: "root",    cpu: "0.0", mem: "0.3", stat: "Ss", cmd: "sshd: /usr/sbin/sshd -D [listener]" },
  { pid: 601,  ppid: 1,  user: "root",    cpu: "0.0", mem: "0.2", stat: "Ss", cmd: "/usr/sbin/cron -f" },
  { pid: 700,  ppid: 1,  user: "www-data", cpu: "0.1", mem: "1.2", stat: "Ss", cmd: "/usr/sbin/apache2 -k start" },
  { pid: 701,  ppid: 700, user: "www-data", cpu: "0.0", mem: "1.0", stat: "S",  cmd: "/usr/sbin/apache2 -k start" },
  { pid: 820,  ppid: 1,  user: "root",    cpu: "0.0", mem: "0.4", stat: "Ssl", cmd: "/usr/sbin/rsyslogd -n -iNONE" },
  { pid: 1101, ppid: 512, user: "root",   cpu: "0.0", mem: "0.2", stat: "Ss", cmd: "sshd: user [priv]" },
  { pid: 1102, ppid: 1101, user: "user",  cpu: "0.0", mem: "0.1", stat: "S",  cmd: "sshd: user@pts/0" },
  { pid: 1103, ppid: 1102, user: "user",  cpu: "0.0", mem: "0.3", stat: "Ss", cmd: "-bash" },
  { pid: 1200, ppid: 1103, user: "user",  cpu: "0.0", mem: "0.1", stat: "R+", cmd: "ps aux" },
];

const NETSTAT_OUTPUT = `Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      512/sshd
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      700/apache2
tcp        0      0 127.0.0.1:3306          0.0.0.0:*               LISTEN      950/mysqld
tcp6       0      0 :::22                   :::*                    LISTEN      512/sshd
tcp6       0      0 :::80                   :::*                    LISTEN      700/apache2
tcp        0    272 192.168.1.10:22         192.168.1.5:54321       ESTABLISHED 1101/sshd`;

const SS_OUTPUT = `Netid  State   Recv-Q  Send-Q  Local Address:Port   Peer Address:Port  Process
tcp    LISTEN  0       128     0.0.0.0:22          0.0.0.0:*          users:(("sshd",pid=512,fd=3))
tcp    LISTEN  0       511     0.0.0.0:80          0.0.0.0:*          users:(("apache2",pid=700,fd=4))
tcp    LISTEN  0       70      127.0.0.1:3306      0.0.0.0:*          users:(("mysqld",pid=950,fd=21))
tcp    ESTAB   0       272     192.168.1.10:22     192.168.1.5:54321  users:(("sshd",pid=1101,fd=5))`;

const WHO_OUTPUT = `user     pts/0        2024-01-20 06:10 (192.168.1.5)`;

const LAST_OUTPUT = `user     pts/0        192.168.1.5      Sat Jan 20 06:10   still logged in
user     pts/0        192.168.1.5      Fri Jan 19 22:45 - 23:12  (00:27)
user     pts/0        192.168.1.12     Thu Jan 18 14:32 - 16:05  (01:33)
root     tty1                          Wed Jan 17 09:00 - 09:12  (00:12)
reboot   system boot  6.1.0-17-amd64  Wed Jan 17 09:00   still running

wtmp begins Wed Jan 10 09:00:01 2024`;

const LSOF_OUTPUT = `COMMAND   PID     USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
sshd      512     root   3u  IPv4  12345      0t0  TCP *:ssh (LISTEN)
sshd      1101    root   4u  IPv4  23456      0t0  TCP stuick-lab:ssh->192.168.1.5:54321 (ESTABLISHED)
apache2   700     root   4u  IPv6  34567      0t0  TCP *:http (LISTEN)
mysqld    950     mysql  21u IPv4  45678      0t0  TCP localhost:mysql (LISTEN)
bash      1103    user   0u  CHR  136,0      0t0    3 /dev/pts/0
bash      1103    user   1u  CHR  136,0      0t0    3 /dev/pts/0`;

function parseArgs(input: string): { cmd: string; args: string[]; flags: string } {
  const parts = input.trim().split(/\s+/);
  const cmd = parts[0] ?? "";
  const args: string[] = [];
  let flags = "";
  for (let i = 1; i < parts.length; i++) {
    if (parts[i].startsWith("-") && !parts[i].startsWith("--")) {
      flags += parts[i].slice(1);
    } else {
      args.push(parts[i]);
    }
  }
  return { cmd, args, flags };
}

export function executeCommand(
  input: string,
  state: TerminalState,
  fs: FS,
  mode: "linux" | "security"
): { output: OutputLine[]; newState: TerminalState; newFS: FS } {
  const trimmed = input.trim();
  const newState = { ...state, history: [...state.history, trimmed] };
  const newFS = { ...fs };
  const out: OutputLine[] = [];

  if (!trimmed) return { output: [], newState, newFS };

  const { cmd, args, flags } = parseArgs(trimmed);
  const addOut = (text: string, type: OutputLine["type"] = "output") => out.push({ text, type });
  const addErr = (text: string) => out.push({ text, type: "error" });

  const fullPath = (p: string) => resolvePath(newState.cwd, p);

  switch (cmd) {
    case "pwd":
      addOut(newState.cwd);
      break;

    case "ls": {
      const target = args[0] ? fullPath(args[0]) : newState.cwd;
      const entry = newFS[target];
      if (!entry) { addErr(`ls: cannot access '${args[0] ?? "."}': No such file or directory`); break; }
      if (entry.type === "file") { addOut(args[0] ?? target.split("/").pop()!); break; }
      const lines = listDir(target, newFS, flags);
      lines.forEach((l) => addOut(l));
      break;
    }

    case "cd": {
      const target = args[0] ? fullPath(args[0]) : "/home/user";
      const entry = newFS[target];
      if (!entry) { addErr(`cd: ${args[0]}: No such file or directory`); break; }
      if (entry.type === "file") { addErr(`cd: ${args[0]}: Not a directory`); break; }
      newState.cwd = target;
      break;
    }

    case "cat": {
      if (!args[0]) { addErr("cat: missing operand"); break; }
      const target = fullPath(args[0]);
      const entry = newFS[target];
      if (!entry) { addErr(`cat: ${args[0]}: No such file or directory`); break; }
      if (entry.type === "dir") { addErr(`cat: ${args[0]}: Is a directory`); break; }
      const lines = (entry.content ?? "").split("\n");
      if (flags.includes("n")) {
        lines.forEach((l, i) => addOut(`${String(i + 1).padStart(6)}  ${l}`));
      } else {
        lines.forEach((l) => addOut(l));
      }
      break;
    }

    case "head": {
      if (!args[0]) { addErr("head: missing operand"); break; }
      const n = flags.includes("n") ? parseInt(args[0]) || 10 : 10;
      const fileArg = flags.includes("n") ? args[1] : args[0];
      if (!fileArg) { addErr("head: missing file operand"); break; }
      const target = fullPath(fileArg);
      const entry = newFS[target];
      if (!entry || entry.type === "dir") { addErr(`head: ${fileArg}: No such file`); break; }
      (entry.content ?? "").split("\n").slice(0, n).forEach((l) => addOut(l));
      break;
    }

    case "tail": {
      if (!args[0]) { addErr("tail: missing operand"); break; }
      const n = 10;
      const target = fullPath(args[0]);
      const entry = newFS[target];
      if (!entry || entry.type === "dir") { addErr(`tail: ${args[0]}: No such file`); break; }
      (entry.content ?? "").split("\n").slice(-n).forEach((l) => addOut(l));
      break;
    }

    case "grep": {
      if (args.length < 2) { addErr("grep: usage: grep [options] PATTERN FILE"); break; }
      const pattern = args[0];
      const target = fullPath(args[1]);
      const entry = newFS[target];
      if (!entry || entry.type === "dir") { addErr(`grep: ${args[1]}: No such file`); break; }
      const regex = flags.includes("i") ? new RegExp(pattern, "i") : new RegExp(pattern);
      const matches = (entry.content ?? "").split("\n").filter((l) => regex.test(l));
      if (matches.length === 0) {
        // no output, non-zero exit (no error message for grep)
      } else {
        matches.forEach((l) => {
          if (flags.includes("n")) {
            const idx = (entry.content ?? "").split("\n").indexOf(l) + 1;
            addOut(`${idx}:${l}`);
          } else {
            addOut(l);
          }
        });
      }
      break;
    }

    case "find": {
      const base = args[0] ? fullPath(args[0]) : newState.cwd;
      const nameIdx = args.indexOf("-name");
      const typeIdx = args.indexOf("-type");
      const permIdx = args.indexOf("-perm");
      const nameFilter = nameIdx >= 0 ? args[nameIdx + 1] : null;
      const typeFilter = typeIdx >= 0 ? args[typeIdx + 1] : null;
      const permFilter = permIdx >= 0 ? args[permIdx + 1] : null;

      const results = Object.keys(newFS).filter((k) => {
        if (!k.startsWith(base)) return false;
        const entry = newFS[k];
        if (nameFilter) {
          const name = k.split("/").pop()!;
          const pattern = nameFilter.replace(/\*/g, ".*").replace(/\?/g, ".");
          if (!new RegExp(`^${pattern}$`).test(name)) return false;
        }
        if (typeFilter === "f" && entry.type !== "file") return false;
        if (typeFilter === "d" && entry.type !== "dir") return false;
        if (permFilter === "-4000" && !(entry.permissions ?? "").includes("s")) return false;
        return true;
      });

      if (results.length === 0) {
        // no output
      } else {
        results.forEach((r) => addOut(r));
      }
      break;
    }

    case "echo": {
      const text = args.join(" ").replace(/\$HOME/g, "/home/user").replace(/\$USER/g, newState.user).replace(/\$SHELL/g, "/bin/bash").replace(/\$PATH/g, "/usr/local/bin:/usr/bin:/bin:/home/user/bin");
      addOut(text);
      break;
    }

    case "mkdir": {
      if (!args[0]) { addErr("mkdir: missing operand"); break; }
      const target = fullPath(args[0]);
      if (newFS[target]) { addErr(`mkdir: cannot create directory '${args[0]}': File exists`); break; }
      newFS[target] = { type: "dir", permissions: "drwxr-xr-x", owner: newState.user, modified: "now" };
      break;
    }

    case "touch": {
      if (!args[0]) { addErr("touch: missing file operand"); break; }
      const target = fullPath(args[0]);
      if (!newFS[target]) {
        newFS[target] = { type: "file", permissions: "-rw-r--r--", owner: newState.user, size: 0, modified: "now", content: "" };
      }
      break;
    }

    case "rm": {
      if (!args[0]) { addErr("rm: missing operand"); break; }
      const target = fullPath(args[0]);
      if (!newFS[target]) { addErr(`rm: cannot remove '${args[0]}': No such file or directory`); break; }
      if (newFS[target].type === "dir" && !flags.includes("r")) {
        addErr(`rm: cannot remove '${args[0]}': Is a directory`); break;
      }
      delete newFS[target];
      break;
    }

    case "cp": {
      if (args.length < 2) { addErr("cp: missing destination"); break; }
      const src = fullPath(args[0]);
      const dest = fullPath(args[1]);
      if (!newFS[src]) { addErr(`cp: ${args[0]}: No such file`); break; }
      newFS[dest] = { ...newFS[src] };
      break;
    }

    case "mv": {
      if (args.length < 2) { addErr("mv: missing destination"); break; }
      const src = fullPath(args[0]);
      const dest = fullPath(args[1]);
      if (!newFS[src]) { addErr(`mv: ${args[0]}: No such file or directory`); break; }
      newFS[dest] = { ...newFS[src] };
      delete newFS[src];
      break;
    }

    case "chmod": {
      if (args.length < 2) { addErr("chmod: missing operand"); break; }
      const target = fullPath(args[1]);
      if (!newFS[target]) { addErr(`chmod: cannot access '${args[1]}': No such file`); break; }
      addOut(`chmod: permissions updated for '${args[1]}'`, "success");
      break;
    }

    case "chown": {
      if (args.length < 2) { addErr("chown: missing operand"); break; }
      addOut(`chown: ownership updated for '${args[1]}'`, "success");
      break;
    }

    case "file": {
      if (!args[0]) { addErr("file: missing operand"); break; }
      const target = fullPath(args[0]);
      const entry = newFS[target];
      if (!entry) { addErr(`file: ${args[0]}: No such file or directory`); break; }
      if (entry.type === "dir") addOut(`${args[0]}: directory`);
      else if ((entry.permissions ?? "").includes("x")) addOut(`${args[0]}: POSIX shell script, ASCII text executable`);
      else addOut(`${args[0]}: ASCII text`);
      break;
    }

    case "wc": {
      if (!args[0]) { addErr("wc: missing operand"); break; }
      const target = fullPath(args[0]);
      const entry = newFS[target];
      if (!entry || entry.type === "dir") { addErr(`wc: ${args[0]}: No such file`); break; }
      const content = entry.content ?? "";
      const lines = content.split("\n").length;
      const words = content.split(/\s+/).filter(Boolean).length;
      const bytes = content.length;
      if (flags.includes("l")) addOut(`${lines} ${args[0]}`);
      else if (flags.includes("w")) addOut(`${words} ${args[0]}`);
      else addOut(`  ${lines}  ${words}  ${bytes} ${args[0]}`);
      break;
    }

    case "whoami":
      addOut(newState.user);
      break;

    case "id":
      addOut(`uid=1000(${newState.user}) gid=1000(${newState.user}) groups=1000(${newState.user}),4(adm),24(cdrom),27(sudo),30(dip),46(plugdev),100(users)`);
      break;

    case "hostname":
      addOut(newState.hostname);
      break;

    case "uname":
      if (flags.includes("a")) addOut(`Linux ${newState.hostname} 6.1.0-17-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.1.69-1 (2023-12-30) x86_64 GNU/Linux`);
      else if (flags.includes("r")) addOut("6.1.0-17-amd64");
      else if (flags.includes("n")) addOut(newState.hostname);
      else addOut("Linux");
      break;

    case "date":
      addOut("Sat Jan 20 06:25:01 UTC 2024");
      break;

    case "uptime":
      if (flags.includes("p")) addOut("up 10 days, 21 hours, 25 minutes");
      else addOut(" 06:25:01 up 10 days, 21:25,  1 user,  load average: 0.08, 0.12, 0.09");
      break;

    case "ps": {
      const aux = flags.includes("a") || args.includes("aux") || args.includes("-ef");
      const ef = args.includes("-ef");
      if (aux || ef) {
        addOut("USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND");
        PS_PROCESSES.forEach((p) => {
          addOut(`${p.user.padEnd(12)} ${String(p.pid).padStart(5)} ${p.cpu.padStart(4)} ${p.mem.padStart(4)} ${String(Math.floor(Math.random() * 50000 + 5000)).padStart(6)} ${String(Math.floor(Math.random() * 10000 + 1000)).padStart(5)} ?        ${p.stat.padEnd(4)} 06:10   0:00 ${p.cmd}`);
        });
      } else {
        addOut("    PID TTY          TIME CMD");
        addOut("   1103 pts/0    00:00:00 bash");
        addOut("   1200 pts/0    00:00:00 ps");
      }
      break;
    }

    case "top":
      addOut("top - 06:25:01 up 10 days, 21:25,  1 user,  load average: 0.08, 0.12, 0.09");
      addOut("Tasks: 87 total,   1 running,  86 sleeping,   0 stopped,   0 zombie");
      addOut("%Cpu(s):  1.3 us,  0.4 sy,  0.0 ni, 97.9 id,  0.3 wa,  0.0 hi,  0.1 si");
      addOut("MiB Mem :   1987.4 total,    342.1 free,    891.2 used,    754.1 buff/cache");
      addOut("MiB Swap:    975.0 total,    970.4 free,      4.6 used.    896.7 avail Mem");
      addOut("");
      addOut("    PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND");
      addOut("    700 www-data  20   0  201456  24312   8912 S   0.3   1.2   0:12.45 apache2");
      addOut("    512 root      20   0   15428   7804   6712 S   0.0   0.4   0:00.88 sshd");
      addOut("    820 syslog    20   0  224932   8204   6832 S   0.0   0.4   0:00.22 rsyslogd");
      addOut("   1103 user      20   0   10024   5124   4012 S   0.0   0.3   0:00.05 bash");
      addOut("[Tip: In the real terminal, press 'q' to exit top]", "info");
      break;

    case "kill":
      if (!args[0]) { addErr("kill: usage: kill [-signal] pid"); break; }
      addOut(`kill: signal sent to process ${args[args.length - 1]}`, "success");
      break;

    case "pgrep":
      if (!args[0]) { addErr("pgrep: missing pattern"); break; }
      {
        const matches = PS_PROCESSES.filter((p) => p.cmd.toLowerCase().includes(args[0].toLowerCase()));
        if (matches.length === 0) { /* no output */ }
        else matches.forEach((p) => addOut(String(p.pid)));
      }
      break;

    case "history": {
      const h = newState.history.slice(0, -1);
      if (h.length === 0) addOut("(no history yet)");
      else h.forEach((cmd, i) => addOut(`  ${String(i + 1).padStart(3)}  ${cmd}`));
      break;
    }

    case "clear":
      return { output: [{ text: "__CLEAR__", type: "info" }], newState, newFS };

    case "env":
      Object.entries(newState.env).forEach(([k, v]) => addOut(`${k}=${v}`));
      addOut("PWD=" + newState.cwd);
      break;

    case "export":
      if (args[0]) {
        const [k, v] = args[0].split("=");
        if (k && v !== undefined) newState.env[k] = v;
        addOut(`export: ${args[0]}`, "success");
      }
      break;

    // Security-specific commands
    case "who":
      addOut(WHO_OUTPUT);
      break;

    case "w":
      addOut(` 06:25:01 up 10 days, 21:25,  1 user,  load average: 0.08, 0.12, 0.09`);
      addOut("USER     TTY      FROM             LOGIN@   IDLE JCPU   PCPU WHAT");
      addOut("user     pts/0    192.168.1.5      06:10    0.00s  0.05s  0.01s w");
      break;

    case "last":
      LAST_OUTPUT.split("\n").forEach((l) => addOut(l));
      break;

    case "netstat":
      if (flags.includes("t") || flags.includes("a") || flags.includes("n") || flags.includes("l") || flags.includes("p") || args.length === 0) {
        NETSTAT_OUTPUT.split("\n").forEach((l) => addOut(l));
      } else {
        NETSTAT_OUTPUT.split("\n").forEach((l) => addOut(l));
      }
      break;

    case "ss":
      SS_OUTPUT.split("\n").forEach((l) => addOut(l));
      break;

    case "lsof":
      LSOF_OUTPUT.split("\n").forEach((l) => addOut(l));
      break;

    case "stat": {
      if (!args[0]) { addErr("stat: missing operand"); break; }
      const target = fullPath(args[0]);
      const entry = newFS[target];
      if (!entry) { addErr(`stat: cannot statx '${args[0]}': No such file or directory`); break; }
      addOut(`  File: ${target}`);
      addOut(`  Size: ${entry.size ?? 4096}   Blocks: 8   IO Block: 4096   ${entry.type}`);
      addOut(`Device: 801h/2049d  Inode: ${Math.floor(Math.random() * 900000) + 100000}   Links: 1`);
      addOut(`Access: (${entry.permissions ?? "-rw-r--r--"})  Uid: ( 1000/ ${entry.owner ?? "user"})   Gid: ( 1000/ ${entry.owner ?? "user"})`);
      addOut(`Access: 2024-01-20 06:10:00.000000000 +0000`);
      addOut(`Modify: 2024-01-20 ${entry.modified ?? "06:00"}:00.000000000 +0000`);
      break;
    }

    case "df":
      addOut("Filesystem      Size  Used Avail Use% Mounted on");
      addOut("udev            975M     0  975M   0% /dev");
      addOut("tmpfs           199M  1.1M  198M   1% /run");
      addOut("/dev/sda1        19G  4.2G   14G  24% /");
      addOut("tmpfs           994M     0  994M   0% /dev/shm");
      addOut("tmpfs           5.0M     0  5.0M   0% /run/lock");
      break;

    case "free":
      addOut("               total        used        free      shared  buff/cache   available");
      addOut("Mem:         2033536      912384      350208        1124      771944      918348");
      addOut("Swap:         998396        4704      993692");
      break;

    case "du":
      if (args[0]) {
        const target = fullPath(args[0]);
        addOut(`4\t${target}`);
      } else {
        addOut(`4\t${newState.cwd}`);
      }
      break;

    case "man": {
      if (!args[0]) { addErr("What manual page do you want?"); break; }
      const manpages: Record<string, string> = {
        ls: "ls - list directory contents\nUsage: ls [OPTION]... [FILE]...\n  -a  do not ignore hidden entries\n  -l  use long listing format\n  -h  print human readable sizes",
        grep: "grep - print lines that match patterns\nUsage: grep [OPTION] PATTERN FILE\n  -i  ignore case\n  -n  show line numbers\n  -r  recursive",
        chmod: "chmod - change file mode bits\nUsage: chmod [OPTION] MODE FILE\nModes: 755 (rwxr-xr-x), 644 (rw-r--r--), 600 (rw-------)\nSymbolic: chmod u+x file, chmod o-r file",
        find: "find - search for files\nUsage: find [path] [expression]\n  -name PATTERN  search by name\n  -type f|d      file or directory\n  -perm -4000    find setuid files",
        ps: "ps - report a snapshot of current processes\nUsage: ps [options]\n  aux  show all processes (BSD style)\n  -ef  show all processes (System V style)",
        ssh: "ssh - OpenSSH remote login client\nUsage: ssh [options] user@host\n  -p PORT  port number\n  -i FILE  identity file\n  -L local port forwarding",
        netstat: "netstat - network statistics\nUsage: netstat [options]\n  -t  TCP connections\n  -u  UDP connections\n  -l  listening sockets\n  -n  show numeric addresses\n  -p  show PID/program name",
        ss: "ss - another utility to investigate sockets\nUsage: ss [options]\n  -t  TCP sockets\n  -l  listening sockets\n  -n  numeric\n  -p  show process",
        iptables: "iptables - administration tool for IPv4 packet filtering\nUsage: iptables [options] rule-specification\n  -L  list all rules\n  -A  append rule to chain\n  -D  delete rule from chain\n  Chains: INPUT, OUTPUT, FORWARD",
      };
      const page = manpages[args[0]];
      if (page) {
        addOut(`MANUAL: ${args[0].toUpperCase()}(1)`, "info");
        addOut("─".repeat(40), "info");
        page.split("\n").forEach((l) => addOut(l));
        addOut("─".repeat(40), "info");
      } else {
        addErr(`man: ${args[0]}: no manual page found. Try 'help' for available commands.`);
      }
      break;
    }

    case "help":
    case "--help":
      addOut("Available commands:", "info");
      addOut("─".repeat(40), "info");
      addOut("Navigation  : pwd, ls [-la], cd, find");
      addOut("Files       : cat [-n], head, tail, wc, grep, file, stat");
      addOut("Editing     : touch, mkdir, cp, mv, rm [-r]");
      addOut("Permissions : chmod, chown, id");
      addOut("System info : whoami, hostname, uname [-a], date, uptime, df, free, du, env, echo");
      addOut("Processes   : ps [aux], top, kill, pgrep");
      if (mode === "security") {
        addOut("─".repeat(40), "info");
        addOut("Security    : who, w, last, netstat, ss, lsof");
      }
      addOut("Reference   : man <command>, history, clear");
      addOut("─".repeat(40), "info");
      addOut("Tip: Try 'man ls', 'ps aux', 'cat /var/log/auth.log'", "info");
      break;

    default:
      addErr(`${cmd}: command not found. Type 'help' to see available commands.`);
  }

  return { output: out, newState, newFS };
}
