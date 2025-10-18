"use client";

import { useForm } from "react-hook-form";
import { useState, useRef } from "react";
import { AiOutlinePlus } from "react-icons/ai";

type Todo = {
  id: string | number;
  title: string;
  completed: boolean;
};

type CreateTodoModalProps = {
  onAdd: (newTodo: Omit<Todo, "id">) => Promise<void>;
};

type FormValues = {
  title: string;
};

export function CreateTodoModal({ onAdd }: CreateTodoModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { title: "" },
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef<HTMLElement | null>(null);

  const onSubmit = async (data: FormValues) => {
    const title = data.title.trim();
    if (!title) return;
    setIsSubmitting(true);
    const newTodo = { title, completed: false };

    try {
      await onAdd(newTodo);
      setIsOpen(false);
      reset();
    } catch (error) {
      console.error("Failed to create todo:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      reset();
    }
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-primary btn-sm shadow-none"
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls="create-todo-modal"
      >
        <span aria-hidden="true">
          <AiOutlinePlus className="text-lg" />
        </span>
        <span className="hidden md:inline ml-1">New Task</span>
      </button>

      {isOpen && (
        <dialog
          id="create-todo-modal"
          open
          className="modal modal-open"
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-modal-title"
        >
          <article
            className="modal-box"
            tabIndex={-1}
            ref={modalRef}
            onKeyDown={handleKeyDown}
          >
            <header>
              <h3 id="create-modal-title" className="font-bold text-lg mb-2">
                Add a new task
              </h3>
            </header>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-2"
            >
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Title</span>
                <input
                  className="input input-bordered input-sm"
                  placeholder="Task title"
                  {...register("title", {
                    required: "Title is required.",
                    validate: (v) =>
                      v.trim().length > 0 || "Title cannot be empty.",
                  })}
                  autoFocus
                  disabled={isSubmitting}
                />
              </label>
              {errors.title && (
                <p className="text-red-500 text-xs">{errors.title.message}</p>
              )}

              <footer className="modal-action">
                <button
                  type="submit"
                  className="btn btn-primary btn-sm shadow-none"
                  disabled={isSubmitting}
                >
                  Add
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-ghost"
                  onClick={() => {
                    setIsOpen(false);
                    reset();
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </footer>
            </form>
          </article>
        </dialog>
      )}
    </>
  );
}
