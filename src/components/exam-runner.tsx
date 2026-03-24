"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { buildExamForTest, evaluateExam, QuestionPayload } from "@/lib/exam";
import { EXAM_DURATION_SECONDS } from "@/lib/constants";
import { saveAttempt } from "@/lib/client-storage";

type ExamResponse = {
  testNumber: number;
  durationSeconds: number;
  questions: QuestionPayload[];
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
};

const shouldOpenContextByDefault = (question: QuestionPayload) => {
  if (!question.scenario) {
    return false;
  }

  if (question.type === "performance-based") {
    return true;
  }

  return question.scenario.length > 220;
};

const OPTION_LABELS = ["A", "B", "C", "D", "E", "F"];

export function ExamRunner({ testId }: { testId: number }) {
  const router = useRouter();
  const [exam, setExam] = useState<ExamResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [flags, setFlags] = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [startedAt, setStartedAt] = useState<string>(new Date().toISOString());
  const [submitting, setSubmitting] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [scenarioOpen, setScenarioOpen] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const questionAreaRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  useEffect(() => {
    const load = () => {
      const payload: ExamResponse = {
        testNumber: testId,
        durationSeconds: EXAM_DURATION_SECONDS,
        questions: buildExamForTest(testId),
      };
      setExam(payload);
      setTimeLeft(payload.durationSeconds);
      setStartedAt(new Date().toISOString());
      setLoading(false);
    };

    load();
  }, [testId]);

  useEffect(() => {
    if (!exam || submitting) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          void submitExam(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  });

  const currentQuestion = exam?.questions[index];

  useEffect(() => {
    const question = exam?.questions[index];
    if (!question) {
      setScenarioOpen(false);
      return;
    }

    setScenarioOpen(shouldOpenContextByDefault(question));
  }, [exam, index]);

  // Scroll question area to top when navigating
  useEffect(() => {
    questionAreaRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [index]);

  const answeredCount = useMemo(() => Object.keys(answers).filter((key) => answers[Number(key)]?.length > 0).length, [answers]);
  const flaggedCount = useMemo(() => Object.values(flags).filter(Boolean).length, [flags]);

  const requiredSelections = (question: QuestionPayload) => (question.type === "multiple-choice-multiple" ? 3 : 1);

  const goNext = useCallback(() => {
    if (exam) setIndex((prev) => Math.min(exam.questions.length - 1, prev + 1));
  }, [exam]);

  const goPrev = useCallback(() => {
    setIndex((prev) => Math.max(0, prev - 1));
  }, []);

  // Swipe navigation for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      const deltaY = e.changedTouches[0].clientY - touchStartY.current;
      if (Math.abs(deltaX) > 60 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
        if (deltaX < 0) goNext();
        else goPrev();
      }
    },
    [goNext, goPrev],
  );

  const toggleOption = (questionId: number, option: string, multi: boolean) => {
    if (!exam) {
      return;
    }

    const question = exam.questions.find((entry) => entry.id === questionId);
    if (!question) {
      return;
    }

    setAnswers((prev) => {
      const existing = prev[questionId] || [];
      let nextSelection: string[] = [];

      if (!multi) {
        nextSelection = [option];
      } else if (existing.includes(option)) {
        nextSelection = existing.filter((entry) => entry !== option);
      } else {
        nextSelection = [...existing, option];
      }

      const nextState = { ...prev, [questionId]: nextSelection };

      const shouldAutoNext = nextSelection.length >= requiredSelections(question);
      if (shouldAutoNext && index < exam.questions.length - 1) {
        window.setTimeout(() => {
          setIndex((prevIndex) => Math.min(exam.questions.length - 1, prevIndex + 1));
        }, 280);
      }

      return nextState;
    });
  };

  const submitExam = async (autoSubmit = false) => {
    if (submitting) {
      return;
    }
    setSubmitting(true);

    if (!exam) {
      return;
    }

    const endedAt = new Date().toISOString();
    const elapsedSeconds = Math.min(
      EXAM_DURATION_SECONDS,
      Math.max(0, Math.floor((new Date(endedAt).getTime() - new Date(startedAt).getTime()) / 1000)),
    );

    const attempt = evaluateExam(testId, startedAt, endedAt, elapsedSeconds, exam.questions, answers);
    saveAttempt(attempt);

    const suffix = autoSubmit ? `?attempt=${attempt.id}&auto=1` : `?attempt=${attempt.id}`;
    router.push(`/mock-tests/${testId}/result${suffix}`);
  };

  if (loading || !exam || !currentQuestion) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-zinc-600 border-t-cyan-400" />
          <p className="text-sm text-zinc-400">Loading exam...</p>
        </div>
      </div>
    );
  }

  const progressPct = ((index + 1) / exam.questions.length) * 100;
  const isUrgent = timeLeft < 300;
  const multi = currentQuestion.type !== "multiple-choice-single";
  const unansweredCount = exam.questions.length - answeredCount;

  return (
    <div
      className="flex flex-col sm:block sm:space-y-4 sm:pb-0"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ─── STICKY TOP BAR ─── */}
      <div className="sticky top-0 z-20 border-b border-zinc-700/60 bg-zinc-900/95 backdrop-blur-md sm:rounded-xl sm:border sm:border-zinc-700 sm:p-4">
        {/* Progress bar — always visible */}
        <div className="h-1 w-full bg-zinc-800 sm:hidden">
          <div
            className="h-1 bg-cyan-500 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="flex items-center justify-between gap-2 px-3 py-2.5 sm:px-0 sm:py-0">
          {/* Mobile: compact info */}
          <div className="flex items-center gap-2.5 sm:hidden">
            <Link
              href="/"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800 text-sm active:bg-zinc-700"
              aria-label="Home"
            >
              ←
            </Link>
            <div>
              <p className="text-sm font-semibold text-zinc-100">Q {index + 1}/{exam.questions.length}</p>
              <p className="text-[11px] text-zinc-500">{answeredCount} answered</p>
            </div>
          </div>

          {/* Desktop info */}
          <div className="hidden sm:block">
            <h2 className="text-base font-semibold sm:text-lg">Mock Test {exam.testNumber}</h2>
            <p className="text-xs text-zinc-400 sm:text-sm">
              Question {index + 1} of {exam.questions.length} • {answeredCount} answered
              {flaggedCount > 0 ? ` • ${flaggedCount} flagged` : ""}
            </p>
          </div>

          {/* Timer */}
          <div
            className={`rounded-lg px-3 py-1.5 text-base font-bold tabular-nums sm:px-4 sm:py-2 sm:text-2xl ${
              isUrgent
                ? "animate-pulse border border-red-500 bg-red-950/50 text-red-300"
                : "border border-amber-500/60 bg-amber-950/30 text-amber-300"
            }`}
          >
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Desktop progress bar */}
        <div className="mt-3 hidden h-1.5 w-full rounded-full bg-zinc-800 sm:block">
          <div
            className="h-1.5 rounded-full bg-cyan-500 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* ─── QUESTION AREA ─── */}
      <div
        ref={questionAreaRef}
        className="flex-1 overflow-y-auto px-3 pb-44 pt-3 sm:overflow-visible sm:px-0 sm:pb-0 sm:pt-0"
      >
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3.5 sm:p-5">
          {/* Question type & difficulty badge */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {multi ? (
              <span className="rounded-md bg-violet-900/50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-violet-300">
                Select {requiredSelections(currentQuestion)}
              </span>
            ) : null}
            {currentQuestion.type === "performance-based" ? (
              <span className="rounded-md bg-amber-900/50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-300">
                PBQ
              </span>
            ) : null}
            <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-[11px] font-medium text-zinc-400">
              {currentQuestion.domainName}
            </span>
          </div>

          {/* Scenario / Context Panel */}
          {currentQuestion.scenario ? (
            <div className="mb-4">
              <button
                type="button"
                onClick={() => setScenarioOpen((prev) => !prev)}
                className={`flex w-full items-center gap-2 rounded-lg border px-3.5 py-2.5 text-left text-sm font-medium transition-colors ${
                  scenarioOpen
                    ? "border-blue-500/40 bg-blue-950/30 text-blue-200"
                    : "border-zinc-600 bg-zinc-800 text-zinc-300 active:bg-zinc-700"
                }`}
              >
                <span className="text-base">{scenarioOpen ? "▾" : "▸"}</span>
                <span>{scenarioOpen ? "Hide Scenario Context" : "View Scenario Context"}</span>
                {!scenarioOpen && currentQuestion.type === "performance-based" ? (
                  <span className="ml-auto text-[11px] text-amber-400">Recommended</span>
                ) : null}
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  scenarioOpen ? "mt-2 max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="rounded-lg border border-blue-500/20 bg-blue-950/20 p-3.5 text-[13px] leading-6 text-blue-100/90 sm:text-sm sm:leading-7">
                  {currentQuestion.scenario}
                </div>
              </div>
            </div>
          ) : null}

          {/* Question prompt */}
          <p className="text-[15px] font-medium leading-7 text-zinc-100 sm:text-lg sm:leading-8">
            {currentQuestion.prompt}
          </p>

          {/* Options */}
          <div className="mt-4 space-y-2.5 sm:mt-5 sm:space-y-3">
            {currentQuestion.options.map((option, optIndex) => {
              const selected = (answers[currentQuestion.id] || []).includes(option);
              return (
                <button
                  type="button"
                  key={option}
                  className={`group flex w-full items-start gap-3 rounded-xl border px-3.5 py-3 text-left transition-all duration-150 active:scale-[0.98] sm:px-4 sm:py-3.5 ${
                    selected
                      ? "border-cyan-400/60 bg-cyan-950/40 shadow-[0_0_12px_rgba(34,211,238,0.08)]"
                      : "border-zinc-700/70 bg-zinc-800/80 hover:border-zinc-600 hover:bg-zinc-750 active:bg-zinc-700"
                  }`}
                  onClick={() => toggleOption(currentQuestion.id, option, multi)}
                >
                  <span
                    className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                      selected
                        ? "bg-cyan-500 text-zinc-900"
                        : "bg-zinc-700 text-zinc-300 group-hover:bg-zinc-600"
                    }`}
                  >
                    {OPTION_LABELS[optIndex] || optIndex + 1}
                  </span>
                  <span className={`text-[14px] leading-6 sm:text-[15px] sm:leading-7 ${selected ? "text-cyan-100" : "text-zinc-200"}`}>
                    {option}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Desktop navigation buttons */}
          <div className="mt-8 hidden border-t border-zinc-800 pt-4 sm:block">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setFlags((prev) => ({ ...prev, [currentQuestion.id]: !prev[currentQuestion.id] }))}
                className={`rounded-md border px-3 py-2.5 text-sm transition-colors ${
                  flags[currentQuestion.id]
                    ? "border-amber-500/50 bg-amber-950/40 text-amber-300"
                    : "border-zinc-600 hover:bg-zinc-800"
                }`}
              >
                {flags[currentQuestion.id] ? "⚑ Flagged" : "⚐ Flag for Review"}
              </button>
              <button
                type="button"
                disabled={index === 0}
                onClick={goPrev}
                className="rounded-md border border-zinc-600 px-3 py-2.5 text-sm disabled:opacity-40"
              >
                ← Previous
              </button>
              <button
                type="button"
                disabled={index === exam.questions.length - 1}
                onClick={goNext}
                className="rounded-md border border-zinc-600 px-3 py-2.5 text-sm disabled:opacity-40"
              >
                Next →
              </button>
              <button
                type="button"
                onClick={() => setReviewMode((prev) => !prev)}
                className="rounded-md border border-zinc-600 px-3 py-2.5 text-sm hover:bg-zinc-800"
              >
                {reviewMode ? "Hide Review" : "Review All"}
              </button>
              <button
                type="button"
                onClick={() => setConfirmSubmit(true)}
                className="ml-auto rounded-md bg-cyan-700 px-4 py-2.5 text-sm font-semibold hover:bg-cyan-600"
              >
                {submitting ? "Submitting..." : "Submit Exam"}
              </button>
            </div>
          </div>
        </div>

        {/* Review panel */}
        {reviewMode ? (
          <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900 p-3.5 sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">Answer Review</h3>
              <div className="flex gap-3 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm bg-emerald-600" /> Answered
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm bg-amber-600" /> Flagged
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm bg-zinc-600" /> Unanswered
                </span>
              </div>
            </div>
            <div className="grid grid-cols-8 gap-1.5 sm:grid-cols-10 sm:gap-2">
              {exam.questions.map((question, questionIndex) => {
                const isAnswered = (answers[question.id] || []).length > 0;
                const isFlagged = !!flags[question.id];
                const isCurrent = questionIndex === index;
                return (
                  <button
                    key={question.id}
                    type="button"
                    onClick={() => {
                      setIndex(questionIndex);
                      setReviewMode(false);
                    }}
                    className={`rounded-md py-2 text-xs font-medium transition-all ${
                      isCurrent
                        ? "ring-2 ring-cyan-400 ring-offset-1 ring-offset-zinc-900"
                        : ""
                    } ${
                      isFlagged
                        ? "bg-amber-700/80 text-amber-100"
                        : isAnswered
                          ? "bg-emerald-700/80 text-emerald-100"
                          : "bg-zinc-700/80 text-zinc-300"
                    }`}
                  >
                    {questionIndex + 1}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>

      {/* ─── MOBILE BOTTOM BAR (iPhone optimized) ─── */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-zinc-700/60 bg-zinc-900/95 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:hidden">
        <div className="mx-auto max-w-lg">
          {/* Navigation row */}
          <div className="flex items-center gap-1 px-2.5 pt-2">
            <button
              type="button"
              disabled={index === 0}
              onClick={goPrev}
              className="flex h-11 flex-1 items-center justify-center rounded-lg bg-zinc-800 text-sm font-medium transition-colors active:bg-zinc-700 disabled:opacity-40"
            >
              ← Prev
            </button>

            <button
              type="button"
              onClick={() => setFlags((prev) => ({ ...prev, [currentQuestion.id]: !prev[currentQuestion.id] }))}
              className={`flex h-11 w-12 items-center justify-center rounded-lg text-lg transition-colors ${
                flags[currentQuestion.id]
                  ? "bg-amber-800/80 text-amber-200"
                  : "bg-zinc-800 text-zinc-400 active:bg-zinc-700"
              }`}
              aria-label={flags[currentQuestion.id] ? "Unflag question" : "Flag question"}
            >
              {flags[currentQuestion.id] ? "⚑" : "⚐"}
            </button>

            <button
              type="button"
              onClick={() => setReviewMode((prev) => !prev)}
              className={`flex h-11 w-12 items-center justify-center rounded-lg text-base transition-colors ${
                reviewMode ? "bg-cyan-800/60 text-cyan-200" : "bg-zinc-800 text-zinc-400 active:bg-zinc-700"
              }`}
              aria-label="Review all questions"
            >
              ▦
            </button>

            <button
              type="button"
              disabled={index === exam.questions.length - 1}
              onClick={goNext}
              className="flex h-11 flex-1 items-center justify-center rounded-lg bg-zinc-800 text-sm font-medium transition-colors active:bg-zinc-700 disabled:opacity-40"
            >
              Next →
            </button>
          </div>

          {/* Submit row */}
          <div className="px-2.5 pb-1 pt-1.5">
            <button
              type="button"
              onClick={() => setConfirmSubmit(true)}
              className="flex h-11 w-full items-center justify-center rounded-lg bg-cyan-700 text-sm font-semibold text-white transition-colors active:bg-cyan-600"
            >
              {submitting ? "Submitting..." : `Submit Exam (${answeredCount}/${exam.questions.length})`}
            </button>
          </div>
        </div>
      </div>

      {/* ─── CONFIRM SUBMIT MODAL ─── */}
      {confirmSubmit ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-md rounded-t-2xl border-t border-zinc-700 bg-zinc-900 p-5 sm:rounded-2xl sm:border">
            <h3 className="text-lg font-semibold text-zinc-100">Submit Exam?</h3>
            <div className="mt-3 space-y-1.5 text-sm text-zinc-400">
              <p>Answered: <span className="font-medium text-emerald-400">{answeredCount}</span> / {exam.questions.length}</p>
              {unansweredCount > 0 ? (
                <p>Unanswered: <span className="font-medium text-amber-400">{unansweredCount}</span></p>
              ) : null}
              {flaggedCount > 0 ? (
                <p>Flagged: <span className="font-medium text-amber-400">{flaggedCount}</span></p>
              ) : null}
              <p>Time remaining: <span className="font-medium text-zinc-200">{formatTime(timeLeft)}</span></p>
            </div>
            {unansweredCount > 0 ? (
              <p className="mt-3 text-[13px] text-amber-300/80">
                You have unanswered questions. Unanswered questions will be marked incorrect.
              </p>
            ) : null}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setConfirmSubmit(false)}
                className="rounded-xl border border-zinc-600 py-3 text-sm font-medium transition-colors active:bg-zinc-800"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmSubmit(false);
                  void submitExam(false);
                }}
                className="rounded-xl bg-cyan-600 py-3 text-sm font-semibold text-white transition-colors active:bg-cyan-500"
              >
                Confirm Submit
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
