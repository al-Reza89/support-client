import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/lib/axios-client";
import { Ticket } from "./useTickets";

export interface TicketDetailResponse {
  id: string;
  email: string;
  firstName: string;
  ticket: Ticket & {
    message: string; // The message field for the detailed view
  };
}

export const useTicket = (ticketId: string) => {
  return useQuery({
    queryKey: ["ticket", ticketId],
    queryFn: async (): Promise<TicketDetailResponse> => {
      const { data } = await axiosClient.get(`/api/tickets/${ticketId}`);
      return data;
    },
    enabled: !!ticketId,
  });
};
