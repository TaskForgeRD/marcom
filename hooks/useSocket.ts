// hooks/useSocket.ts - Updated to handle chart data from backend
import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

interface ChartDataPoint {
  month: string;
  monthName: string;
  value: number;
}

interface StatsData {
  total: number;
  fitur: number;
  komunikasi: number;
  aktif: number;
  expired: number;
  dokumen: number;
  lastUpdated: string;
  appliedFilters?: any; // For debugging filtered stats
  chartData?: {
    total: ChartDataPoint[];
    fitur: ChartDataPoint[];
    komunikasi: ChartDataPoint[];
    aktif: ChartDataPoint[];
    expired: ChartDataPoint[];
    dokumen: ChartDataPoint[];
  };
}

interface FilterParams {
  brand?: string;
  cluster?: string;
  fitur?: string;
  jenis?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  search?: string;
  onlyVisualDocs?: boolean;
}

interface UseSocketReturn {
  socket: Socket | null;
  connected: boolean;
  stats: StatsData | null;
  loading: boolean;
  error: string | null;
  refreshStats: () => void;
  requestFilteredStats: (filters: FilterParams) => void;
  refreshFilteredStats: (filters: FilterParams) => void;
}

export const useSocket = (): UseSocketReturn => {
  const [connected, setConnected] = useState(false);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("marcom-auth-store");
    const token = raw ? JSON.parse(raw)?.state?.token : null;

    if (!token) {
      setError("No authentication token found");
      setLoading(false);
      return;
    }

    // Initialize socket connection
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      path: "/socket.io",
      transports: ["websocket"],
      withCredentials: true,
      auth: {
        token: token,
      },
    });

    socketRef.current = socket;

    // Connection events
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
      setConnected(true);
      setError(null);
      // Request initial stats (unfiltered)
      socket.emit("request_stats");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
      setConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setError("Failed to connect to real-time server");
      setConnected(false);
      setLoading(false);
    });

    // Stats events
    socket.on("stats_update", (newStats: StatsData) => {
      console.log("Received stats update with chart data:", newStats);
      setStats(newStats);
      setLoading(false);
      setError(null);
    });

    socket.on("stats_error", (error: { message: string }) => {
      console.error("Stats error:", error);
      setError(error.message);
      setLoading(false);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  // Refresh unfiltered stats
  const refreshStats = useCallback(() => {
    if (socketRef.current && connected) {
      setLoading(true);
      socketRef.current.emit("request_stats");
    }
  }, [connected]);

  // Request filtered stats
  const requestFilteredStats = useCallback(
    (filters: FilterParams) => {
      if (socketRef.current && connected) {
        console.log("Requesting filtered stats with:", filters);
        setLoading(true);
        socketRef.current.emit("request_filtered_stats", filters);
      }
    },
    [connected]
  );

  // Refresh filtered stats
  const refreshFilteredStats = useCallback(
    (filters: FilterParams) => {
      if (socketRef.current && connected) {
        console.log("Refreshing filtered stats with:", filters);
        setLoading(true);
        socketRef.current.emit("refresh_filtered_stats", filters);
      }
    },
    [connected]
  );

  return {
    socket: socketRef.current,
    connected,
    stats,
    loading,
    error,
    refreshStats,
    requestFilteredStats,
    refreshFilteredStats,
  };
};
