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
            front: "In TLS 1.3, what is the SNI and why does it matter for SOC visibility?",
            back: "SNI = Server Name Indication. It's a field in the cleartext ClientHello that tells the server which hostname the client wants. SOC analysts use SNI to identify destination websites even though all subsequent payload is encrypted (no DPI possible).",
          },
          {
            front: "How does DNS amplification work?",
            back: "Attacker spoofs the source IP of a DNS query to the victim's IP, then queries an open DNS resolver for a large response (e.g. ANY record). The resolver sends the large response to the victim, multiplying the attack volume 50–100×.",
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
            front: "What is MFA fatigue and how does an attacker exploit it?",
            back: "MFA fatigue = attacker triggers repeated MFA push notifications until the target gets annoyed and approves one to stop the spam. The attacker is now logged in. Examples: Uber 2022, Cisco 2022. Mitigation: number matching, push-to-confirm, hardware tokens.",
          },
          {
            front: "What are the 3 insider threat archetypes?",
            back: "(1) Malicious — intentionally damages org (rare, high impact). (2) Negligent — clicks phishing, ignores policy (most common). (3) Compromised — credentials stolen by external attacker (e.g. Twitter Hack 2020).",
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
            front: "What is the canonical Emotet kill chain that ends in ransomware?",
            back: "Phish (macro doc) → user enables macro → PowerShell download cradle → Emotet loader → TrickBot (data theft + lateral movement) → Cobalt Strike (C2) → Ryuk ransomware (or Conti). Dwell time before ransomware: 30–90 days.",
          },
          {
            front: "Why is 'winword.exe spawning cmd.exe or powershell.exe' a critical detection signal?",
            back: "Microsoft Office almost never legitimately needs to spawn cmd/powershell as a child process. This parent-child anomaly is one of the highest-signal endpoint detections for macro-based malware. EDR + Sysmon EID 1 + parent-process correlation catches this.",
          },
          {
            front: "Name 3 typical Office macro persistence mechanisms on Windows.",
            back: "(1) Registry Run keys (HKCU/HKLM\\...\\Run, T1547.001). (2) Scheduled Tasks (T1053.005). (3) WMI Event Subscription (T1546.003). Also seen: Startup folder LNK, services (T1543.003).",
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
            front: "What does SwiftOnSecurity's sysmon-config do that out-of-box Sysmon doesn't?",
            back: "Filters noise from chatty Windows internal processes, logs the high-value events (process create with parent, network connections from non-system processes, registry persistence keys, DLL loads from suspicious paths). Community-tuned starting point; better than nothing, easier than writing your own.",
          },
          {
            front: "What is Atomic Red Team and what's it used for?",
            back: "Atomic Red Team (by Red Canary) is a free library of small, atomic tests that simulate specific MITRE ATT&CK techniques. SOC analysts use it to: (1) verify detection rules fire on real technique execution; (2) practice writing detections; (3) measure coverage. Each 'atomic' maps to one ATT&CK technique ID.",
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
            front: "What is the WannaCry kill switch and how was it discovered?",
            back: "WannaCry checks if 'iuqerfsodp9ifjaposdfjhgosurijfaewrwergwea.com' resolves. If it does → assume sandbox → exit (no encryption). Marcus Hutchins (MalwareTech) found the domain in the malware strings, registered it for $10.69 to track infections, and accidentally globally killed the worm.",
          },
          {
            front: "What does Suricata's 'eve.json' contain, and how do you read it efficiently?",
            back: "eve.json is Suricata's structured-JSON event log. One JSON object per line. Event types: alert, dns, http, tls, flow, fileinfo. Read efficiently with jq, e.g.: jq 'select(.event_type==\"alert\") | {time:.timestamp, sig:.alert.signature, src:.src_ip, dst:.dest_ip}'",
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
