"use client";

import Header from "@/components/layout/Header";
import { useDoctorTreatmentPrograms } from "@/hooks/useTreatmentPrograms";
import { PuffLoader } from "react-spinners";
import TransitionLink from "@/components/common/TransitionLink";
import { useState } from "react";

const TreatmentProgramsPage = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error, refetch } = useDoctorTreatmentPrograms(page);
  const programs = data?.data ?? [];

  return (
    <div className="w-full h-full flex flex-col">
      <Header searchFn={() => {}} isShowSearch={false} />
      <div className="p-6 md:p-12 space-y-6">
        <h2 className="font-bold text-2xl">برنامه‌های درمان</h2>

        {isLoading && (
          <div className="flex justify-center py-16">
            <PuffLoader size={60} color="#3e86fa" />
          </div>
        )}

        {error && (
          <div className="text-center space-y-2">
            <p className="text-rose-500">خطا در دریافت برنامه‌ها</p>
            <button onClick={() => refetch()} className="text-blue-600">
              تلاش مجدد
            </button>
          </div>
        )}

        <div className="grid gap-3 md:grid-cols-2">
          {programs.map((program: any) => (
            <TransitionLink
              key={program.id}
              href={`/treatment-programs/${program.id}`}
              className="rounded-xl border bg-white p-4 hover:border-blue-300 dark:bg-gray-800"
            >
              <p className="font-semibold">{program.title || "برنامه درمان"}</p>
              <p className="text-sm text-muted-foreground mt-1">
                مراجع: {program.client?.name || "—"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                وضعیت: {program.status} · جلسات:{" "}
                {program.appointments_count ?? 0}
              </p>
            </TransitionLink>
          ))}
        </div>

        {data?.meta && data.meta.last_page > 1 && (
          <div className="flex gap-2 justify-center">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 rounded border"
            >
              قبلی
            </button>
            <span className="text-sm self-center">
              {page} / {data.meta.last_page}
            </span>
            <button
              disabled={page >= data.meta.last_page}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 rounded border"
            >
              بعدی
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TreatmentProgramsPage;
