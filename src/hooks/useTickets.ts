import { useQuery } from "@tanstack/react-query";
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

export const useTickets = () => {
  return useQuery({
    queryKey: ["tickets"],
    queryFn: async (): Promise<TicketResponse> => {
      const { data } = await axiosClient.get("/api/tickets");
      return data;
    },
  });
};
