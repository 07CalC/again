import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";


export const getAsyncDB = async () => {
  const env = (await getCloudflareContext({ async: true })).env;
  return drizzle(env.DB, { schema });
}

