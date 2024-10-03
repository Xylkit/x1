"use client";

import React, { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/atoms/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/atoms/dialog";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { useCollectiveData } from "@/hooks/use-collective-data";
import { Address } from "viem";

const NewCollective = () => {
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [description, setDescription] = useState("");
  const [symbol, setSymbol] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [quorum, setQuorum] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const { addCollective } = useCollectiveData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!name || !symbol || !tokenName || !quorum) {
      toast.error("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      // TODO: Send to the blockchain

      const { address, voteToken } = {
        address: "0x" as Address,
        voteToken: "0x" as Address,
      };

      toast.success("Details sent. Waiting for confirmation...");

      addCollective({
        name,
        address,
        voteToken,
        avatarUrl,
        description,
      });

      toast.success("Collective created successfully!");

      setOpen(false);
      setName("");
      setAvatarUrl("");
      setDescription("");
      setSymbol("");
      setTokenName("");
      setQuorum("");
    } catch (error) {
      console.error("Error creating collective:", error);
      toast.error(
        `Failed to create collective: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex justify-end">
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="bg-zinc-800 text-white hover:bg-zinc-700 rounded-lg py-3 px-4"
          >
            New Collective
          </Button>
        </DialogTrigger>
      </div>
      <DialogContent className="sm:max-w-[425px] bg-white sm:rounded-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle>Create New Collective</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>General</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
            />
            <Input
              type="text"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="Logo URL (optional)"
            />
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
            />
          </div>

          <div className="space-y-2">
            <Label>Token</Label>
            <div className="flex space-x-2">
              <Input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="Symbol"
              />
              <Input
                type="text"
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
                placeholder="Token Name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Governance</Label>
            <Input
              id="notes"
              value={quorum}
              onChange={(e) => setQuorum(e.target.value)}
              placeholder="Quorum % (votes needed for a proposal to pass)"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-zinc-800 text-white hover:bg-zinc-700 rounded-lg py-3"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Collective..." : "Create Collective"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewCollective;
