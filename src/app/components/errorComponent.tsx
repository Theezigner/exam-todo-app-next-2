"use client";

import Link from "next/link";

type ErrorComponentProps = {
  error: unknown;
};

export function ErrorComponent({ error }: ErrorComponentProps) {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
      ? error
      : "Something went wrong.";

  return (
    <main role="alert" aria-live="assertive" className="p-4 text-red-600">
      <header>
        <h2 className="font-bold text-lg">🚫 Error</h2>
      </header>
      <p>{message || "Something went wrong."}</p>
      <footer className="mt-4">
        <Link href="/" className="btn btn-sm btn-outline">
          Back to Todo List
        </Link>
      </footer>
    </main>
  );
}
