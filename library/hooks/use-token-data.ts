import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useDatabase } from "@/hooks/use-database";
import { TokenTable } from "@/providers/db/config";

export const useTokenData = () => {
  const { db, isLoading: dbLoading, error: dbError } = useDatabase();
  const queryClient = useQueryClient();

  const tableQuery = (whereCondition?: Partial<TokenTable>) =>
    useQuery<TokenTable[], Error>({
      queryKey: ["token", whereCondition],
      queryFn: async () => {
        if (!db) throw new Error("Database is not initialized");
        let query = db.selectFrom("token").selectAll();

        if (whereCondition) {
          Object.entries(whereCondition).forEach(([key, value]) => {
            query = query.where(key as any, "=", value);
          });
        }

        return query.execute();
      },
      enabled: !dbLoading && !dbError,
    });

  const addToken = useMutation<
    void,
    Error,
    Omit<TokenTable, "updateAt" | "createAt">
  >({
    mutationFn: async (newData) => {
      if (!db) throw new Error("Database is not initialized");
      await db.insertInto("token").values(newData).execute();
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["token"] });
    },
  });

  const updateToken = useMutation<
    void,
    Error,
    { symbol: string; data: Partial<TokenTable> }
  >({
    mutationFn: async ({ symbol, data }) => {
      if (!db) throw new Error("Database is not initialized");
      await db
        .updateTable("token")
        .set(data)
        .where("symbol", "=", symbol)
        .execute();
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["token"] });
    },
  });

  const deleteToken = useMutation<void, Error, string>({
    mutationFn: async (symbol) => {
      if (!db) throw new Error("Database is not initialized");
      await db.deleteFrom("token").where("symbol", "=", symbol).execute();
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["token"] });
    },
  });

  return {
    tableQuery,
    addToken: (token: Omit<TokenTable, "updateAt" | "createAt">) =>
      addToken.mutate(token),
    updateToken: (symbol: string, token: Partial<TokenTable>) =>
      updateToken.mutate({ symbol, data: token }),
    deleteToken: (symbol: string) => deleteToken.mutate(symbol),
  };
};
