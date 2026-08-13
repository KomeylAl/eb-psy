"use client";

import Header from "@/components/layout/Header";
import { QuickLinks } from "@/components/dashboard/QuickLinks";
import { SimpleBarChart } from "@/components/dashboard/SimpleBarChart";
import { StatCard } from "@/components/dashboard/StatCard";
import Table from "@/components/common/Table";
import { appointmentColumns } from "@/lib/columns";
import { useAppointments } from "@/hooks/useAppointments";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useUser } from "@/contexts/UserContext";
import {
  Bell,
  CalendarCheck,
  CalendarClock,
  FileStack,
  ClipboardList,
} from "lucide-react";
import { PuffLoader } from "react-spinners";
import TransitionLink from "@/components/common/TransitionLink";

export default function Home() {
  const { user } = useUser();
  const { data: stats, isLoading, error, refetch } = useDashboardStats();
  const {
    data: recentAppointments,
    isLoading: appointmentsLoading,
  } = useAppointments(1, 5);

  return (
    <div className="flex-1 h-screen overflow-y-auto flex flex-col">
      <Header isShowSearch={false} searchFn={() => {}} />

      <div className="flex-1 p-4 sm:p-6 md:p-8 flex flex-col gap-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-bold text-2xl">داشبورد روان‌درمانگر</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {user?.name
                ? `${user.name} عزیز، خلاصه وضعیت امروز شما`
                : "خلاصه وضعیت نوبت‌ها، ارزیابی‌ها و اعلان‌ها"}
            </p>
          </div>
          <TransitionLink
            href="/appointments"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            مشاهده همه نوبت‌ها
          </TransitionLink>
        </div>

        {isLoading && (
          <div className="flex flex-1 items-center justify-center py-20">
            <PuffLoader size={60} color="#3e86fa" />
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center dark:border-rose-900 dark:bg-rose-950/30">
            <p className="text-rose-600">خطا در دریافت آمار داشبورد</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 text-sm text-blue-600 hover:underline"
            >
              تلاش مجدد
            </button>
          </div>
        )}

        {stats && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="نوبت‌های امروز"
                value={stats.todayAppointments}
                description="تعداد نوبت‌های ثبت‌شده برای امروز"
                icon={<CalendarClock size={20} />}
              />
              <StatCard
                title="نوبت‌های در انتظار"
                value={stats.pendingAppointments}
                description="نوبت‌هایی که هنوز انجام نشده‌اند"
                icon={<CalendarCheck size={20} />}
                accentClassName="bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300"
              />
              <StatCard
                title="ارزیابی‌های در انتظار"
                value={stats.pendingAssessments}
                description="ارزیابی‌هایی که نیاز به پیگیری دارند"
                icon={<ClipboardList size={20} />}
                accentClassName="bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-300"
              />
              <StatCard
                title="اعلان‌های خوانده‌نشده"
                value={stats.unreadNotifications}
                description="پیام‌های جدید نیازمند توجه"
                icon={<Bell size={20} />}
                accentClassName="bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300"
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <SimpleBarChart
                title="نوبت‌های ۷ روز اخیر"
                items={stats.weeklyAppointments.map((item) => ({
                  label: item.label,
                  value: item.total,
                }))}
              />
              <SimpleBarChart
                title="وضعیت پرداخت نوبت‌ها"
                items={[
                  { label: "پرداخت‌شده", value: stats.paidAppointments },
                  { label: "پرداخت‌نشده", value: stats.unpaidAppointments },
                  { label: "در انتظار", value: stats.pendingPayments },
                ]}
                barClassName="bg-emerald-500/90 dark:bg-emerald-400"
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-2xl border bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">آخرین نوبت‌ها</h3>
                  <span className="text-xs text-muted-foreground">
                    ۵ مورد اخیر
                  </span>
                </div>

                {appointmentsLoading && (
                  <div className="flex justify-center py-10">
                    <PuffLoader size={40} color="#3e86fa" />
                  </div>
                )}

                {!appointmentsLoading && recentAppointments && (
                  <Table
                    data={recentAppointments.data ?? []}
                    columns={appointmentColumns}
                    currentPage={1}
                    pageSize={5}
                    totalItems={Math.min(
                      recentAppointments.meta?.total ?? 0,
                      5
                    )}
                  />
                )}
              </div>

              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  <StatCard
                    title="نوبت‌های انجام‌شده"
                    value={stats.doneAppointments}
                    description="مجموع نوبت‌های با وضعیت انجام‌شده"
                    icon={<CalendarCheck size={18} />}
                    accentClassName="bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-300"
                  />
                  <StatCard
                    title="منابع پیشنهادی"
                    value={stats.resourcesTotal}
                    description={`${stats.resourcesLink} لینک · ${stats.resourcesFile} فایل`}
                    icon={<FileStack size={18} />}
                    accentClassName="bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300"
                  />
                  <StatCard
                    title="ارزیابی‌های انجام‌شده"
                    value={stats.doneAssessments}
                    description="ارزیابی‌هایی که تکمیل شده‌اند"
                    icon={<ClipboardList size={18} />}
                  />
                </div>
              </div>
            </div>

            <QuickLinks />
          </>
        )}
      </div>
    </div>
  );
}
