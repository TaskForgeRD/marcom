// hooks/useSocket.ts - Simplified to handle only unfiltered stats
import { useFilterStore } from "@/stores/filter-materi.store";
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
  chartData?: {
    total: ChartDataPoint[];
    fitur: ChartDataPoint[];
    komunikasi: ChartDataPoint[];
    aktif: ChartDataPoint[];
    expired: ChartDataPoint[];
    dokumen: ChartDataPoint[];
  };
}

interface UseSocketReturn {
  socket: Socket | null;
  connected: boolean;
  stats: StatsData | null;
  loading: boolean;
  error: string | null;
  refreshStats: () => void;
}

export const useSocket = (): UseSocketReturn => {
  const { getCurrentFilters } = useFilterStore();
  const { brand, start_date, end_date } = getCurrentFilters();

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
      setConnected(true);
      setError(null);
      // Always request unfiltered stats
      socket.emit("request_stats", { brand, start_date, end_date });
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setError("Failed to connect to real-time server");
      setConnected(false);
      setLoading(false);
    });

    socket.on("stats_loading", () => {
      setLoading(true);
      setError(null);
    });

    socket.on("has_update", () => {
      setLoading(true);
      setError(null);
      socket.emit("request_stats", { brand, start_date, end_date });
    });
    // Stats events
    socket.on("stats_update", (newStats: StatsData) => {
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

  // Refresh unfiltered stats only
  const refreshStats = useCallback(() => {
    if (socketRef.current && connected) {
      setLoading(true);
      socketRef.current.emit("request_stats", { brand, start_date, end_date });
    }
  }, [connected]);

  return {
    socket: socketRef.current,
    connected,
    stats,
    loading,
    error,
    refreshStats,
  };
};
