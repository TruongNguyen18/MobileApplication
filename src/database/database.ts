import * as SQLite from "expo-sqlite";
export const db = SQLite.openDatabaseSync("finance_v7.db");
