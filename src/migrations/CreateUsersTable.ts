import db from "../db";

const userMigration = db.run(
  `CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT UNIQUE,
  password TEXT
)`,
  (err: Error) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Table created or already exists.");
  }
);

module.exports = userMigration;
