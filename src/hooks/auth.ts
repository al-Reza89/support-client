import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/lib/axios-client";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async (): Promise<User> => {
      const { data } = await axiosClient.get("/api/auth");
      return data.data;
    },
    retry: false,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await axiosClient.post("/api/auth/signin", credentials);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      window.location.reload();
      router.push("/");
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      await axiosClient.post("/api/auth/logout");
    },
    onSuccess: () => {
      queryClient.clear();
      window.location.reload();
      router.push("/signin");
    },
  });
};

export const useSignup = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await axiosClient.post("/api/auth/signup", credentials);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      router.push("/notice");
    },
  });
};

// http://localhost:3000/api/auth/google?redirect_url=http://localhost:3001

export const signInOrUpGoogle = async (redirect_url: string) => {
  const url = `/api/auth/google?redirect_url=${redirect_url}`;
  console.log(url);

  const { data } = await axiosClient.get(url);
  return data;
};
