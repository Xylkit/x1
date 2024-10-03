import { sql } from "kysely";
import { SqliteBuilder } from "kysely-sqlite-builder";
import { useSchema } from "kysely-sqlite-builder/schema";
import { WaSqliteWorkerDialect } from "kysely-wasqlite-worker";
import React, { createContext, useEffect, useState } from "react";
import { toast } from "sonner";

import type { DB } from "./config";
import { tables } from "./config";

interface DatabaseContextType {
  db: SqliteBuilder<DB> | null;
  isLoading: boolean;
  error: Error | null;
}

export const DatabaseContext = createContext<DatabaseContextType | null>(null);

const DatabaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<DatabaseContextType>({
    db: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const initDB = async () => {
      try {
        const dialect = new WaSqliteWorkerDialect({
          fileName: "xylkit",
          preferOPFS: true,
        });

        const db = new SqliteBuilder<DB>({
          dialect,
          onQuery: true,
        });

        // Check if tables exist using raw SQL
        const tableCheckQuery = sql`
          SELECT name FROM sqlite_master 
          WHERE type='table' AND name NOT LIKE 'sqlite_%';
        `;

        const existingTables = await db.execute(tableCheckQuery);

        if (existingTables.rows.length === 0) {
          // If no tables exist, sync the schema
          const result = await db.syncDB(useSchema(tables));

          if (!result.ready) {
            throw result.error || new Error("Failed to initialize database");
          }
          console.log("Database schema synced successfully");
        } else {
          console.log("Tables already exist, skipping schema sync");
        }

        setState({ db, isLoading: false, error: null });
      } catch (error) {
        console.error("Failed to initialize database:", error);
        toast.error(
          "Failed to initialize database. Please use a supported browser."
        );
        setState({ db: null, isLoading: false, error: error as Error });
      }
    };

    initDB();

    return () => {
      state.db?.destroy();
    };
  }, []);

  return (
    <DatabaseContext.Provider value={state}>
      {children}
    </DatabaseContext.Provider>
  );
};

export default DatabaseProvider;
