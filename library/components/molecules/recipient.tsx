"use client";

import Image from "next/image";

import { ScrollArea, ScrollBar } from "@/components/atoms/scroll-area";
import { Recipient } from "@/types";
import { isValidUrl } from "@/utils";

const RecipientHead = ({ item }: { item: Recipient }) => {
  const { address, name, type, avatarUrl } = item;

  return (
    <div className="flex items-center justify-between gap-4">
      <Image
        src={isValidUrl(avatarUrl) || `https://avatar.vercel.sh/${address}${name}`}
        alt={`${name} logo`}
        width={48}
        height={48}
        className="aspect-[1] rounded-full object-cover"
      />
      <div className="flex flex-col">
        <h3 className="text-lg w-fit font-semibold text-gray-800">{name}</h3>
        <span className="text-sm w-fit text-gray-600 capitalize">{type}</span>
      </div>
    </div>
  );
};

const RecipientBody = ({ item }: { item: Recipient }) => {
  const { address } = item;

  return (
    <div className="flex flex-col gap-4">
      <ScrollArea className="rounded-md border">
        <div className="flex space-x-4 p-4">
          {/* {flows.length > 0 ? (
            flows.map((flow) => (
              <div key={flow.id} className="shrink-0">
                <p className="text-sm mt-2 text-center">{flow.name}</p>
                <p className="text-sm font-bold">${flow.amount.toFixed(2)}</p>
              </div>
            ))
          ) : (
            <div className="w-[200px] h-[250px] flex flex-col items-center justify-center border rounded-md">
              <p className="text-gray-400 mb-2">No funding flow</p>
              <p className="text-sm">This recipient has no active flows</p>
              <p className="text-sm font-bold">$0</p>
            </div>
          )} */}

          <>TBD find flows from contract</>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export { RecipientBody, RecipientHead };
