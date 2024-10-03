import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDatabase } from "@/hooks/use-database";
import { RecipientTable } from "@/providers/db/config";

export const useRecipientData = () => {
  const { db, isLoading: dbLoading, error: dbError } = useDatabase();
  const queryClient = useQueryClient();

  const tableQuery = (whereCondition?: Partial<RecipientTable>) =>
    useQuery<RecipientTable[], Error>({
      queryKey: ["recipient", whereCondition],
      queryFn: async () => {
        if (!db) throw new Error("Database is not initialized");
        let query = db.selectFrom("recipient").selectAll();

        if (whereCondition) {
          Object.entries(whereCondition).forEach(([key, value]) => {
            query = query.where(key as any, "=", value);
          });
        }

        return query.execute();
      },
      enabled: !dbLoading && !dbError,
    });

  const addRecipient = useMutation<
    void,
    Error,
    Omit<RecipientTable, "id" | "updateAt" | "createAt">
  >({
    mutationFn: async (newData) => {
      if (!db) throw new Error("Database is not initialized");
      await db
        .insertInto("recipient")
        .values(newData)
        .execute();
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["recipient"] });
    },
  });

  const updateRecipient = useMutation<
    void,
    Error,
    { id: number; data: Partial<RecipientTable> }
  >({
    mutationFn: async ({ id, data }) => {
      if (!db) throw new Error("Database is not initialized");
      await db
        .updateTable("recipient")
        .set(data)
        .where("id", "=", id)
        .execute();
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["recipient"] });
    },
  });

  return {
    tableQuery,
    addRecipient: (recipient: Omit<RecipientTable, "id" | "updateAt" | "createAt">) =>
      addRecipient.mutate(recipient),
    updateRecipient: (id: number, recipient: Partial<RecipientTable>) =>
      updateRecipient.mutate({ id, data: recipient }),
  };
};