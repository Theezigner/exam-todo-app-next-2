"use client";

import { useForm } from "react-hook-form";
import { useState, useRef } from "react";
import { FiEdit2 } from "react-icons/fi";

export type Todo = {
  id: number | string;
  title: string;
  completed: boolean;
};

type EditTodoModalProps = {
  todo: Todo;
  onUpdate: (updated: Todo) => Promise<void>;
};

type FormValues = {
  title: string;
  completed: "true" | "false";
};

export function EditTodoModal({ todo, onUpdate }: EditTodoModalProps) {
  const [isOpen, setIsOpen] = useState(false);
   const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef<HTMLElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: todo.title,
      completed: todo.completed ? ("true" as const) : ("false" as const),
    },
  });

  const open = () => {
    reset({
      title: todo.title,
      completed: todo.completed ? "true" : "false",
    });
    setIsOpen(true);
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    const updatedTodo = {
      ...todo,
      title: data.title.trim(),
      completed: data.completed === "true",
    };

    try {
      await onUpdate(updatedTodo); // 💥 Await the parent's update function
      setIsOpen(false);
      reset();
    } catch (error) {
      console.error("Failed to update todo:", error);
      // Optionally set an error message here
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
        className="btn btn-xs py-0"
        onClick={open}
        disabled={isSubmitting}
        aria-label={`Edit task: ${todo.title}`}
      >
        <FiEdit2 />
      </button>

      {isOpen && (
        <dialog
          // for HTML validity; DaisyUI also respects the utility classes
          open
          className="modal modal-open"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-modal-title"
        >
          <article
            className="modal-box"
            tabIndex={-1}
            ref={modalRef}
            onKeyDown={handleKeyDown}
          >
            <header>
              <h3 id="edit-modal-title" className="font-bold text-lg mb-2">
                Edit task
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

              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Status</span>
                <select
                  className="select select-bordered select-sm"
                  {...register("completed")}
                  defaultValue={todo.completed ? "true" : "false"}
                  disabled={isSubmitting}
                >
                  <option value="false">Not done</option>
                  <option value="true">Done</option>
                </select>
              </label>

              <footer className="modal-action">
                <button
                  type="submit"
                  className="btn btn-primary btn-sm shadow-none"
                  disabled={isSubmitting}
                >
                  Save
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
