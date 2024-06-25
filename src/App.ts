import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import cors from "cors";
import { login } from "./controllers/AuthController";
import {
  index as userIndex,
  store as userStore,
  show as userShow,
  update as userUpdate,
  destroy as userDestroy,
} from "./controllers/UserController";
import {
  index as taskIndex,
  store as taskStore,
  show as taskShow,
  update as taskUpdate,
  destroy as taskDelete,
} from "./controllers/TaskController";
import { authenticateToken } from "./middleware/authenticate-token";
import { query, body } from "express-validator";
// import { UserProps } from "./models/User";

// declare module "express-session" {
//   interface SessionData {
//     user: UserProps;
//   }
// }

const App = express();

App.use(cors());
App.use(bodyParser.json());
App.use(express.urlencoded({ extended: true }));
App.use(
  session({
    secret: "this-my-session-secret-key",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000, secure: false },
  })
);

App.post(
  "/auth/login",
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
  login
);
App.get("/users", authenticateToken, userIndex);
App.post(
  "/users",
  authenticateToken,
  body("name").notEmpty().withMessage("Name is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
  userStore
);
App.get("/users/:id", authenticateToken, userShow);
App.put(
  "/users/:id",
  authenticateToken,
  body("name").notEmpty().withMessage("Name is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
  userUpdate
);
App.delete("/users/:id", authenticateToken, userDestroy);
App.get("/tasks", authenticateToken, taskIndex);
App.post(
  "/tasks",
  authenticateToken,
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("status").notEmpty().withMessage("Status is required"),
  taskStore
);
App.get("/tasks/:id", authenticateToken, taskShow);
App.put(
  "/tasks/:id",
  authenticateToken,
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("status").notEmpty().withMessage("Status is required"),
  taskUpdate
);
App.delete("/tasks/:id", authenticateToken, taskDelete);

export default App;
