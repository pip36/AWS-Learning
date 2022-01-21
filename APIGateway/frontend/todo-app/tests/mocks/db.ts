import { generateTodo, Todo } from "../../src/domain/Todo";

type DbData = {
  todos: { [key: string]: Todo };
};

const DEFAULT_TODO_COUNT = 5;

class Db {
  data: DbData = { todos: {} };

  clear(): void {
    this.data = { todos: {} };
  }

  seed(): void {
    this.seedTodos();
  }

  seedTodos(options: { count: number } = { count: DEFAULT_TODO_COUNT }): void {
    this.data.todos = Array(options.count)
      .fill(0)
      .map(generateTodo)
      .reduce((a, x) => ({ ...a, [x.id]: x }), {} as DbData["todos"]);
  }

  getTodos(): Todo[] {
    return Object.entries(this.data.todos).map(([_, todo]) => todo);
  }

  addTodo(todo: Todo): void {
    this.data.todos[todo.id] = todo;
  }

  deleteTodo(id: string): void {
    delete this.data.todos[id];
  }
}

const db = new Db();
db.seed();

export default db;
