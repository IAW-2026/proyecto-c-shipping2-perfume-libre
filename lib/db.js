import { Pool } from "pg";

export const db = new Pool({
   /* URL de conexión obtenida desde las variables de entorno 
   (.env.local-variables locales en vercel)*/
  connectionString: process.env.DATABASE_URL,

  ssl: {
    rejectUnauthorized: false,
  },
});