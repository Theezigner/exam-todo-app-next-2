import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Link from "next/link";
import { Metadata } from "next";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

const getTodo = async (id: string): Promise<Todo> => {
  await new Promise((resolve) => setTimeout(resolve, 50));

  if (id === "1") {
    return { id: "1", title: "buy groceries", completed: true };
  } else if (id === "2") {
    return { id: "2", title: "finish client conversion", completed: false };
  }
  return { id: id, title: "unknown task", completed: false };
};

type TodoDetailParams = { id: string };

export async function generateMetadata({
  params,
}: {
  params: TodoDetailParams;
}): Promise<Metadata> {
  const todo = await getTodo(params.id);

  return {
    title: "Task Details",
    description: `Details for task: ${
      todo.title.charAt(0).toUpperCase() + todo.title.slice(1)
    }`,
  };
}

export default async function TodoDetailPage({
  params,
}: {
  params: TodoDetailParams;
}) {
  const todo = await getTodo(params.id);

  return (
    <main className="max-w-sm mx-auto p-4 space-y-4">
      <article className="border rounded bg-base-100 shadow-md space-y-3 p-4 text-center">
        <header>
          <h2 className="text-xl font-bold">Task Details</h2>
        </header>

        <p>
          <strong>Task:</strong>{" "}
          {todo.title.charAt(0).toUpperCase() + todo.title.slice(1)}
        </p>

        <p className="flex flex-row gap-2 justify-center">
          <strong>Status:</strong>{" "}
          {todo.completed ? (
            <span className="flex justify-center items-center gap-1 text-green-600">
              <FaCheckCircle /> Completed
            </span>
          ) : (
            <span className="flex items-center justify-center gap-1 text-red-600">
              <FaTimesCircle /> Not Completed
            </span>
          )}
        </p>
      </article>

      <footer className="flex justify-center">
        <Link href="/" className="btn btn-sm btn-outline">
          Back to Todo List
        </Link>
      </footer>
    </main>
  );
}
