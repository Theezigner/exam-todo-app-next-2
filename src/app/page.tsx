"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../utils/axios";
import { CreateTodoModal } from "./components/createTodoModal";
import { EditTodoModal } from "./components/editTodoModal";
import { DeleteTodoModal } from "./components/deleteTodoModal";
import { toast } from "react-hot-toast";
import type { Todo } from "./components/editTodoModal";

import SignOutGithubButton from "./components/signout-github-button";

export default function HomePage() {
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const todosPerPage: number = 10;

  const {
    data: todos = [],
  } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: async (): Promise<Todo[]> => {
      const res = await axiosInstance.get<Todo[]>("/todos");
      return res.data;
    },
  });

  const filteredData = todos.filter((todo) =>
    todo.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const paginatedTodos = filteredData.slice(
    (currentPage - 1) * todosPerPage,
    currentPage * todosPerPage
  );
  const totalPages = Math.max(1, Math.ceil(filteredData.length / todosPerPage));

  const createTodoMutation = useMutation<Todo, Error, Omit<Todo, "id">>({
    mutationFn: async (newTodo: Omit<Todo, "id">): Promise<Todo> => {
      try {
        await axiosInstance.post<Todo>("/todos", newTodo);
      } catch (error) {
        console.log("JSONPlaceholder error (expected):", error);
      }

      const clientTodo: Todo = {
        id: `client-${Date.now()}`,
        ...newTodo,
      };

      return clientTodo;
    },
    onSuccess: (clientTodo: Todo): void => {
      toast.success("Task added!");
      queryClient.setQueryData<Todo[]>(
        ["todos"],
        (old: Todo[] = []): Todo[] => [clientTodo, ...old]
      );
    },
    onError: (): void => {
      toast.error("Failed to add task.");
    },
  });

  const updateTodoMutation = useMutation<Todo | void, Error, Todo>({
    mutationFn: async (updatedTodo: Todo): Promise<Todo | void> => {
      const { id, title, completed } = updatedTodo;

      const isClientTodo = String(id).startsWith("client-");

      if (isClientTodo) {
        return updatedTodo;
      }

      try {
        const res = await axiosInstance.put<Todo>(`/todos/${id}`, {
          title,
          completed,
          userId: 1,
        });
        return res.data;
      } catch (error) {
        console.log("JSONPlaceholder error, using local data:", error);
        return updatedTodo;
      }
    },
    onSuccess: (serverTodo: Todo | void, variables: Todo): void => {
      const next: Todo = (serverTodo as Todo) ?? variables;
      toast.success("Task updated!");
      queryClient.setQueryData<Todo[]>(["todos"], (old: Todo[] = []): Todo[] =>
        old.map((t: Todo) => (String(t.id) === String(next.id) ? next : t))
      );
    },
    onError: (): void => {
      toast.error("Failed to update task.");
    },
  });

  const deleteTodoMutation = useMutation<
    string | number,
    Error,
    string | number
  >({
    mutationFn: async (id: string | number): Promise<string | number> => {
      const isClientTodo = String(id).startsWith("client-");

      if (!isClientTodo) {
        try {
          await axiosInstance.delete(`/todos/${id}`);
        } catch (error) {
          console.log("JSONPlaceholder error (expected):", error);
        }
      }

      return id;
    },
    onSuccess: (id: string | number): void => {
      toast.success("Task deleted!");
      queryClient.setQueryData<Todo[]>(["todos"], (old = []) =>
        old.filter((t) => String(t.id) !== String(id))
      );
    },
    onError: (): void => {
      toast.error("Failed to delete task.");
    },
  });

  const handleAdd = async (newTodo: Omit<Todo, "id">): Promise<void> => {
    await createTodoMutation.mutateAsync(newTodo);
  };

  const handleUpdate = async (updatedTodo: Todo): Promise<void> => {
    await updateTodoMutation.mutateAsync(updatedTodo);
  };

  const handleDelete = (id: string | number): void => {
    deleteTodoMutation.mutate(id);
  };

  return (
    <main className="space-y-6 max-w-lg mx-auto px-4 py-6">
      <section className="flex justify-center">
        <form
          className="form-control w-full max-w-md"
          aria-label="Search todos"
        >
          <input
            type="text"
            className="input input-bordered input-sm w-full"
            placeholder="Search todos..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
            aria-label="Search todos by title"
          />
        </form>
      </section>

      <section className="flex justify-end">
        <CreateTodoModal onAdd={handleAdd} />
      </section>

      <section
        aria-label="Todo list"
        className="grid gap-4 rounded shadow-md bg-base-100 p-4"
      >
        {paginatedTodos.map((todo: Todo) => (
          <article
            key={todo.id}
            className="border-b border-base-300 pb-3 last:border-b-0"
            aria-label={`Todo: ${todo.title}`}
          >
            <header className="flex items-start gap-2 text-left">
              <h2 className="text-md font-semibold break-words">
                <Link
                  href={`/todo/${String(todo.id)}`}
                  className="link link-hover"
                >
                  {todo.title.charAt(0).toUpperCase() + todo.title.slice(1)}
                </Link>
              </h2>
              <EditTodoModal todo={todo} onUpdate={handleUpdate} />
            </header>

            <div className="flex items-center justify-between mt-1">
              <p>
                <span
                  className={`font-semibold ${
                    todo.completed ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {todo.completed ? "Done" : "Not done"}
                </span>
              </p>
              <DeleteTodoModal todo={todo} onDelete={handleDelete} />
            </div>
          </article>
        ))}
      </section>

      <nav
        className="flex justify-center items-center gap-4 mt-6"
        aria-label="Pagination controls"
      >
        <button
          className="btn btn-sm"
          onClick={(): void =>
            setCurrentPage((prev: number) => Math.max(prev - 1, 1))
          }
          disabled={currentPage === 1}
          aria-label="Go to previous page"
        >
          Prev
        </button>

        <span className="text-sm font-medium">
          Page {currentPage} of {totalPages}
        </span>

        <button
          className="btn btn-sm"
          onClick={(): void =>
            setCurrentPage((prev: number) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          aria-label="Go to next page"
        >
          Next
        </button>
      </nav>
      <SignOutGithubButton />
    </main>
  );
}
