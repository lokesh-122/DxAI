import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  RealtimeReport,
  RealtimeHealthMetrics,
  RealtimeNotification,
  subscribeToUserReports,
  subscribeToHealthMetrics,
  subscribeToNotifications,
  simulateRealtimeUpdates
} from '@/lib/realtime-data';

export const useRealtimeReports = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<RealtimeReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    const unsubscribe = subscribeToUserReports(
      user.uid,
      (newReports) => {
        setReports(newReports);
        setLoading(false);
        setError(null);
      }
    );

    return unsubscribe;
  }, [user?.uid]);

  return { reports, loading, error };
};

export const useRealtimeHealthMetrics = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<RealtimeHealthMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    const unsubscribe = subscribeToHealthMetrics(
      user.uid,
      (newMetrics) => {
        setMetrics(newMetrics);
        setLoading(false);
        setError(null);
      }
    );

    return unsubscribe;
  }, [user?.uid]);

  return { metrics, loading, error };
};

export const useRealtimeNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    const unsubscribe = subscribeToNotifications(
      user.uid,
      (newNotifications) => {
        setNotifications(newNotifications);
        setLoading(false);
        setError(null);
      }
    );

    return unsubscribe;
  }, [user?.uid]);

  return { notifications, loading, error };
};

export const useRealtimeSimulation = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.uid) return;

    // Start simulation
    const cleanup = simulateRealtimeUpdates(user.uid);

    return cleanup;
  }, [user?.uid]);
};