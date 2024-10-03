import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useDatabase } from "@/hooks/use-database";
import { CollectiveTable } from "@/providers/db/config";

export const useCollectiveData = () => {
  const { db, isLoading: dbLoading, error: dbError } = useDatabase();
  const queryClient = useQueryClient();

  const tableQuery = (whereCondition?: Partial<CollectiveTable>) =>
    useQuery<CollectiveTable[], Error>({
      queryKey: ["collective", whereCondition],
      queryFn: async () => {
        if (!db) throw new Error("Database is not initialized");
        let query = db.selectFrom("collective").selectAll();

        if (whereCondition) {
          Object.entries(whereCondition).forEach(([key, value]) => {
            query = query.where(key as any, "=", value);
          });
        }

        return query.execute();
      },
      enabled: !dbLoading && !dbError,
    });

  const addCollective = useMutation<
    void,
    Error,
    Omit<CollectiveTable, "id" | "updateAt" | "createAt">
  >({
    mutationFn: async (newData) => {
      if (!db) throw new Error("Database is not initialized");
      await db.insertInto("collective").values(newData).execute();
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["collective"] });
    },
  });

  const updateCollective = useMutation<
    void,
    Error,
    { id: number; data: Partial<CollectiveTable> }
  >({
    mutationFn: async ({ id, data }) => {
      if (!db) throw new Error("Database is not initialized");
      await db
        .updateTable("collective")
        .set(data)
        .where("id", "=", id)
        .execute();
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["collective"] });
    },
  });

  return {
    tableQuery,
    addCollective: (
      collective: Omit<CollectiveTable, "id" | "updateAt" | "createAt">
    ) => addCollective.mutate(collective),
    updateCollective: (id: number, collective: Partial<CollectiveTable>) =>
      updateCollective.mutate({ id, data: collective }),
  };
};
