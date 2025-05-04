"use client";

import React, { useState } from "react";
import { useTickets } from "@/hooks/useTickets";
import { TicketsTable } from "@/components/ui/TicketsTable";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { CreateTicketModal } from "@/components/tickets/CreateTicketModal";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const Tickets = () => {
  const { data, isLoading, isError } = useTickets();
  const { user } = useCurrentUser();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const isAgent = user?.role === "AGENT";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
        <h2 className="text-2xl font-bold text-red-500">
          Error loading tickets
        </h2>
        <p className="text-gray-500">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card className="bg-white dark:bg-gray-950 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-2xl font-bold">
              {isAgent ? "All Support Tickets" : "My Support Tickets"}
            </CardTitle>
            <CardDescription>
              {isAgent
                ? "Manage and respond to customer support tickets"
                : "Track and manage your support requests"}
            </CardDescription>
          </div>
          {!isAgent && (
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Create Ticket
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {data && (
            <TicketsTable
              email={data.email}
              name={data.firstName}
              tickets={data.tickets}
            />
          )}
        </CardContent>
      </Card>

      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default Tickets;
