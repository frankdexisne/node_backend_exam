import { resolve } from "path";
import db from "../db";
import sqlite3 from "sqlite3";
export interface UserProps {
  id?: number;
  name: string;
  email: string;
  password: string;
}

class User {
  get(): Promise<UserProps[]> {
    return new Promise((resolve, reject) => {
      let data: UserProps[] = [];
      const query = `SELECT * FROM users`;
      db.all(query, [], (err: Error | null, rows: UserProps[]) => {
        if (err) {
          return reject(err);
        }
        rows.forEach((row: UserProps) => {
          const { id, name, email, password } = row;
          data.push({ id, name, email, password });
        });
        resolve(data);
      });
    });
  }
  find(id: number): Promise<UserProps | undefined> {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM users WHERE id = ?`;
      db.get(query, [id], (err: Error | null, row: UserProps) => {
        if (err) {
          return reject(err);
        }
        resolve(row);
      });
    });
  }

  update(id: number, user: UserProps): Promise<void> {
    return new Promise((resolve, reject) => {
      const query = `UPDATE users SET email = ?, name = ?, password = ? WHERE id = ?`;
      db.run(
        query,
        [user.email, user.name, user.password, id],
        function (err: Error | null) {
          if (err) {
            return reject(err);
          }
          resolve();
        }
      );
    });
  }
  create(user: UserProps): Promise<UserProps> {
    const { name, email, password } = user;
    return new Promise((resolve, reject) => {
      const query =
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
      db.run(
        query,
        [name, email, password],
        function (this: sqlite3.RunResult, err: Error | null) {
          if (err) {
            return reject(err);
          }
          const id = this.lastID;
          new User().find(id).then((data) => resolve(data!));
        }
      );
    });
  }
  delete(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM users WHERE id = ?`;
      db.run(query, [id], function (err: Error | null) {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }
  authenticate(
    email: string,
    password: string
  ): Promise<UserProps | undefined> {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM users WHERE email = ? AND password = ?`;
      db.get(query, [email, password], (err: Error | null, row: UserProps) => {
        if (err) {
          return reject(err);
        }
        resolve(row);
      });
    });
  }
  findByEmail(email: string): Promise<UserProps | undefined> {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM users WHERE email = ?`;
      db.get(query, [email], (err: Error | null, row: UserProps) => {
        if (err) {
          return reject(err);
        }
        resolve(row);
      });
    });
  }
}

export default User;
