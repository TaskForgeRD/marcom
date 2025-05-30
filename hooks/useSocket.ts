// hooks/useSocket.ts
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

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
}

export const useSocket = (): UseSocketReturn => {
  const [connected, setConnected] = useState(false);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      setError('No authentication token found');
      setLoading(false);
      return;
    }

    // Initialize socket connection
    const socket = io('http://localhost:5001', {
      auth: {
        token: token
      }
    });

    socketRef.current = socket;

    // Connection events
    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
      setConnected(true);
      setError(null);
      // Request initial stats
      socket.emit('request_stats');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
      setConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setError('Failed to connect to real-time server');
      setConnected(false);
      setLoading(false);
    });

    // Stats events
    socket.on('stats_update', (newStats: StatsData) => {
      console.log('Received stats update:', newStats);
      setStats(newStats);
      setLoading(false);
      setError(null);
    });

    socket.on('stats_error', (error: { message: string }) => {
      console.error('Stats error:', error);
      setError(error.message);
      setLoading(false);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const refreshStats = () => {
    if (socketRef.current && connected) {
      setLoading(true);
      socketRef.current.emit('refresh_stats');
    }
  };

  return {
    socket: socketRef.current,
    connected,
    stats,
    loading,
    error,
    refreshStats
  };
};