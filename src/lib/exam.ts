import { DOMAIN_COUNTS, DOMAIN_KEYS, EXAM_QUESTION_COUNT, MAX_SCORE, PASSING_SCORE } from "@/lib/constants";
import { STATIC_SYLLABUS } from "@/lib/static-syllabus";

export type QuestionPayload = {
  id: number;
  qid: string;
  prompt: string;
  type: string;
  difficulty: string;
  options: string[];
  explanation: string;
  correctAnswers: string[];
  scenario?: string | null;
  domainKey: string;
  domainName: string;
  topicId: number;
  studyPath: string;
};

export type ExamAttempt = {
  id: string;
  testNumber: number;
  startedAt: string;
  completedAt: string;
  elapsedSeconds: number;
  score900: number;
  pass: boolean;
  domainScores: Array<{
    domainId: number;
    domainKey: string;
    domainName: string;
    correct: number;
    total: number;
    pct: number;
  }>;
  wrongAnswers: Array<{
    questionId: number;
    questionQid: string;
    questionPrompt: string;
    selectedAnswer: string;
    correctAnswer: string;
    explanation: string;
    recommendedTopic: string;
    topicId: number;
    domainName: string;
  }>;
};

const stringHash = (text: string) => {
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
};

export const seededShuffle = <T,>(input: T[], seed: number) => {
  const list = [...input];
  let state = seed;
  const rand = () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };

  for (let index = list.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rand() * (index + 1));
    [list[index], list[swapIndex]] = [list[swapIndex], list[index]];
  }

  return list;
};

const DOMAIN_BANK: Record<
  string,
  {
    singleGood: string[];
    singleBad: string[];
    multiGood: string[];
    multiBad: string[];
    scenarioStems: string[];
    pbqSituation: string[];
    pbqGoodPath: string;
    pbqBadPaths: string[];
  }
> = {
  "general-security-concepts": {
    singleGood: [
      "Enforce least privilege with role-based access",
      "Implement MFA for privileged workflows",
      "Apply secure change approval with rollback",
      "Use signed configuration baselines",
      "Validate certificate chains and revocation",
      "Encrypt sensitive data in transit with TLS 1.3",
    ],
    singleBad: [
      "Use shared administrator accounts",
      "Disable audit logging for performance",
      "Allow anonymous internal service access",
      "Keep default credentials for convenience",
      "Use broad Any/Any ACL rules",
      "Skip change documentation during production updates",
    ],
    multiGood: [
      "Implement MFA",
      "Enable centralized logging",
      "Enforce change-control approvals",
      "Apply least privilege",
      "Use certificate lifecycle management",
      "Validate integrity with hashing/signatures",
    ],
    multiBad: [
      "Share service credentials",
      "Disable certificate validation",
      "Use plaintext administrative protocols",
      "Bypass policy exceptions without review",
    ],
    scenarioStems: [
      "A security architect is standardizing foundational controls across business units",
      "A compliance review found inconsistent authentication and logging behavior",
      "A merger introduced multiple identity systems and weak trust boundaries",
    ],
    pbqSituation: [
      "PBQ: You are given identity logs, PKI trust errors, and policy exceptions from multiple teams.",
      "PBQ: A configuration drift report shows weak protocol settings and unapproved changes.",
    ],
    pbqGoodPath: "Validate identity/control requirement → enforce policy-compliant control → verify logs/evidence → document and approve change",
    pbqBadPaths: [
      "Disable logging to reduce noise → deploy quickly → validate later",
      "Grant broad admin access first → review policy after rollout",
      "Accept default settings → postpone certificate validation",
    ],
  },
  "threats-vulnerabilities-mitigations": {
    singleGood: [
      "Isolate affected endpoint and block indicators of compromise",
      "Patch exploitable internet-facing vulnerability first",
      "Harden email controls with SPF/DKIM/DMARC and phishing simulation",
      "Use parameterized queries and strict input validation",
      "Segment high-risk workloads to reduce lateral movement",
      "Prioritize remediation by exploitability and business impact",
    ],
    singleBad: [
      "Ignore low-volume suspicious alerts",
      "Disable endpoint protection to avoid false positives",
      "Allow unrestricted outbound traffic for convenience",
      "Use wildcard allow rules on management ports",
      "Postpone critical patching to next quarter",
      "Store credentials in plaintext config files",
    ],
    multiGood: [
      "Perform authenticated vulnerability scanning",
      "Apply patch management SLAs",
      "Use EDR for behavior-based detection",
      "Conduct phishing-resistant awareness training",
      "Enforce network segmentation",
      "Validate remediation with retesting",
    ],
    multiBad: [
      "Allow public management interfaces",
      "Use shared privileged passwords",
      "Treat all findings as equal priority",
      "Disable DNS filtering",
    ],
    scenarioStems: [
      "A SOC detects suspicious process behavior and outbound beaconing",
      "A red-team exercise identifies exploitable web and identity weaknesses",
      "A phishing campaign bypassed legacy email filters",
    ],
    pbqSituation: [
      "PBQ: Analyze endpoint telemetry, threat intel indicators, and scan results from a ransomware incident.",
      "PBQ: You receive evidence of web exploitation followed by privilege escalation and lateral movement.",
    ],
    pbqGoodPath: "Identify attack vector and impacted assets → contain spread → eradicate root cause and patch weakness → validate and monitor for recurrence",
    pbqBadPaths: [
      "Rebuild systems immediately without containment",
      "Close incident ticket after IOC block only",
      "Delay remediation until monthly maintenance window",
    ],
  },
  "security-architecture": {
    singleGood: [
      "Use microsegmentation with explicit trust boundaries",
      "Apply private endpoints for sensitive cloud services",
      "Enforce mutual TLS for service-to-service authentication",
      "Use PAM with just-in-time privileged access",
      "Classify data and apply handling controls by sensitivity",
      "Design HA/failover to meet RTO and RPO",
    ],
    singleBad: [
      "Expose management plane to public internet",
      "Use flat network architecture for simplicity",
      "Reuse long-lived static admin tokens",
      "Store secrets in code repositories",
      "Skip backup restoration testing",
      "Allow all east-west traffic between workloads",
    ],
    multiGood: [
      "Implement network segmentation",
      "Use identity federation and SSO",
      "Apply KMS-managed encryption keys",
      "Deploy resilient backup and replication",
      "Use conditional access policies",
      "Harden cloud security group rules",
    ],
    multiBad: [
      "Permit shared root accounts",
      "Expose databases directly to internet",
      "Rely on single-zone deployment only",
      "Disable certificate validation checks",
    ],
    scenarioStems: [
      "An enterprise is redesigning hybrid architecture after repeated segmentation failures",
      "A cloud migration increased exposure of identity and data flows",
      "An availability assessment found critical single points of failure",
    ],
    pbqSituation: [
      "PBQ: Review architecture diagram, trust boundaries, and failover map to reduce breach impact.",
      "PBQ: Assess IAM and network paths for a hybrid cloud application with sensitive data.",
    ],
    pbqGoodPath: "Define trust boundary and data classification → enforce identity-aware access controls → segment and secure communication paths → test failover and recovery",
    pbqBadPaths: [
      "Migrate workload first and harden later",
      "Keep flat routing to simplify operations",
      "Grant permanent elevated access to all administrators",
    ],
  },
  "security-operations": {
    singleGood: [
      "Tune SIEM correlation with context-rich detections",
      "Isolate compromised hosts before eradication",
      "Use secure configuration baselines and drift monitoring",
      "Enforce deprovisioning for terminated users",
      "Capture volatile evidence before system shutdown",
      "Automate triage enrichment through SOAR playbooks",
    ],
    singleBad: [
      "Disable noisy alerts without validation",
      "Skip chain-of-custody documentation",
      "Retain dormant privileged accounts indefinitely",
      "Allow unmanaged endpoints on production network",
      "Close incidents before recovery validation",
      "Store backups without periodic restoration tests",
    ],
    multiGood: [
      "Centralize logging",
      "Conduct threat hunting",
      "Perform access recertification",
      "Apply endpoint hardening baselines",
      "Validate incident lessons learned",
      "Run vulnerability remediation retests",
    ],
    multiBad: [
      "Disable endpoint telemetry",
      "Use shared admin accounts",
      "Ignore asset inventory drift",
      "Bypass incident communication plans",
    ],
    scenarioStems: [
      "A SOC receives high-confidence alerts indicating active compromise",
      "An audit found inconsistent vulnerability closure evidence",
      "Incident response metrics show slow containment times",
    ],
    pbqSituation: [
      "PBQ: Triage SIEM alerts, endpoint telemetry, and identity events during an active incident.",
      "PBQ: Review forensic artifacts and decide defensible response actions in order.",
    ],
    pbqGoodPath: "Triage and validate indicators → contain affected systems/accounts → eradicate persistence and vulnerabilities → recover, monitor, and document lessons learned",
    pbqBadPaths: [
      "Recover service first before containment",
      "Delete evidence to speed up restoration",
      "Skip post-incident review and close ticket",
    ],
  },
  "security-program-management-oversight": {
    singleGood: [
      "Update risk register with owner, treatment, and due date",
      "Align policy standards with regulatory obligations",
      "Require vendor security controls in contracts",
      "Perform role-based awareness with measurable outcomes",
      "Use BIA to prioritize continuity controls",
      "Track audit findings to verified remediation",
    ],
    singleBad: [
      "Accept high risk without documented approval",
      "Onboard vendors without due diligence",
      "Use awareness completion rate as sole KPI",
      "Skip policy review cycles",
      "Ignore recurring audit findings",
      "Treat compliance and security as interchangeable",
    ],
    multiGood: [
      "Maintain formal risk register",
      "Define risk appetite and tolerance",
      "Implement third-party reassessment",
      "Document policy exceptions",
      "Run periodic compliance monitoring",
      "Measure awareness effectiveness",
    ],
    multiBad: [
      "Approve broad permanent exceptions",
      "Rely on vendor self-attestation only",
      "Skip incident reporting obligations",
      "Avoid audit evidence retention",
    ],
    scenarioStems: [
      "Leadership requests a defensible risk-treatment decision for a high-impact finding",
      "A compliance gap requires coordinated policy, training, and remediation updates",
      "A supplier incident exposes weaknesses in third-party oversight",
    ],
    pbqSituation: [
      "PBQ: Evaluate risk, compliance obligations, and vendor controls to select best governance actions.",
      "PBQ: Prioritize corrective actions from audit findings, BIA impact, and policy exceptions.",
    ],
    pbqGoodPath: "Assess risk and business impact → choose and document treatment strategy → enforce policy/vendor controls → monitor metrics and report outcomes",
    pbqBadPaths: [
      "Defer governance actions until next audit cycle",
      "Approve vendor onboarding without control validation",
      "Close risk without owner accountability",
    ],
  },
};

const difficultyLevels = ["easy", "medium", "hard"] as const;
const questionTypes = ["multiple-choice-single", "multiple-choice-multiple", "performance-based"] as const;

const difficultyGuidance: Record<(typeof difficultyLevels)[number], string> = {
  easy: "Focus on the foundational control that most directly reduces risk.",
  medium: "Balance control effectiveness with operational impact and incident context.",
  hard: "Prioritize the control path that remains defensible under audit, risk, and real-world constraints.",
};

const pickOne = <T,>(items: T[], seed: number) => items[Math.abs(seed) % items.length];

const pickManyUnique = <T,>(items: T[], count: number, seed: number) => {
  const shuffled = seededShuffle(items, seed);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

const buildQuestionPool = (): QuestionPayload[] => {
  let currentId = 1;
  const questions: QuestionPayload[] = [];

  STATIC_SYLLABUS.forEach((domain) => {
    domain.topics.forEach((topic) => {
      difficultyLevels.forEach((difficulty, dIndex) => {
        questionTypes.forEach((questionType, tIndex) => {
          const seed = currentId + dIndex + tIndex;
          const domainBank = DOMAIN_BANK[domain.key] ?? DOMAIN_BANK["general-security-concepts"];
          const stem = pickOne(domainBank.scenarioStems, seed + 3);
          const guidance = difficultyGuidance[difficulty];

          if (questionType === "multiple-choice-single") {
            const correct = pickOne(domainBank.singleGood, seed + 11);
            const distractors = pickManyUnique(
              domainBank.singleBad.filter((option) => option !== correct),
              3,
              seed + 19,
            );
            const optionPool = [correct, ...distractors];
            const shuffledOptions = seededShuffle(optionPool, stringHash(`${topic.slug}-${difficulty}-single`));
            const correctAnswer = [correct];

            questions.push({
              id: currentId,
              qid: `Q-${String(currentId).padStart(4, "0")}`,
              prompt: `In this ${difficulty} scenario, which action is the BEST first step to strengthen ${topic.title.toLowerCase()}?`,
              type: questionType,
              difficulty,
              options: shuffledOptions,
              explanation: `${correct} is correct because it directly addresses the primary control gap. ${guidance}`,
              correctAnswers: correctAnswer,
              scenario: `${stem} while reviewing ${topic.title}. ${guidance}`,
              domainKey: domain.key,
              domainName: domain.name,
              topicId: topic.id,
              studyPath: topic.studyPath,
            });
            currentId += 1;
            return;
          }

          if (questionType === "multiple-choice-multiple") {
            const correctAnswers = pickManyUnique(domainBank.multiGood, 3, seed + 23);
            const distractors = pickManyUnique(
              domainBank.multiBad.filter((option) => !correctAnswers.includes(option)),
              2,
              seed + 29,
            );
            const optionPool = [...correctAnswers, ...distractors];
            const shuffledOptions = seededShuffle(optionPool, stringHash(`${topic.slug}-${difficulty}-multi`));

            questions.push({
              id: currentId,
              qid: `Q-${String(currentId).padStart(4, "0")}`,
              prompt: `Select THREE controls that provide the strongest combined risk reduction for ${topic.title.toLowerCase()} in this ${difficulty} case.`,
              type: questionType,
              difficulty,
              options: shuffledOptions,
              explanation: `${correctAnswers.join(", ")} together provide layered prevention, detection, and response coverage.`,
              correctAnswers,
              scenario: `${stem}. Choose the three controls that most improve defensive posture without creating unmanaged risk.`,
              domainKey: domain.key,
              domainName: domain.name,
              topicId: topic.id,
              studyPath: topic.studyPath,
            });
            currentId += 1;
            return;
          }

          const options = seededShuffle(
            [domainBank.pbqGoodPath, ...domainBank.pbqBadPaths],
            stringHash(`${topic.slug}-${difficulty}-pbq`),
          );
          const pbqScene = pickOne(domainBank.pbqSituation, seed + 31);

          questions.push({
            id: currentId,
            qid: `Q-${String(currentId).padStart(4, "0")}`,
            prompt: `Performance-based: Which response sequence is the BEST operational path for ${topic.title.toLowerCase()}?`,
            type: questionType,
            difficulty,
            options,
            explanation: `${domainBank.pbqGoodPath} is correct because it follows a defensible lifecycle: assess, control, validate, and report improvements.`,
            correctAnswers: [domainBank.pbqGoodPath],
            scenario: `${pbqScene} Evidence includes logs, policy context, and operational constraints. Select the sequence with the strongest risk and governance outcome.`,
            domainKey: domain.key,
            domainName: domain.name,
            topicId: topic.id,
            studyPath: topic.studyPath,
          });
          currentId += 1;
        });
      });
    });
  });

  return questions;
};

const QUESTION_POOL = buildQuestionPool();

export const buildExamForTest = (testNumber: number) => {
  const byDomain = DOMAIN_KEYS.reduce<Record<string, QuestionPayload[]>>((acc, key) => {
    acc[key] = QUESTION_POOL.filter((question) => question.domainKey === key);
    return acc;
  }, {});

  const selected: QuestionPayload[] = [];

  DOMAIN_KEYS.forEach((key) => {
    const domainQuestions = seededShuffle(byDomain[key], stringHash(`${testNumber}-${key}`));
    const needed = DOMAIN_COUNTS[key];
    for (let index = 0; index < needed; index += 1) {
      selected.push(domainQuestions[index % domainQuestions.length]);
    }
  });

  return seededShuffle(selected.slice(0, EXAM_QUESTION_COUNT), stringHash(`exam-${testNumber}`));
};

export const calculateScore = (correct: number) => {
  const score = Math.round((correct / EXAM_QUESTION_COUNT) * MAX_SCORE);
  return {
    score,
    pass: score >= PASSING_SCORE,
  };
};

export const evaluateExam = (
  testNumber: number,
  startedAt: string,
  endedAt: string,
  elapsedSeconds: number,
  questions: QuestionPayload[],
  answers: Record<number, string[]>,
): ExamAttempt => {
  const domainScoresSeed = DOMAIN_KEYS.reduce<Record<string, { domainId: number; domainName: string; correct: number; total: number }>>((acc, key) => {
    const domainInfo = STATIC_SYLLABUS.find((domain) => domain.key === key);
    if (domainInfo) {
      acc[key] = { domainId: domainInfo.id, domainName: domainInfo.name, correct: 0, total: 0 };
    }
    return acc;
  }, {});

  const wrongAnswers: ExamAttempt["wrongAnswers"] = [];
  let correctTotal = 0;

  questions.forEach((question) => {
    const selected = [...(answers[question.id] || [])].sort();
    const actual = [...question.correctAnswers].sort();
    const matched = selected.length === actual.length && selected.every((entry, index) => entry === actual[index]);
    domainScoresSeed[question.domainKey].total += 1;

    if (matched) {
      correctTotal += 1;
      domainScoresSeed[question.domainKey].correct += 1;
      return;
    }

    wrongAnswers.push({
      questionId: question.id,
      questionQid: question.qid,
      questionPrompt: question.prompt,
      selectedAnswer: selected.join(" | ") || "No answer",
      correctAnswer: actual.join(" | "),
      explanation: question.explanation,
      recommendedTopic: question.studyPath,
      topicId: question.topicId,
      domainName: question.domainName,
    });
  });

  const { score, pass } = calculateScore(correctTotal);

  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    testNumber,
    startedAt,
    completedAt: endedAt,
    elapsedSeconds,
    score900: score,
    pass,
    domainScores: Object.entries(domainScoresSeed).map(([domainKey, item]) => ({
      domainId: item.domainId,
      domainKey,
      domainName: item.domainName,
      correct: item.correct,
      total: item.total,
      pct: item.total ? (item.correct / item.total) * 100 : 0,
    })),
    wrongAnswers,
  };
};

