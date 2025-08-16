// hooks/useSocket.ts - Fixed version
import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

interface StatsData {
  total: number;
  fitur: number;
  komunikasi: number;
  aktif: number;
  expired: number;
  dokumen: number;
  lastUpdated: string;
}

interface UseSocketReturn {
  socket: Socket | null;
  connected: boolean;
  stats: StatsData | null;
  loading: boolean;
  error: string | null;
  refreshStats: () => void;
  requestStatsWithFilters: (filters: any) => void;
}

export const useSocket = (): UseSocketReturn => {
  const [connected, setConnected] = useState(false);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const isInitialized = useRef(false);

  // Memoize callbacks to prevent recreating on every render
  const refreshStats = useCallback(() => {
    if (socketRef.current && connected) {
      setLoading(true);
      socketRef.current.emit("refresh_stats");
    }
  }, [connected]);

  const requestStatsWithFilters = useCallback(
    (filters: any) => {
      if (socketRef.current && connected) {
        setLoading(true);
        socketRef.current.emit("request_stats_with_filters", filters);
      }
    },
    [connected]
  );

  useEffect(() => {
    // Prevent double initialization in development mode
    if (isInitialized.current) return;
    isInitialized.current = true;

    const initializeSocket = () => {
      try {
        const raw = localStorage.getItem("marcom-auth-store");
        const token = raw ? JSON.parse(raw)?.state?.token : null;

        if (!token) {
          setError("No authentication token found");
          setLoading(false);
          return;
        }

        // Check if socket already exists and is connected
        if (socketRef.current?.connected) {
          return;
        }

        // Disconnect existing socket if any
        if (socketRef.current) {
          socketRef.current.disconnect();
        }

        console.log("Initializing socket connection...");

        // Initialize socket connection
        const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
          path: "/socket.io",
          auth: {
            token: token,
          },
          forceNew: true, // Force new connection
          transports: ["websocket", "polling"], // Try websocket first, fallback to polling
        });

        socketRef.current = socket;

        // Connection events
        socket.on("connect", () => {
          console.log("Connected to Socket.IO server");
          setConnected(true);
          setError(null);
          // Request initial stats with a small delay
          setTimeout(() => {
            socket.emit("request_stats");
          }, 100);
        });

        socket.on("disconnect", (reason) => {
          console.log("Disconnected from Socket.IO server:", reason);
          setConnected(false);
          if (reason === "io server disconnect") {
            // Server disconnected, try to reconnect
            setTimeout(() => socket.connect(), 1000);
          }
        });

        socket.on("connect_error", (error) => {
          console.error("Socket connection error:", error);
          setError(`Failed to connect: ${error.message}`);
          setConnected(false);
          setLoading(false);
        });

        // Stats events
        socket.on("stats_update", (newStats: StatsData) => {
          console.log("Received stats update:", newStats);
          setStats(newStats);
          setLoading(false);
          setError(null);
        });

        socket.on("stats_error", (error: { message: string }) => {
          console.error("Stats error:", error);
          setError(error.message);
          setLoading(false);
        });
      } catch (err) {
        console.error("Socket initialization error:", err);
        setError("Failed to initialize socket connection");
        setLoading(false);
      }
    };

    // Initialize with a small delay to ensure DOM is ready
    const timer = setTimeout(initializeSocket, 100);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      if (socketRef.current) {
        console.log("Cleaning up socket connection...");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      isInitialized.current = false;
    };
  }, []); // Empty dependency array is correct here

  return {
    socket: socketRef.current,
    connected,
    stats,
    loading,
    error,
    refreshStats,
    requestStatsWithFilters,
  };
};
