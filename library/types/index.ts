import { Address } from "viem";

export interface Collective {
  id: number;
  name: string;
  address: string;
  voteToken: string;
  avatarUrl: string | null;
  description: string | null;
}

export interface Recipient {
  id: number;
  name: string;
  avatarUrl: string | null;
  address: Address;
  privateKey: Address | null;
  type: "organization" | "individual";
}

export interface Collector {
  id: number;
  name: string;
  emojiCodePoint: string;
  address: Address;
  privateKey: Address | null;
  services: ServiceItem[];
}

export type Token = {
  symbol: string;
  name: string;
  address: Address;
};

export interface RecipientFlow {
  id: number;
  token: Token;
  name: string;
  description: string | null;
  amount: number;
  duration: string;
  allocation: string;
  recipient: Address;
  creator: Address;
}

export interface ServiceItem {
  id: number;
  name: string;
  emojiCodePoint: string;
  price: number;
}

export interface CollectiveFund {
  id: number;
  name: string;
  emojiCodePoint: string;
  creator: Address;
  status: "Open" | "Closed";
  description: string | null;
  token: Token;
  amount: number;
  stream: boolean;
  startTimestamp: number;
  endTimestamp: number;
  approvedCollectors: Address[];
}

export interface FundRecipient {
  address: string;
  name: string;
  status:
    | "None"
    | "Pending"
    | "Accepted"
    | "Rejected"
    | "Appealed"
    | "InReview";
}
