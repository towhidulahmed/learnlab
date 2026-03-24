"use client";

import { ExamAttempt } from "@/lib/exam";

const STUDY_PROGRESS_KEY = "secplus-study-progress-v1";
const ATTEMPTS_KEY = "secplus-attempts-v1";

export const loadStudyProgress = (): Record<number, boolean> => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(STUDY_PROGRESS_KEY);
    if (!raw) {
      return {};
    }
    return JSON.parse(raw) as Record<number, boolean>;
  } catch {
    return {};
  }
};

export const saveStudyProgress = (state: Record<number, boolean>) => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STUDY_PROGRESS_KEY, JSON.stringify(state));
};

export const loadAttempts = (): ExamAttempt[] => {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(ATTEMPTS_KEY);
    if (!raw) {
      return [];
    }
    return JSON.parse(raw) as ExamAttempt[];
  } catch {
    return [];
  }
};

export const saveAttempt = (attempt: ExamAttempt) => {
  const existing = loadAttempts();
  const next = [...existing, attempt];
  if (typeof window !== "undefined") {
    window.localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(next));
  }
  return attempt;
};

export const getAttemptById = (attemptId: string) => loadAttempts().find((attempt) => attempt.id === attemptId) || null;

export const getLatestAttemptForTest = (testNumber: number) => {
  const filtered = loadAttempts().filter((attempt) => attempt.testNumber === testNumber);
  return filtered.length ? filtered[filtered.length - 1] : null;
};
