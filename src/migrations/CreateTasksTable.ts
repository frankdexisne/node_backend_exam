import db from "../db";

const taskMigration = db.run(
  `CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  description TEXT,
  status TEXT,
  user_id INTEGER,
  FOREIGN KEY (user_id) REFERENCES users (id)
)`,
  (err: Error) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Table created or already exists.");
  }
);

module.exports = taskMigration;
