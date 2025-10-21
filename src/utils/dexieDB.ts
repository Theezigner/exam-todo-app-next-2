import Dexie from "dexie";
import type { Table } from "dexie"; 

export type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

export class TodoDB extends Dexie {
  todos!: Table<Todo, number>;
  constructor() {
    super("TodoAppDB");
    this.version(1).stores({
      todos: "id, title, completed",
    });
  }
}

export const db = new TodoDB();
