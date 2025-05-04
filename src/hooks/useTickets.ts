import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/lib/axios-client";

export interface Ticket {
  id: string;
  subject: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface TicketResponse {
  id: string;
  email: string;
  firstName: string;
  tickets: Ticket[];
}

export interface CreateTicketInput {
  subject: string;
  message: string;
}

export const useTickets = () => {
  const queryClient = useQueryClient();

  // Query for fetching tickets
  const query = useQuery({
    queryKey: ["tickets"],
    queryFn: async (): Promise<TicketResponse> => {
      const { data } = await axiosClient.get("/api/tickets");
      return data;
    },
  });

  // Mutation for creating a ticket
  const createTicket = useMutation({
    mutationFn: async (ticketData: CreateTicketInput) => {
      const { data } = await axiosClient.post("/api/tickets", ticketData);
      return data;
    },
    onSuccess: () => {
      // Invalidate the tickets query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });

  return {
    ...query,
    createTicket,
  };
};
