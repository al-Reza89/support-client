"use client";

import { Ticket } from "@/hooks/useTickets";
import { DataTable } from "./DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ExternalLink } from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";
import { format } from "date-fns";
import { useState } from "react";
import Link from "next/link";

interface TicketsTableProps {
  email: string;
  name: string;
  tickets: Ticket[];
}

export function TicketsTable({ email, name, tickets }: TicketsTableProps) {
  // Add userEmail and userName properties to each ticket for sorting
  const processedTickets = tickets.map((ticket) => ({
    ...ticket,
    userEmail: email,
    userName: name,
  }));

  const columns: ColumnDef<Ticket & { userEmail: string; userName: string }>[] =
    [
      {
        accessorKey: "id",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Ticket ID
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="font-medium truncate max-w-[150px]">
            {row.getValue("id")}
          </div>
        ),
      },
      {
        accessorKey: "userEmail",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Email
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => <div>{row.getValue("userEmail")}</div>,
      },
      {
        accessorKey: "userName",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => <div>{row.getValue("userName")}</div>,
      },
      {
        accessorKey: "subject",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Subject
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => <div>{row.getValue("subject")}</div>,
      },
      {
        accessorKey: "status",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Status
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const status = row.getValue("status") as string;

          return (
            <Badge
              variant={
                status === "OPEN"
                  ? "default"
                  : status === "CLOSED"
                  ? "secondary"
                  : "outline"
              }
            >
              {status}
            </Badge>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Created At
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const date = new Date(row.getValue("createdAt"));
          return <div>{format(date, "MMM dd, yyyy")}</div>;
        },
      },
      {
        id: "actions",
        header: "View Message",
        cell: ({ row }) => {
          const ticketId = row.getValue("id") as string;
          return (
            <Link href={`/tickets/${ticketId}`} className="flex items-center">
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                title="View Message"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
              <span className="ml-2">View Message</span>
            </Link>
          );
        },
      },
    ];

  return (
    <DataTable data={processedTickets} columns={columns} searchKey="subject" />
  );
}
