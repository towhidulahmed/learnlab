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
  const [hamMenuOpen, setHamMenuOpen] = useState(false);
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
      {/* ─── MOBILE: ultra-compact top bar ─── */}
      <div className="sticky top-0 z-20 border-b border-zinc-700/60 bg-zinc-900/95 backdrop-blur-md sm:rounded-xl sm:border sm:border-zinc-700 sm:p-4">
        {/* Thin progress bar */}
        <div className="h-[3px] w-full bg-zinc-800 sm:hidden">
          <div
            className="h-[3px] bg-cyan-500 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="flex items-center justify-between px-2.5 py-1.5 sm:px-0 sm:py-0">
          {/* Mobile: hamburger + Q number */}
          <div className="flex items-center gap-2 sm:hidden">
            <button
              type="button"
              aria-label="Menu"
              onClick={() => setHamMenuOpen((prev) => !prev)}
              className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-800 active:bg-zinc-700"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <span className="text-[13px] font-semibold tabular-nums text-zinc-200">
              {index + 1}<span className="text-zinc-500">/{exam.questions.length}</span>
            </span>
          </div>

          {/* Desktop info */}
          <div className="hidden sm:block">
            <h2 className="text-base font-semibold sm:text-lg">Mock Test {exam.testNumber}</h2>
            <p className="text-xs text-zinc-400 sm:text-sm">
              Question {index + 1} of {exam.questions.length} • {answeredCount} answered
              {flaggedCount > 0 ? ` • ${flaggedCount} flagged` : ""}
            </p>
          </div>

          {/* Timer — compact on mobile */}
          <div
            className={`rounded-md px-2 py-1 text-[13px] font-bold tabular-nums sm:rounded-lg sm:px-4 sm:py-2 sm:text-2xl ${
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

      {/* ─── MOBILE HAMBURGER MENU OVERLAY ─── */}
      {hamMenuOpen ? (
        <div className="fixed inset-0 z-50 sm:hidden" onClick={() => setHamMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="absolute left-0 top-0 h-full w-64 border-r border-zinc-700 bg-zinc-900 p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Navigation</p>
            <nav className="mt-3 space-y-0.5">
              <Link
                href="/"
                onClick={() => setHamMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-300 active:bg-zinc-800"
              >
                <svg className="h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
                Home
              </Link>
              <div className="my-1.5 border-t border-zinc-800" />
              <Link
                href="/security-plus"
                onClick={() => setHamMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-300 active:bg-zinc-800"
              >
                <svg className="h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                Security+
              </Link>
              <Link
                href="/security-plus/mock-tests/1"
                onClick={() => setHamMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-300 active:bg-zinc-800"
              >
                <svg className="h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>
                Exams
              </Link>
              <Link
                href="/security-plus/flashcards"
                onClick={() => setHamMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-300 active:bg-zinc-800"
              >
                <svg className="h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-1.007.661-1.862 1.572-2.14z" /></svg>
                Flashcards
              </Link>
              <Link
                href="/security-plus/practice"
                onClick={() => setHamMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-300 active:bg-zinc-800"
              >
                <svg className="h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" /></svg>
                Practice
              </Link>
              <Link
                href="/security-plus/study"
                onClick={() => setHamMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-300 active:bg-zinc-800"
              >
                <svg className="h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                Study
              </Link>
              <Link
                href="/security-plus/syllabus"
                onClick={() => setHamMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-300 active:bg-zinc-800"
              >
                <svg className="h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0z" /></svg>
                Syllabus
              </Link>
            </nav>
            <div className="mt-6 border-t border-zinc-800 pt-4">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Exam Info</p>
              <div className="mt-2 space-y-1 text-[13px] text-zinc-400">
                <p>Mock Test {exam.testNumber}</p>
                <p>{answeredCount}/{exam.questions.length} answered</p>
                {flaggedCount > 0 ? <p>{flaggedCount} flagged</p> : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* ─── QUESTION AREA ─── */}
      <div
        ref={questionAreaRef}
        className="flex-1 overflow-y-auto px-2.5 pb-16 pt-2 sm:overflow-visible sm:px-0 sm:pb-0 sm:pt-0"
      >
        {/* Mobile: no card wrapper, direct content for max space */}
        <div className="sm:rounded-xl sm:border sm:border-zinc-800 sm:bg-zinc-900 sm:p-5">
          {/* Badges — desktop only */}
          <div className="mb-3 hidden flex-wrap items-center gap-2 sm:flex">
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

          {/* Mobile: multi-select hint — tiny, inline */}
          {multi ? (
            <p className="mb-1.5 text-[11px] font-medium text-violet-400 sm:hidden">
              Select {requiredSelections(currentQuestion)} answers
            </p>
          ) : null}

          {/* Scenario / Context Panel */}
          {currentQuestion.scenario ? (
            <div className="mb-3 sm:mb-4">
              <button
                type="button"
                onClick={() => setScenarioOpen((prev) => !prev)}
                className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-[13px] font-medium transition-colors sm:px-3.5 sm:py-2.5 sm:text-sm ${
                  scenarioOpen
                    ? "border-blue-500/40 bg-blue-950/30 text-blue-200"
                    : "border-zinc-700 bg-zinc-800/80 text-zinc-400 active:bg-zinc-700"
                }`}
              >
                <span className="text-sm">{scenarioOpen ? "▾" : "▸"}</span>
                <span>{scenarioOpen ? "Hide Context" : "Context"}</span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  scenarioOpen ? "mt-1.5 max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="rounded-lg border border-blue-500/20 bg-blue-950/20 p-3 text-[13px] leading-6 text-blue-100/90 sm:p-3.5 sm:text-sm sm:leading-7">
                  {currentQuestion.scenario}
                </div>
              </div>
            </div>
          ) : null}

          {/* Question prompt */}
          <p className="text-[15px] font-medium leading-[1.65] text-zinc-100 sm:text-lg sm:leading-8">
            {currentQuestion.prompt}
          </p>

          {/* Options — tighter on mobile */}
          <div className="mt-3 space-y-1.5 sm:mt-5 sm:space-y-3">
            {currentQuestion.options.map((option, optIndex) => {
              const selected = (answers[currentQuestion.id] || []).includes(option);
              return (
                <button
                  type="button"
                  key={option}
                  className={`group flex w-full items-start gap-2.5 rounded-lg border px-3 py-2 text-left transition-all duration-150 active:scale-[0.98] sm:gap-3 sm:rounded-xl sm:px-4 sm:py-3.5 ${
                    selected
                      ? "border-cyan-400/60 bg-cyan-950/40"
                      : "border-zinc-700/60 bg-zinc-800/60 active:bg-zinc-700"
                  }`}
                  onClick={() => toggleOption(currentQuestion.id, option, multi)}
                >
                  <span
                    className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-[11px] font-bold transition-colors sm:h-7 sm:w-7 sm:rounded-lg sm:text-xs ${
                      selected
                        ? "bg-cyan-500 text-zinc-900"
                        : "bg-zinc-700 text-zinc-400 group-hover:bg-zinc-600"
                    }`}
                  >
                    {OPTION_LABELS[optIndex] || optIndex + 1}
                  </span>
                  <span className={`text-[14px] leading-[1.5] sm:text-[15px] sm:leading-7 ${selected ? "text-cyan-100" : "text-zinc-200"}`}>
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
          <div className="mt-3 rounded-xl border border-zinc-800 bg-zinc-900 p-3 sm:mt-4 sm:p-5">
            <div className="mb-2 flex items-center justify-between sm:mb-3">
              <h3 className="text-sm font-semibold sm:text-base">Review</h3>
              <div className="flex gap-3 text-[10px] sm:text-[11px]">
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-sm bg-emerald-600" /> Done
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-sm bg-amber-600" /> Flag
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-sm bg-zinc-600" /> Skip
                </span>
              </div>
            </div>
            <div className="grid grid-cols-9 gap-1 sm:grid-cols-10 sm:gap-2">
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
                    className={`rounded py-1.5 text-[10px] font-medium sm:rounded-md sm:py-2 sm:text-xs ${
                      isCurrent
                        ? "ring-2 ring-cyan-400 ring-offset-1 ring-offset-zinc-900"
                        : ""
                    } ${
                      isFlagged
                        ? "bg-amber-700/80 text-amber-100"
                        : isAnswered
                          ? "bg-emerald-700/80 text-emerald-100"
                          : "bg-zinc-700/80 text-zinc-400"
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

      {/* ─── MOBILE BOTTOM BAR — single row of small icons ─── */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-zinc-700/50 bg-zinc-900/95 pb-[max(0.25rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:hidden">
        <div className="flex items-center justify-between px-4 py-1">
          {/* Prev */}
          <button
            type="button"
            disabled={index === 0}
            onClick={goPrev}
            className="flex h-8 w-8 items-center justify-center rounded-md active:bg-zinc-800 disabled:opacity-30"
            aria-label="Previous question"
          >
            <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          </button>

          {/* Flag */}
          <button
            type="button"
            onClick={() => setFlags((prev) => ({ ...prev, [currentQuestion.id]: !prev[currentQuestion.id] }))}
            className={`flex h-8 w-8 items-center justify-center rounded-md ${
              flags[currentQuestion.id]
                ? "text-amber-400"
                : "text-zinc-500 active:bg-zinc-800"
            }`}
            aria-label={flags[currentQuestion.id] ? "Unflag" : "Flag"}
          >
            <svg className="h-[18px] w-[18px]" fill={flags[currentQuestion.id] ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" /></svg>
          </button>

          {/* Review grid */}
          <button
            type="button"
            onClick={() => setReviewMode((prev) => !prev)}
            className={`flex h-8 w-8 items-center justify-center rounded-md ${
              reviewMode ? "text-cyan-400" : "text-zinc-500 active:bg-zinc-800"
            }`}
            aria-label="Review"
          >
            <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
          </button>

          {/* Submit */}
          <button
            type="button"
            onClick={() => setConfirmSubmit(true)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-cyan-400 active:bg-zinc-800"
            aria-label="Submit exam"
          >
            <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </button>

          {/* Next */}
          <button
            type="button"
            disabled={index === exam.questions.length - 1}
            onClick={goNext}
            className="flex h-8 w-8 items-center justify-center rounded-md active:bg-zinc-800 disabled:opacity-30"
            aria-label="Next question"
          >
            <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
          </button>
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
                Unanswered questions will be marked incorrect.
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
