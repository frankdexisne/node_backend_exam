import { createServer } from "http";
import dotenv from "dotenv";

import App from "./App";

dotenv.config();

require("./migrations/CreateUsersTable");
require("./migrations/CreateTasksTable");
require("./seeders/UsersTableSeeder");

const httpServer = createServer(App);

httpServer.listen(80);
