export type UnixSecurityTopic = {
  slug: string;
  title: string;
  content: string;
  commands: { cmd: string; desc: string }[];
  tips: string[];
  flashcards: { front: string; back: string }[];
};

export type UnixSecurityDomain = {
  key: string;
  name: string;
  level: "beginner" | "intermediate" | "advanced";
  topics: UnixSecurityTopic[];
};

export const UNIX_SECURITY_STUDY: UnixSecurityDomain[] = [
  {
    key: "system-fundamentals",
    name: "System Fundamentals",
    level: "beginner",
    topics: [
      {
        slug: "terminal-basics",
        title: "The Terminal and How Your System Works",
        content: `Every Unix-based system (macOS, Linux, BSD) has two layers you can interact with. The GUI, which is icons, windows, and clicks. And the Terminal, which is the raw engine underneath. Every click in the GUI is actually a command running behind the scenes. The Terminal lets you talk to the OS directly, in its own language.\n\nThink of it like this: the GUI is an automatic car. The Terminal is a manual. More control, steeper learning curve, far more powerful.\n\n**Opening a Terminal**\n\n**On macOS:** Spotlight (Command+Space), type Terminal, hit Enter. Or use iTerm2 if you prefer a better app.\n\n**On Linux:** Depends on the desktop environment. Most distros: right-click desktop and look for "Open Terminal", or press Ctrl+Alt+T (Ubuntu/GNOME), or find it in your applications menu.\n\n**What is a Process?**\n\nEvery time you open an app or the system does something, it creates a process. A process is a running program with its own ID number called a PID (Process ID). Your system has hundreds of processes running simultaneously. Most are invisible background services. Some belong to you, some belong to root.\n\nWho runs a process matters enormously in security. A process running as root has unlimited power over your system. A process running as your user only has your permissions.\n\n**Your First Commands (same on macOS and Linux)**\n\n\`whoami\` prints your current username. Simple, but fundamental. In security, identity is everything.\n\n\`pwd\` (Print Working Directory) tells you which folder you are currently inside. The Terminal always has a current location.\n\n\`ls -la\` lists everything in the current folder. The flags: \`-l\` gives long format showing permissions, owner, size, date. \`-a\` shows all files including hidden ones (files starting with a dot).\n\nReading the permission string \`drwxr-xr-x\`:\n- First character: \`d\` = directory, \`-\` = file, \`l\` = symlink\n- Next 3: owner's permissions (r=read, w=write, x=execute)\n- Next 3: group's permissions\n- Last 3: everyone else's permissions\n\nMalware often hides in files starting with a dot (hidden files) or sets unusual permissions.\n\n**Pipes and Filters (identical on both platforms)**\n\nThe pipe \`|\` takes output from one command and feeds it into another. Like an assembly line.\n\n\`grep\` filters text and only shows lines matching a pattern. \`grep -v\` shows lines that do NOT match (invert). \`grep -i\` is case-insensitive.\n\n\`sudo\` (Super User Do) runs a command as root. Many security commands need this because reading process details and network connections is sensitive. Your system asks for your password to confirm you are authorizing it.`,
        commands: [
          { cmd: "whoami", desc: "Print your current username" },
          { cmd: "pwd", desc: "Print your current directory" },
          { cmd: "ls -la ~/", desc: "List home directory including hidden files" },
          { cmd: "ps aux | wc -l", desc: "Count how many processes are running" },
          { cmd: "ps aux | grep $(whoami)", desc: "Show only your processes" },
          { cmd: "sudo ls /private/var/log", desc: "List system logs as root" },
        ],
        tips: [
          "Run 'ps aux | grep $(whoami)' regularly to see what is running under your account",
          "Hidden files (starting with .) are not shown by default. Always use ls -la when investigating",
          "If a process is running as root but you did not start it, that is worth investigating",
          "Use TAB to autocomplete paths. It also confirms the path actually exists",
        ],
        flashcards: [
          { front: "What does PID stand for?", back: "Process ID. A unique number assigned to every running process on the system" },
          { front: "Why does it matter who owns a process?", back: "A process running as root has unlimited system access. A process running as your user is limited to your permissions" },
          { front: "What does the first character in ls -l output tell you?", back: "The file type: d=directory, -=regular file, l=symbolic link, p=pipe" },
          { front: "What does grep -v do?", back: "Inverts the match, showing only lines that do NOT contain the search pattern" },
          { front: "What does sudo do?", back: "Runs the following command as root (the superuser), prompting for your password first" },
          { front: "Why do attackers use dotfiles and dotfolders in home directories?", back: "Files starting with a dot are hidden from normal ls output. Attackers place scripts, configs, and binaries in dotfolders like ~/.cache/ or ~/.config/ to avoid casual detection" },
        ],
      },
      {
        slug: "processes-deep-dive",
        title: "Processes: ps, top, and kill",
        content: `Understanding what is running on your system is the foundation of security monitoring. If something malicious is on your machine, it is running as a process. You just need to find it.\n\n**Reading the Process List with Intent**\n\n\`ps aux\` shows every process on the system. The key columns for an investigation are USER (who owns it), PID (its ID number), %CPU, %MEM, and COMMAND (the full path and arguments).\n\nThe COMMAND column is where investigations begin. Legitimate processes run from predictable locations: /usr/bin, /System, /Applications. Anything running from /tmp, /dev/shm, a dotfolder in a home directory, or with a random-looking name does not belong.\n\n\`ps aux | grep -v root | grep -v $(whoami)\` filters out root-owned processes and your own, leaving only processes owned by other accounts. Service accounts running things you did not configure are worth questioning.\n\n\`ps aux | sort -k3 -rn | head -10\` surfaces the most CPU-hungry processes. High sustained CPU from an unrecognized process at an odd time (2am, while you are idle) is a strong signal.\n\n**Investigating a Specific Process**\n\nWhen you have a suspicious PID, get its full details:\n\n\`ps -p PID -o pid,ppid,user,args\`\n\nThe ppid (parent PID) shows what spawned it. Run the same command on the parent to trace the chain. A shell spawned by a cron job or by a web server process is not normal.\n\n**Stopping a Malicious Process**\n\nOnce you have confirmed something is malicious and documented everything, use \`kill -9 PID\` to force stop it. Always document first — the process may be providing evidence you will lose once it is gone. Do not stop there: the process will restart if its persistence mechanism is still in place. Killing the process without removing the persistence is temporary.\n\n**What Suspicious Looks Like**\n\n- COMMAND path in /tmp, /dev/shm, or a home directory dotfolder\n- Random-character process name (xf3k9z, .svc, .upd)\n- Process running as root that you did not start\n- Multiple instances of a process that should be a singleton\n- High CPU or memory at unusual hours with no obvious cause`,
        commands: [
          { cmd: "ps aux", desc: "Show all processes from all users" },
          { cmd: "ps aux | grep -v root | grep -v $(whoami)", desc: "Show processes not owned by root or you" },
          { cmd: "top -o cpu", desc: "Live process view sorted by CPU usage (macOS); on Linux just 'top' then press P" },
          { cmd: "ps aux | sort -k3 -rn | head -10", desc: "Top 10 processes by CPU usage" },
          { cmd: "kill -9 PID", desc: "Force kill a process by its PID" },
          { cmd: "pkill -f processname", desc: "Kill processes by matching the command name" },
        ],
        tips: [
          "Processes in /tmp or /var/tmp are suspicious. Legitimate software does not live there",
          "A process whose name is a string of random characters is a red flag",
          "Use 'ps aux | sort -k4 -rn | head' to find memory hogs, which can indicate data exfiltration",
          "kill -9 should be your last resort. Start with kill (SIGTERM) to give the process a chance to clean up",
          "On Linux, /dev/shm is another world-writable staging area used by malware, similar to /tmp",
        ],
        flashcards: [
          { front: "What does ps -p PID -o pid,ppid,user,args show you during an investigation?", back: "The full command line, the parent PID (how the process was spawned), and the owner. The ppid is critical for tracing the infection chain" },
          { front: "What column in ps aux is most important during a security investigation?", back: "COMMAND — it shows the full path and arguments of the running process. A path in /tmp, /dev/shm, or a home dotfolder is a strong red flag" },
          { front: "Why is a process running from /tmp suspicious?", back: "Legitimate software installs to /usr, /Applications, or similar. Running from /tmp suggests it was dropped there to avoid detection" },
          { front: "What does pkill -f do?", back: "Kills all processes whose full command line matches the given string" },
          { front: "How do you sort ps output to find the most CPU-intensive processes?", back: "ps aux | sort -k3 -rn | head -10 (sort by column 3 which is %CPU, reverse numeric order)" },
          { front: "Why must you document a suspicious process before killing it?", back: "Killing the process destroys its network connections, open file handles, and other runtime evidence. Note the PID, ppid, full command, and any lsof connections first" },
        ],
      },
      {
        slug: "filesystem-security",
        title: "The Filesystem: Where Things Live and Where Malware Hides",
        content: `The Unix filesystem has a specific layout. Knowing it lets you spot things that do not belong. The core structure is the same across macOS and Linux.\n\n**Key Directories (same on macOS and Linux)**\n\n\`/etc\` — system configuration files. passwd, hosts, sudoers. These control how your system behaves at a fundamental level.\n\n\`/var\` — variable data. Logs live in /var/log. Temporary runtime data lives here. High churn directory.\n\n\`/tmp\` — temporary files, cleared on reboot. Anyone can write here. A common malware staging area.\n\n\`/usr\` — user programs. /usr/bin, /usr/sbin. Most system commands live here.\n\n**On Linux only:** \`/dev/shm\` is a RAM-based temporary filesystem. World-writable. Malware uses it to avoid disk writes. \`/proc\` exposes live process and kernel information. \`/opt\` is for optional third-party software.\n\n**On macOS only:** \`/Applications\` holds GUI apps. \`/private\` is the real location of /etc and /var (they are symlinks from the root). \`/System/Library\` contains Apple's own framework and daemon files.\n\n**macOS Persistence Locations**\n\n\`~/Library/LaunchAgents\` — programs that start automatically when you log in. This is where most macOS malware sets up persistence. Any .plist file here runs something on login.\n\n\`/Library/LaunchAgents\` — same, but for all users.\n\n\`/Library/LaunchDaemons\` — system-level startup programs that run even before login.\n\n**Linux Persistence Locations**\n\n\`~/.bashrc\`, \`~/.bash_profile\`, \`~/.profile\` — shell startup files. Adding a malicious command here executes it every time the user opens a terminal.\n\n\`/etc/cron.d/\`, \`/var/spool/cron/crontabs/\` — scheduled task definitions.\n\n\`/etc/systemd/system/\` and \`/lib/systemd/system/\` — systemd service units that start on boot.\n\n\`/etc/init.d/\` and \`/etc/rc.local\` — legacy startup scripts still present on many systems.\n\n**Hidden Files (same on both)**\n\nFiles starting with a dot are hidden from normal \`ls\`. Attackers abuse this. A dotfile in your home directory that you did not create is worth looking at.\n\n**The find Command (same on both)**\n\n\`find\` searches the filesystem. The most useful security uses:\n- Find recently modified files: \`find / -mtime -1 2>/dev/null\`\n- Find files in unexpected locations: \`find /tmp -name "*.sh"\`\n- Find world-writable files: \`find / -perm -002 -type f 2>/dev/null\``,
        commands: [
          { cmd: "ls -la ~/Library/LaunchAgents", desc: "macOS: list auto-start programs for your user" },
          { cmd: "ls -la /etc/systemd/system/", desc: "Linux: list custom systemd service units" },
          { cmd: "find /tmp /dev/shm -type f 2>/dev/null", desc: "Find all files in world-writable staging areas" },
          { cmd: "find / -mtime -1 -not -path '*/proc/*' 2>/dev/null", desc: "Find files modified in the last 24 hours" },
          { cmd: "ls -la ~/.*", desc: "List hidden dotfiles in your home directory" },
          { cmd: "find / -perm -002 -type f 2>/dev/null | head -20", desc: "Find world-writable files (everyone can modify)" },
        ],
        tips: [
          "macOS: Check ~/Library/LaunchAgents after installing anything. Some installers add unexpected entries",
          "Linux: Check ~/.bashrc and ~/.profile for commands you did not add. Malware hides persistence there",
          "find output often includes errors for directories you cannot access. Append '2>/dev/null' to hide those",
          "A .plist file in LaunchAgents that references a binary in /tmp is a serious red flag",
          "World-writable files (-perm -002) are a privilege escalation risk. Any user can modify them",
        ],
        flashcards: [
          { front: "Where does macOS malware most commonly establish persistence?", back: "~/Library/LaunchAgents or /Library/LaunchAgents as .plist files that reference a script or binary to run on login" },
          { front: "Where does Linux malware commonly establish persistence?", back: "systemd units in /etc/systemd/system/, cron entries in /etc/cron.d/ or crontab, or commands added to ~/.bashrc or ~/.profile" },
          { front: "What is /tmp used for and why is it a security concern?", back: "/tmp stores temporary files cleared on reboot. It is world-writable, so any user (or malware) can create files there without special permissions" },
          { front: "What does find -mtime -1 find?", back: "Files modified within the last 1 day (24 hours)" },
          { front: "What does 2>/dev/null do?", back: "Redirects error messages (stderr, file descriptor 2) to /dev/null, discarding them silently" },
          { front: "What directory contains system configuration files on Unix?", back: "/etc. Contains passwd, sudoers, hosts, and configuration for most services" },
          { front: "What does find -perm -002 find?", back: "World-writable files, files that any user on the system can modify. A security risk for privilege escalation" },
        ],
      },
    ],
  },
  {
    key: "network-visibility",
    name: "Network Visibility",
    level: "intermediate",
    topics: [
      {
        slug: "networking-fundamentals",
        title: "Networking Fundamentals for Security",
        content: `Before you can spot suspicious network activity, you need to understand what normal looks like.\n\n**IP Addresses**\n\nEvery device on a network has an IP address. Your Mac has at least two: a local one (e.g., 192.168.1.x) for your home network, and your external public IP when you hit the internet.\n\n\`127.0.0.1\` is localhost. Always points to your own machine. A process talking to 127.0.0.1 is talking to itself (common for local services, databases, etc.).\n\n**Ports**\n\nA port is a numbered channel on an IP address. If an IP address is the building, the port is the apartment number. Both the sender and receiver need to agree on which port to use.\n\nWell-known ports to know:\n- \`22\` — SSH (remote terminal access)\n- \`80\` — HTTP (web, unencrypted)\n- \`443\` — HTTPS (web, encrypted)\n- \`3306\` — MySQL database\n- \`5432\` — PostgreSQL database\n- \`8080 / 8443\` — common alternative web ports\n\nPorts below 1024 require root to open. If you see an unfamiliar process listening on a low port, pay attention.\n\n**TCP vs UDP**\n\nTCP is connection-oriented. It does a handshake, confirms delivery, retransmits lost packets. Web browsing, SSH, file transfers.\n\nUDP is fire-and-forget. Faster, no confirmation. DNS, video streaming, games.\n\nFrom a security view: TCP connections leave clear traces (established connections, source/destination, state). UDP is harder to track.\n\n**What Listening Means**\n\nWhen a process "listens" on a port, it is waiting for incoming connections on that port. If you have a service listening on port 22, someone could potentially SSH into your machine from outside.\n\nListening on 127.0.0.1 means local only. Listening on 0.0.0.0 or your external IP means anyone can attempt to connect.`,
        commands: [
          { cmd: "ifconfig", desc: "Show network interface configuration and IP addresses (macOS/Linux)" },
          { cmd: "ip addr", desc: "Show IP addresses (modern Linux)" },
          { cmd: "curl ifconfig.me", desc: "Show your public (external) IP address" },
          { cmd: "ping -c 4 8.8.8.8", desc: "Test connectivity to Google's DNS server" },
          { cmd: "traceroute 8.8.8.8", desc: "Show the network path to a destination" },
          { cmd: "host google.com", desc: "DNS lookup for a domain name" },
        ],
        tips: [
          "0.0.0.0 as a listening address means the process accepts connections on all interfaces. That is exposed to the network",
          "127.0.0.1 (localhost) is only reachable from your own machine. Services bound here are not directly exposed",
          "Ports above 1024 can be opened by any user without root. Be aware of what your own user is listening on",
          "traceroute reveals your network path. The first hop is usually your router (192.168.x.x)",
        ],
        flashcards: [
          { front: "What is 127.0.0.1?", back: "Localhost. Always refers to your own machine. A process connecting to 127.0.0.1 is connecting to itself" },
          { front: "What is the difference between TCP and UDP?", back: "TCP is connection-oriented with delivery confirmation. UDP is fire-and-forget, faster but no confirmation" },
          { front: "What does it mean when a process is 'listening' on a port?", back: "It is waiting for incoming connections on that port. Anyone who can reach that port can attempt to connect" },
          { front: "What port does SSH use by default?", back: "Port 22" },
          { front: "What is the security difference between listening on 0.0.0.0 vs 127.0.0.1?", back: "0.0.0.0 accepts connections from any interface including the network. 127.0.0.1 only accepts connections from localhost" },
          { front: "Why do ports below 1024 require root to open?", back: "They are reserved as well-known service ports. Requiring root prevents unprivileged users from impersonating standard services like HTTP (80) or SSH (22)" },
        ],
      },
      {
        slug: "netstat",
        title: "netstat: Reading the Network State",
        content: `\`netstat\` shows you every network connection and every port your system is listening on. It is one of the most useful commands for spotting unexpected activity.\n\n**Basic Usage**\n\n\`netstat -an\` is the most common form. \`-a\` shows all connections and listening ports. \`-n\` shows raw numbers (IPs and ports instead of hostnames, faster and clearer).\n\n**Reading the Output**\n\nThe columns: Proto, Local Address, Foreign Address, State.\n\n\`Local Address\` is your machine's IP and port. \`Foreign Address\` is who you are connected to. \`State\` tells you the connection status.\n\nConnection states to know:\n- \`LISTEN\` — waiting for incoming connections\n- \`ESTABLISHED\` — active connection, data can flow\n- \`TIME_WAIT\` — connection recently closed, waiting for delayed packets to arrive\n- \`CLOSE_WAIT\` — remote end closed, your side has not yet\n\n**What to Look For**\n\nStart with LISTEN. Those are your exposed services.\n\n\`netstat -an | grep LISTEN\` filters to only listening ports. Look at every entry and ask: do I know what this is?\n\nThen look at ESTABLISHED. Those are active connections right now.\n\n\`netstat -an | grep ESTABLISHED\` shows who you are currently connected to. Unexpected connections to unfamiliar IPs are worth investigating.\n\n**On macOS**\n\nThe \`netstat\` output on macOS looks slightly different. Use \`netstat -anp tcp\` for TCP only or \`netstat -anp udp\` for UDP. The \`-p\` flag on macOS specifies protocol, not process name (unlike Linux where \`-p\` shows the process).`,
        commands: [
          { cmd: "netstat -an", desc: "Show all connections and listening ports (numeric)" },
          { cmd: "netstat -an | grep LISTEN", desc: "Show only listening ports" },
          { cmd: "netstat -an | grep ESTABLISHED", desc: "Show active connections" },
          { cmd: "netstat -anp tcp | grep LISTEN", desc: "TCP listening ports only (macOS)" },
          { cmd: "netstat -rn", desc: "Show the routing table" },
          { cmd: "netstat -an | grep -v '127.0.0.1' | grep LISTEN", desc: "Listening ports exposed beyond localhost" },
        ],
        tips: [
          "grep -v '127.0.0.1' on LISTEN output gives you what is exposed to the network, not just to yourself",
          "TIME_WAIT entries are normal after connections close. Many of them just means high traffic volume",
          "On Linux, netstat -tulpn shows the process name next to each listening port (requires root for all processes)",
          "An ESTABLISHED connection to a foreign IP you do not recognize is worth looking up with 'whois IP'",
        ],
        flashcards: [
          { front: "What does netstat -an show?", back: "All active connections and listening ports on the system, displayed with numeric IPs and ports" },
          { front: "What does a LISTEN state mean in netstat output?", back: "The process is waiting for incoming connections on that port" },
          { front: "What does ESTABLISHED mean in netstat output?", back: "An active connection exists. Data can flow between the two endpoints" },
          { front: "How do you filter netstat output to see only listening ports?", back: "netstat -an | grep LISTEN" },
          { front: "What is the difference between netstat -p on macOS vs Linux?", back: "On macOS, -p specifies the protocol (tcp/udp). On Linux, -p shows the process name and PID associated with each connection" },
          { front: "Why is it significant when a port is listening on 0.0.0.0 vs 127.0.0.1?", back: "0.0.0.0 is reachable from any network interface including external ones. 127.0.0.1 is only reachable from the local machine" },
        ],
      },
      {
        slug: "lsof",
        title: "lsof: Connecting Processes to Network Activity",
        content: `\`lsof\` stands for "list open files." On Unix, everything is a file, including network connections. So lsof shows you everything a process has open: files, directories, sockets, network connections.\n\nFor security work, the most useful part is the network view.\n\n**lsof -i**\n\n\`lsof -i\` lists all processes with open network connections. This is the command that bridges the gap between netstat (which shows connections but not always the process) and ps (which shows processes but not their connections).\n\nOutput columns: COMMAND, PID, USER, FD, TYPE, DEVICE, SIZE, NODE, NAME.\n\nThe NAME column is what you care about. It shows the connection: \`4.3.2.1:443 (ESTABLISHED)\` or \`*:8080 (LISTEN)\`.\n\n**Filtering**\n\n\`lsof -i TCP\` — only TCP connections\n\`lsof -i :443\` — only connections on port 443\n\`lsof -i -P\` — show port numbers instead of service names\n\`lsof -i -n\` — show IPs instead of resolved hostnames (faster)\n\n**Combining with ps**\n\nWhen you spot a suspicious connection in lsof, note the PID. Then run \`ps -p PID -o user,pid,ppid,command\` to get full details on that process: who owns it, what is its parent process, and the full command that started it.\n\n**lsof by process**\n\n\`lsof -p PID\` shows everything a specific process has open: files, libraries, sockets. This is useful after you have identified a suspicious process.\n\n\`lsof -u username\` shows everything open by a specific user.`,
        commands: [
          { cmd: "lsof -i", desc: "List all processes with open network connections" },
          { cmd: "lsof -i -P -n", desc: "Network connections with numeric ports and IPs (no DNS lookup)" },
          { cmd: "lsof -i TCP -P | grep LISTEN", desc: "TCP listening sockets with process names" },
          { cmd: "lsof -i :22", desc: "Show what is using port 22" },
          { cmd: "lsof -p PID", desc: "Show all open files for a specific process" },
          { cmd: "sudo lsof -i -P -n | grep -v '127.0.0.1'", desc: "All non-local network connections with process names" },
        ],
        tips: [
          "Run lsof -i as root (sudo) to see all processes, not just your own",
          "lsof -i -P -n is the version to use for security investigation: no slow DNS lookups, raw port numbers",
          "When you find a suspicious PID in lsof, use 'ps -p PID -o user,pid,ppid,command' to see the full picture",
          "A process connected to an unusual foreign IP on a high port (above 1024) with no explanation is worth digging into",
        ],
        flashcards: [
          { front: "What does lsof stand for?", back: "List Open Files. On Unix, network connections are treated as files, so lsof can show network activity" },
          { front: "What does lsof -i show?", back: "All processes that have open network connections, with the process name, PID, user, and connection details" },
          { front: "How do you find what process is using a specific port?", back: "lsof -i :PORT (e.g., lsof -i :443) or on Linux: ss -tulpn | grep :PORT" },
          { front: "What flags make lsof output faster and cleaner for investigation?", back: "-P (numeric ports) and -n (numeric IPs, no DNS) prevent slow lookups" },
          { front: "How do you see all open files for a specific process?", back: "lsof -p PID" },
          { front: "How do lsof -i and netstat complement each other?", back: "netstat shows connections and states quickly. lsof maps each connection to the exact process name and PID" },
        ],
      },
    ],
  },
  {
    key: "defense-and-hardening",
    name: "Defense and Hardening",
    level: "intermediate",
    topics: [
      {
        slug: "system-persistence",
        title: "Persistence Mechanisms: macOS, Linux, and cron",
        content: `Persistence is how a malicious program survives a reboot. If you remove it from memory but it has a persistence mechanism, it comes back the next time you restart. Understanding persistence locations is one of the most practical defensive skills. The mechanisms differ significantly between macOS and Linux.\n\n**macOS: LaunchAgents**\n\nLaunchAgents are .plist files that tell macOS to run something automatically. They run in the context of a logged-in user.\n\nLocations to check:\n- \`~/Library/LaunchAgents\` — your user only, runs on your login\n- \`/Library/LaunchAgents\` — all users, runs on any user login\n\nThe .plist file contains a \`Program\` or \`ProgramArguments\` key that points to the binary or script to run.\n\n**macOS: LaunchDaemons**\n\n\`/Library/LaunchDaemons\` — runs as root, even before any user logs in. Higher privilege, higher risk if abused.\n\n\`launchctl list\` shows all currently loaded entries. Filter out Apple's: \`launchctl list | grep -v com.apple\`. What remains is third-party.\n\n**Linux: systemd**\n\nsystemd is the standard init system on modern Linux. Services that run on boot are defined as unit files.\n\n\`/etc/systemd/system/\` — custom and third-party service units. This is where a persistent backdoor would live.\n\n\`systemctl list-units --type=service --state=running\` shows all currently active services.\n\n\`systemctl status servicename\` gives details on a specific service including its unit file path and recent logs.\n\n**Linux: startup files**\n\n\`~/.bashrc\` and \`~/.bash_profile\` run every time a user opens a terminal. Appending a malicious command here is a subtle persistence technique.\n\n\`/etc/profile\` and \`/etc/profile.d/\` run for all users on login.\n\n\`/etc/rc.local\` (older systems) runs commands at boot. Still present on some distros.\n\n**cron (same on both platforms)**\n\n\`cron\` is a scheduler. It runs commands at specified times. \`crontab -l\` shows your scheduled tasks. \`sudo crontab -l\` shows root's scheduled tasks.\n\nA crontab entry looks like: \`* * * * * /path/to/script\`. The five asterisks represent minute, hour, day of month, month, day of week.\n\nSystem-wide cron: \`/etc/crontab\`, \`/etc/cron.d/\`, and \`/var/spool/cron/crontabs/\`.`,
        commands: [
          { cmd: "launchctl list | grep -v com.apple", desc: "macOS: show non-Apple auto-start entries" },
          { cmd: "ls -la ~/Library/LaunchAgents /Library/LaunchDaemons", desc: "macOS: list user agents and system daemons" },
          { cmd: "systemctl list-units --type=service --state=running", desc: "Linux: list all active systemd services" },
          { cmd: "ls -la /etc/systemd/system/", desc: "Linux: list custom systemd unit files" },
          { cmd: "crontab -l", desc: "Show your scheduled cron jobs (macOS and Linux)" },
          { cmd: "sudo crontab -l", desc: "Show root's scheduled cron jobs (macOS and Linux)" },
        ],
        tips: [
          "macOS: A new LaunchAgent entry after installing software is normal. One you did not put there is not",
          "macOS: Read a suspicious .plist with: cat ~/Library/LaunchAgents/filename.plist",
          "Linux: A new file in /etc/systemd/system/ that you did not create warrants investigation",
          "On both: grep your ~/.bashrc and ~/.profile for any commands that should not be there",
        ],
        flashcards: [
          { front: "What is the difference between a LaunchAgent and a LaunchDaemon?", back: "LaunchAgents run in the context of a logged-in user. LaunchDaemons run as root even before any user logs in (macOS)" },
          { front: "Where does Linux malware typically establish boot persistence?", back: "systemd unit files in /etc/systemd/system/, cron entries, or commands added to /etc/rc.local or ~/.bashrc" },
          { front: "How do you see which LaunchAgents are not from Apple?", back: "launchctl list | grep -v com.apple" },
          { front: "What Linux command lists all running systemd services?", back: "systemctl list-units --type=service --state=running" },
          { front: "What does crontab -l show?", back: "The scheduled cron tasks for your current user (works on both macOS and Linux)" },
          { front: "Why is ~/.bashrc a persistence risk on Linux?", back: "Commands added to ~/.bashrc execute every time the user opens a terminal. An attacker can add a reverse shell or exfiltration command there silently" },
        ],
      },
      {
        slug: "users-permissions",
        title: "Users, Permissions, and Privilege Escalation",
        content: `Understanding users and permissions is not just system administration. It is the core of access control, and access control is the core of security. Most of this module is identical across macOS and Linux.\n\n**Who Are You? (same on both)**\n\n\`id\` shows your user ID (UID), group ID (GID), and all groups you belong to. If your UID is 0, you are root.\n\n\`who\` shows who is currently logged in to the system. \`w\` shows the same with more detail, including what they are running.\n\n\`last\` shows recent login history. Useful for spotting unexpected logins.\n\n**Listing Users on the System**\n\n\`/etc/passwd\` lists all user accounts on both platforms. Format: \`username:x:UID:GID:description:home:shell\`. On modern systems the \`x\` means the password is in /etc/shadow. Use \`cat /etc/passwd | grep -v nologin | grep -v false\` to show accounts that can actually log in.\n\n**On Linux:** \`getent passwd\` shows all users including those from LDAP/NIS. Regular user accounts have UIDs 1000 and above on most distros.\n\n**On macOS:** \`dscl . -list /Users | grep -v '^_'\` lists user accounts (system accounts start with underscore). User accounts have UIDs 500 and above.\n\n**sudo and sudoers (same on both)**\n\n\`sudo -l\` shows what commands your user is allowed to run with sudo. This tells an attacker (or you) exactly what escalation paths exist.\n\n\`/etc/sudoers\` (or entries in /etc/sudoers.d/) controls who can run what as root. \`NOPASSWD\` entries are particularly sensitive because they allow privilege escalation without a password.\n\n**Privilege Escalation (same concepts on both)**\n\nPrivilege escalation is when a lower-privileged user gains higher privileges than they should have. Signs to watch for:\n- A process running as root that was started by a non-root user\n- Unexpected entries in sudoers\n- SUID binaries in unusual locations: \`find / -perm -4000 2>/dev/null\`\n- New user accounts you did not create\n- On Linux: world-writable files owned by root that are executed by a privileged service`,
        commands: [
          { cmd: "id", desc: "Show your user ID, group ID, and group memberships" },
          { cmd: "who", desc: "Show who is currently logged in" },
          { cmd: "last | head -20", desc: "Show the 20 most recent login events" },
          { cmd: "sudo -l", desc: "Show what commands your user can run with sudo" },
          { cmd: "find / -perm -4000 -type f 2>/dev/null", desc: "Find SUID binaries (run as their owner)" },
          { cmd: "cat /etc/passwd | grep -v nologin | grep -v false", desc: "Linux: show accounts that can actually log in" },
          { cmd: "dscl . -list /Users | grep -v '^_'", desc: "macOS: list non-system user accounts" },
        ],
        tips: [
          "Run 'sudo -l' as your normal user to understand your own escalation paths. An attacker will check this first",
          "SUID binaries run as their owner, not the caller. A SUID root binary that can be abused = root access",
          "New user accounts (especially with UID 0) that you did not create are a serious compromise indicator",
          "'last' reads from /var/log/wtmp (Linux) or /var/log/utx.log (macOS). Works the same way on both",
          "On Linux, check /etc/passwd for any uid=0 accounts besides root: awk -F: '($3==0){print}' /etc/passwd",
        ],
        flashcards: [
          { front: "What does the id command show?", back: "Your UID (user ID), GID (primary group ID), and all secondary groups you belong to" },
          { front: "What UID does the root user always have?", back: "0" },
          { front: "What does sudo -l show?", back: "The list of commands your user is permitted to run as root (or other users) via sudo" },
          { front: "What is a SUID binary?", back: "A binary with the Set User ID bit set. It executes with the file owner's privileges (often root) regardless of who runs it" },
          { front: "Where is sudoers configuration stored?", back: "/etc/sudoers and additional files in /etc/sudoers.d/" },
          { front: "What is privilege escalation?", back: "When a user gains more privileges than they should have, for example a regular user gaining root access" },
        ],
      },
      {
        slug: "log-analysis",
        title: "Log Analysis: Reading What Your System Records",
        content: `Logs are your system's memory. Every suspicious event, every failed login, every sudo command leaves a trace. Knowing where to look and what to look for is a core blue team skill.\n\n**Log Locations**\n\nOn Linux: \`/var/log/\` contains most logs.\n- \`/var/log/auth.log\` (Debian/Ubuntu) or \`/var/log/secure\` (RHEL/CentOS) — authentication events, sudo usage, SSH logins\n- \`/var/log/syslog\` or \`/var/log/messages\` — general system events\n- \`/var/log/cron\` — scheduled task execution\n\nOn macOS: Apple uses a unified logging system.\n- \`log show\` is the primary command\n- \`log stream\` gives live output\n- Some legacy logs still exist in \`/private/var/log/\`\n\n**Reading Logs on macOS**\n\n\`log show --last 1h\` shows the last hour of system logs. The output is dense. Pipe it to \`grep\` to filter.\n\n\`log show --predicate 'eventMessage contains "sudo"' --last 1d\` shows all sudo events in the last day.\n\n**Reading Logs on Linux**\n\n\`tail -f /var/log/auth.log\` streams new authentication events in real time. Useful when you want to watch what is happening now.\n\n\`grep "Failed password" /var/log/auth.log\` finds failed SSH login attempts. A large number of them indicates a brute force attack.\n\n\`grep "sudo" /var/log/auth.log\` shows every sudo command executed on the system.\n\n**What to Look For**\n\n- Failed login attempts, especially many in short succession\n- Successful logins from unexpected IPs or at unusual times\n- sudo commands you did not run\n- cron jobs executing things you did not schedule\n- Gaps in logs (logs being cleared is a sign of a cover-up)`,
        commands: [
          { cmd: "log show --last 1h | grep -i error", desc: "macOS: last hour of error logs" },
          { cmd: "log show --predicate 'eventMessage contains \"sudo\"' --last 1d", desc: "macOS: sudo activity in the last day" },
          { cmd: "tail -f /var/log/auth.log", desc: "Linux: stream authentication log in real time" },
          { cmd: "grep 'Failed password' /var/log/auth.log | tail -20", desc: "Linux: last 20 failed SSH attempts" },
          { cmd: "last | head -20", desc: "Last 20 login events" },
          { cmd: "sudo cat /private/var/log/system.log | grep -i 'error\\|warn' | tail -30", desc: "macOS: recent errors and warnings" },
        ],
        tips: [
          "The absence of logs is itself suspicious. If a system should be generating logs but is not, investigate",
          "On Linux, 'grep -c \"Failed password\" /var/log/auth.log' counts total failures. High numbers = brute force",
          "Use 'grep -B 2 -A 2 pattern file' to see 2 lines before and after each match, giving context",
          "Log timestamps are your best friend. Cross-reference suspicious process activity with log events at the same time",
        ],
        flashcards: [
          { front: "Where are authentication logs stored on Debian/Ubuntu?", back: "/var/log/auth.log" },
          { front: "What macOS command shows recent system logs?", back: "log show --last 1h (adjust the time range as needed)" },
          { front: "What grep command finds failed SSH logins?", back: "grep 'Failed password' /var/log/auth.log" },
          { front: "What does tail -f do?", back: "Follows a file in real time, printing new lines as they are added. Useful for watching logs live" },
          { front: "Why are gaps in logs suspicious?", back: "Attackers sometimes clear log files to cover their tracks. A gap where there should be continuous entries suggests tampering" },
          { front: "How do you filter macOS logs to show only sudo activity?", back: "log show --predicate 'eventMessage contains \"sudo\"' --last 1d" },
        ],
      },
      {
        slug: "incident-walkthrough",
        title: "Incident Investigation Walkthrough: Putting It All Together",
        content: `This module is a realistic scenario walkthrough. It ties every tool and concept in this course into a single investigation. Read it as a story, then use it as a reference when you face something real.\n\n**The Scenario**\n\nYour laptop fan has been running at high speed every night around 2am, even when you are not using it. Your internet router shows unusually high outbound traffic. You did not schedule any tasks to run at that time.\n\nSomething is happening. Here is how you investigate it, step by step.\n\n**Step 1: Check What Is Running**\n\nStart with the process list. You want to know if something unexpected is alive.\n\n\`ps aux | sort -k3 -rn | head -20\`\n\nLook at the COMMAND column. Do you recognize everything? Is any process running from /tmp, /dev/shm, or a dotfolder in your home directory? Is there a process with a random-looking name like xf3k9 or .update?\n\n\`ps aux | grep -v root | grep -v $(whoami)\`\n\nThis filters to processes owned by neither root nor you. Unexpected service accounts running things at 2am belong here.\n\nSuppose you see: \`nobody   1847  98.0  0.1  /tmp/.svc\`. That is immediately suspicious. A process owned by nobody, running from /tmp, using 98% CPU.\n\n**Step 2: Map That Process to Its Network Activity**\n\n\`sudo lsof -i -P -n | grep ESTABLISHED\`\n\nLook for PID 1847 in the output. If you see \`svc 1847 nobody TCP 192.168.1.10:54321->203.0.113.5:443 (ESTABLISHED)\`, your suspicious process has an outbound HTTPS connection to an external IP.\n\n\`ps -p 1847 -o pid,ppid,user,args\`\n\nThis tells you the full command and the parent PID. The args might show: \`/tmp/.svc --config /tmp/.cfg\`. Both the binary and its config are in /tmp.\n\nCheck the parent PID with the same command to see what spawned it. Was it a cron job? A shell? An unexpected parent is part of the infection chain.\n\n**Step 3: Check Persistence**\n\nThe process is running now, but how does it survive a reboot? Something started it.\n\n**macOS:**\n\`ls -la ~/Library/LaunchAgents\`\n\nYou find a file: \`com.svcupdate.plist\`. You open it and the ProgramArguments key points to \`/tmp/.svc\`. That is your persistence mechanism. This plist runs /tmp/.svc every time you log in.\n\n**Linux:**\n\`crontab -l\`\n\`sudo crontab -l\`\n\nYou find: \`0 2 * * * /tmp/.svc --connect\`. A cron job runs it at 2am every night. That explains the fan noise.\n\nAlso check: \`grep -r '/tmp/.svc' /etc/systemd/system/ ~/.bashrc ~/.profile 2>/dev/null\`\n\nAttackers often plant persistence in multiple places as a backup.\n\n**Step 4: Check Log Evidence**\n\nWhen did this start? What account was involved?\n\n**Linux:** \`grep '/tmp/.svc' /var/log/syslog | tail -20\`\n\n\`last | head -20\` shows login history. Was there an SSH login from an unfamiliar IP around the time this started?\n\n\`grep 'Failed password' /var/log/auth.log | tail -20\` — were there brute force attempts before a successful login?\n\n**macOS:** \`log show --predicate 'eventMessage contains ".svc"' --last 7d\`\n\n\`log show --predicate 'eventMessage contains "sudo"' --last 7d\` — did someone escalate privileges?\n\nLook for log gaps. If your auth.log has no entries for the hours the fan was spinning, someone may have cleared them.\n\n**Step 5: Check for C2 Beacon Patterns**\n\nA single ESTABLISHED connection is one data point. A beacon will reconnect on a schedule. Run two snapshots with a gap:\n\n\`sudo lsof -i -P -n | grep ESTABLISHED > /tmp/snap1.txt\`\n\nWait two minutes.\n\n\`sudo lsof -i -P -n | grep ESTABLISHED > /tmp/snap2.txt\`\n\n\`diff /tmp/snap1.txt /tmp/snap2.txt\`\n\nIf the same destination IP (203.0.113.5) appears in both despite the connection closing and reopening, you have a beacon. The implant is calling home on a timer.\n\nAlso check DNS for tunneling: \`log show --predicate 'subsystem == "com.apple.network.dns"' --last 1h\` (macOS) or \`journalctl -u systemd-resolved --since "1 hour ago"\` (Linux). Many queries to a single strange domain with random subdomains = DNS C2.\n\n**Step 6: Assess and Respond**\n\nAt this point you know: what is running, where it is, how it survives, when it started, and how it communicates.\n\nDocument everything before removing anything. Note the PID, the file paths, the destination IP, and the log timestamps. If this is a work machine, this information goes to your security team.\n\n**Containment (do not skip documentation first):**\n- Remove the persistence: delete the plist file or remove the cron entry\n- Kill the process: \`kill -9 1847\`\n- Block the IP at your router if possible\n- Delete the malicious files: \`rm -f /tmp/.svc /tmp/.cfg\`\n\n**After remediation:** Change all passwords, check for additional accounts added to /etc/passwd, review sudo rules with \`sudo -l\`, and run \`find / -mtime -7 -type f 2>/dev/null\` to find anything else the attacker created in the last week.\n\n**The Key Lesson**\n\nNo single tool tells the whole story. You used ps to find the process, lsof to map it to a network connection, ps again to trace its parent, launchctl or crontab to find its persistence, logs to establish a timeline, and beacon analysis to confirm C2. Each module in this course is one piece. The investigation is what connects them.`,
        commands: [
          { cmd: "ps aux | sort -k3 -rn | head -20", desc: "Step 1: find high-CPU processes — starting point of every investigation" },
          { cmd: "sudo lsof -i -P -n | grep ESTABLISHED", desc: "Step 2: map suspicious process PID to its outbound network connection" },
          { cmd: "ps -p PID -o pid,ppid,user,args", desc: "Step 2: get full command and parent of the suspicious process" },
          { cmd: "ls -la ~/Library/LaunchAgents && crontab -l", desc: "Step 3: check the two most common persistence locations" },
          { cmd: "grep 'Failed password' /var/log/auth.log | tail -20", desc: "Step 4: check for brute force attempts that preceded the compromise" },
          { cmd: "sudo lsof -i -P -n | grep ESTABLISHED > /tmp/snap1.txt && sleep 120 && sudo lsof -i -P -n | grep ESTABLISHED > /tmp/snap2.txt && diff /tmp/snap1.txt /tmp/snap2.txt", desc: "Step 5: two-snapshot beacon detection" },
        ],
        tips: [
          "Always document before you remove. Once you kill the process or delete the file, forensic evidence is gone",
          "Check persistence in multiple places. Attackers often plant backup persistence in cron, LaunchAgents, AND .bashrc simultaneously",
          "A log gap (missing time range in auth.log or syslog) is itself evidence. It suggests the attacker cleared logs",
          "Cross-reference timestamps across everything: when the cron job ran, when the network connection appeared, when the last suspicious login occurred",
          "After cleanup, check /etc/passwd for new accounts with UID 0 and review sudo -l for rules you did not set",
        ],
        flashcards: [
          { front: "What is the correct order for investigating a suspicious process?", back: "1) Identify it (ps), 2) Map its network activity (lsof), 3) Trace its origin (ppid), 4) Find its persistence (cron/LaunchAgents), 5) Build a timeline (logs), 6) Confirm C2 patterns (beacon snapshots)" },
          { front: "Why should you document before removing a malicious file or process?", back: "Once deleted or killed, forensic evidence is gone. File hashes, network destinations, parent PIDs, and log timestamps may be needed for incident reporting or further investigation" },
          { front: "If you find malware in ~/Library/LaunchAgents, where else should you immediately check?", back: "/Library/LaunchAgents, /Library/LaunchDaemons, crontab, ~/.bashrc, ~/.profile, and /etc/systemd/system/ (Linux). Attackers often plant multiple persistence mechanisms as fallbacks" },
          { front: "A log file has no entries for a 3-hour window when you know the system was running. What does this indicate?", back: "Log tampering. Attackers clear or truncate log files to erase evidence of their activity. The absence of expected entries is itself evidence of a compromise" },
          { front: "You remove the malicious cron job and kill the process. What must you do next?", back: "Change all passwords, check /etc/passwd for new or modified accounts, review sudo rules with 'sudo -l', scan for other recently modified files with 'find / -mtime -7', and check if the binary was dropped in multiple locations" },
          { front: "What does a two-snapshot lsof comparison tell you that a single snapshot cannot?", back: "Whether a connection is a persistent C2 beacon. A beacon disconnects between check-in cycles, so a single snapshot may show nothing. If the same destination IP reappears in both snapshots, it confirms regular call-home behavior" },
        ],
      },
    ],
  },
  {
    key: "c2-detection",
    name: "C2 Detection",
    level: "advanced",
    topics: [
      {
        slug: "c2-fundamentals",
        title: "How C2 Backdoors Work",
        content: `A C2 (Command and Control) channel is the communication link between a compromised system and the attacker's server. Without it, a backdoor is just a dormant file. With it, the attacker can issue commands, receive stolen data, and maintain access indefinitely. Understanding how C2 works is the prerequisite to detecting it.\n\n**The Architecture**\n\nThe implant is the code running on the victim system. It may be a standalone executable, a shared library injected into a legitimate process, or shellcode running purely in memory with no file on disk.\n\nThe handler (also called the teamserver or listener) is the attacker-controlled server. The implant connects outbound to it. This direction matters for detection: you are looking for outbound connections from your machine to external IPs, not inbound connections.\n\n**Beacon vs. Interactive Mode**\n\nMost modern implants use a beacon model. The implant sleeps for a set interval (say, 60 seconds), then wakes up, contacts the handler, checks for instructions, executes any tasks, sends results back, and sleeps again. This produces periodic, low-volume outbound traffic that blends with background noise.\n\nInteractive shells maintain a persistent TCP connection. Easier to detect because the connection stays ESTABLISHED continuously in netstat and lsof.\n\n**Jitter**\n\nOperators add jitter to beacon intervals to defeat timing-based detection. Instead of exactly 60 seconds every call-home, the implant sleeps for 60 seconds plus or minus a random percentage (10% jitter means anywhere from 54 to 66 seconds). This makes simple interval matching unreliable.\n\n**Common C2 Frameworks**\n\nCobalt Strike is the most widely abused commercial red team tool. Its default beacon uses HTTPS. It supports malleable C2 profiles that mimic legitimate CDN or SaaS traffic to blend in.\n\nMetasploit Meterpreter is common in automated exploitation. It connects back on configurable ports and supports staged payloads where a small first-stage downloads the actual implant.\n\nSliver is open-source and growing in use. It supports mutual TLS (mTLS), HTTP, and DNS channels.\n\nCustom implants written by nation-state actors have no public signatures or known patterns.\n\n**C2 Channels**\n\nHTTPS (port 443) is the most common channel. It blends with legitimate web traffic and is rarely blocked. The implant calls out to a hardcoded domain or IP that the attacker controls.\n\nDNS encoding uses DNS query and response fields to carry data. Very hard to block because DNS is fundamental infrastructure. The implant sends data as subdomains of an attacker-controlled domain.\n\nHTTP with custom headers encodes commands in user-agent strings, cookies, or custom header fields, making the traffic look like normal web browsing at first glance.\n\nICMP tunneling routes data through ping packets. Uncommon but used when TCP and UDP are heavily monitored or blocked.`,
        commands: [
          { cmd: "sudo lsof -i -P -n | grep ESTABLISHED", desc: "Show all active outbound connections with the responsible process" },
          { cmd: "sudo lsof -i -P -n | grep -v '127.0.0.1' | grep -v '::1'", desc: "All non-local network connections, focus on unfamiliar IPs" },
          { cmd: "ps -eo pid,ppid,user,args | grep -v grep | head -40", desc: "Show process tree with parent PIDs to spot abnormal spawn chains" },
          { cmd: "netstat -an | grep ESTABLISHED | grep -v '127.0.0.1'", desc: "Active external TCP connections" },
          { cmd: "ss -tnp | grep ESTABLISHED", desc: "Linux: established connections with process name (ss is faster than netstat)" },
          { cmd: "ls -la /proc/$(pgrep suspicious)/exe", desc: "Linux: check if the binary on disk was deleted after launch (shows '(deleted)')" },
        ],
        tips: [
          "Implants call OUT to the handler, not the other way. Focus on established outbound connections to external IPs",
          "Beacon traffic looks like periodic brief connections to the same destination. Manual checks at different times help spot it",
          "A jitter value of 10-20% means the interval varies slightly each time to defeat simple detection",
          "The process making the suspicious connection matters more than the connection itself. bash or python3 connecting outbound is far more suspicious than curl",
          "DNS-based C2 never establishes a TCP connection you can see in netstat. It operates entirely through DNS queries",
        ],
        flashcards: [
          { front: "What is a C2 (Command and Control) channel?", back: "The communication link between a backdoor implant on the victim machine and the attacker's handler server. The implant connects outbound to the handler to receive instructions and send back results" },
          { front: "Why do implants call out TO the attacker rather than the attacker connecting IN?", back: "Outbound connections pass through most firewalls by default. Inbound connections from the internet to an internal host are usually blocked. Attackers exploit this by having the implant initiate the session" },
          { front: "What is a beacon in C2 context?", back: "A beacon is an implant that sleeps for a set interval, then wakes up, contacts the handler, checks for commands, executes them, sends results, and goes back to sleep. It produces periodic low-volume traffic" },
          { front: "What is jitter in a C2 beacon?", back: "A random variation added to the beacon sleep interval to defeat timing-based detection. 20% jitter on a 60-second interval means the implant calls home every 48 to 72 seconds instead of exactly 60" },
          { front: "Why is HTTPS such a common C2 channel?", back: "It blends with legitimate web traffic, is rarely blocked at the firewall, and encrypts the payload so content inspection cannot read commands or stolen data" },
          { front: "How does DNS-based C2 carry data?", back: "It encodes data as subdomains of an attacker-controlled domain. A query like aGVsbG8=.c2.attacker.com carries base64-encoded data in the subdomain. Responses encode commands in TXT or A records" },
        ],
      },
      {
        slug: "c2-network-detection",
        title: "Detecting C2 Beacons in Outbound Traffic",
        content: `C2 traffic must move. It goes from the implant outbound to the handler. Your job is to find that movement using the tools you already know: lsof, netstat, ss, and your system logs.\n\n**What You Are Looking For**\n\nAt the network level, C2 traffic looks like one or more of these:\n- An outbound ESTABLISHED connection to an IP or domain you do not recognize\n- A process that has no legitimate reason to be on the network (bash, python3 in /tmp, cron) showing up with an active connection\n- A connection that stays open for an unusually long time or reconnects at regular intervals\n- DNS queries for high-entropy random-looking subdomains\n\n**Step 1: Map Processes to Connections**\n\n\`sudo lsof -i -P -n | grep ESTABLISHED\`\n\nFor each line, look at the COMMAND column (who made the connection) and the NAME column (what IP and port they are connected to). Ask yourself: does this process have a legitimate reason to connect to this destination?\n\nSuspicious COMMAND values: bash, sh, python3, python, perl, ruby, nc, ncat, socat, curl used as a persistent process rather than a one-shot request.\n\nSuspicious NAME patterns: high port numbers (50000+), connections to cloud VPS ranges (check with whois), connections at regular intervals.\n\n**Step 2: Check the Process Details**\n\nWhen you find a suspicious connection, note the PID and dig deeper:\n\n\`ps -p PID -o pid,ppid,user,args\`\n\nThe args column shows the full command. \`python3 /tmp/.update.py\` is very different from \`python3 /usr/lib/packagekit/pk-offline-update.py\`.\n\nThe ppid (parent PID) tells you what spawned the suspicious process. If apache2 spawned a bash shell, that is a webshell execution. If sshd spawned python3, something is wrong.\n\n**Step 3: Check for Beaconing Patterns**\n\nA beacon will not always be visible in a single lsof snapshot because it disconnects between calls. Run the check twice with a gap between them:\n\n\`sudo lsof -i -P -n | grep ESTABLISHED > /tmp/check1.txt\`\n\nWait 2-3 minutes. Then:\n\n\`sudo lsof -i -P -n | grep ESTABLISHED > /tmp/check2.txt\`\n\n\`diff /tmp/check1.txt /tmp/check2.txt\`\n\nIf the same destination IP appears in both despite the connection closing and reopening, that is a candidate beacon.\n\n**DNS Anomalies**\n\nDNS-based C2 never appears in netstat or lsof as a TCP connection. You need to look at DNS activity instead.\n\nOn macOS: \`log show --predicate 'subsystem == "com.apple.network.dns"' --last 1h | grep -i query\`\n\nOn Linux with systemd-resolved: \`journalctl -u systemd-resolved --since "1 hour ago" | grep -i query\`\n\nAlternatively, check your router's DNS logs if available.\n\nSigns of DNS tunneling: many queries to the same base domain with varying long subdomains, TXT record queries (uncommon in normal traffic), repeated NXDOMAIN responses.\n\n**Checking Connection History in Logs**\n\nOn Linux, if the C2 used SSH or a service that logs, you will find traces in auth.log. But for raw TCP connections, the system does not log every connection by default. You need either a firewall log or network capture.\n\n\`grep -i 'connect' /var/log/syslog | tail -30\` can sometimes surface connection events depending on what services are logging.`,
        commands: [
          { cmd: "sudo lsof -i -P -n | grep ESTABLISHED", desc: "All active external connections with the process responsible" },
          { cmd: "ps -p PID -o pid,ppid,user,args", desc: "Get full process details including parent and full command" },
          { cmd: "sudo lsof -i -P -n | grep ESTABLISHED > /tmp/check1.txt && sleep 120 && sudo lsof -i -P -n | grep ESTABLISHED > /tmp/check2.txt && diff /tmp/check1.txt /tmp/check2.txt", desc: "Two-snapshot beacon detection: same destination reappearing = beacon candidate" },
          { cmd: "log show --predicate 'subsystem == \"com.apple.network.dns\"' --last 1h | grep query", desc: "macOS: DNS queries in the last hour" },
          { cmd: "journalctl -u systemd-resolved --since '1 hour ago' | grep -i query", desc: "Linux: DNS queries via systemd-resolved" },
          { cmd: "ps -eo pid,ppid,user,args | awk '$2==TARGET_PPID'", desc: "Find all child processes spawned by a suspicious parent (replace TARGET_PPID with the PID)" },
        ],
        tips: [
          "bash or sh with an ESTABLISHED connection to an external IP is almost always suspicious. Shells do not need network access on their own",
          "A single lsof snapshot misses beacons that are between call-home cycles. Use two snapshots with a gap to catch them",
          "High-entropy domain names (a3f9k2mj.someDomain.com) are a strong indicator of a DGA (Domain Generation Algorithm) or DNS tunneling",
          "Use 'whois IP' on unfamiliar destination IPs. C2 infrastructure often registers on cloud providers (AWS, DigitalOcean, Linode, Vultr) in unusual regions",
          "On macOS, Little Snitch or LuLu (firewall tools) log every outbound connection attempt with the process name, making beacon detection much easier",
          "TXT DNS record queries from a workstation are unusual. Normal browsing does not use TXT records",
        ],
        flashcards: [
          { front: "What command shows all active external connections with the process name?", back: "sudo lsof -i -P -n | grep ESTABLISHED (the -P and -n flags avoid slow DNS lookups)" },
          { front: "A process called 'python3' has an ESTABLISHED connection to 203.0.113.44:443. What should you check next?", back: "Run ps -p PID -o pid,ppid,user,args to see the full command and parent process. Check whether the script path is in a legitimate location or somewhere like /tmp or a home directory" },
          { front: "Why does a single lsof snapshot sometimes miss C2 beacons?", back: "A beaconing implant disconnects between call-home intervals. If you check during the sleep period, there is no active connection to see. Two snapshots minutes apart will catch a beacon reappearing" },
          { front: "What DNS pattern indicates possible DNS tunneling?", back: "Many queries to the same base domain with different long random-looking subdomains, especially TXT record queries. Normal DNS queries are short and predictable" },
          { front: "What does a process ppid tell you in a C2 investigation?", back: "The parent PID reveals how the suspicious process was spawned. If a web server spawned a bash shell, it suggests webshell execution. If sshd spawned python3, something has gone wrong in the SSH session" },
          { front: "Why is HTTPS C2 hard to detect purely from network connections?", back: "Port 443 is used by almost everything. The connection looks like normal web traffic. Without knowing which process is responsible, the traffic blends in. lsof maps the connection to the process, which is where the anomaly becomes visible" },
        ],
      },
      {
        slug: "c2-process-injection",
        title: "Finding Injected Code and Memory-Only Implants",
        content: `Advanced C2 implants do not always drop a file and run it. Instead, they inject their code into a running legitimate process. From ps output, you see the legitimate process name. Inside it, the attacker's code is running. This is harder to detect but not impossible.\n\n**What Process Injection Means**\n\nProcess injection places attacker-controlled code inside the memory space of a legitimate running process. The legitimate process handle in the OS now executes both its original code and the injected payload.\n\nFrom ps, you still see something like /usr/bin/python3 or sshd. The injection is invisible at that level. What leaks is behavior that does not match what the process normally does: outbound network connections, file access in unusual places, unexplained memory growth.\n\n**Process Hollowing**\n\nProcess hollowing starts a legitimate process in a suspended state, unmaps its original code from memory, and writes the attacker's payload into that memory space before resuming it. The process entry in ps shows the original binary name, but it is running completely different code.\n\nIndicators:\n- A process whose binary path is legitimate but lsof -p shows no access to libraries or files you would expect\n- A process making network connections to external IPs when it has no network functionality normally\n\n**Checking for Deleted Binaries (Linux)**\n\nA classic evasion: drop the binary, execute it, then immediately delete the file. The process keeps running from memory. The file is gone from disk.\n\n\`ls -la /proc/PID/exe\`\n\nIf the output shows \`(deleted)\` after the path, the binary on disk was removed after the process started. This is sometimes legitimate (package updates), but in the context of a suspicious process it is a strong indicator.\n\n\`ls -la /proc/*/exe 2>/dev/null | grep deleted\`\n\nThis scans all processes for deleted executable paths.\n\n**Checking Memory Regions (Linux)**\n\n\`/proc/PID/maps\` shows the memory map of a process: every memory region, its permissions, and what file backs it if any.\n\n\`cat /proc/1234/maps | grep rwx\`\n\nLook for regions marked \`rwx\` (read, write, and execute). Legitimate code regions are \`r-x\` (read and execute only). A memory region that is both writable and executable in a process that is not a JVM, browser, or JIT compiler is suspicious. It may contain injected shellcode.\n\n**Parent-Child Process Anomalies**\n\nLegitimate processes have predictable parent-child relationships. Knowing what is normal lets you spot what is not.\n\n\`ps -eo pid,ppid,user,args\`\n\nThings that should raise questions:\n- apache2 or nginx spawning a bash or sh child (webshell execution)\n- A system daemon like sshd or cron spawning python3 or perl with no arguments\n- bash being a child of something other than a terminal or SSH session\n- Multiple instances of a process that should be a singleton\n\n**Signed vs. Unsigned Binaries (macOS)**\n\nOn macOS, legitimate Apple software and most commercial apps are code-signed. An unsigned or ad-hoc signed binary making network connections is worth investigating.\n\n\`codesign -dv --verbose=4 /path/to/binary 2>&1\`\n\nIf the output shows \`not signed\` or an ad-hoc signature with no team identifier, the binary has no verified origin.\n\n**Memory-Only Implants**\n\nSome implants are loaded by exploiting a vulnerability or abusing a legitimate mechanism (a malicious shared library, a malicious Perl module, a Python package) and never write a standalone executable to disk.\n\nOn Linux, check what shared libraries a process has mapped:\n\n\`cat /proc/PID/maps | grep '\\.so'\`\n\nA path like /tmp/libupdate.so.1 or a .so in a home directory is a strong indicator. Legitimate shared libraries live in /lib, /usr/lib, or /usr/local/lib.`,
        commands: [
          { cmd: "ls -la /proc/*/exe 2>/dev/null | grep deleted", desc: "Linux: find all processes whose on-disk binary was deleted after launch" },
          { cmd: "cat /proc/PID/maps | grep rwx", desc: "Linux: find memory regions that are both writable and executable (possible shellcode injection)" },
          { cmd: "cat /proc/PID/maps | grep '\\.so' | grep -v '/usr/lib\\|/lib\\|/usr/local/lib'", desc: "Linux: find shared libraries loaded from unusual locations (not standard lib paths)" },
          { cmd: "ps -eo pid,ppid,user,args | sort -k2 -n", desc: "Show processes sorted by parent PID to spot unusual spawn chains" },
          { cmd: "codesign -dv --verbose=4 /path/to/binary 2>&1", desc: "macOS: check if a binary is properly signed and by whom" },
          { cmd: "lsof -p PID | grep -v '/usr/lib\\|/lib\\|Apple\\|/System'", desc: "Files open by a process, filtered to show only non-standard paths" },
        ],
        tips: [
          "Process injection is invisible in ps. The anomaly shows up in behavior: unexpected network connections, unusual file access, or memory anomalies",
          "On Linux, grep /proc/*/exe for 'deleted' first. It takes seconds and immediately surfaces processes running from deleted binaries",
          "A rwx memory region in a non-JIT process is a red flag. Normal code is r-x. Only JVMs, browsers, and JIT engines legitimately need rwx regions",
          "Parent-child relationships are your map. A web server spawning a shell, a cron job spawning python3 on a schedule you did not set, or a daemon spawning perl are all worth tracing",
          "On macOS, anything making persistent outbound connections that lacks a proper team-signed code signature deserves scrutiny",
          "Shared libraries loaded from /tmp, /dev/shm, or home directories are highly suspicious. All legitimate .so files belong in standard library paths",
        ],
        flashcards: [
          { front: "What is process injection?", back: "A technique where attacker-controlled code is placed inside the memory space of a running legitimate process. The process appears normal in ps output but is executing the attacker's payload alongside its own code" },
          { front: "What is process hollowing?", back: "A process is started in a suspended state, its original code is unmapped from memory, and the attacker's payload is written into that space before the process resumes. The process name in ps looks legitimate" },
          { front: "On Linux, what does /proc/PID/exe showing '(deleted)' indicate?", back: "The binary that started the process has been deleted from disk. The process continues running from memory. This is sometimes done by malware to erase evidence of the file that was dropped and executed" },
          { front: "What does a rwx memory region in /proc/PID/maps indicate?", back: "A memory region that is readable, writable, and executable. Injected shellcode needs to be writable (to write the payload) and executable (to run it). Legitimate code regions are r-x only" },
          { front: "What parent-child process relationship suggests webshell execution?", back: "A web server process (apache2, nginx, httpd) spawning a shell (bash, sh) or scripting interpreter (python3, perl, php) as a direct child. The web server has no legitimate reason to spawn an interactive shell" },
          { front: "What makes a shared library in /tmp or a home directory suspicious?", back: "Legitimate shared libraries are installed to /lib, /usr/lib, or /usr/local/lib. A .so file in /tmp, /dev/shm, or a user home directory was likely dropped by an attacker as part of an injection or persistence mechanism" },
        ],
      },
    ],
  },
];

export const UNIX_SECURITY_TOTAL_TOPICS = UNIX_SECURITY_STUDY.reduce(
  (sum, d) => sum + d.topics.length,
  0
);

export const UNIX_SECURITY_TOTAL_FLASHCARDS = UNIX_SECURITY_STUDY.reduce(
  (sum, d) => sum + d.topics.reduce((s, t) => s + t.flashcards.length, 0),
  0
);
