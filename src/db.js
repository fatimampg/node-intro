import fs from "node:fs/promises";

const DB_PATH = new URL("../db.json", import.meta.url).pathname;

export const getDB = async () => {
  const db = await fs.readFile(DB_PATH, "utf-8");
  return JSON.parse(db); //json string -> JavaScript object
};

export const saveDB = async (db) => {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2)); //take the stringify and space it by 2 spaces (formatting the json file)
  return db;
};

export const insert = async (data) => {
  const db = await getDB(); //json string -> JavaScript object
  db.notes.push(data); // (mutation of the original array)
  await saveDB(db); // JavaScript object -> json string and save it (the entire database was changed)
  return data;
};
