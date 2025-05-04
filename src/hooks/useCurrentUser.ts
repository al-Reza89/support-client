import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/lib/axios-client";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "USER" | "AGENT";
  profileImage: string | null;
}

export function useCurrentUser() {
  const query = useQuery({
    queryKey: ["currentUser"],
    queryFn: async (): Promise<User> => {
      const { data } = await axiosClient.get("/api/users/me");
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    user: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
