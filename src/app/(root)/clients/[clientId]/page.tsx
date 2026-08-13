"use client";

import React from "react";
import Header from "@/components/layout/Header";
import { useDoctorTreatmentPrograms } from "@/hooks/useTreatmentPrograms";
import { PuffLoader } from "react-spinners";
import TransitionLink from "@/components/common/TransitionLink";

interface Params {
  clientId: string;
}

interface PageProps {
  params: React.Usable<Params>;
}

/** Legacy route: medical records are program-scoped; list this client's programs. */
const ClientProgramsRedirectPage = ({ params }: PageProps) => {
  const { clientId } = React.use(params);
  const { data, isLoading, error, refetch } = useDoctorTreatmentPrograms({
    page: 1,
    pageSize: 50,
    clientId,
  });

  const programs = data?.data ?? [];
  const clientName = programs[0]?.client?.name;

  return (
    <div className="w-full h-full flex flex-col">
      <Header searchFn={() => {}} isShowSearch={false} />
      <div className="p-4 sm:p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-2xl">
              برنامه‌های درمان {clientName ? `— ${clientName}` : ""}
            </h2>
            <p className="text-sm text-muted-foreground">
              پرونده پزشکی از طریق برنامه درمان باز می‌شود.
            </p>
          </div>
          <TransitionLink
            href="/treatment-programs"
            className="text-blue-600 text-sm"
          >
            همه برنامه‌ها
          </TransitionLink>
        </div>

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

        {!isLoading && programs.length === 0 && (
          <p className="text-muted-foreground text-sm">
            برنامه‌ای برای این مراجع یافت نشد.
          </p>
        )}

        <div className="grid gap-3 md:grid-cols-2">
          {programs.map((program: any) => (
            <TransitionLink
              key={program.id}
              href={`/treatment-programs/${program.id}`}
              className="rounded-xl border bg-white p-4 hover:border-blue-300 dark:bg-gray-800"
            >
              <p className="font-medium">{program.title || "برنامه درمان"}</p>
              <p className="text-xs text-muted-foreground mt-1">
                وضعیت: {program.status} · جلسات:{" "}
                {program.appointments_count ?? 0}
              </p>
            </TransitionLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientProgramsRedirectPage;
