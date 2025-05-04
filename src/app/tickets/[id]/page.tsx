"use client";

import React, { useState, useEffect } from "react";
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
import { ArrowLeft, CheckCircle, Send, XCircle } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { useParams } from "next/navigation";
import { MarkdownEditor } from "@/components/ui/MarkdownEditor";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "react-toastify";
import { Reply } from "@/hooks/useTicket";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function TicketDetailPage() {
  const params = useParams();
  const ticketId = params.id as string;
  const { data, isLoading, isError, addReply, updateTicketStatus } =
    useTicket(ticketId);
  const [replyContent, setReplyContent] = useState("");
  const { user } = useCurrentUser();
  const isAgent = user?.role === "AGENT";

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
  const isTicketClosed = ticket.status === "CLOSED";

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }

    try {
      await addReply.mutateAsync({ content: replyContent });
      setReplyContent("");
      toast.success("Reply added successfully");
    } catch (error) {
      toast.error("Failed to add reply");
      console.error(error);
    }
  };

  const handleStatusChange = async (newStatus: "OPEN" | "CLOSED") => {
    try {
      await updateTicketStatus.mutateAsync({ status: newStatus });
      toast.success(
        `Ticket ${newStatus === "CLOSED" ? "closed" : "reopened"} successfully`
      );
    } catch (error) {
      toast.error(
        `Failed to ${newStatus === "CLOSED" ? "close" : "reopen"} ticket`
      );
      console.error(error);
    }
  };

  // Helper function to get initials from name
  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Helper to determine if a reply is from the ticket creator
  const isFromTicketCreator = (reply: Reply) => {
    return reply.author.id === data.id;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-4">
        <Link href="/tickets">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tickets
          </Button>
        </Link>
      </div>

      <Card className="mb-6 bg-white dark:bg-gray-950 shadow-sm">
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
            <div className="flex items-center gap-2">
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

              {isAgent && (
                <div className="flex gap-2 ml-4">
                  {isTicketClosed ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange("OPEN")}
                      className="flex items-center gap-1"
                      disabled={updateTicketStatus.isPending}
                    >
                      <CheckCircle className="h-4 w-4" />
                      Reopen
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange("CLOSED")}
                      className="flex items-center gap-1 text-red-500 hover:text-red-600"
                      disabled={updateTicketStatus.isPending}
                    >
                      <XCircle className="h-4 w-4" />
                      Close
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-start border p-4 rounded-lg">
            <Avatar className="h-10 w-10">
              <AvatarImage src={null} alt={firstName} />
              <AvatarFallback>{getInitials(firstName)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex justify-between mb-2">
                <div className="font-semibold text-sm">{firstName}</div>
                <div className="text-xs text-muted-foreground">
                  {format(new Date(ticket.createdAt), "MMM dd, yyyy HH:mm")}
                </div>
              </div>
              <div className="prose prose-stone dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-primary prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:p-1 prose-code:rounded text-sm">
                <ReactMarkdown>{ticket.message}</ReactMarkdown>
              </div>
            </div>
          </div>

          {/* Display replies */}
          {ticket.replies && ticket.replies.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Replies</h3>
              <div className="space-y-4">
                {ticket.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className={`flex gap-4 items-start border p-4 rounded-lg ${
                      isFromTicketCreator(reply) ? "ml-0" : "ml-8"
                    }`}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={reply.author.profileImage || undefined}
                        alt={reply.author.name}
                      />
                      <AvatarFallback>
                        {getInitials(reply.author.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <div className="font-semibold text-sm flex items-center gap-2">
                          {reply.author.name}
                          {reply.author.role === "AGENT" && (
                            <Badge variant="outline" className="text-xs">
                              Support Agent
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(
                            new Date(reply.createdAt),
                            "MMM dd, yyyy HH:mm"
                          )}
                        </div>
                      </div>
                      <div className="prose prose-stone dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-primary prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:p-1 prose-code:rounded text-sm">
                        <ReactMarkdown>{reply.content}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between items-center border-t pt-4">
          <div className="text-sm text-muted-foreground">
            Ticket ID: {ticket.id}
          </div>
          <div className="text-sm text-muted-foreground">
            Updated: {format(new Date(ticket.updatedAt), "MMM dd, yyyy")}
          </div>
        </CardFooter>
      </Card>

      {/* Reply form - only show if ticket is open */}
      {!isTicketClosed ? (
        <Card className="bg-white dark:bg-gray-950 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Add a Reply</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReply} className="space-y-4">
              <MarkdownEditor
                value={replyContent}
                onChange={setReplyContent}
                placeholder="Write your reply here..."
                height="min-h-[150px]"
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={addReply.isPending || !replyContent.trim()}
                  className="flex items-center gap-2"
                >
                  {addReply.isPending ? "Submitting..." : "Submit Reply"}
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
          <p className="text-muted-foreground">
            This ticket is closed. {isAgent && "Reopen it to add replies."}
          </p>
        </div>
      )}
    </div>
  );
}
