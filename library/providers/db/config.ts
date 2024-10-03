import type { Selectable } from "kysely";
import type { InferDatabase } from "kysely-sqlite-builder/schema";
import { column, defineTable } from "kysely-sqlite-builder/schema";
import { Address } from "viem";

export const tables = {
  collective: defineTable({
    columns: {
      id: column.increments(),
      name: column.string({ notNull: true }),
      avatarUrl: column.string(),
      address: column.string({ notNull: true }).$cast<Address>(),
      voteToken: column.string({ notNull: true }).$cast<Address>(),
      description: column.string(),
    },
    index: ["name"],
    timeTrigger: { create: true, update: true },
  }),

  token: defineTable({
    columns: {
      symbol: column.string({ notNull: true }),
      name: column.string({ notNull: true }),
      address: column.string({ notNull: true }).$cast<Address>(),
    },
    primary: "symbol",
    index: ["address"],
    timeTrigger: { create: true, update: true },
  }),

  recipient: defineTable({
    columns: {
      id: column.increments(),
      name: column.string({ notNull: true }),
      avatarUrl: column.string(),
      address: column.string({ notNull: true }).$cast<Address>(),
      privateKey: column.string().$cast<Address>(),
      type: column
        .string({ notNull: true })
        .$cast<"organization" | "individual">(),
    },
    index: ["address", "type"],
    timeTrigger: { create: true, update: true },
  }),

  collective_fund: defineTable({
    columns: {
      id: column.increments(),
      name: column.string({ notNull: true }),
      emojiCodePoint: column.string({ notNull: true }),
      creator: column.string({ notNull: true }).$cast<Address>(),
      status: column.string({ notNull: true }).$cast<"Open" | "Closed">(),
      description: column.string(),
      tokenSymbol: column.string(),
      amount: column.float({ notNull: true }),
      stream: column.boolean({ notNull: true }),
      startTimestamp: column.int({ notNull: true }),
      endTimestamp: column.int({ notNull: true }),
      approvedCollectors: column.object({defaultTo: []}).$cast<Address[]>(),
    },
    index: ["creator", "status"],
    timeTrigger: { create: true, update: true },
  }),

  collector: defineTable({
    columns: {
      id: column.increments(),
      name: column.string({ notNull: true }),
      emojiCodePoint: column.string({ notNull: true }),
      address: column.string({ notNull: true }).$cast<Address>(),
      privateKey: column.string().$cast<Address>(),
    },
    index: ["address"],
    timeTrigger: { create: true, update: true },
  }),

  services_item: defineTable({
    columns: {
      id: column.increments(),
      name: column.string({ notNull: true }),
      emojiCodePoint: column.string({ notNull: true }),
      price: column.float({ notNull: true }),
      collectorId: column.int({ notNull: true }),
    },
    index: ["collectorId"],
    timeTrigger: { create: true, update: true },
  }),
};

export type DB = InferDatabase<typeof tables>;

export type CollectiveTable = Selectable<DB["collective"]>;
export type TokenTable = Selectable<DB["token"]>;
export type RecipientTable = Selectable<DB["recipient"]>;
export type CollectiveFundTable = Selectable<DB["collective_fund"]>;
export type CollectorTable = Selectable<DB["collector"]>;
export type ServicesItemTable = Selectable<DB["services_item"]>;
