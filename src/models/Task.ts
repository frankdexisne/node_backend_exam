import db from "../db";
import sqlite3 from "sqlite3";
interface TaskProps {
  id?: number;
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "Done";
  user_id?: number;
}

class Task {
  get(): Promise<TaskProps[]> {
    return new Promise((resolve, reject) => {
      let data: TaskProps[] = [];
      const query = `SELECT * FROM tasks`;
      db.all(query, [], (err: Error | null, rows: TaskProps[]) => {
        if (err) {
          return reject(err);
        }
        rows.forEach((row: TaskProps) => {
          const { id, title, description, status, user_id } = row;
          data.push({ id, title, description, status, user_id });
        });
        resolve(data);
      });
    });
  }
  find(id: number): Promise<TaskProps | undefined> {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM tasks WHERE id = ?`;
      db.get(query, [id], (err: Error | null, row: TaskProps) => {
        if (err) {
          return reject(err);
        }
        resolve(row);
      });
    });
  }

  update(id: number, task: TaskProps): Promise<void> {
    return new Promise((resolve, reject) => {
      const { title, description, status } = task;
      const query = `UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?`;
      db.run(
        query,
        [title, description, status, id],
        function (err: Error | null) {
          if (err) {
            return reject(err);
          }
          resolve();
        }
      );
    });
  }
  create(task: TaskProps): Promise<TaskProps> {
    const { title, description, status, user_id } = task;
    return new Promise((resolve, reject) => {
      const query =
        "INSERT INTO tasks (title, description, status, user_id) VALUES (?, ?, ?, ?)";
      db.run(
        query,
        [title, description, status, user_id],
        function (this: sqlite3.RunResult, err: Error | null) {
          if (err) {
            return reject(err);
          }
          const id = this.lastID;
          new Task().find(id).then((data) => resolve(data!));
        }
      );
    });
  }
  delete(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM tasks WHERE id = ?`;
      db.run(query, [id], function (err: Error | null) {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }
}

export default Task;
