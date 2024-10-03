import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Address } from "viem";

import { useDatabase } from "@/hooks/use-database";
import { CollectiveFundTable } from "@/providers/db/config";
import { CollectiveFund } from "@/types";

export const useCollectiveFundData = () => {
  const { db, isLoading: dbLoading, error: dbError } = useDatabase();
  const queryClient = useQueryClient();

  const tableQuery = (whereCondition?: Partial<CollectiveFundTable>) =>
    useQuery<CollectiveFund[], Error>({
      queryKey: ["collective_fund", whereCondition],
      queryFn: async () => {
        if (!db) throw new Error("Database is not initialized");
        let query = db
          .selectFrom("collective_fund")
          .leftJoin("token", "collective_fund.tokenSymbol", "token.symbol")
          .selectAll("collective_fund")
          .select([
            "token.symbol as tokenSymbol",
            "token.name as tokenName",
            "token.address as tokenAddress",
          ]);

        if (whereCondition) {
          Object.entries(whereCondition).forEach(([key, value]) => {
            query = query.where(`collective_fund.${key}` as any, "=", value);
          });
        }

        const results = await query.execute();

        return results.map((row) => ({
          ...row,
          stream: row.stream ? true : false,
          token: row.tokenSymbol
            ? {
                symbol: row.tokenSymbol,
                name: row.tokenName,
                address: row.tokenAddress,
              }
            : ({} as any),
        }));
      },
      enabled: !dbLoading && !dbError,
    });

  const addCollectiveFund = useMutation<
    void,
    Error,
    Omit<CollectiveFundTable, "id" | "updateAt" | "createAt">
  >({
    mutationFn: async (fund) => {
      if (!db) throw new Error("Database is not initialized");
      await db
        .insertInto("collective_fund")
        .values({
          ...fund,
          stream: fund.stream as any,
        })
        .execute();
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["collective_fund"],
      });
    },
  });

  const updateCollectiveFund = useMutation<
    void,
    Error,
    { id: number; fund: Partial<CollectiveFundTable> }
  >({
    mutationFn: async ({ id, fund }) => {
      if (!db) throw new Error("Database is not initialized");
      await db
        .updateTable("collective_fund")
        .set({
          ...fund,
          stream: fund.stream as any,
        })
        .where("id", "=", id)
        .execute();
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["collective_fund"],
      });
    },
  });

  const approveCollector = useMutation<
    void,
    Error,
    { fundId: number; collectorAddress: Address }
  >({
    mutationFn: async ({ fundId, collectorAddress }) => {
      if (!db) throw new Error("Database is not initialized");
      const fund = await db
        .selectFrom("collective_fund")
        .selectAll()
        .where("id", "=", fundId)
        .executeTakeFirst();
      if (!fund) throw new Error(`Fund with id ${fundId} not found`);

      const approvedCollectors = [...(fund.approvedCollectors || [])];
      if (!approvedCollectors.includes(collectorAddress)) {
        approvedCollectors.push(collectorAddress);
        await db
          .updateTable("collective_fund")
          .set({ approvedCollectors })
          .where("id", "=", fundId)
          .execute();
      }
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["collective_fund"],
      });
    },
  });

  return {
    tableQuery,
    addCollectiveFund: (
      fund: Omit<CollectiveFundTable, "id" | "updateAt" | "createAt">
    ) => addCollectiveFund.mutate(fund),
    updateCollectiveFund: (id: number, fund: Partial<CollectiveFundTable>) =>
      updateCollectiveFund.mutate({ id, fund }),
    approveCollector,
  };
};
