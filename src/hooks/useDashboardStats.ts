import { useQuery } from "@tanstack/react-query";
import { formatLocalDate, getPastLocalDates } from "@/lib/utils";

type CountResponse = {
  meta?: {
    total?: number;
  };
};

async function fetchCount(
  path: string,
  params: Record<string, string> = {}
): Promise<number> {
  const searchParams = new URLSearchParams({
    page: "1",
    pageSize: "1",
    ...params,
  });

  const res = await fetch(`${path}?${searchParams.toString()}`);
  const payload = (await res.json().catch(() => null)) as CountResponse | null;

  if (!res.ok) {
    throw new Error(
      (payload as { message?: string } | null)?.message ||
        "خطا در دریافت آمار داشبورد"
    );
  }

  return Number(payload?.meta?.total ?? 0);
}

export type DashboardStats = {
  todayAppointments: number;
  pendingAppointments: number;
  doneAppointments: number;
  paidAppointments: number;
  unpaidAppointments: number;
  pendingPayments: number;
  pendingAssessments: number;
  doneAssessments: number;
  resourcesTotal: number;
  resourcesLink: number;
  resourcesFile: number;
  unreadNotifications: number;
  weeklyAppointments: Array<{ date: string; label: string; total: number }>;
};

export function useDashboardStats() {
  const today = formatLocalDate();
  const weekDays = getPastLocalDates(7);

  return useQuery({
    queryKey: ["dashboard-stats", today],
    queryFn: async (): Promise<DashboardStats> => {
      const [
        todayAppointments,
        pendingAppointments,
        doneAppointments,
        paidAppointments,
        unpaidAppointments,
        pendingPayments,
        pendingAssessments,
        doneAssessments,
        resourcesTotal,
        resourcesLink,
        resourcesFile,
        unreadNotifications,
        ...weeklyCounts
      ] = await Promise.all([
        fetchCount("/api/appointments", { date: today }),
        fetchCount("/api/appointments", { status: "pending" }),
        fetchCount("/api/appointments", { status: "done" }),
        fetchCount("/api/appointments", { payment_status: "paid" }),
        fetchCount("/api/appointments", { payment_status: "unpaid" }),
        fetchCount("/api/appointments", { payment_status: "pending" }),
        fetchCount("/api/assessments", { status: "pending" }),
        fetchCount("/api/assessments", { status: "done" }),
        fetchCount("/api/resources"),
        fetchCount("/api/resources", { type: "link" }),
        fetchCount("/api/resources", { type: "file" }),
        fetchCount("/api/notifications/unread"),
        ...weekDays.map((day) =>
          fetchCount("/api/appointments", { date: day.date })
        ),
      ]);

      return {
        todayAppointments,
        pendingAppointments,
        doneAppointments,
        paidAppointments,
        unpaidAppointments,
        pendingPayments,
        pendingAssessments,
        doneAssessments,
        resourcesTotal,
        resourcesLink,
        resourcesFile,
        unreadNotifications,
        weeklyAppointments: weekDays.map((day, index) => ({
          ...day,
          total: weeklyCounts[index] ?? 0,
        })),
      };
    },
  });
}
