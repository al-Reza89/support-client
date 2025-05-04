import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/lib/axios-client";
import { Ticket } from "./useTickets";

export interface Author {
  id: string;
  name: string;
  email: string;
  profileImage: string | null;
  role: string;
}

export interface Reply {
  id: string;
  content: string;
  createdAt: string;
  author: Author;
}

export interface TicketDetailResponse {
  id: string;
  email: string;
  firstName: string;
  ticket: Ticket & {
    message: string; // The original message
    replies: Reply[]; // All subsequent replies
  };
}

export interface AddReplyInput {
  content: string;
}

export interface UpdateStatusInput {
  status: "OPEN" | "CLOSED";
}

export const useTicket = (ticketId: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["ticket", ticketId],
    queryFn: async (): Promise<TicketDetailResponse> => {
      const { data } = await axiosClient.get(`/api/tickets/${ticketId}`);
      return data;
    },
    enabled: !!ticketId,
  });

  const addReply = useMutation({
    mutationFn: async (replyData: AddReplyInput) => {
      const { data } = await axiosClient.post(
        `/api/tickets/${ticketId}/replies`,
        replyData
      );
      return data;
    },
    onSuccess: () => {
      // Invalidate the ticket query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["ticket", ticketId] });
    },
  });

  const updateTicketStatus = useMutation({
    mutationFn: async (statusData: UpdateStatusInput) => {
      const { data } = await axiosClient.patch(
        `/api/tickets/${ticketId}/status`,
        statusData
      );
      return data;
    },
    onSuccess: () => {
      // Invalidate both the ticket and tickets list queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["ticket", ticketId] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });

  return {
    ...query,
    addReply,
    updateTicketStatus,
  };
};
