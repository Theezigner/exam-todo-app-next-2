'use client';

import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: unknown;
};

export class ErrorBoundary extends Component <
  ErrorBoundaryProps,
  ErrorBoundaryState
>{
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: unknown): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Global Error Caught:", error, errorInfo);
  }

  private getErrorMessage(error: unknown): string {
    if (typeof error === "string") return error;

    if (error instanceof Error) {
      const msg = error.message ?? "";

      if (/Network Error/i.test(msg)) {
        return "You appear to be offline. Please check your connection.";
      }
      if (/404/.test(msg)) {
        return "The page you are looking for could not be found.";
      }
      if (/500/.test(msg)) {
        return "Internal server error. Please try again later.";
      }
      if (msg) return msg;
    }

    return "An unexpected error occurred.";
  }

  render(): ReactNode {
    const { hasError, error } = this.state;

    if (hasError) {
      const errorMessage = this.getErrorMessage(error);

      return (
        <main
          role="alert"
          aria-live="assertive"
          className="p-6 text-red-700 bg-red-100 rounded max-w-xl mx-auto mt-10"
        >
          <header>
            <h2 className="text-2xl font-bold mb-2">An error occurred</h2>
          </header>
          <p>{errorMessage}</p>
        </main>
      );
    }

    return this.props.children;
  }
}