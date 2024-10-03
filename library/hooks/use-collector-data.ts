import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Address } from "viem";

import { useDatabase } from "@/hooks/use-database";
import { CollectorTable } from "@/providers/db/config";
import { Collector, ServiceItem } from "@/types";

export const useCollectorData = () => {
  const { db, isLoading: dbLoading, error: dbError } = useDatabase();
  const queryClient = useQueryClient();

  const tableQuery = (whereCondition?: Partial<CollectorTable>) =>
    useQuery<Collector[], Error>({
      queryKey: ["collector", whereCondition],
      queryFn: async () => {
        if (!db) throw new Error("Database is not initialized");
        let query = db
          .selectFrom("collector")
          .leftJoin(
            "services_item",
            "collector.id",
            "services_item.collectorId"
          )
          .selectAll("collector")
          .select([
            "services_item.id as serviceId",
            "services_item.name as serviceName",
            "services_item.emojiCodePoint as serviceEmojiCodePoint",
            "services_item.price as servicePrice",
          ]);

        if (whereCondition) {
          Object.entries(whereCondition).forEach(([key, value]) => {
            query = query.where(`collector.${key}` as any, "=", value);
          });
        }

        const results = await query.execute();

        // Group the results by collector
        const collectorMap = new Map<number, Collector>();
        results.forEach((row) => {
          if (!collectorMap.has(row.id)) {
            collectorMap.set(row.id, {
              id: row.id,
              name: row.name,
              emojiCodePoint: row.emojiCodePoint,
              address: row.address as Address,
              privateKey: row.privateKey as Address | null,
              services: [],
            });
          }

          if (row.serviceId) {
            const collector = collectorMap.get(row.id)!;
            collector.services.push({
              id: row.serviceId,
              name: row.serviceName,
              emojiCodePoint: row.serviceEmojiCodePoint,
              price: row.servicePrice,
              collectorId: row.id,
            } as ServiceItem);
          }
        });

        return Array.from(collectorMap.values());
      },
      enabled: !dbLoading && !dbError,
    });

  const addCollector = useMutation<
    void,
    Error,
    Omit<CollectorTable, "id" | "updateAt" | "createAt">
  >({
    mutationFn: async (newData) => {
      if (!db) throw new Error("Database is not initialized");
      await db.insertInto("collector").values(newData).execute();
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["collector"] });
    },
  });

  const updateCollector = useMutation<
    void,
    Error,
    { id: number; data: Partial<CollectorTable> }
  >({
    mutationFn: async ({ id, data }) => {
      if (!db) throw new Error("Database is not initialized");
      await db
        .updateTable("collector")
        .set(data)
        .where("id", "=", id)
        .execute();
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["collector"] });
    },
  });

  return {
    tableQuery,
    addCollector: (
      collector: Omit<CollectorTable, "id" | "updateAt" | "createAt" | "services">
    ) => addCollector.mutateAsync(collector),
    updateCollector: (id: number, collector: Partial<CollectorTable>) =>
      updateCollector.mutate({ id, data: collector }),
  };
};
