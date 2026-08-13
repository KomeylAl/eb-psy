"use client";

import React, { useMemo } from "react";
import Header from "@/components/layout/Header";
import {
  useDoctorProgramRecord,
  useDoctorTreatmentProgram,
  useUpdateHomework,
} from "@/hooks/useTreatmentPrograms";
import { PuffLoader } from "react-spinners";
import DoctorClientRecordForm from "@/components/medical-record/DoctorClientRecordForm";
import TransitionLink from "@/components/common/TransitionLink";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { dateConvert } from "@/lib/utils";

interface Params {
  programId: string;
}

interface PageProps {
  params: React.Usable<Params>;
}

const statusLabel = (status: string) => {
  switch (status) {
    case "active":
      return "فعال";
    case "completed":
      return "تکمیل‌شده";
    case "paused":
      return "متوقف";
    case "cancelled":
      return "لغو شده";
    default:
      return status || "—";
  }
};

const homeworkLabel = (status: string) => {
  switch (status) {
    case "assigned":
      return "در انتظار";
    case "done":
      return "انجام‌شده";
    case "cancelled":
      return "لغو شده";
    default:
      return status || "—";
  }
};

const ProgressCard = ({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) => (
  <div className="rounded-xl border bg-white p-4 dark:bg-gray-800">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-2xl font-bold mt-1">{value}</p>
    {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
  </div>
);

const ProgramDetailPage = ({ params }: PageProps) => {
  const { programId } = React.use(params);
  const { data, isLoading, error, refetch } =
    useDoctorTreatmentProgram(programId);
  const program = data?.data;

  const {
    data: recordPayload,
    isLoading: recordLoading,
    refetch: refetchRecord,
  } = useDoctorProgramRecord(programId);

  const { mutate: updateHomework } = useUpdateHomework(() => refetch());

  const appointments = program?.appointments ?? [];
  const progress = program?.progress;
  const record = recordPayload?.data?.record ?? program?.medical_record;

  const homeworks = useMemo(
    () =>
      appointments.flatMap((app: any) =>
        (app.homeworks ?? []).map((hw: any) => ({
          ...hw,
          appointment_id: app.id,
          appointment_date: app.date,
          appointment_time: app.time,
        }))
      ),
    [appointments]
  );

  return (
    <div className="w-full h-full flex flex-col">
      <Header searchFn={() => {}} isShowSearch={false} />
      <div className="p-4 sm:p-6 md:p-8 space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="font-bold text-2xl">
              {program?.title || "برنامه درمان"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              مراجع: {program?.client?.name || "—"} · وضعیت:{" "}
              {statusLabel(program?.status)}
            </p>
          </div>
          <TransitionLink
            href="/treatment-programs"
            className="text-blue-600 text-sm"
          >
            بازگشت به برنامه‌ها
          </TransitionLink>
        </div>

        {isLoading && (
          <div className="flex justify-center py-16">
            <PuffLoader size={60} color="#3e86fa" />
          </div>
        )}

        {error && (
          <p className="text-rose-500 text-center">
            دسترسی به این برنامه ممکن نیست.
          </p>
        )}

        {program && !isLoading && (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="flex flex-wrap h-auto">
              <TabsTrigger value="overview">روند درمان</TabsTrigger>
              <TabsTrigger value="record">پرونده پزشکی</TabsTrigger>
              <TabsTrigger value="sessions">جلسات</TabsTrigger>
              <TabsTrigger value="homeworks">تکالیف</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="pt-4 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <ProgressCard
                  label="کل جلسات"
                  value={progress?.sessions_total ?? 0}
                  hint={`${progress?.sessions_done ?? 0} انجام‌شده`}
                />
                <ProgressCard
                  label="پیشرفت جلسات"
                  value={`${progress?.sessions_completion_rate ?? 0}%`}
                  hint={`${progress?.sessions_pending ?? 0} در انتظار`}
                />
                <ProgressCard
                  label="کل تکالیف"
                  value={progress?.homeworks_total ?? 0}
                  hint={`${progress?.homeworks_done ?? 0} انجام‌شده`}
                />
                <ProgressCard
                  label="انجام تکالیف"
                  value={`${progress?.homeworks_completion_rate ?? 0}%`}
                  hint={`${progress?.homeworks_assigned ?? 0} باز`}
                />
              </div>
              <div className="rounded-xl border bg-white p-4 dark:bg-gray-800 text-sm space-y-1">
                <p>شروع: {program.started_at ? dateConvert(program.started_at) : "—"}</p>
                <p>پایان: {program.ended_at ? dateConvert(program.ended_at) : "—"}</p>
              </div>
            </TabsContent>

            <TabsContent value="record" className="pt-4">
              {recordLoading ? (
                <div className="flex justify-center py-12">
                  <PuffLoader size={50} color="#3e86fa" />
                </div>
              ) : (
                <DoctorClientRecordForm
                  programId={programId}
                  record={record}
                  onSaved={() => {
                    refetchRecord();
                    refetch();
                  }}
                />
              )}
            </TabsContent>

            <TabsContent value="sessions" className="pt-4 space-y-3">
              {appointments.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  جلسه‌ای ثبت نشده است.
                </p>
              )}
              {appointments.map((app: any) => (
                <div
                  key={app.id}
                  className="rounded-xl border bg-white p-4 dark:bg-gray-800 space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium">
                      {dateConvert(app.date)} — {app.time}
                    </p>
                    <TransitionLink
                      href={`/appointments/${app.id}`}
                      className="text-blue-600 text-sm"
                    >
                      جزئیات جلسه
                    </TransitionLink>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    وضعیت: {app.status === "done" ? "انجام‌شده" : "در انتظار"} ·
                    اتاق: {app.room?.name || "—"} · تکالیف:{" "}
                    {(app.homeworks ?? []).length}
                  </p>
                  {app.session_notes && (
                    <p className="text-sm whitespace-pre-wrap border-t pt-2">
                      {app.session_notes}
                    </p>
                  )}
                </div>
              ))}
            </TabsContent>

            <TabsContent value="homeworks" className="pt-4 space-y-3">
              {homeworks.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  تکلیفی ثبت نشده است. از جزئیات هر جلسه می‌توانید تکلیف اضافه کنید.
                </p>
              )}
              {homeworks.map((hw: any) => (
                <div
                  key={hw.id}
                  className="rounded-xl border bg-white p-4 dark:bg-gray-800 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3"
                >
                  <div>
                    <p className="font-medium">{hw.title}</p>
                    {hw.body && (
                      <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                        {hw.body}
                      </p>
                    )}
                    <p className="text-xs mt-2 text-muted-foreground">
                      جلسه: {dateConvert(hw.appointment_date)}{" "}
                      {hw.appointment_time} · وضعیت:{" "}
                      {homeworkLabel(hw.status)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <TransitionLink
                      href={`/appointments/${hw.appointment_id}`}
                      className="text-blue-600 text-sm self-center"
                    >
                      جلسه
                    </TransitionLink>
                    {hw.status !== "done" && hw.status !== "cancelled" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          updateHomework({
                            id: hw.id,
                            body: { status: "done" },
                          })
                        }
                      >
                        انجام شد
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default ProgramDetailPage;
