import { Client } from "pg";

const query = async (queryObject) => {
  const client = new Client({
    user: "dev_pg_user",
    database: "dev_pg_db",
    password: "dev_pg_pass",
    host: "localhost",
    port: 5432,
  });

  try {
    await client.connect();
    const result = await client.query(queryObject);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    client.end();
  }
};

export default {
  query,
};
