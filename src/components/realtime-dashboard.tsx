'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Bell, 
  CheckCircle2, 
  AlertTriangle,
  Heart,
  Brain,
  Zap,
  Clock,
  X
} from 'lucide-react';
import { useRealtimeReports, useRealtimeHealthMetrics, useRealtimeNotifications, useRealtimeSimulation } from '@/hooks/useRealtimeData';
import { markNotificationAsRead } from '@/lib/realtime-data';
import { toast } from 'sonner';

export function RealtimeDashboard() {
  const { reports, loading: reportsLoading } = useRealtimeReports();
  const { metrics, loading: metricsLoading } = useRealtimeHealthMetrics();
  const { notifications, loading: notificationsLoading } = useRealtimeNotifications();
  
  // Enable real-time simulation
  useRealtimeSimulation();

  const [lastHealthScore, setLastHealthScore] = useState<number | null>(null);

  useEffect(() => {
    if (metrics?.healthScore && lastHealthScore !== null) {
      const change = metrics.healthScore - lastHealthScore;
      if (Math.abs(change) >= 2) {
        toast.success(
          change > 0 
            ? `Health score improved by ${change} points! 🎉` 
            : `Health score changed by ${change} points`
        );
      }
    }
    if (metrics?.healthScore) {
      setLastHealthScore(metrics.healthScore);
    }
  }, [metrics?.healthScore, lastHealthScore]);

  const handleDismissNotification = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      toast.success('Notification dismissed');
    } catch (error) {
      toast.error('Failed to dismiss notification');
    }
  };

  const getHealthScoreTrend = () => {
    if (!metrics?.trends?.healthScoreChange) return null;
    const change = metrics.trends.healthScoreChange;
    return {
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
      value: Math.abs(change),
      color: change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-slate-600'
    };
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Real-time Notifications */}
      {notifications.length > 0 && (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card key={notification.id} className="medical-card border-l-4 border-l-blue-500 animate-in slide-in-from-right duration-500">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bell className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 font-poppins">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-slate-600 font-inter">
                        {notification.message}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {formatTimestamp(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDismissNotification(notification.id)}
                    className="h-8 w-8 p-0 hover:bg-red-50"
                  >
                    <X className="w-4 h-4 text-slate-400" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Real-time Health Metrics */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="medical-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-poppins">
              <Heart className="w-4 h-4 text-red-500" />
              Health Score
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-auto" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {metricsLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-slate-200 rounded mb-2"></div>
                <div className="h-2 bg-slate-200 rounded"></div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-3xl font-bold ${getHealthScoreColor(metrics?.healthScore || 0)} font-poppins`}>
                    {metrics?.healthScore || 0}
                  </span>
                  {(() => {
                    const trend = getHealthScoreTrend();
                    if (!trend || trend.direction === 'stable') return null;
                    return (
                      <div className={`flex items-center gap-1 ${trend.color}`}>
                        {trend.direction === 'up' ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <span className="text-sm font-medium">+{trend.value}</span>
                      </div>
                    );
                  })()}
                </div>
                <Progress value={metrics?.healthScore || 0} className="h-2 mb-2" />
                <p className="text-xs text-slate-500">
                  Last updated: {formatTimestamp(metrics?.lastActivity)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="medical-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-poppins">
              <Activity className="w-4 h-4 text-green-500" />
              Total Reports
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse ml-auto" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {metricsLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-slate-200 rounded mb-2"></div>
                <div className="h-4 bg-slate-200 rounded"></div>
              </div>
            ) : (
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2 font-poppins">
                  {metrics?.totalReports || 0}
                </div>
                <p className="text-sm text-slate-600">
                  Report frequency: {metrics?.trends?.reportFrequency?.toFixed(1) || 0}/month
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="medical-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-poppins">
              <Brain className="w-4 h-4 text-purple-500" />
              AI Analysis
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse ml-auto" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2 font-poppins">
                {reports.filter(r => r.status === 'completed').length}
              </div>
              <p className="text-sm text-slate-600">
                Completed analyses
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Reports Status */}
      <Card className="medical-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-poppins">
            <Zap className="w-5 h-5 text-yellow-500" />
            Live Report Status
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-2" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reportsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-slate-200 rounded mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="font-inter">No reports yet. Upload your first medical report to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.slice(0, 5).map((report) => (
                <div key={report.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <div className="w-12 h-12 medical-gradient rounded-xl flex items-center justify-center">
                    {report.status === 'completed' ? (
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    ) : report.status === 'processing' ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-white" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800 font-poppins">
                      {report.name}
                    </h4>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Badge 
                        className={
                          report.status === 'completed' ? 'bg-green-100 text-green-800' :
                          report.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }
                      >
                        {report.status}
                      </Badge>
                      {report.status === 'completed' && (
                        <>
                          <span>{report.diagnosis}</span>
                          <span className="text-slate-400">•</span>
                          <span>{report.confidence}% confidence</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-slate-500">
                      {formatTimestamp(report.updatedAt)}
                    </div>
                    {report.status === 'processing' && (
                      <div className="flex items-center gap-1 text-xs text-yellow-600 mt-1">
                        <Clock className="w-3 h-3" />
                        Analyzing...
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}