import { initRemoteDatabase } from "./dataSource/db/initDatabase";
import server from "./server";

(async () => {
  await server.initServer("3001", "0.0.0.0");
  await initRemoteDatabase();
})();
