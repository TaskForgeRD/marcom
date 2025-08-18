import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

interface MonthlyData {
  month: string;
  value: number;
}

interface DetailedMonthlyData {
  total: MonthlyData[];
  fitur: MonthlyData[];
  komunikasi: MonthlyData[];
  aktif: MonthlyData[];
  expired: MonthlyData[];
  dokumen: MonthlyData[];
}

interface StatsData {
  total: number;
  fitur: number;
  komunikasi: number;
  aktif: number;
  expired: number;
  dokumen: number;
  lastUpdated: string;
  monthlyData?: DetailedMonthlyData;
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

  const refreshStats = useCallback(() => {
    if (socketRef.current && connected) {
      setLoading(true);
      socketRef.current.emit("refresh_stats");
      socketRef.current.emit("request_monthly_stats");
    }
  }, [connected]);

  const requestStatsWithFilters = useCallback(
    (filters: any) => {
      if (socketRef.current && connected) {
        setLoading(true);
        socketRef.current.emit("request_stats_with_filters", filters);
        socketRef.current.emit("request_monthly_stats_with_filters", filters);
      }
    },
    [connected]
  );

  useEffect(() => {
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

        if (socketRef.current?.connected) {
          return;
        }

        if (socketRef.current) {
          socketRef.current.disconnect();
        }

        const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
          path: "/socket.io",
          auth: {
            token: token,
          },
          forceNew: true,
          transports: ["websocket", "polling"],
        });

        socketRef.current = socket;

        socket.on("connect", () => {
          setConnected(true);
          setError(null);
          setTimeout(() => {
            socket.emit("request_stats");
            socket.emit("request_monthly_stats");
          }, 100);
        });

        socket.on("disconnect", (reason) => {
          setConnected(false);
          if (reason === "io server disconnect") {
            setTimeout(() => socket.connect(), 1000);
          }
        });

        socket.on("connect_error", (error) => {
          setError(`Failed to connect: ${error.message}`);
          setConnected(false);
          setLoading(false);
        });

        socket.on("stats_update", (newStats: StatsData) => {
          setStats((prevStats) => ({
            ...newStats,
            monthlyData: prevStats?.monthlyData || ({} as DetailedMonthlyData),
          }));
          setLoading(false);
          setError(null);
        });

        socket.on(
          "monthly_stats_update",
          (monthlyData: DetailedMonthlyData) => {
            setStats((prevStats) => ({
              ...prevStats!,
              monthlyData,
            }));
          }
        );

        socket.on("stats_error", (error: { message: string }) => {
          setError(error.message);
          setLoading(false);
        });
      } catch (err) {
        setError("Failed to initialize socket connection");
        setLoading(false);
      }
    };

    const timer = setTimeout(initializeSocket, 100);

    return () => {
      clearTimeout(timer);
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      isInitialized.current = false;
    };
  }, []);

  console.log(stats);

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
