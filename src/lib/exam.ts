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

const singleOptionSets = [
  ["Least privilege", "Shared admin account", "Unrestricted inbound ACL", "Default guest login"],
  ["Input validation", "Disable logging", "Use default credentials", "Flat network only"],
  ["MFA enforcement", "Single reused password", "Disable endpoint protection", "Open admin portal"],
  ["Network segmentation", "Broad Any/Any rules", "Anonymous access", "Disabled patching"],
];

const multiOptionSets = [
  ["Patch management", "Asset inventory", "Continuous monitoring", "Disable backups"],
  ["Segmentation", "Allow-listing", "Incident runbooks", "Shared admin passwords"],
  ["SIEM correlation", "Vulnerability scanning", "Threat hunting", "Public management ports"],
  ["Data classification", "DLP policy", "Key rotation", "Permanent broad access"],
];

const difficultyLevels = ["easy", "medium", "hard"] as const;
const questionTypes = ["multiple-choice-single", "multiple-choice-multiple", "performance-based"] as const;

const buildQuestionPool = (): QuestionPayload[] => {
  let currentId = 1;
  const questions: QuestionPayload[] = [];

  STATIC_SYLLABUS.forEach((domain) => {
    domain.topics.forEach((topic) => {
      difficultyLevels.forEach((difficulty, dIndex) => {
        questionTypes.forEach((questionType, tIndex) => {
          const seed = currentId + dIndex + tIndex;
          if (questionType === "multiple-choice-single") {
            const options = [...singleOptionSets[seed % singleOptionSets.length]];
            const shuffledOptions = seededShuffle(options, stringHash(`${topic.slug}-${difficulty}-single`));
            const correctAnswer = [options[0]];
            questions.push({
              id: currentId,
              qid: `Q-${String(currentId).padStart(4, "0")}`,
              prompt: `Which control BEST strengthens ${topic.title.toLowerCase()} in a ${difficulty} scenario?`,
              type: questionType,
              difficulty,
              options: shuffledOptions,
              explanation: `${options[0]} is the best fit because it reduces risk while aligning to SY0-701 operational priorities for ${topic.title}.`,
              correctAnswers: correctAnswer,
              scenario: `You are reviewing ${topic.title} implementation gaps in production. Choose the BEST immediate control improvement.`,
              domainKey: domain.key,
              domainName: domain.name,
              topicId: topic.id,
              studyPath: topic.studyPath,
            });
            currentId += 1;
            return;
          }

          if (questionType === "multiple-choice-multiple") {
            const options = [...multiOptionSets[seed % multiOptionSets.length]];
            const shuffledOptions = seededShuffle(options, stringHash(`${topic.slug}-${difficulty}-multi`));
            const correctAnswers = [options[0], options[1], options[2]];
            questions.push({
              id: currentId,
              qid: `Q-${String(currentId).padStart(4, "0")}`,
              prompt: `Select THREE controls that most effectively reduce risk for ${topic.title.toLowerCase()}.`,
              type: questionType,
              difficulty,
              options: shuffledOptions,
              explanation: `${correctAnswers.join(", ")} together provide prevention, visibility, and operational response coverage.`,
              correctAnswers,
              scenario: `A security lead is prioritizing quarterly improvements related to ${topic.title}. Select the strongest combined controls.`,
              domainKey: domain.key,
              domainName: domain.name,
              topicId: topic.id,
              studyPath: topic.studyPath,
            });
            currentId += 1;
            return;
          }

          const options = [
            "Containment → Eradication → Recovery",
            "Recovery → Lessons Learned → Triage",
            "Identification → Closure → Ignore",
            "Escalation → Procurement → Recovery",
          ];

          questions.push({
            id: currentId,
            qid: `Q-${String(currentId).padStart(4, "0")}`,
            prompt: `A SOC identifies suspicious activity related to ${topic.title.toLowerCase()}. What is the BEST response sequence?`,
            type: questionType,
            difficulty,
            options,
            explanation: "Containment first limits impact; eradication removes root cause; recovery restores services safely.",
            correctAnswers: [options[0]],
            scenario: `PBQ: Analyze event timeline, system logs, and impact data tied to ${topic.title}. Choose the best operational order.`,
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

