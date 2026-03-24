export type StaticTopic = {
  id: number;
  slug: string;
  title: string;
  studyPath: string;
  content: string;
  keyTerms: string[];
  examples: string[];
  tips: string[];
};

export type StaticDomain = {
  id: number;
  key: string;
  name: string;
  weightPct: number;
  topics: StaticTopic[];
};

const topic = (
  id: number,
  slug: string,
  title: string,
  domainName: string,
  objectiveCoverage: string[],
  keyTerms: string[],
  examples: string[],
  tips: string[],
): StaticTopic => ({
  id,
  slug,
  title,
  studyPath: `/study#${slug}`,
  content: `## ${title}\n${title} is part of ${domainName} in SY0-701. Focus on when to apply each control and how to choose the best mitigation under exam constraints.\n\nObjective coverage:\n${objectiveCoverage.map((line) => `- ${line}`).join("\n")}`,
  keyTerms,
  examples,
  tips,
});

export const STATIC_SYLLABUS: StaticDomain[] = [
  {
    id: 1,
    key: "general-security-concepts",
    name: "General Security Concepts",
    weightPct: 12,
    topics: [
      topic(1, "security-controls-types", "Security Control Types and Categories", "General Security Concepts", ["Technical, managerial, and operational controls", "Preventive, detective, corrective, deterrent, and compensating controls", "Directive and physical controls"], ["preventive control", "detective control", "compensating control", "directive control"], ["MFA is preventive while SIEM alerting is detective.", "Legacy systems often require compensating controls with segmentation."], ["Use PDC (Preventive-Detective-Corrective) to classify controls quickly.", "For BEST-answer questions, prioritize defense in depth over single controls."]),
      topic(2, "cia-aaa-nonrepudiation", "CIA, AAA, and Non-repudiation", "General Security Concepts", ["Confidentiality, integrity, and availability", "Authentication, authorization, accounting", "Non-repudiation through signatures and evidence"], ["CIA triad", "AAA", "non-repudiation", "audit trail"], ["File integrity monitoring protects integrity objectives.", "Digital signatures plus logs provide non-repudiation."], ["Map requirements to CIA first before selecting tools.", "Accounting answers usually involve traceable logs and retention."]),
      topic(3, "zero-trust-and-deception", "Zero Trust and Deception", "General Security Concepts", ["Never trust, always verify", "Microsegmentation and contextual access", "Honeypots and honeytokens as detection tools"], ["zero trust", "microsegmentation", "honeypot", "honeytoken"], ["A honeytoken credential triggers high-priority IR workflow.", "Microsegmentation limits lateral movement between workloads."], ["If identity context is emphasized, zero trust is usually expected.", "Deception controls are high-signal detective mechanisms."]),
      topic(4, "secure-protocols-and-services", "Secure Protocols and Services", "General Security Concepts", ["Secure protocol selection for network services", "Legacy protocol replacement", "Certificate-backed trust"], ["TLS", "SSH", "IPsec", "certificate chain"], ["SSH replaces Telnet for secure remote admin.", "HTTPS with valid cert chain protects user sessions."], ["Prefer encrypted protocol alternatives in all options.", "Disable deprecated protocol versions and weak ciphers."]),
      topic(5, "pki-certificates-lifecycle", "PKI and Certificate Lifecycle", "General Security Concepts", ["CA/RA and trust chains", "CSR, issuance, renewal, revocation", "CRL/OCSP checking"], ["CA", "RA", "OCSP", "CRL"], ["Automated certificate renewal prevents outage.", "Compromised certs are revoked and checked via OCSP."], ["Revocation questions often map to OCSP/CRL.", "Private key protection is critical in PKI." ]),
      topic(6, "encryption-hashing-signatures", "Encryption, Hashing, and Signatures", "General Security Concepts", ["Symmetric vs asymmetric use", "Hashing for integrity", "Signatures for authentication and non-repudiation"], ["AES", "RSA", "SHA-2", "digital signature"], ["VPN uses symmetric encryption after key exchange.", "Software hash and signature validation protects supply chain."], ["Confidentiality maps to encryption; integrity maps to hashing/signatures.", "Asymmetric is slower but enables key exchange and trust."]),
      topic(7, "change-management-and-versioning", "Change Management and Versioning", "General Security Concepts", ["Approval workflow and rollback plans", "Documentation and risk impact", "Version control and traceability"], ["CAB", "rollback plan", "maintenance window", "version control"], ["Firewall changes require approval and rollback plan.", "IaC pull requests provide clear change records."], ["Strong exam answers include testing + approval + rollback.", "Emergency changes still require post-change documentation."]),
      topic(8, "physical-environmental-security", "Physical and Environmental Security", "General Security Concepts", ["Physical access controls", "Site protections and monitoring", "Power and environmental resilience"], ["mantrap", "badge access", "CCTV", "HVAC monitoring"], ["Data center mantraps reduce unauthorized entry.", "Environmental sensors detect overheating early."], ["Theft/tampering scenarios often require physical controls first.", "Availability scenarios often include power and HVAC safeguards."]),
    ],
  },
  {
    id: 2,
    key: "threats-vulnerabilities-mitigations",
    name: "Threats, Vulnerabilities & Mitigations",
    weightPct: 22,
    topics: [
      topic(9, "threat-actors-and-motivations", "Threat Actors and Motivations", "Threats, Vulnerabilities & Mitigations", ["Nation-state, criminal, insider, and hacktivist actors", "Motivations: espionage, disruption, extortion, financial gain", "Capability versus opportunity"], ["threat actor", "insider threat", "espionage", "hacktivist"], ["Ransomware groups prioritize financial impact targets.", "Insiders can abuse legitimate privileges for data theft."], ["Match actor + motive + likely vector in scenario questions.", "Insider questions often involve privilege misuse."]),
      topic(10, "social-engineering-and-human-attacks", "Social Engineering Attacks", "Threats, Vulnerabilities & Mitigations", ["Phishing variants", "Impersonation and pretexting", "Awareness and reporting controls"], ["spear phishing", "vishing", "smishing", "pretexting"], ["Caller impersonates IT to request password reset.", "Phishing simulation improves reporting speed."], ["Best mitigation combines awareness and technical controls.", "Look for verification steps in strong answers."]),
      topic(11, "malware-and-fileless-techniques", "Malware and Fileless Techniques", "Threats, Vulnerabilities & Mitigations", ["Common malware families", "Fileless/living-off-the-land behavior", "Containment-first response"], ["ransomware", "rootkit", "botnet", "fileless malware"], ["PowerShell abuse enables fileless lateral movement.", "Endpoint isolation stops spread before eradication."], ["Containment before eradication is standard sequence.", "Behavioral detection helps against fileless threats."]),
      topic(12, "application-and-web-vulnerabilities", "Application and Web Vulnerabilities", "Threats, Vulnerabilities & Mitigations", ["Injection and broken access control", "XSS and CSRF", "Secure coding and dependency hygiene"], ["SQL injection", "XSS", "CSRF", "secure SDLC"], ["Parameterized queries reduce injection risk.", "Server-side authorization prevents privilege bypass."], ["Input handling issues usually point to validation/sanitization gaps.", "Prioritize least privilege and server-side checks."]),
      topic(13, "network-wireless-attacks", "Network and Wireless Attacks", "Threats, Vulnerabilities & Mitigations", ["DoS/DDoS, spoofing, replay, on-path attacks", "Rogue AP/evil twin risks", "Segmentation and secure wireless controls"], ["DDoS", "evil twin", "on-path", "segmentation"], ["Rogue AP captures credentials from unmanaged clients.", "DDoS scrubbing plus rate limiting mitigates volumetric attacks."], ["Wireless BEST answers often include WPA3 + 802.1X.", "Segmentation reduces blast radius."]),
      topic(14, "cloud-virtualization-and-container-threats", "Cloud and Virtualization Threats", "Threats, Vulnerabilities & Mitigations", ["Cloud misconfiguration risk", "Hypervisor/container isolation concerns", "Shared responsibility"], ["shared responsibility", "VM escape", "container isolation", "misconfiguration"], ["Public bucket misconfiguration exposes sensitive files.", "Privileged containers raise breakout risk."], ["Cloud incidents often start with IAM/config mistakes.", "Choose controls spanning host + orchestration layers."]),
      topic(15, "vulnerability-management-lifecycle", "Vulnerability Management Lifecycle", "Threats, Vulnerabilities & Mitigations", ["Discover, assess, remediate, validate", "Risk scoring and prioritization", "Exception handling"], ["CVSS", "authenticated scan", "remediation", "validation"], ["Critical internet-facing findings get emergency remediation SLA.", "Closed tickets require retest evidence."], ["Best lifecycle answers include retest/verification.", "Prioritize by exploitability + business impact."]),
      topic(16, "mitigation-strategies-and-hardening", "Mitigation Strategies and Hardening", "Threats, Vulnerabilities & Mitigations", ["Baseline hardening", "Isolation and access enforcement", "Allow-listing and endpoint controls"], ["hardening baseline", "allow-listing", "EDR", "isolation"], ["Disable unnecessary services to reduce attack surface.", "Isolate compromised hosts before forensic collection."], ["Hardening answers usually reduce attack surface first.", "Isolate quickly during active compromise."]),
    ],
  },
  {
    id: 3,
    key: "security-architecture",
    name: "Security Architecture",
    weightPct: 18,
    topics: [
      topic(17, "architecture-models-and-tradeoffs", "Architecture Models and Trade-offs", "Security Architecture", ["On-prem, cloud, hybrid, multi-cloud", "Virtualized/containerized deployment tradeoffs", "Control placement decisions"], ["hybrid", "multi-cloud", "containerization", "control plane"], ["Regulated workloads may remain on-prem while analytics runs in cloud.", "Container platforms require image and runtime security controls."], ["Choose architecture based on data sensitivity and trust boundaries.", "Migration questions reward phased control adoption."]),
      topic(18, "secure-network-design-and-zones", "Secure Network Design and Zones", "Security Architecture", ["DMZ and trust boundaries", "Segmentation and east-west control", "Privileged access paths"], ["DMZ", "trust boundary", "jump host", "NAC"], ["DB tier isolated behind internal firewall policy.", "Admin access routed through hardened jump host."], ["Segmentation is often correct when blast radius matters.", "Boundary controls should be explicit in design answers."]),
      topic(19, "secure-communication-and-remote-access", "Secure Communication and Remote Access", "Security Architecture", ["VPN patterns and secure tunneling", "Conditional access and posture checks", "Service authentication"], ["remote access VPN", "conditional access", "mTLS", "bastion"], ["Remote users require MFA and compliant device posture.", "Service APIs use mTLS for mutual identity assurance."], ["Remote access answers should include both identity and encryption.", "Machine-to-machine trust often points to mTLS."]),
      topic(20, "identity-and-access-architecture", "Identity and Access Architecture", "Security Architecture", ["Federation and SSO", "RBAC vs ABAC", "Privileged access design"], ["IdP", "SSO", "RBAC", "ABAC"], ["Federated SSO centralizes policy and lifecycle controls.", "PAM enforces just-in-time elevated access."], ["ABAC fits context-aware policy questions.", "Privileged access scenarios demand stronger oversight controls."]),
      topic(21, "data-classification-and-protection", "Data Classification and Protection", "Security Architecture", ["Data states", "Classification and handling requirements", "DLP, masking, tokenization"], ["data classification", "tokenization", "masking", "DLP"], ["PII data labels drive encryption and retention policy.", "Tokenization reduces exposure of sensitive identifiers."], ["Choose controls by data state (at rest/in transit/in use).", "Classification often drives all downstream decisions."]),
      topic(22, "cloud-security-controls", "Cloud Security Controls", "Security Architecture", ["Identity-centric cloud defense", "Network and key management controls", "Posture management"], ["KMS", "private endpoint", "CASB", "CSPM"], ["Private endpoints reduce public exposure risk.", "Posture tools continuously detect misconfiguration."], ["Shared responsibility always matters in cloud questions.", "IAM misconfigurations are frequently the root cause."]),
      topic(23, "iot-ot-embedded-security", "IoT, OT, and Embedded Security", "Security Architecture", ["Constrained and legacy system risks", "Firmware security", "Compensating controls"], ["ICS", "SCADA", "secure boot", "firmware signing"], ["OT zones rely on strict segmentation and monitored conduits.", "Unsigned firmware updates should be blocked."], ["OT questions often prioritize safety and uptime constraints.", "When patching is hard, use isolation + monitoring."]),
      topic(24, "resilience-redundancy-recovery", "Resilience, Redundancy, and Recovery", "Security Architecture", ["HA and failover", "Backups and recovery testing", "RTO/RPO planning"], ["RTO", "RPO", "failover", "fault tolerance"], ["Active-passive failover protects critical service availability.", "Immutable backups support ransomware recovery."], ["Recovery plans must be tested to be valid.", "Strict uptime targets usually require redundancy controls."]),
    ],
  },
  {
    id: 4,
    key: "security-operations",
    name: "Security Operations",
    weightPct: 28,
    topics: [
      topic(25, "secure-baselines-and-hardening-ops", "Operational Baselines and Hardening", "Security Operations", ["Baseline definition and enforcement", "Patch and config compliance", "Endpoint/mobile/wireless hardening"], ["baseline", "hardening", "compliance drift", "patch management"], ["Endpoint baseline enforces encryption, EDR, and lock policy.", "Wireless hardening removes weak ciphers and open SSIDs."], ["Best answers reduce attack surface before adding complexity.", "Continuous drift monitoring is key in operations."]),
      topic(26, "asset-management-and-inventory", "Asset Management and Inventory", "Security Operations", ["Asset identification and ownership", "Lifecycle events", "Secure disposal"], ["asset inventory", "CMDB", "ownership", "decommission"], ["Unknown assets trigger risk review and onboarding controls.", "Decommissioned drives require sanitization evidence."], ["You cannot secure assets that are not inventoried.", "Lifecycle control questions often combine policy + operations."]),
      topic(27, "vulnerability-scanning-and-prioritization", "Vulnerability Scanning and Prioritization", "Security Operations", ["Scan planning and scope", "Risk-based prioritization", "Validation and closure"], ["vulnerability scanner", "SLA", "criticality", "retest"], ["Critical exposed CVEs receive accelerated SLA.", "Retest confirms remediation before closure."], ["Prioritize exploitable + exposed + high-impact findings.", "Closure without validation is usually wrong."]),
      topic(28, "logging-monitoring-and-siem", "Logging, Monitoring, and SIEM", "Security Operations", ["Central log management", "Correlation and triage", "Alert quality tuning"], ["SIEM", "correlation", "alert fatigue", "telemetry"], ["Impossible-travel and MFA anomalies are correlated in SIEM.", "SOC tuning reduces false positives for analyst focus."], ["Correlation beats isolated events for stronger detection.", "Monitoring answers should include data source quality."]),
      topic(29, "security-tools-enterprise-controls", "Enterprise Security Tools", "Security Operations", ["Network and endpoint controls", "Policy tuning", "Detection and response integration"], ["IDS/IPS", "WAF", "NAC", "XDR"], ["NAC blocks unmanaged endpoints from production VLAN.", "WAF mitigates web-layer exploit attempts."], ["Match control to attack phase and surface.", "WAF is web-focused, not host malware-focused."]),
      topic(30, "iam-operations-and-account-lifecycle", "IAM Operations and Lifecycle", "Security Operations", ["Provision/deprovision process", "MFA/SSO operations", "PAM and account review"], ["provisioning", "deprovisioning", "PAM", "access review"], ["HR offboarding triggers immediate access removal.", "Privileged sessions require brokered access and logging."], ["Lifecycle automation is usually preferred.", "Stale account cleanup is a frequent exam target."]),
      topic(31, "incident-response-and-threat-hunting", "Incident Response and Threat Hunting", "Security Operations", ["IR lifecycle", "Playbooks and communication", "Proactive hunting"], ["containment", "eradication", "recovery", "threat hunting"], ["IR team isolates affected hosts before eradication.", "Hunting starts with hypotheses from observed telemetry."], ["Containment-first sequence is standard in IR.", "Lessons learned should include control improvements."]),
      topic(32, "forensics-and-evidence-handling", "Forensics and Evidence Handling", "Security Operations", ["Chain of custody", "Evidence collection priority", "Timeline and analysis"], ["chain of custody", "volatile evidence", "forensic image", "timeline"], ["Memory capture occurs before shutdown to preserve volatile data.", "Evidence transfer logs maintain legal defensibility."], ["Legal scenarios require strict evidence handling.", "Capture volatile data first when possible."]),
    ],
  },
  {
    id: 5,
    key: "security-program-management-oversight",
    name: "Security Program Management & Oversight",
    weightPct: 20,
    topics: [
      topic(33, "governance-structure-and-roles", "Governance Structure and Roles", "Security Program Management & Oversight", ["Governance bodies and accountability", "Role clarity and separation of duties", "Business alignment"], ["governance", "accountability", "SoD", "ownership"], ["Governance board approves risk tolerance and strategic controls.", "Separated duties prevent single-user abuse in critical processes."], ["Governance questions focus on authority and accountability.", "Enterprise-scope scenarios usually require policy-level controls."]),
      topic(34, "policies-standards-procedures", "Policies, Standards, and Procedures", "Security Program Management & Oversight", ["Document hierarchy and purpose", "Operational and technical standards", "Review and communication cycles"], ["policy", "standard", "procedure", "guideline"], ["Policy defines requirements; procedures define execution steps.", "Standards enforce minimum encryption across environments."], ["Policy is WHAT, procedure is HOW.", "Choose the term matching level of detail in the question."]),
      topic(35, "risk-identification-analysis-treatment", "Risk Identification and Treatment", "Security Program Management & Oversight", ["Risk registers and ownership", "Quantitative/qualitative analysis", "Risk treatment strategies"], ["risk register", "risk appetite", "ALE", "risk treatment"], ["Leadership signs accepted risks beyond threshold.", "Cyber insurance can support risk transfer strategy."], ["Cost-based choices often involve acceptance or transfer.", "Quantitative answers usually include monetary impact."]),
      topic(36, "business-impact-and-resilience-planning", "Business Impact and Resilience Planning", "Security Program Management & Oversight", ["BIA and critical process mapping", "Dependency and priority analysis", "Continuity alignment"], ["BIA", "criticality", "RTO", "RPO"], ["BIA identifies payroll and identity services as critical.", "Dependencies reveal hidden single points of failure."], ["BIA should precede final continuity planning.", "Recovery priorities should align to business impact."]),
      topic(37, "third-party-and-supply-chain-risk", "Third-Party and Supply Chain Risk", "Security Program Management & Oversight", ["Vendor due diligence", "Contract and SLA security requirements", "Continuous monitoring"], ["vendor risk", "SLA", "right-to-audit", "questionnaire"], ["Vendor contracts include incident notification timelines.", "High-risk vendors receive annual reassessment."], ["Third-party risk is continuous, not one-time.", "Contract controls should be explicit before onboarding."]),
      topic(38, "compliance-privacy-and-legal-considerations", "Compliance and Privacy", "Security Program Management & Oversight", ["Regulatory obligations", "Evidence and audit readiness", "Privacy handling and consequences"], ["compliance", "privacy", "regulatory control", "evidence"], ["Compliance gaps trigger corrective action plans.", "Data retention and minimization support privacy obligations."], ["Compliance proves alignment; it is not identical to security.", "Documentation is central to defensibility."]),
      topic(39, "audits-assessments-and-testing", "Audits, Assessments, and Testing", "Security Program Management & Oversight", ["Internal vs external audits", "Attestation and assessment", "Penetration testing and remediation"], ["audit", "attestation", "assessment", "penetration test"], ["External audit validates control evidence and closure status.", "Pen test results drive prioritized remediation plans."], ["Audits assess conformance; pen tests assess exploitability.", "Strong answers include validation after remediation."]),
      topic(40, "security-awareness-and-metrics", "Security Awareness and Metrics", "Security Program Management & Oversight", ["Role-based training", "Behavioral reporting culture", "Program KPIs and maturity"], ["awareness", "phishing simulation", "KPI", "maturity"], ["Phishing simulation trends guide targeted retraining.", "Metrics track reporting speed and risky behavior reduction."], ["Measure behavior change, not attendance alone.", "Good metrics are actionable and risk-linked."]),
    ],
  },
];
