import * as SQLite from "expo-sqlite";
export const db = SQLite.openDatabaseSync("finance_v6.db");
