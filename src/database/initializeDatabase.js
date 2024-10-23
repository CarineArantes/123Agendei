export async function initializeDatabase(database) {
  
  // await database.execAsync(`
  //   DROP TABLE IF EXISTS affinity;
  // `);
  // await database.execAsync(`
  //   DROP TABLE IF EXISTS costumerService;
  // `);
  // await database.execAsync(`
  //   DROP TABLE IF EXISTS service;
  // `);
  // await database.execAsync(`
  //   DROP TABLE IF EXISTS employees;
  // `);

  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      active INTEGER NOT NULL,
      name TEXT NOT NULL,
      createAt TEXT NOT NULL
    );
  `);

  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS service (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      active INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      favorite INTEGER NOT NULL,
      createAt TEXT NOT NULL
    );
  `);

  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS affinity (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employeeId INTEGER NOT NULL,
      serviceId INTEGER NOT NULL,
      FOREIGN KEY (employeeId) REFERENCES employees(id),
      FOREIGN KEY (serviceId) REFERENCES service(id)
    );
  `);

  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS CostumerService (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      active INTEGER NOT NULL DEFAULT 1,
      clientName TEXT NOT NULL,
      clientPhone TEXT NOT NULL,
      serviceType TEXT NOT NULL,
      schedulingDate TEXT NOT NULL,
      schedulingTime TEXT NOT NULL,
      createAt TEXT NOT NULL,
      servedAt TEXT DEFAULT NULL,
      employeeId INTEGER,
      serviceId INTEGER,
      FOREIGN KEY (employeeId) REFERENCES employees(id),
      FOREIGN KEY (serviceId) REFERENCES service(id)
    );
  `);
}
