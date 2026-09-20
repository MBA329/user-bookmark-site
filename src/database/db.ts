import {Kysely,PostgresDialect} from 'kysely'
import {Pool} from "pg";
import {env} from "../config/env";
import {Database} from "./schema";

export const db = new Kysely<Database>({
dialect: new PostgresDialect({
  pool: new Pool({
    connectionString: env.databaseUrl,
  }),
 
}),

})

