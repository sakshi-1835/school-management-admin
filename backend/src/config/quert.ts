import db from "./db";

export const createTables = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(100),
      password VARCHAR(255),
      role VARCHAR(50) DEFAULT 'user'
    );
  `);

  console.log("Tables created");
};



export const createClassesTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS classes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      class_name VARCHAR(50) NOT NULL
    );
  `);

  console.log("Classes table created");
};

export const createSectionsTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS sections (
      id INT AUTO_INCREMENT PRIMARY KEY,
      section_name ENUM('A','B','C'),
      class_id INT,
      class_teacher_id INT,
      FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
      FOREIGN KEY (class_teacher_id) REFERENCES users(id) ON DELETE SET NULL
    );
  `);

  console.log("Sections table created");
};

export const createStudentsTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS students (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      age INT,
      class_id INT,
      section_id INT,
      FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
      FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
    );
  `);

  console.log("Students table created");
};