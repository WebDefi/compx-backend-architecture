import { initRemoteDatabase } from "./dataSource/db/initDatabase";
import server from "./server";

(async () => {
  await server.initServer("3000", "0.0.0.0");
  await initRemoteDatabase();
})();
