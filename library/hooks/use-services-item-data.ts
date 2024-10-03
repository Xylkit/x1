import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDatabase } from "@/hooks/use-database";
import { ServicesItemTable } from "@/providers/db/config";

export const useServicesItemData = () => {
  const { db, isLoading: dbLoading, error: dbError } = useDatabase();
  const queryClient = useQueryClient();

  const fetchServicesItems = async (whereCondition?: Partial<ServicesItemTable>) => {
    if (!db) throw new Error("Database is not initialized");
    let query = db.selectFrom("services_item").selectAll();

    if (whereCondition) {
      Object.entries(whereCondition).forEach(([key, value]) => {
        query = query.where(key as any, "=", value);
      });
    }

    return query.execute();
  };

  const tableQuery = (whereCondition?: Partial<ServicesItemTable>) =>
    useQuery<ServicesItemTable[], Error>({
      queryKey: ["services_item", whereCondition],
      queryFn: () => fetchServicesItems(whereCondition),
      enabled: !dbLoading && !dbError,
    });

  const addServicesItem = useMutation<
    void,
    Error,
    Omit<ServicesItemTable, "id" | "updateAt" | "createAt">
  >({
    mutationFn: async (newData) => {
      if (!db) throw new Error("Database is not initialized");
      await db.insertInto("services_item").values(newData).execute();
    },
    onSuccess: (_, variables) => {
      queryClient.refetchQueries({ queryKey: ["services_item"] });
      if (variables.collectorId) {
        queryClient.refetchQueries({
          queryKey: ["services_item", { collectorId: variables.collectorId }],
        });
      }
    },
  });

  const updateServicesItem = useMutation<
    void,
    Error,
    { id: number; data: Partial<ServicesItemTable> }
  >({
    mutationFn: async ({ id, data }) => {
      if (!db) throw new Error("Database is not initialized");
      await db
        .updateTable("services_item")
        .set(data)
        .where("id", "=", id)
        .execute();
    },
    onSuccess: (_, variables) => {
      queryClient.refetchQueries({ queryKey: ["services_item"] });
      if (variables.data.collectorId) {
        queryClient.refetchQueries({
          queryKey: [
            "services_item",
            { collectorId: variables.data.collectorId },
          ],
        });
      }
    },
  });

  const itemsByCollector = (collectorId: number) => tableQuery({ collectorId });

  // This function can be called safely from event handlers
  const fetchItemsByCollector = async (collectorId: number) => {
    return fetchServicesItems({ collectorId });
  };

  return {
    tableQuery,
    addServicesItem: (
      item: Omit<ServicesItemTable, "id" | "updateAt" | "createAt">
    ) => addServicesItem.mutate(item),
    updateServicesItem: (id: number, item: Partial<ServicesItemTable>) =>
      updateServicesItem.mutate({ id, data: item }),
    itemsByCollector, // This is still a hook and should only be used in React components
    fetchItemsByCollector, // This can be called from event handlers or other non-React contexts
  };
};