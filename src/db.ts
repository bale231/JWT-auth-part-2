import pgPromise from "pg-promise";

const db = pgPromise()("postgres://postgres:postgres@localhost:5342/postgres");
const setupDb = async () => {
  await db.none(`
    DROP TABLE IF EXISTS planets;

    CREATE TABLE planets (
      id SERIAL NOT NULL PRIMARY KEY,
      name TEXT NOT NULL,
      image TEXT
    );

    DROP TABLE IF EXISTS users;
    
    CREATE TABLE users (
        id SERIAL NOT NULL PRIMARY KEY,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        token TEXT
    );

  `);

  await db.none(`
      INSERT INTO planets (name)
      VALUES ('Earth'),
             ('Moon'),
             ('Saturn'),
             ('Jupiter')
  `);
  await db.none(
    `INSERT INTO users (username, password) VALUES ('dummy', 'dummy')`
  );

  const planets = await db.many(`SELECT * FROM planets;`);
  const users = await db.many(`SELECT * FROM users`);
  console.log(planets);
  console.log(users);
};

setupDb();

export { db };
