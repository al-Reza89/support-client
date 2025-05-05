import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useCurrentUser } from "@/hooks/useCurrentUser";

// Internal cookie utility to avoid import issues
const getTokenFromCookies = (): string | undefined => {
  if (typeof document === "undefined") return undefined;

  const cookies = document.cookie.split(";");
  const tokenCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("access_token=")
  );
  if (tokenCookie) {
    return decodeURIComponent(tokenCookie.split("=")[1].trim());
  }
  return undefined;
};

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const { user, isLoading } = useCurrentUser();

  useEffect(() => {
    // Don't attempt to connect if user data is still loading
    if (isLoading) return;

    // Only connect if the user is authenticated
    if (!socketRef.current && user) {
      console.log("Initializing socket connection with credentials");

      try {
        // Initialize socket with withCredentials to send cookies automatically
        socketRef.current = io(
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
          {
            withCredentials: true, // This sends cookies automatically with the request
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            timeout: 10000,
          }
        );

        // Set up event listeners
        socketRef.current.on("connect", () => {
          console.log("Connected to WebSocket server", socketRef.current?.id);
          setIsConnected(true);
          setConnectionError(null);
        });

        socketRef.current.on("disconnect", (reason) => {
          console.log("Disconnected from WebSocket server:", reason);
          setIsConnected(false);
        });

        socketRef.current.on("connect_error", (error) => {
          console.error("Socket connection error:", error.message);
          setConnectionError(error.message);
          setIsConnected(false);
        });

        socketRef.current.on("error", (error) => {
          console.error("Socket error:", error);
          setConnectionError(
            typeof error === "string" ? error : "Unknown error"
          );
        });

        socketRef.current.on("reconnect_attempt", (attemptNumber) => {
          console.log(`Reconnection attempt ${attemptNumber}`);
        });

        socketRef.current.on("reconnect_failed", () => {
          console.error("Failed to reconnect to server");
          setConnectionError("Failed to reconnect after multiple attempts");
        });
      } catch (err) {
        console.error("Error creating socket connection:", err);
        setConnectionError("Failed to establish connection to server");
      }
    } else if (!user && !isLoading) {
      // User is not authenticated
      setConnectionError("Authentication required. Please log in.");

      // Disconnect if already connected
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
    }

    // Cleanup function to disconnect socket when component unmounts
    return () => {
      if (socketRef.current) {
        console.log("Disconnecting socket");
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
    };
  }, [user, isLoading]);

  // Join a specific ticket room
  const joinTicketRoom = (ticketId: string) => {
    if (!socketRef.current || !isConnected) {
      console.warn("Cannot join room: socket not connected");
      return;
    }

    console.log(`Joining ticket room: ${ticketId}`);
    socketRef.current.emit("joinTicket", ticketId);
  };

  // Leave a specific ticket room
  const leaveTicketRoom = (ticketId: string) => {
    if (!socketRef.current || !isConnected) {
      return;
    }

    console.log(`Leaving ticket room: ${ticketId}`);
    socketRef.current.emit("leaveTicket", ticketId);
  };

  // Listen for events on a specific ticket
  const onNewReply = (callback: (data: any) => void) => {
    if (!socketRef.current) {
      return () => {};
    }

    console.log("Setting up newReply listener");
    socketRef.current.on("newReply", callback);

    // Return cleanup function to remove listener
    return () => {
      if (socketRef.current) {
        console.log("Removing newReply listener");
        socketRef.current.off("newReply", callback);
      }
    };
  };

  // Listen for status changes on a specific ticket
  const onStatusChange = (callback: (data: any) => void) => {
    if (!socketRef.current) {
      return () => {};
    }

    console.log("Setting up statusChanged listener");
    socketRef.current.on("statusChanged", callback);

    // Return cleanup function to remove listener
    return () => {
      if (socketRef.current) {
        console.log("Removing statusChanged listener");
        socketRef.current.off("statusChanged", callback);
      }
    };
  };

  // Listen for when a user joins the room
  const onUserJoined = (callback: (data: any) => void) => {
    if (!socketRef.current) {
      return () => {};
    }

    socketRef.current.on("userJoined", callback);

    return () => {
      if (socketRef.current) {
        socketRef.current.off("userJoined", callback);
      }
    };
  };

  return {
    socket: socketRef.current,
    isConnected,
    connectionError,
    joinTicketRoom,
    leaveTicketRoom,
    onNewReply,
    onStatusChange,
    onUserJoined,
  };
};
