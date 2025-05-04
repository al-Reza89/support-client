"use client";

import React from "react";
import { useTickets } from "@/hooks/useTickets";
import { TicketsTable } from "@/components/ui/TicketsTable";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Tickets = () => {
  const { data, isLoading, isError } = useTickets();

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
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Support Tickets</CardTitle>
          <CardDescription>
            Manage and track customer support tickets
          </CardDescription>
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
    </div>
  );
};

export default Tickets;
