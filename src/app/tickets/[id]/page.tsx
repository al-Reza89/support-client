"use client";

import React from "react";
import { useTicket } from "@/hooks/useTicket";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { useParams } from "next/navigation";

export default function TicketDetailPage() {
  const params = useParams();
  const ticketId = params.id as string;
  const { data, isLoading, isError } = useTicket(ticketId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
        <h2 className="text-2xl font-bold text-red-500">
          Error loading ticket
        </h2>
        <p className="text-gray-500 mb-4">
          The ticket could not be found or there was an error loading it.
        </p>
        <Link href="/tickets">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tickets
          </Button>
        </Link>
      </div>
    );
  }

  const { ticket, email, firstName } = data;

  return (
    <div className="p-6">
      <div className="mb-4">
        <Link href="/tickets">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tickets
          </Button>
        </Link>
      </div>

      <Card className="bg-white dark:bg-gray-950 shadow-sm">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold">
                {ticket.subject}
              </CardTitle>
              <CardDescription>
                Submitted by {firstName} ({email})
              </CardDescription>
            </div>
            <Badge
              variant={
                ticket.status === "OPEN"
                  ? "default"
                  : ticket.status === "CLOSED"
                  ? "secondary"
                  : "outline"
              }
              className="text-sm"
            >
              {ticket.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-stone dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-primary prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:p-1 prose-code:rounded">
            <ReactMarkdown>{ticket.message}</ReactMarkdown>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="text-sm text-muted-foreground">
            Ticket ID: {ticket.id}
          </div>
          <div className="text-sm text-muted-foreground">
            Created: {format(new Date(ticket.createdAt), "MMM dd, yyyy")}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
