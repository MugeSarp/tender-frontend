import { useState, useEffect } from "react";
import { FiClock, FiAlertTriangle, FiFileText } from "react-icons/fi";
import type Tender from "../interfaces/tender";
import httpClient from "../services/http-client";

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, description, icon, color }: StatCardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${color}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
        <div className="text-gray-400">{icon}</div>
      </div>
    </div>
  );
}

export default function StatCards() {
  const [stats, setStats] = useState({
    urgentTenders: 0,
    totalNotices: 0,
    upcomingDeadlines: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await httpClient.get("/api/tenders");
        const tenders: Tender[] = response.data.tenders || response.data;

        const now = new Date();
        const tenDaysFromNow = new Date(
          now.getTime() + 10 * 24 * 60 * 60 * 1000
        );
        const threeDaysFromNow = new Date(
          now.getTime() + 3 * 24 * 60 * 60 * 1000
        );

        const urgentTenders = tenders.filter(
          (t) =>
            new Date(t.deadline) <= tenDaysFromNow && new Date(t.deadline) > now
        ).length;

        const totalNotices = tenders.length;

        const upcomingDeadlines = tenders.filter(
          (t) =>
            new Date(t.deadline) <= threeDaysFromNow &&
            new Date(t.deadline) > now
        ).length;

        setStats({
          urgentTenders,
          totalNotices,
          upcomingDeadlines,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-12 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard
        title="Urgent Deadlines"
        value={stats.urgentTenders}
        description="Deadlines within 10 days"
        icon={<FiAlertTriangle className="w-8 h-8" />}
        color="hover:shadow-md transition-shadow duration-200"
      />

      <StatCard
        title="Total Notices"
        value={stats.totalNotices}
        description="All tender notices"
        icon={<FiFileText className="w-8 h-8" />}
        color="hover:shadow-md transition-shadow duration-200"
      />

      <StatCard
        title="Critical Deadlines"
        value={stats.upcomingDeadlines}
        description="Due within 3 days"
        icon={<FiClock className="w-8 h-8" />}
        color="hover:shadow-md transition-shadow duration-200"
      />
    </div>
  );
}
