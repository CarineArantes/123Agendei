export async function initializeDatabase(database) {
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS costumerService (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      clientName TEXT NOT NULL,
      clientPhone TEXT NOT NULL,
      serviceType TEXT NOT NULL,
      schedulingDate TEXT NOT NULL,
      schedulingTime TEXT NOT NULL
    );
  `)
}