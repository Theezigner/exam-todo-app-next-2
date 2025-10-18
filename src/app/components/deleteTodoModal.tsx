"use client";

import { useState, useRef } from "react";
import { FiTrash2 } from "react-icons/fi";

type Todo = {
  id: string | number;
  title: string;
  completed: boolean;
};

type DeleteTodoModalProps = {
  todo: Todo;
  onDelete: (id: string | number) => void;
};

export function DeleteTodoModal({ todo, onDelete }: DeleteTodoModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLElement | null>(null);

  const handleDelete = () => {
    onDelete(todo.id);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-xs py-0 hover:text-red-600 border-none"
        aria-label={`Delete task: ${todo.title}`}
        onClick={() => setIsOpen(true)}
      >
        <span aria-hidden="true">
          <FiTrash2 />
        </span>
      </button>

      {isOpen && (
        <dialog
          open
          className="modal modal-open"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
        >
          <article
            className="modal-box"
            tabIndex={-1}
            ref={modalRef}
            onKeyDown={handleKeyDown}
          >
            <header>
              <h3 id="delete-modal-title" className="font-bold text-lg mb-2">
                Delete task
              </h3>
            </header>

            <p>
              Are you sure you want to delete{" "}
              <span className="font-semibold">"{todo.title}"</span>?
            </p>

            <footer className="modal-action">
              <button
                type="button"
                className="btn btn-sm btn-error bg-red-700 hover:bg-red-800 text-white border-none shadow-none"
                onClick={handleDelete}
              >
                Yes, Delete
              </button>
              <button
                type="button"
                className="btn btn-sm btn-ghost"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
            </footer>
          </article>
        </dialog>
      )}
    </>
  );
}
