"use client";

import { useEffect, useMemo, useState } from "react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const answeredCount = useMemo(() => Object.keys(answers).filter((key) => answers[Number(key)]?.length > 0).length, [answers]);

  const requiredSelections = (question: QuestionPayload) => (question.type === "multiple-choice-multiple" ? 3 : 1);

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
        }, 160);
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
    return <p className="text-zinc-400">Loading exam...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-20 rounded-xl border border-zinc-700 bg-zinc-900 p-2.5 sm:top-4 sm:p-4">
        <div className="flex items-center justify-between gap-2 sm:flex-wrap sm:gap-3">
          <div className="flex items-center gap-2 sm:hidden">
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="rounded-md border border-zinc-600 bg-zinc-800 px-2.5 py-1.5 text-sm"
            >
              ☰
            </button>
            <p className="text-xs font-semibold text-zinc-200">Mock {exam.testNumber} • Q {index + 1}/{exam.questions.length}</p>
          </div>
          <div className="hidden sm:block">
            <h2 className="text-base font-semibold sm:text-lg">Mock Test {exam.testNumber}</h2>
            <p className="text-xs text-zinc-400 sm:text-sm">
              Question {index + 1} of {exam.questions.length} • Answered {answeredCount}
            </p>
          </div>
          <div className="rounded-md border border-amber-500 bg-amber-950/40 px-2.5 py-1 text-lg font-bold text-amber-300 sm:px-4 sm:py-2 sm:text-2xl">
            {formatTime(timeLeft)}
          </div>
        </div>

        {mobileMenuOpen ? (
          <div className="mt-2 grid gap-2 sm:hidden">
            <Link onClick={() => setMobileMenuOpen(false)} href="/" className="rounded-md bg-zinc-800 px-3 py-2 text-sm">
              Home
            </Link>
            <Link onClick={() => setMobileMenuOpen(false)} href="/study" className="rounded-md bg-zinc-800 px-3 py-2 text-sm">
              Study
            </Link>
          </div>
        ) : null}
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3 sm:p-4">
        {currentQuestion.scenario ? (
          <p className="mb-3 rounded-md bg-zinc-800 p-3 text-sm leading-6 text-zinc-300">
            {currentQuestion.scenario}
          </p>
        ) : null}
        <p className="text-base font-medium leading-7 sm:text-lg sm:leading-8">{currentQuestion.prompt}</p>

        <div className="mt-3 space-y-2 sm:mt-4 sm:space-y-2.5">
          {currentQuestion.options.map((option) => {
            const selected = (answers[currentQuestion.id] || []).includes(option);
            const multi = currentQuestion.type !== "multiple-choice-single";
            return (
              <button
                type="button"
                key={option}
                className={`min-h-[52px] w-full rounded-md border px-3 py-2.5 text-left text-base leading-6 sm:min-h-[56px] sm:px-3.5 sm:py-3 sm:text-base ${
                  selected ? "border-cyan-500 bg-cyan-950/30" : "border-zinc-700 bg-zinc-800 hover:bg-zinc-700"
                }`}
                onClick={() => toggleOption(currentQuestion.id, option, multi)}
              >
                {option}
              </button>
            );
          })}
        </div>

        <div className="mt-10 border-t border-zinc-800 pt-4 sm:mt-8 sm:pt-4">
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          <button
            type="button"
            onClick={() => setFlags((prev) => ({ ...prev, [currentQuestion.id]: !prev[currentQuestion.id] }))}
            className="col-span-2 rounded-md border border-zinc-600 px-3 py-2.5 text-sm hover:bg-zinc-800 sm:col-span-1"
          >
            {flags[currentQuestion.id] ? "Unflag" : "Flag for Review"}
          </button>
          <button
            type="button"
            disabled={index === 0}
            onClick={() => setIndex((prev) => Math.max(0, prev - 1))}
            className="rounded-md border border-zinc-600 px-3 py-2.5 text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={index === exam.questions.length - 1}
            onClick={() => setIndex((prev) => Math.min(exam.questions.length - 1, prev + 1))}
            className="rounded-md border border-zinc-600 px-3 py-2.5 text-sm disabled:opacity-50"
          >
            Next
          </button>
          <button
            type="button"
            onClick={() => setReviewMode((prev) => !prev)}
            className="col-span-2 rounded-md border border-zinc-600 px-3 py-2.5 text-sm hover:bg-zinc-800 sm:col-span-1"
          >
            {reviewMode ? "Hide Review" : "Review All Answers"}
          </button>
          <button
            type="button"
            onClick={() => void submitExam(false)}
            className="col-span-2 rounded-md bg-cyan-700 px-3 py-2.5 text-sm font-semibold hover:bg-cyan-600 sm:ml-auto sm:col-span-1"
          >
            {submitting ? "Submitting..." : "Submit Exam"}
          </button>
          </div>
        </div>
      </div>

      {reviewMode ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3 sm:p-4">
          <h3 className="font-semibold">Answer Review</h3>
          <div className="mt-3 grid grid-cols-6 gap-2 sm:grid-cols-10">
            {exam.questions.map((question, questionIndex) => {
              const isAnswered = (answers[question.id] || []).length > 0;
              const isFlagged = !!flags[question.id];
              return (
                <button
                  key={question.id}
                  type="button"
                  onClick={() => {
                    setIndex(questionIndex);
                    setReviewMode(false);
                  }}
                  className={`rounded-md px-2 py-1.5 text-xs ${
                    isFlagged
                      ? "bg-amber-700"
                      : isAnswered
                        ? "bg-emerald-700"
                        : "bg-zinc-700"
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
  );
}
