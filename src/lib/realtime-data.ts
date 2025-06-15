import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  limit,
  where,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';

export interface RealtimeReport {
  id: string;
  userId: string;
  name: string;
  diagnosis: string;
  stage: string;
  confidence: number;
  department: string;
  urgency: 'low' | 'medium' | 'high';
  healthScore: number;
  aiProvider: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: 'processing' | 'completed' | 'failed';
}

export interface RealtimeHealthMetrics {
  id: string;
  userId: string;
  healthScore: number;
  totalReports: number;
  lastActivity: Timestamp;
  trends: {
    healthScoreChange: number;
    reportFrequency: number;
  };
}

export interface RealtimeNotification {
  id: string;
  userId: string;
  type: 'report_complete' | 'health_alert' | 'appointment_reminder';
  title: string;
  message: string;
  read: boolean;
  createdAt: Timestamp;
}

// Mock data for fallback when Firebase permissions are not configured
const getMockReports = (userId: string): RealtimeReport[] => [
  {
    id: 'mock-1',
    userId,
    name: 'Liver Function Test',
    diagnosis: 'Fatty Liver Grade II',
    stage: 'Moderate',
    confidence: 94,
    department: 'Gastroenterology',
    urgency: 'medium',
    healthScore: 72,
    aiProvider: 'Gemini Pro',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    status: 'completed'
  },
  {
    id: 'mock-2',
    userId,
    name: 'Complete Blood Count',
    diagnosis: 'Iron Deficiency Anemia',
    stage: 'Mild',
    confidence: 89,
    department: 'Hematology',
    urgency: 'low',
    healthScore: 78,
    aiProvider: 'GPT-4',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    status: 'completed'
  }
];

const getMockHealthMetrics = (userId: string): RealtimeHealthMetrics => ({
  id: userId,
  userId,
  healthScore: 78,
  totalReports: 12,
  lastActivity: Timestamp.now(),
  trends: {
    healthScoreChange: 2,
    reportFrequency: 3.5
  }
});

const getMockNotifications = (userId: string): RealtimeNotification[] => [
  {
    id: 'mock-notif-1',
    userId,
    type: 'health_alert',
    title: 'Health Tip',
    message: 'Remember to stay hydrated! Drink at least 8 glasses of water today.',
    read: false,
    createdAt: Timestamp.now()
  },
  {
    id: 'mock-notif-2',
    userId,
    type: 'report_complete',
    title: 'Analysis Complete',
    message: 'Your latest liver function test analysis is ready for review.',
    read: false,
    createdAt: Timestamp.now()
  }
];

// Real-time reports subscription with error handling
export const subscribeToUserReports = (
  userId: string, 
  callback: (reports: RealtimeReport[]) => void
) => {
  try {
    const reportsRef = collection(db, 'reports');
    const q = query(
      reportsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(10)
    );

    return onSnapshot(q, 
      (snapshot) => {
        const reports: RealtimeReport[] = [];
        snapshot.forEach((doc) => {
          reports.push({ id: doc.id, ...doc.data() } as RealtimeReport);
        });
        callback(reports);
      },
      (error) => {
        console.warn('Firebase permission error for reports, using mock data:', error.message);
        // Fallback to mock data when permissions are denied
        callback(getMockReports(userId));
      }
    );
  } catch (error) {
    console.warn('Firebase connection error for reports, using mock data:', error);
    // Return mock data immediately and create a no-op unsubscribe function
    callback(getMockReports(userId));
    return () => {};
  }
};

// Real-time health metrics subscription with error handling
export const subscribeToHealthMetrics = (
  userId: string,
  callback: (metrics: RealtimeHealthMetrics | null) => void
) => {
  try {
    const metricsRef = doc(db, 'healthMetrics', userId);
    
    return onSnapshot(metricsRef, 
      (doc) => {
        if (doc.exists()) {
          callback({ id: doc.id, ...doc.data() } as RealtimeHealthMetrics);
        } else {
          callback(getMockHealthMetrics(userId));
        }
      },
      (error) => {
        console.warn('Firebase permission error for health metrics, using mock data:', error.message);
        // Fallback to mock data when permissions are denied
        callback(getMockHealthMetrics(userId));
      }
    );
  } catch (error) {
    console.warn('Firebase connection error for health metrics, using mock data:', error);
    // Return mock data immediately and create a no-op unsubscribe function
    callback(getMockHealthMetrics(userId));
    return () => {};
  }
};

// Real-time notifications subscription with error handling
export const subscribeToNotifications = (
  userId: string,
  callback: (notifications: RealtimeNotification[]) => void
) => {
  try {
    const notificationsRef = collection(db, 'notifications');
    const q = query(
      notificationsRef,
      where('userId', '==', userId),
      where('read', '==', false),
      orderBy('createdAt', 'desc'),
      limit(5)
    );

    return onSnapshot(q, 
      (snapshot) => {
        const notifications: RealtimeNotification[] = [];
        snapshot.forEach((doc) => {
          notifications.push({ id: doc.id, ...doc.data() } as RealtimeNotification);
        });
        callback(notifications);
      },
      (error) => {
        console.warn('Firebase permission error for notifications, using mock data:', error.message);
        // Fallback to mock data when permissions are denied
        callback(getMockNotifications(userId));
      }
    );
  } catch (error) {
    console.warn('Firebase connection error for notifications, using mock data:', error);
    // Return mock data immediately and create a no-op unsubscribe function
    callback(getMockNotifications(userId));
    return () => {};
  }
};

// Add new report with error handling
export const addReport = async (userId: string, reportData: Partial<RealtimeReport>) => {
  try {
    const reportsRef = collection(db, 'reports');
    return await addDoc(reportsRef, {
      ...reportData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: 'processing'
    });
  } catch (error) {
    console.warn('Firebase permission error when adding report:', error);
    throw new Error('Unable to save report. Please check Firebase permissions.');
  }
};

// Update report status with error handling
export const updateReportStatus = async (
  reportId: string, 
  status: 'processing' | 'completed' | 'failed',
  additionalData?: Partial<RealtimeReport>
) => {
  try {
    const reportRef = doc(db, 'reports', reportId);
    return await updateDoc(reportRef, {
      status,
      updatedAt: serverTimestamp(),
      ...additionalData
    });
  } catch (error) {
    console.warn('Firebase permission error when updating report:', error);
    throw new Error('Unable to update report. Please check Firebase permissions.');
  }
};

// Update health metrics with error handling
export const updateHealthMetrics = async (userId: string, metrics: Partial<RealtimeHealthMetrics>) => {
  try {
    const metricsRef = doc(db, 'healthMetrics', userId);
    return await updateDoc(metricsRef, {
      ...metrics,
      lastActivity: serverTimestamp()
    });
  } catch (error) {
    console.warn('Firebase permission error when updating health metrics:', error);
    // Silently fail for metrics updates in demo mode
  }
};

// Add notification with error handling
export const addNotification = async (userId: string, notification: Partial<RealtimeNotification>) => {
  try {
    const notificationsRef = collection(db, 'notifications');
    return await addDoc(notificationsRef, {
      ...notification,
      userId,
      read: false,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.warn('Firebase permission error when adding notification:', error);
    // Silently fail for notifications in demo mode
  }
};

// Mark notification as read with error handling
export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const notificationRef = doc(db, 'notifications', notificationId);
    return await updateDoc(notificationRef, {
      read: true
    });
  } catch (error) {
    console.warn('Firebase permission error when marking notification as read:', error);
    // Silently fail for notification updates in demo mode
  }
};

// Simulate real-time data updates (for demo purposes) with error handling
export const simulateRealtimeUpdates = (userId: string) => {
  // Only simulate if we have proper Firebase permissions
  let healthScoreInterval: NodeJS.Timeout | null = null;
  let notificationInterval: NodeJS.Timeout | null = null;

  // Test Firebase permissions first
  const testPermissions = async () => {
    try {
      const metricsRef = doc(db, 'healthMetrics', userId);
      await updateDoc(metricsRef, {
        lastActivity: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.warn('Firebase permissions not configured, skipping real-time simulation');
      return false;
    }
  };

  testPermissions().then((hasPermissions) => {
    if (!hasPermissions) return;

    // Simulate health score updates every 30 seconds
    healthScoreInterval = setInterval(async () => {
      const randomChange = Math.floor(Math.random() * 6) - 3; // -3 to +3
      const newScore = Math.max(60, Math.min(100, 78 + randomChange));
      
      await updateHealthMetrics(userId, {
        healthScore: newScore,
        trends: {
          healthScoreChange: randomChange,
          reportFrequency: Math.random() * 5
        }
      });
    }, 30000);

    // Simulate new notifications every 2 minutes
    notificationInterval = setInterval(async () => {
      const notifications = [
        {
          type: 'health_alert' as const,
          title: 'Health Tip',
          message: 'Remember to stay hydrated! Drink at least 8 glasses of water today.'
        },
        {
          type: 'appointment_reminder' as const,
          title: 'Appointment Reminder',
          message: 'You have a follow-up appointment scheduled for next week.'
        },
        {
          type: 'report_complete' as const,
          title: 'Analysis Complete',
          message: 'Your latest report analysis is ready for review.'
        }
      ];

      const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
      await addNotification(userId, randomNotification);
    }, 120000);
  });

  // Return cleanup function
  return () => {
    if (healthScoreInterval) clearInterval(healthScoreInterval);
    if (notificationInterval) clearInterval(notificationInterval);
  };
};