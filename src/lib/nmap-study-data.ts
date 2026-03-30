import type { LinuxDomain } from "./linux-study-data";

export const NMAP_STUDY: LinuxDomain[] = [
  // ─── Domain 1: Nmap Fundamentals ─────────────────────────────────────────────
  {
    key: "fundamentals",
    name: "Nmap Fundamentals",
    level: "beginner",
    topics: [
      {
        slug: "nmap-introduction",
        title: "Introduction to Nmap",
        content: `Nmap (Network Mapper) is the world's most widely used open-source network scanner, originally created by Gordon Lyon (Fyodor) in 1997. It is a staple tool for security professionals, penetration testers, and network administrators to discover hosts, open ports, running services, and potential vulnerabilities across a network.

**Core Capabilities:**
- **Host discovery**, determine which hosts are online
- **Port scanning**, identify open, closed, and filtered ports
- **Service & version detection**, identify what software is listening on each port
- **OS fingerprinting**, estimate the operating system and version of a target
- **Scriptable interaction**, automate tasks with the Nmap Scripting Engine (NSE)

**Basic Syntax:**
\`\`\`
nmap [scan type] [options] {target specification}
\`\`\`

**Installation:**
- Debian/Ubuntu: \`sudo apt install nmap\`
- RHEL/Fedora: \`sudo dnf install nmap\`
- macOS: \`brew install nmap\`
- Windows: Download the installer from nmap.org (includes Zenmap GUI)

**Privilege Levels:**
Many scan types such as SYN scan (\`-sS\`) require root/administrator privileges because they craft raw IP packets at a low level. TCP Connect scan (\`-sT\`) works without root by using the OS's standard connect() syscall. Running \`sudo nmap\` on Linux or running as Administrator on Windows unlocks full functionality.

**Legal and Ethical Notice:**
Scanning any network without written authorization from the owner is illegal in most jurisdictions and can violate the Computer Fraud and Abuse Act (US) and similar laws worldwide. Always obtain explicit permission before scanning. Even port scanning your own production systems without a maintenance window can trigger firewalls and IDS alerts.

**Common Use Cases:**
- Network asset inventory and mapping
- Pre-engagement reconnaissance in penetration tests
- Verifying firewall rules and ACL configurations
- Monitoring service availability
- Compliance auditing (PCI-DSS, HIPAA)`,
        commands: [
          { cmd: "nmap --version", desc: "Display Nmap version and build info" },
          { cmd: "nmap -h", desc: "Show quick help and usage summary" },
          { cmd: "nmap 192.168.1.1", desc: "Default scan: top 1000 ports on a single host" },
          { cmd: "sudo nmap -sS 192.168.1.1", desc: "SYN scan (requires root), the most common scan type" },
          { cmd: "nmap -sT 192.168.1.1", desc: "TCP Connect scan, works without root privileges" },
          { cmd: "nmap -A 192.168.1.1", desc: "Aggressive scan: OS, version, script, and traceroute" },
        ],
        tips: [
          "Always run Nmap as root (or with sudo) for best results, most advanced scan types require raw socket access",
          "The default scan without any flags runs a TCP SYN scan on the top 1000 most common ports",
          "Use -v or -vv to get verbose output and see results as they come in, rather than waiting for the full scan",
          "Install nmap from official repositories or nmap.org, third-party builds may be outdated",
        ],
        flashcards: [
          { front: "What does Nmap stand for?", back: "Network Mapper, an open-source tool for network discovery and security auditing" },
          { front: "What scan type does a default Nmap run (no flags)?", back: "SYN scan (-sS) on the top 1000 most common TCP ports if run as root; TCP Connect (-sT) if not root" },
          { front: "Why do many Nmap scans require root/administrator privileges?", back: "They craft raw IP packets at a low level, which requires direct access to the network interface" },
          { front: "What is the basic Nmap syntax structure?", back: "nmap [scan type] [options] {target specification}" },
          { front: "What flag runs an aggressive all-in-one scan?", back: "-A enables OS detection, version detection, script scanning, and traceroute" },
          { front: "What is the Nmap Scripting Engine (NSE)?", back: "A built-in scripting platform that allows automating a wide variety of networking tasks including vulnerability detection" },
        ],
      },
      {
        slug: "target-specification",
        title: "Target Specification",
        content: `Nmap supports a wide range of target specification formats, making it flexible for scanning individual hosts, subnets, or complex multi-range networks.

**Single Host:**
Specify a hostname (\`nmap scanme.nmap.org\`), IPv4 address (\`nmap 192.168.1.1\`), or IPv6 address (\`nmap -6 ::1\`).

**CIDR Notation:**
Scan an entire subnet by appending the prefix length. \`nmap 192.168.1.0/24\` scans all 256 addresses in the subnet (192.168.1.0 – 192.168.1.255). \`nmap 10.0.0.0/8\` scans 16.7 million addresses, only do this with permission and appropriate timing.

**IP Ranges:**
Use a hyphen to specify a range within an octet: \`nmap 192.168.1.1-50\` scans .1 through .50.
Mix multiple formats: \`nmap 192.168.1.1,5,10-20\` scans .1, .5, and .10 through .20.

**Wildcard:**
\`nmap 192.168.1.*\` is equivalent to \`192.168.1.0/24\`.

**Input from File (\`-iL\`):**
Store targets one per line (or space/comma-separated) in a text file and pass it with \`-iL targets.txt\`. This is useful for large engagements.

**Excluding Targets (\`--exclude\`, \`--excludefile\`):**
Exclude specific hosts or ranges from a scan: \`nmap 192.168.1.0/24 --exclude 192.168.1.1,192.168.1.254\`. Use \`--excludefile\` to specify a file of exclusions. This is critical when production-critical hosts must be protected.

**Random Targets (\`-iR\`):**
\`nmap -iR 100\` selects 100 random Internet hosts. Useful for research but must only be used ethically and with great care.

**Resolving Hostnames:**
Nmap resolves hostnames by default. Disable with \`-n\` (no DNS resolution) to speed up scans significantly on large ranges.`,
        commands: [
          { cmd: "nmap 192.168.1.0/24", desc: "Scan all 256 hosts in the subnet" },
          { cmd: "nmap 192.168.1.1-50", desc: "Scan hosts .1 through .50 in the range" },
          { cmd: "nmap 10.0.0.1,5,10-20", desc: "Scan .1, .5, and .10 through .20" },
          { cmd: "nmap -iL targets.txt", desc: "Read scan targets from a file" },
          { cmd: "nmap 192.168.1.0/24 --exclude 192.168.1.1", desc: "Scan subnet but exclude the gateway" },
          { cmd: "nmap -n 192.168.1.0/24", desc: "Skip DNS resolution for faster scanning" },
        ],
        tips: [
          "Use -n to skip DNS resolution when scanning large ranges, it dramatically speeds up scans",
          "Always use --exclude to protect critical infrastructure like routers and production servers",
          "For large engagements, put all targets in a file with -iL to keep scans organized and reproducible",
          "CIDR /24 = 256 hosts, /16 = 65536 hosts, /8 = 16.7M hosts, be mindful of scope",
        ],
        flashcards: [
          { front: "How do you scan an entire /24 subnet with Nmap?", back: "nmap 192.168.1.0/24, or equivalently nmap 192.168.1.*" },
          { front: "What flag reads scan targets from a file?", back: "-iL filename.txt (input list)" },
          { front: "How do you exclude a specific host from a scan?", back: "Use --exclude 192.168.1.1 after the target specification" },
          { front: "What does -n do in Nmap?", back: "Disables DNS reverse resolution, making scans faster (no DNS lookups)" },
          { front: "What syntax scans 192.168.1.1, .5, and .10 through .20?", back: "nmap 192.168.1.1,5,10-20" },
          { front: "What flag scans a random set of Internet hosts?", back: "-iR <number>, selects that many random hosts (use ethically and legally only)" },
        ],
      },
      {
        slug: "port-states",
        title: "Understanding Port States",
        content: `Nmap categorizes ports into six possible states based on the responses (or lack thereof) it receives during scanning. Understanding these states is fundamental to interpreting Nmap output correctly.

**Open:**
An application is actively accepting connections on this port. A service (e.g., Apache on TCP 80, SSH on TCP 22) is listening. This is the most interesting state from a security perspective, open ports represent potential attack surface.

**Closed:**
The port is accessible (not filtered by a firewall), but no application is currently listening on it. The host is reachable and the port responds, but returns a TCP RST (reset) for TCP or an ICMP port unreachable for UDP. Useful for OS detection.

**Filtered:**
Nmap cannot determine whether the port is open because a packet filter (firewall, router ACL) is dropping or rejecting packets destined for this port. Nmap doesn't receive any response, or receives ICMP unreachable error type 3, code 1/2/3/9/10/13. Filtered ports slow down scans significantly.

**Unfiltered:**
The port is accessible but Nmap cannot determine if it is open or closed. This state only appears with ACK scan (\`-sA\`), which is used to map firewall rules. The host responds to the ACK probe but the state of the application is indeterminate.

**Open|Filtered:**
Nmap cannot determine whether a port is open or filtered. This occurs with scan types where open and filtered ports give the same response (no response). Common with UDP, FIN, NULL, and XMAS scans. If an open port receives a FIN packet, it silently drops it, same as a filtered port.

**Closed|Filtered:**
Nmap cannot determine whether a port is closed or filtered. Only appears with IP ID idle scan (\`-sI\`).

**Practical Takeaway:**
In most penetration tests, the states of interest are **open** (service is running) and **filtered** (firewall is protecting it). A filtered port that you can reach via a different technique may reveal a hidden service.`,
        commands: [
          { cmd: "nmap --open 192.168.1.1", desc: "Only show open (or open|filtered) ports in results" },
          { cmd: "nmap -sA 192.168.1.1", desc: "ACK scan to identify filtered vs unfiltered ports (maps firewall rules)" },
          { cmd: "nmap --reason 192.168.1.1", desc: "Show the reason Nmap assigned a particular port state" },
          { cmd: "nmap -sU 192.168.1.1", desc: "UDP scan, commonly produces open|filtered results" },
          { cmd: "nmap -v --reason 192.168.1.0/24", desc: "Verbose scan with state reasons across a subnet" },
        ],
        tips: [
          "Use --reason to see exactly WHY Nmap assigned a port state, great for debugging unexpected results",
          "Heavily filtered scans (many 'filtered' results) indicate a firewall between you and the target",
          "Closed ports still respond, they are useful for confirming host availability even when all ports are filtered",
          "The --open flag keeps output clean by hiding closed and filtered ports when you just need the attack surface",
        ],
        flashcards: [
          { front: "What does a 'filtered' port state mean in Nmap?", back: "A firewall or filter is blocking packets to that port, Nmap receives no response or an ICMP unreachable error" },
          { front: "What is the difference between 'closed' and 'filtered'?", back: "Closed: port accessible, no service listening (returns RST). Filtered: a firewall blocks packets, no RST received" },
          { front: "When does Nmap report 'open|filtered'?", back: "When open and filtered ports give the same response (silence), common with UDP, FIN, NULL, XMAS scans" },
          { front: "What scan type produces 'unfiltered' port results?", back: "ACK scan (-sA), used to map firewall rules, can't distinguish open from closed but identifies filtering" },
          { front: "What flag shows only open ports in Nmap output?", back: "--open (hides closed and filtered ports)" },
          { front: "What flag shows the reason for each port state assignment?", back: "--reason (e.g., 'syn-ack' for open, 'reset' for closed, 'no-response' for filtered)" },
        ],
      },
    ],
  },

  // ─── Domain 2: Host & Port Discovery ─────────────────────────────────────────
  {
    key: "discovery",
    name: "Host & Port Discovery",
    level: "beginner",
    topics: [
      {
        slug: "host-discovery",
        title: "Host Discovery",
        content: `Host discovery is the process of determining which hosts are online before investing time in port scanning. Nmap offers numerous host discovery techniques, each suited to different network environments and firewall configurations.

**Ping Scan Only (\`-sn\`):**
Also called a ping sweep. Nmap sends probes but doesn't scan ports. It simply reports which hosts are up. Fast and non-intrusive for mapping live hosts on a subnet.

**Skip Host Discovery (\`-Pn\`):**
Treat all hosts as online, skip the discovery phase and proceed directly to port scanning. Essential when targets are behind firewalls that block all ping probes. Slower on large ranges (scans all hosts even if offline).

**ICMP Probes:**
- \`-PE\`, ICMP echo request (classic "ping")
- \`-PP\`, ICMP timestamp request (sometimes passes firewalls that block echo)
- \`-PM\`, ICMP address mask request

**TCP Probes:**
- \`-PS[portlist]\`, TCP SYN probe (default port 80). A SYN/ACK (open) or RST (closed) indicates host is up
- \`-PA[portlist]\`, TCP ACK probe (default port 80). RST response indicates host is up (useful when SYN is blocked)

**UDP Probes:**
- \`-PU[portlist]\`, UDP probe (default port 40125). ICMP port unreachable = host is up

**ARP Ping (\`-PR\`):**
Used automatically on local networks. Sends ARP requests, which are reliable and fast. Cannot be blocked by host-based firewalls. Nmap uses ARP by default when scanning local subnets with root privilege.

**No DNS Resolution (\`-n\`):**
Always combine with host discovery on large ranges to avoid slow reverse DNS lookups.

**Firewall Bypass Strategy:**
When ICMP is blocked, try \`-PS443\`, \`-PA80\`, or \`-PU53\`. Different probes have different chances of passing through firewalls.`,
        commands: [
          { cmd: "nmap -sn 192.168.1.0/24", desc: "Ping sweep, find live hosts without port scanning" },
          { cmd: "nmap -Pn 192.168.1.1", desc: "Skip host discovery, treat host as online" },
          { cmd: "nmap -PE 192.168.1.0/24", desc: "Use ICMP echo requests for host discovery" },
          { cmd: "nmap -PS22,80,443 192.168.1.0/24", desc: "TCP SYN probe on ports 22, 80, 443 for discovery" },
          { cmd: "nmap -PA80,443 192.168.1.1", desc: "TCP ACK probe for discovery (bypasses stateful firewalls)" },
          { cmd: "nmap -sn -n --exclude 192.168.1.1 192.168.1.0/24", desc: "Fast ping sweep excluding gateway, no DNS" },
        ],
        tips: [
          "-sn is the fastest way to map a live network, combine with -n for large subnets",
          "Use -Pn when hosts appear offline but you know they're up (firewall blocking pings)",
          "On local Ethernet networks, Nmap uses ARP automatically, it's more reliable than ICMP",
          "Combine multiple discovery probes: '-PE -PS80,443 -PA' for comprehensive host detection",
        ],
        flashcards: [
          { front: "What does -sn do in Nmap?", back: "Ping sweep, discovers live hosts without port scanning them" },
          { front: "What does -Pn do in Nmap?", back: "Skips host discovery and treats all hosts as online, scan proceeds even if host doesn't respond to pings" },
          { front: "Which discovery probe works best on local Ethernet networks?", back: "ARP ping (-PR), used automatically on local subnets, cannot be blocked by host firewalls" },
          { front: "What TCP probes can Nmap use for host discovery?", back: "-PS (TCP SYN probe) and -PA (TCP ACK probe), a RST or SYN-ACK response indicates the host is online" },
          { front: "Why use -PA (ACK probe) for host discovery?", back: "Some firewalls allow established TCP traffic but block SYN, an ACK probe bypasses stateful firewall rules" },
          { front: "What flag skips DNS reverse resolution?", back: "-n, essential for fast scanning of large ranges" },
        ],
      },
      {
        slug: "port-selection",
        title: "Port Selection & Ranges",
        content: `By default, Nmap scans the 1000 most common TCP ports (according to nmap-services data). Understanding how to control port selection is critical for effective and efficient scanning.

**Default Scan:**
Without any \`-p\` flag, Nmap scans the top 1000 ports ranked by frequency of use in the nmap-services file. This covers the most common services.

**Specific Ports (\`-p\`):**
- Single port: \`-p 80\`
- Multiple ports: \`-p 22,80,443\`
- Range: \`-p 1-1024\`
- All 65535 ports: \`-p-\` or \`-p 1-65535\`
- Mix: \`-p 22,80,100-200,443,8080\`
- Protocol-prefixed: \`-p T:80,U:53\` for TCP 80 and UDP 53 together

**Top N Ports (\`--top-ports\`):**
\`--top-ports 100\` scans the 100 most commonly open ports. \`--top-ports 1000\` is the default. More focused and faster than a full scan.

**Port Ratio (\`--port-ratio\`):**
\`--port-ratio 0.01\` scans only ports with an open frequency greater than 1%. Useful for targeted scans.

**Fast Scan (\`-F\`):**
Scans only the top 100 ports. Significantly faster than the default top 1000.

**Exclude Ports (\`--exclude-ports\`):**
Exclude specific ports from a scan to avoid disrupting sensitive services.

**Common Ports to Know:**
| Port | Protocol | Service |
|------|----------|---------|
| 21 | TCP | FTP |
| 22 | TCP | SSH |
| 23 | TCP | Telnet |
| 25 | TCP | SMTP |
| 53 | TCP/UDP | DNS |
| 80 | TCP | HTTP |
| 110 | TCP | POP3 |
| 443 | TCP | HTTPS |
| 445 | TCP | SMB |
| 3389 | TCP | RDP |`,
        commands: [
          { cmd: "nmap -p 80,443 192.168.1.1", desc: "Scan only ports 80 and 443" },
          { cmd: "nmap -p 1-65535 192.168.1.1", desc: "Full port scan, all 65535 TCP ports" },
          { cmd: "nmap -p- 192.168.1.1", desc: "Short form for all TCP ports scan" },
          { cmd: "nmap -F 192.168.1.1", desc: "Fast scan: top 100 ports only" },
          { cmd: "nmap --top-ports 500 192.168.1.0/24", desc: "Scan the 500 most common ports across subnet" },
          { cmd: "nmap -p T:80,443 -p U:53,161 192.168.1.1", desc: "Scan specific TCP and UDP ports together" },
        ],
        tips: [
          "Use -p- for full port scans in CTFs and penetration tests, services often run on non-standard ports",
          "-F (fast scan, top 100) is useful for quick reconnaissance when time is limited",
          "Always combine full port scans with -T4 or --min-rate to prevent them from taking hours",
          "Non-standard ports above 1024 often indicate backdoors or admin interfaces, always scan -p-",
        ],
        flashcards: [
          { front: "How many ports does Nmap scan by default?", back: "The top 1000 most commonly open TCP ports (ranked by frequency in nmap-services)" },
          { front: "What flag scans all 65535 TCP ports?", back: "-p- or -p 1-65535" },
          { front: "What does -F do in Nmap?", back: "Fast scan, scans only the top 100 most common ports instead of 1000" },
          { front: "How do you scan top 500 ports?", back: "--top-ports 500" },
          { front: "How do you scan both TCP and UDP ports in one command?", back: "Use -sU -sS together, and specify with -p T:80 U:53 for specific protocol ports" },
          { front: "What is the well-known port for RDP?", back: "TCP 3389 (Remote Desktop Protocol)" },
        ],
      },
      {
        slug: "tcp-scan-types",
        title: "TCP Scanning Methods",
        content: `Nmap provides multiple TCP scanning techniques, each with different stealth levels, reliability, and privilege requirements. Understanding which to use in which situation is a key skill.

**SYN Scan (\`-sS\`), Half-open / Stealth Scan:**
The default scan type when run as root. Sends a SYN packet and waits for a response:
- SYN/ACK received → port is **open** (Nmap sends RST, connection never completes)
- RST received → port is **closed**
- No response / ICMP unreachable → port is **filtered**
Faster than Connect scan and less likely to be logged since the three-way handshake is never completed. Requires raw packet privileges.

**TCP Connect Scan (\`-sT\`), Full Connection:**
Uses the OS's \`connect()\` syscall to complete the full TCP three-way handshake. Works without root privileges. More likely to be logged by target firewalls and applications. Slower than SYN scan. Used when raw packet access is unavailable.

**ACK Scan (\`-sA\`), Firewall Rule Mapping:**
Sends ACK packets (which appear to be part of established sessions). Always returns RST (port never appears open). Used to determine if ports are **filtered** or **unfiltered** (not to find open ports). Excellent for mapping stateful firewall rules.

**NULL Scan (\`-sN\`):**
Sends a TCP segment with no flags set. Open/filtered ports give no response; closed ports return RST. Bypasses some non-stateful packet filters and can evade certain IDSes. May not work against Windows targets (which ignore the RFC 793 spec).

**FIN Scan (\`-sF\`):**
Sends a TCP FIN packet. Similar behavior to NULL: closed ports respond with RST, open ports are silent. Can bypass some firewalls. Doesn't work reliably on Windows.

**XMAS Scan (\`-sX\`):**
Sets FIN, PSH, and URG flags (lights up like a Christmas tree). Same behavior as NULL/FIN. Historical IDS evasion technique; modern IDSes detect it.

**Maimon Scan (\`-sM\`):**
Sends FIN/ACK. Similar to NULL/FIN/XMAS. Originally worked on some BSD systems.

**Window Scan (\`-sW\`):**
Same as ACK but uses the TCP window size to differentiate open vs. closed (exploits a quirk in some TCP implementations). Works on a small number of systems.`,
        commands: [
          { cmd: "sudo nmap -sS 192.168.1.1", desc: "SYN (stealth) scan, default when root" },
          { cmd: "nmap -sT 192.168.1.1", desc: "TCP Connect scan, no root needed" },
          { cmd: "sudo nmap -sA 192.168.1.1", desc: "ACK scan, maps firewall rules" },
          { cmd: "sudo nmap -sN 192.168.1.1", desc: "NULL scan, no TCP flags set" },
          { cmd: "sudo nmap -sF 192.168.1.1", desc: "FIN scan, only FIN flag set" },
          { cmd: "sudo nmap -sX 192.168.1.1", desc: "XMAS scan, FIN, PSH, URG flags set" },
        ],
        tips: [
          "SYN scan (-sS) is the default and best choice in most situations, fast, stealthy, reliable",
          "Use -sT when you don't have root access or when scanning through certain proxies",
          "NULL/FIN/XMAS scans don't work on Windows hosts, always verify the target OS first",
          "ACK scan (-sA) is not for finding open ports, it's specifically for firewall rule analysis",
        ],
        flashcards: [
          { front: "Why is SYN scan (-sS) called a 'half-open' or 'stealth' scan?", back: "Because the TCP three-way handshake is never completed, Nmap sends RST after receiving SYN/ACK, so no full connection is logged by most applications" },
          { front: "What scan type works without root privileges?", back: "TCP Connect scan (-sT), uses the OS connect() syscall" },
          { front: "What is the purpose of ACK scan (-sA)?", back: "To map firewall rules, determines if ports are filtered or unfiltered, not to find open ports" },
          { front: "What flags does an XMAS scan set?", back: "FIN, PSH, and URG, three TCP flags set simultaneously" },
          { front: "Why don't NULL/FIN/XMAS scans work on Windows?", back: "Windows ignores packets with unexpected flag combinations rather than responding per RFC 793, all ports appear closed|filtered" },
          { front: "What response indicates a closed port in a SYN scan?", back: "RST (TCP reset), the host acknowledges the port exists but no service is listening" },
        ],
      },
    ],
  },

  // ─── Domain 3: Advanced Scanning ─────────────────────────────────────────────
  {
    key: "advanced-scanning",
    name: "Advanced Scanning",
    level: "intermediate",
    topics: [
      {
        slug: "udp-scanning",
        title: "UDP Scanning",
        content: `UDP scanning is one of the most challenging aspects of network reconnaissance because UDP is a connectionless protocol, there is no handshake to reliably detect an open port.

**How UDP Scan Works (\`-sU\`):**
Nmap sends a UDP packet to each target port. The response determines the state:
- ICMP port unreachable (type 3, code 3) → port is **closed**
- ICMP unreachable error (type 3, code 1/2/9/10/13) → port is **filtered**
- Any UDP response → port is **open**
- No response → port is **open|filtered** (most common result)

**Why UDP is Slow:**
Because no response = open|filtered, Nmap must wait for timeouts. The Linux kernel also rate-limits ICMP unreachable messages to ~1/second by default, which makes scanning 65535 UDP ports take over 18 hours. Nmap works around this by tracking and throttling its probe rate.

**Optimization Strategies:**
1. Limit to common UDP ports: \`-sU --top-ports 20\`
2. Combine with version detection: \`-sU -sV\`, some UDP services respond to specific protocol probes (NSE scripts)
3. Use higher timing: \`-sU -T4\`
4. Combine with TCP: \`-sSU -T4 -p T:1-1000,U:53,67,68,69,161,162\`

**Important UDP Services:**
| Port | Service |
|------|---------|
| 53 | DNS |
| 67/68 | DHCP |
| 69 | TFTP |
| 123 | NTP |
| 161/162 | SNMP |
| 514 | Syslog |
| 1194 | OpenVPN |

**SNMP (UDP 161) is particularly valuable:**
SNMP can leak enormous amounts of system info if community strings are default ("public", "private"). Always scan UDP 161.`,
        commands: [
          { cmd: "sudo nmap -sU 192.168.1.1", desc: "UDP scan on top 1000 UDP ports" },
          { cmd: "sudo nmap -sU --top-ports 20 192.168.1.1", desc: "Fast UDP scan of 20 most common UDP ports" },
          { cmd: "sudo nmap -sU -sS -p T:22,80,443 -p U:53,161 192.168.1.1", desc: "Combine TCP SYN and UDP scans" },
          { cmd: "sudo nmap -sU -sV --version-intensity 0 192.168.1.1", desc: "UDP with lightweight version detection" },
          { cmd: "sudo nmap -sU -T4 --open 192.168.1.1", desc: "Fast UDP scan showing only open ports" },
        ],
        tips: [
          "UDP scanning is extremely slow, always limit scope with --top-ports 20 or specific ports",
          "SNMP (UDP 161) and DNS (UDP 53) are among the highest-value targets, always scan them",
          "Combine -sU with -sV to help identify open|filtered ports through protocol-specific probes",
          "Use -T4 with UDP scans to reduce wait times, but be aware of rate limits on the target",
        ],
        flashcards: [
          { front: "Why is UDP scanning slower than TCP scanning?", back: "UDP is connectionless, no response means open|filtered (Nmap can't tell). Must wait for timeouts and is limited by ICMP rate limiting" },
          { front: "What response indicates a closed UDP port?", back: "ICMP port unreachable message (type 3, code 3)" },
          { front: "What does 'open|filtered' mean in UDP scanning?", back: "Nmap received no response, the port could be open (application silently drops probe) or filtered (firewall blocking)" },
          { front: "Which high-value service runs on UDP 161?", back: "SNMP (Simple Network Management Protocol), can expose vast system information if using default community strings" },
          { front: "How do you combine TCP SYN and UDP scanning in one command?", back: "sudo nmap -sS -sU [target], both scan types run simultaneously" },
          { front: "What flag limits UDP scan to the top 20 common ports?", back: "--top-ports 20" },
        ],
      },
      {
        slug: "service-version-detection",
        title: "Service & Version Detection",
        content: `Service and version detection allows Nmap to go beyond identifying open ports and determine exactly what software and version is running on each port. This is critical for identifying vulnerable software versions.

**Version Detection (\`-sV\`):**
After discovering open ports, Nmap sends protocol-specific probes and matches responses against the \`nmap-service-probes\` database (thousands of signatures). Output includes:
- Service name (e.g., "Apache httpd")
- Version number (e.g., "2.4.50")
- Extra info (e.g., "(Ubuntu)")
- Confidence level

**Intensity Levels (\`--version-intensity 0-9\`):**
Controls how aggressively Nmap probes:
- \`0\`, only light probes, fastest
- \`5\`, default
- \`9\`, all probes, slowest but most thorough

**Light/Default/All shortcuts:**
- \`--version-light\` → intensity 2
- \`--version-all\` → intensity 9

**Aggressive Scan (\`-A\`):**
Enables version detection (-sV), OS detection (-O), script scanning (-sC), and traceroute in one flag. The go-to for comprehensive scanning.

**Banner Grabbing:**
Version detection often captures service banners, the text a service sends when you connect. Banners can reveal software name, version, and OS. Nmap also uses version probes to trigger more specific responses.

**CPE (Common Platform Enumeration):**
Version detection output often includes CPE strings (e.g., \`cpe:/a:apache:http_server:2.4.50\`) which can be used to look up CVEs in vulnerability databases.

**Practical Example:**
\`nmap -sV --version-intensity 7 -p 22,80,443 192.168.1.1\`
This might return: \`22/tcp open ssh OpenSSH 8.2p1 Ubuntu (protocol 2.0)\``,
        commands: [
          { cmd: "nmap -sV 192.168.1.1", desc: "Version detection on all discovered open ports" },
          { cmd: "nmap -sV --version-intensity 9 192.168.1.1", desc: "Maximum version intensity, most thorough" },
          { cmd: "nmap -sV --version-light 192.168.1.1", desc: "Lightweight version detection, faster" },
          { cmd: "nmap -A 192.168.1.1", desc: "Aggressive: version + OS + scripts + traceroute" },
          { cmd: "nmap -sV -p 22,80,443,8080 192.168.1.0/24", desc: "Version detection on specific ports across subnet" },
          { cmd: "nmap -sV --version-all 192.168.1.1", desc: "Try all version probes (intensity 9)" },
        ],
        tips: [
          "Always run -sV on discovered open ports, version numbers directly map to CVEs",
          "-A is convenient for complete scans but is noisy, use it for targeted hosts, not large subnets",
          "Lower --version-intensity for UDP scans where you just need a rough service identification",
          "CPE strings in -sV output can be fed directly into vulnerability databases like NVD/CVE",
        ],
        flashcards: [
          { front: "What flag enables service and version detection in Nmap?", back: "-sV, sends service-specific probes and matches responses against the nmap-service-probes database" },
          { front: "What does --version-intensity 9 do?", back: "Tries all available version probes, most thorough but slowest" },
          { front: "What does the -A flag enable in Nmap?", back: "Aggressive mode: OS detection (-O), version detection (-sV), script scanning (-sC), and traceroute" },
          { front: "What is a CPE string in Nmap output?", back: "Common Platform Enumeration, a standardized identifier like cpe:/a:apache:http_server:2.4.50, useful for CVE lookups" },
          { front: "What is banner grabbing in the context of Nmap?", back: "Capturing the text a service sends upon connection, reveals software name, version, and sometimes OS information" },
          { front: "What is the default version intensity level for -sV?", back: "5 (scale of 0-9)" },
        ],
      },
      {
        slug: "os-detection",
        title: "OS Detection",
        content: `OS detection allows Nmap to determine the operating system, version, and sometimes the device type of a target by analyzing responses to carefully crafted probe packets. This capability relies on the fact that different OS TCP/IP stack implementations respond to unusual packets in different ways.

**Enabling OS Detection (\`-O\`):**
Nmap sends a series of TCP, UDP, and ICMP probes to an open and a closed port on the target. It analyzes:
- TCP ISN (Initial Sequence Number) generation patterns
- TCP options and their ordering (MSS, SACK, timestamps, window size)
- ICMP response characteristics
- IP TTL and window size values

**Requirements:**
- At least one open and one closed TCP port must be found (use \`-p 1-1000\` or ensure ports are in scope)
- Requires root/administrator privileges

**OS Guess Confidence:**
Results show a confidence percentage and multiple possible OS matches ranked by likelihood. A 96%+ match is considered reliable. Lower confidence = OS is unusual or behind a firewall/NAT.

**Aggressive OS Detection (\`--osscan-guess\` / \`--fuzzy\`):**
Forces Nmap to report its best OS guess even when confidence is low. Useful as a starting point but results may be inaccurate.

**Limiting OS Detection (\`--osscan-limit\`):**
Skip OS detection on hosts that don't have both an open and closed port. Speeds up large-range scans.

**-A Flag:**
Combines OS detection, version detection, scripts, and traceroute. The most comprehensive single-flag option.

**Device Type Detection:**
Along with OS, Nmap often reports device type: general purpose, router, firewall, webcam, phone, etc. Useful for network mapping.

**Limitations:**
- Firewalls and NAT devices can skew OS fingerprinting
- Virtual machines and containers may report the hypervisor's TCP stack
- IDS systems may detect OS fingerprinting probes`,
        commands: [
          { cmd: "sudo nmap -O 192.168.1.1", desc: "Enable OS detection" },
          { cmd: "sudo nmap -O --osscan-guess 192.168.1.1", desc: "OS detection with best-guess even at low confidence" },
          { cmd: "sudo nmap -A 192.168.1.1", desc: "Aggressive: OS + version + scripts + traceroute" },
          { cmd: "sudo nmap -O --osscan-limit 192.168.1.0/24", desc: "OS detection across subnet, skipping ambiguous hosts" },
          { cmd: "sudo nmap -O -p 1-1000 192.168.1.1", desc: "Ensure enough ports are scanned for OS detection" },
        ],
        tips: [
          "OS detection needs at least one open AND one closed port, scan more ports if results are inconclusive",
          "NAT devices and firewalls can make all hosts on a LAN look like the same OS, verify results",
          "Use --osscan-guess when you need any result, but treat low-confidence guesses as hints only",
          "Virtual machines often fingerprint as the host OS or show hypervisor characteristics",
        ],
        flashcards: [
          { front: "What flag enables OS detection in Nmap?", back: "-O, analyzes TCP/IP stack responses to identify the target OS and version" },
          { front: "What does Nmap need to perform accurate OS detection?", back: "At least one open and one closed TCP port, plus root/administrator privileges" },
          { front: "What does --osscan-guess do?", back: "Forces Nmap to report its best OS guess even when confidence is below the normal threshold" },
          { front: "Why might OS detection give incorrect results behind a NAT?", back: "NAT devices modify packet headers, making all internal hosts appear to have the same TCP/IP characteristics" },
          { front: "What four things does -A enable?", back: "OS detection (-O), version detection (-sV), default scripts (-sC), and traceroute (--traceroute)" },
          { front: "What does Nmap analyze for OS detection?", back: "TCP ISN patterns, TCP option ordering, ICMP response characteristics, TTL values, and TCP window sizes" },
        ],
      },
    ],
  },

  // ─── Domain 4: NSE & Performance ─────────────────────────────────────────────
  {
    key: "nse-performance",
    name: "NSE & Performance",
    level: "intermediate",
    topics: [
      {
        slug: "nse-basics",
        title: "Nmap Scripting Engine (NSE)",
        content: `The Nmap Scripting Engine (NSE) extends Nmap's capabilities far beyond basic port scanning. Written in Lua, NSE scripts can automate vulnerability detection, service enumeration, brute forcing, backdoor detection, and much more.

**Script Categories:**
Scripts are organized into categories. A script can belong to multiple categories:
- \`auth\`, authentication bypass and credential testing
- \`broadcast\`, discover hosts via broadcast messages
- \`brute\`, brute-force credential attacks
- \`default\`, run when using -sC or -A (safe, useful scripts)
- \`discovery\`, service information gathering
- \`dos\`, denial-of-service attacks (dangerous, use with extreme caution)
- \`exploit\`, actively exploit vulnerabilities
- \`external\`, contact third-party databases (Shodan, DNS, WHOIS)
- \`fuzzer\`, send malformed packets for fuzzing
- \`intrusive\`, likely to crash services or be logged, not in default
- \`malware\`, detect malware backdoors
- \`safe\`, unlikely to crash services or be logged
- \`version\`, help identify service versions
- \`vuln\`, check for known vulnerabilities

**Running Scripts:**
- \`-sC\`, run default scripts (same as \`--script=default\`)
- \`--script=<name>\`, run a specific script: \`--script=http-title\`
- \`--script=<category>\`, run all scripts in a category: \`--script=vuln\`
- \`--script=<pattern>\`, wildcard: \`--script=http-*\`
- \`--script-args key=value\`, pass arguments to scripts

**Script Location:**
Scripts are in \`/usr/share/nmap/scripts/\` on Linux. Use \`nmap --script-updatedb\` after adding custom scripts.

**Useful Default Scripts:**
- \`http-title\`, grabs HTML page title
- \`ssl-cert\`, retrieves TLS certificate info
- \`smb-os-discovery\`, SMB OS fingerprinting
- \`ftp-anon\`, check for anonymous FTP access
- \`ssh-hostkey\`, retrieve SSH host keys`,
        commands: [
          { cmd: "nmap -sC 192.168.1.1", desc: "Run default NSE scripts" },
          { cmd: "nmap --script=vuln 192.168.1.1", desc: "Run all vulnerability detection scripts" },
          { cmd: "nmap --script=http-title 192.168.1.0/24", desc: "Grab HTTP page titles across subnet" },
          { cmd: "nmap --script=ftp-anon -p 21 192.168.1.1", desc: "Check for anonymous FTP access" },
          { cmd: "nmap --script=smb-os-discovery -p 445 192.168.1.1", desc: "SMB OS discovery" },
          { cmd: "nmap --script=ssh-brute --script-args userdb=users.txt,passdb=pass.txt -p 22 192.168.1.1", desc: "SSH brute force with custom wordlists" },
        ],
        tips: [
          "Always use --script=vuln with caution, some scripts are intrusive and may crash services",
          "The default category (-sC) is designed to be safe and useful, a good starting point",
          "Use ls /usr/share/nmap/scripts/ | grep <keyword> to find scripts for a specific service",
          "nmap --script-help <scriptname> shows documentation and usage for any script",
        ],
        flashcards: [
          { front: "What flag runs the default NSE scripts in Nmap?", back: "-sC or --script=default, runs scripts in the 'default' category (safe and useful)" },
          { front: "What language are NSE scripts written in?", back: "Lua" },
          { front: "What script category checks for known vulnerabilities?", back: "vuln, run with --script=vuln" },
          { front: "What does the 'brute' script category do?", back: "Performs brute-force credential attacks against login services" },
          { front: "Where are NSE scripts stored on Linux?", back: "/usr/share/nmap/scripts/" },
          { front: "How do you run all scripts matching http-*?", back: "--script=http-* (wildcard pattern matching)" },
          { front: "What is a dangerous NSE category to use without authorization?", back: "exploit and dos, they actively exploit vulnerabilities or cause denial of service" },
        ],
      },
      {
        slug: "timing-performance",
        title: "Timing & Performance",
        content: `Nmap's timing controls let you balance scan speed against stealth, accuracy, and network impact. Understanding timing is essential for both efficient legitimate scanning and evasive penetration testing.

**Timing Templates (\`-T0\` to \`-T5\`):**
Nmap provides six timing templates that adjust multiple timing parameters simultaneously:

| Template | Name | Use Case |
|----------|------|----------|
| \`-T0\` | Paranoid | IDS evasion, sends one packet every 5 minutes |
| \`-T1\` | Sneaky | Slow IDS evasion, one packet every 15 seconds |
| \`-T2\` | Polite | Minimal network impact, slows scan by 10x |
| \`-T3\` | Normal | Default, balanced speed and reliability |
| \`-T4\` | Aggressive | Faster scans on reliable networks (LAN/fast internet) |
| \`-T5\` | Insane | Maximum speed, may miss results on slow networks |

**Fine-Grained Control:**
- \`--min-rate <n>\`, send at least n packets per second
- \`--max-rate <n>\`, send at most n packets per second
- \`--max-retries <n>\`, limit probe retransmissions (default varies, use 2 for speed)
- \`--max-rtt-timeout <time>\`, maximum round-trip timeout
- \`--min-hostgroup <n>\`, scan at least n hosts in parallel
- \`--max-hostgroup <n>\`, scan at most n hosts in parallel
- \`--max-parallelism <n>\`, cap the number of parallel probes

**Recommended Combinations:**
- Fast legitimate scan: \`-T4 --min-rate 1000 --max-retries 3\`
- Full stealth: \`-T1 -f --data-length 24\`
- Quick sweep: \`-T4 -F\` (top 100 ports quickly)
- Full TCP: \`-p- -T4 --min-rate 5000\`

**Why -T4 is common:**
-T4 is the recommended setting for most modern networks. It sets aggressive but not extreme timing, and is suitable for pentests on LANs and cloud instances.

**Timing and IDS:**
-T0 and -T1 spread packets over long periods to avoid triggering IDS threshold-based alerts. However, modern behavioral IDS systems can still detect slow scans.`,
        commands: [
          { cmd: "nmap -T4 192.168.1.0/24", desc: "Aggressive timing, good for reliable networks" },
          { cmd: "nmap -T0 192.168.1.1", desc: "Paranoid timing, maximum stealth (very slow)" },
          { cmd: "nmap -T4 --min-rate 1000 192.168.1.0/24", desc: "Minimum 1000 packets/sec with aggressive timing" },
          { cmd: "nmap -p- -T4 --min-rate 5000 192.168.1.1", desc: "Fast full-port scan with rate control" },
          { cmd: "nmap --max-retries 2 -T4 192.168.1.0/24", desc: "Limit retransmissions for speed" },
          { cmd: "nmap -T4 --max-rtt-timeout 100ms 192.168.1.1", desc: "Cap round-trip timeout for faster scans" },
        ],
        tips: [
          "-T4 is the recommended default for most penetration tests on reliable networks",
          "Use -T1 or -T2 only when stealth is more important than speed",
          "--min-rate with -p- is the standard way to do fast full-port scans in CTFs",
          "Never use -T5 in production environments, it will saturate links and may crash services",
        ],
        flashcards: [
          { front: "What does -T4 mean in Nmap?", back: "Aggressive timing template, faster scans suitable for reliable/local networks" },
          { front: "What is the slowest Nmap timing template and why would you use it?", back: "-T0 (Paranoid), sends one packet every 5 minutes to evade IDS threshold detection" },
          { front: "What flag sets a minimum packet send rate?", back: "--min-rate <n>, sends at least n packets per second" },
          { front: "What is the default timing template?", back: "-T3 (Normal)" },
          { front: "How do you reduce retransmissions to speed up a scan?", back: "--max-retries <n>, limits how many times a probe is resent (e.g., --max-retries 2)" },
          { front: "What flag caps the maximum packet send rate?", back: "--max-rate <n>, useful to avoid overwhelming a target or triggering rate-limiting" },
        ],
      },
    ],
  },

  // ─── Domain 5: Evasion & Output ───────────────────────────────────────────────
  {
    key: "evasion-output",
    name: "Evasion & Output",
    level: "advanced",
    topics: [
      {
        slug: "output-formats",
        title: "Output Formats & Reporting",
        content: `Nmap supports multiple output formats to suit different workflows, from human-readable text to machine-parseable XML. Proper output management is essential for documentation, automation, and integration with other tools.

**Normal Output (\`-oN\`):**
Saves the standard readable output to a file. Same as what's printed to the terminal. Useful for reports and manual review.

**XML Output (\`-oX\`):**
Structured XML format that is machine-parseable. Integrates with tools like Metasploit, Faraday, and other vulnerability management platforms. Can be converted to HTML with Nmap's XSL stylesheet.

**Grepable Output (\`-oG\`):**
A flat, grep-friendly format where each host/port is on a single line. Easy to process with standard Unix tools like grep, awk, and cut. Example: \`# Ports: 22/open/tcp//ssh///\`

**Script Kiddie Output (\`-oS\`):**
"Script kiddie" style with random capitalization and substitutions. Not useful in practice.

**All Formats (\`-oA\`):**
Saves normal, XML, and grepable simultaneously with a common basename. \`nmap -oA scan_results 192.168.1.0/24\` creates \`scan_results.nmap\`, \`scan_results.xml\`, \`scan_results.gnmap\`.

**Verbosity and Debugging:**
- \`-v\` / \`-vv\`, increase verbosity (shows results as they come in)
- \`-d\` / \`-dd\`, debug mode (very detailed, for troubleshooting)
- \`--reason\`, show why each port was assigned its state
- \`--open\`, only show open ports
- \`--stats-every <time>\`, print progress stats every n seconds (e.g., \`--stats-every 30s\`)
- \`--packet-trace\`, show all packets sent and received

**Practical Workflow:**
Always save output when doing professional assessments:
\`sudo nmap -sS -sV -sC -O -T4 -oA client_scan 192.168.1.0/24\`

This saves three format files and gives comprehensive results. XML can be imported into reporting tools.`,
        commands: [
          { cmd: "nmap -oN scan.txt 192.168.1.1", desc: "Save normal output to file" },
          { cmd: "nmap -oX scan.xml 192.168.1.1", desc: "Save XML output for tool integration" },
          { cmd: "nmap -oG scan.gnmap 192.168.1.1", desc: "Save grepable output" },
          { cmd: "nmap -oA full_scan 192.168.1.0/24", desc: "Save all three formats at once" },
          { cmd: "nmap -v --open --reason 192.168.1.1", desc: "Verbose with only open ports and state reasons" },
          { cmd: "nmap -T4 -p- --stats-every 30s 192.168.1.1", desc: "Full port scan with progress updates every 30s" },
        ],
        tips: [
          "Always use -oA on professional engagements, save all formats for maximum flexibility later",
          "-oX is essential when importing results into Metasploit, Faraday, or other security platforms",
          "Use -oG with grep to quickly extract hosts with a specific open port from a large scan",
          "Add -v to long-running scans so you can see results in real-time instead of waiting",
        ],
        flashcards: [
          { front: "What flag saves all three output formats simultaneously?", back: "-oA <basename>, creates .nmap (normal), .xml, and .gnmap (grepable) files" },
          { front: "Which Nmap output format is best for importing into Metasploit?", back: "XML (-oX), machine-parseable and directly supported by many security tools" },
          { front: "What is grepable output (-oG) useful for?", back: "Processing with grep/awk/cut to extract specific information like all hosts with port 80 open" },
          { front: "What does --reason show?", back: "The specific reason Nmap assigned a port state (e.g., syn-ack → open, reset → closed, no-response → filtered)" },
          { front: "How do you show progress updates during a long scan?", back: "--stats-every <interval> (e.g., --stats-every 30s)" },
          { front: "What flag shows only open ports in output?", back: "--open" },
        ],
      },
      {
        slug: "firewall-evasion",
        title: "Firewall/IDS Evasion",
        content: `**Authorization Required — Every Technique in This Module**

Using evasion techniques against systems you do not own or do not have written permission to test is illegal in most jurisdictions. This includes decoy scans, idle scans, source IP spoofing, and source port manipulation. The Computer Fraud and Abuse Act (US), Computer Misuse Act (UK), and equivalent laws worldwide treat unauthorized scanning as a criminal offence, even if no data is stolen. Use these only in authorized penetration tests, your own lab, or dedicated practice ranges like HackTheBox and TryHackMe.

Nmap includes several techniques designed to bypass firewalls, evade intrusion detection systems (IDS), and obscure the source of a scan. These are critical skills in penetration testing but must only be used against systems you have explicit authorization to test.

**Packet Fragmentation (\`-f\`):**
Splits IP packets into tiny 8-byte fragments. Many older firewalls and packet filters can't reassemble fragments for inspection. Double fragmentation (\`-ff\` or \`--mtu 16\`) uses 16-byte fragments. Requires raw socket access.

**Decoy Scanning (\`-D\`):**
Sends scan packets that appear to come from multiple IP addresses simultaneously. Real scan mixed with decoy traffic: \`-D RND:10\` uses 10 random decoys, \`-D 192.168.1.5,ME,192.168.1.7\` places your real IP (ME) among two decoys. The target sees multiple scanners and can't easily identify the real source. Doesn't work with OS detection or version scanning.

**Source IP Spoofing (\`-S\`):**
Spoof the source IP address. Requires specifying an interface (\`-e eth0\`) and disabling ICMP pings (\`-Pn\`). Results won't be received (RSTs go to the spoofed IP). Useful to attribute scans to a specific IP or for idle scans.

**Source Port Manipulation (\`--source-port\` / \`-g\`):**
Some firewalls allow traffic from trusted source ports (DNS port 53, HTTP 80). \`--source-port 53\` may bypass rules that trust DNS return traffic. Many firewalls are vulnerable to this.

**Random Data Length (\`--data-length\`):**
Appends random padding bytes to packets to make them appear less like Nmap probes. Hides the characteristic small packet sizes.

**MAC Spoofing (\`--spoof-mac\`):**
Change source MAC address: \`--spoof-mac 0\` uses a random MAC, \`--spoof-mac Apple\` generates a MAC with Apple's OUI. Effective on local network segments only.

**Idle Scan / Zombie Scan (\`-sI\`):**
One of the most advanced and stealthy scan types. Uses a "zombie" host (a quiet machine with predictable IP ID increments) to perform a port scan. The target never sees your real IP. Fully blind scan: \`nmap -sI zombie_ip target_ip\`.

**Proxies (\`--proxies\`):**
Route Nmap traffic through HTTP/SOCKS4 proxies. Useful for attribution hiding.

**Firewall ACK Bypass (\`-sA\`):**
ACK packets often pass through firewalls that only filter incoming SYN packets (stateless firewalls). Useful to map which ports are reachable.`,
        commands: [
          { cmd: "sudo nmap -f 192.168.1.1", desc: "Fragment packets into 8-byte chunks" },
          { cmd: "sudo nmap -D RND:10 192.168.1.1", desc: "Use 10 random decoy IPs to mask your scan" },
          { cmd: "sudo nmap -D 10.0.0.1,ME,10.0.0.3 192.168.1.1", desc: "Decoy scan with your real IP among decoys" },
          { cmd: "sudo nmap --source-port 53 192.168.1.1", desc: "Spoof source port as DNS (53) to bypass ACLs" },
          { cmd: "sudo nmap --data-length 24 192.168.1.1", desc: "Append 24 random bytes to packets" },
          { cmd: "sudo nmap --spoof-mac 0 192.168.1.1", desc: "Use a random spoofed MAC address" },
          { cmd: "sudo nmap -sI zombie_host target_host", desc: "Idle scan, scan target through zombie host" },
        ],
        tips: [
          "Fragmentation (-f) is less effective against modern firewalls with full reassembly; still works on legacy systems",
          "Decoy scans (-D) don't hide your IP perfectly, the real IP must be present to receive responses",
          "Source port 53 (--source-port 53) is one of the most effective simple ACL bypasses",
          "Idle scan (-sI) is the gold standard for anonymous scanning but requires finding a suitable zombie host",
          "Always confirm you have authorization before using evasion techniques, they may constitute illegal activity",
        ],
        flashcards: [
          { front: "What does -f do in Nmap?", back: "Fragments IP packets into 8-byte chunks to bypass packet filters that can't reassemble fragments" },
          { front: "What is a decoy scan (-D) in Nmap?", back: "Sends scan packets appearing to come from multiple IPs simultaneously, making it hard to identify the real scanner" },
          { front: "What is an idle scan (-sI)?", back: "Uses a quiet zombie host with predictable IP IDs to scan a target anonymously, the target never sees the real scanner's IP" },
          { front: "Why does --source-port 53 help bypass some firewalls?", back: "Some firewall ACLs allow traffic from source port 53 (DNS) as it appears to be DNS reply traffic" },
          { front: "What does --data-length do?", back: "Appends random padding bytes to packets, making them appear less like typical Nmap probe packets to IDS systems" },
          { front: "What does --spoof-mac 0 do?", back: "Uses a randomly generated MAC address as the source MAC (only effective on local Ethernet segments)" },
        ],
      },
    ],
  },
];

export const NMAP_TOTAL_FLASHCARDS = NMAP_STUDY.reduce(
  (sum, d) => sum + d.topics.reduce((s, t) => s + t.flashcards.length, 0),
  0
);

export const NMAP_TOTAL_TOPICS = NMAP_STUDY.reduce(
  (sum, d) => sum + d.topics.length,
  0
);
