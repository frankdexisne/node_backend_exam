import User, { UserProps } from "../models/User";
import db from "../db";
import bcryptjs from "bcryptjs";

const email: string = "admin@admin.com";
const password: string = "123456";
const name: string = "Administrator";

const query = `SELECT * FROM users WHERE email = ?`;
bcryptjs.hash(password, 12).then((hashPassword) => {
  db.get(query, [email], (err: Error | null, row: UserProps) => {
    if (err) {
      return;
    }
    if (!row) {
      new User().create({
        email,
        name,
        password: hashPassword,
      });
    }
  });
});
