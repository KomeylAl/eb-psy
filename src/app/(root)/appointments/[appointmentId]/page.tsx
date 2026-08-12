"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import { useAppointments } from "@/hooks/useAppointments";
import {
  useAppointmentHomeworks,
  useStoreHomework,
  useUpdateHomework,
  useUpdateSessionNotes,
} from "@/hooks/useTreatmentPrograms";
import { PuffLoader } from "react-spinners";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TransitionLink from "@/components/common/TransitionLink";
import { dateConvert } from "@/lib/utils";

interface Params {
  appointmentId: string;
}

interface PageProps {
  params: React.Usable<Params>;
}

const AppointmentSessionPage = ({ params }: PageProps) => {
  const { appointmentId } = React.use<Params>(params);
  const { data, isLoading, refetch } = useAppointments(1, 100, "", "");
  const appointment = (data?.data ?? []).find(
    (item: any) => String(item.id) === String(appointmentId)
  );

  const [notes, setNotes] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    if (appointment?.session_notes != null) {
      setNotes(appointment.session_notes || "");
    }
  }, [appointment?.session_notes]);

  const { mutate: saveNotes, isPending: savingNotes } = useUpdateSessionNotes(
    () => refetch()
  );
  const {
    data: homeworksPayload,
    refetch: refetchHomeworks,
    isLoading: homeworksLoading,
  } = useAppointmentHomeworks(appointmentId);
  const { mutate: storeHomework, isPending: storingHomework } = useStoreHomework(
    () => {
      setTitle("");
      setBody("");
      refetchHomeworks();
    }
  );
  const { mutate: updateHomework } = useUpdateHomework(() =>
    refetchHomeworks()
  );

  const homeworks = homeworksPayload?.data ?? [];

  return (
    <div className="w-full h-full flex flex-col">
      <Header searchFn={() => {}} isShowSearch={false} />
      <div className="p-6 md:p-12 space-y-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-bold text-2xl">جزئیات جلسه</h2>
          <TransitionLink href="/appointments" className="text-blue-600 text-sm">
            بازگشت
          </TransitionLink>
        </div>

        {isLoading && (
          <div className="flex justify-center py-16">
            <PuffLoader size={60} color="#3e86fa" />
          </div>
        )}

        {appointment && (
          <>
            <div className="rounded-xl border bg-white p-4 dark:bg-gray-800 space-y-2">
              <p>
                مراجع:{" "}
                <span className="font-medium">{appointment.client?.name}</span>
              </p>
              <p>
                تاریخ: {dateConvert(appointment.date)} — {appointment.time}
              </p>
              {appointment.room?.name && <p>اتاق: {appointment.room.name}</p>}
              {appointment.treatment_program_id && (
                <TransitionLink
                  href={`/treatment-programs/${appointment.treatment_program_id}`}
                  className="text-blue-600 text-sm inline-block"
                >
                  مشاهده پرونده برنامه درمان
                </TransitionLink>
              )}
            </div>

            <div className="rounded-xl border bg-white p-4 dark:bg-gray-800 space-y-3">
              <h3 className="font-semibold">یادداشت جلسه</h3>
              <Textarea
                rows={6}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <Button
                disabled={savingNotes}
                onClick={() =>
                  saveNotes({ appointmentId, session_notes: notes })
                }
              >
                ذخیره یادداشت
              </Button>
            </div>

            <div className="rounded-xl border bg-white p-4 dark:bg-gray-800 space-y-4">
              <h3 className="font-semibold">تکالیف</h3>
              {homeworksLoading && <PuffLoader size={30} color="#3e86fa" />}
              <div className="space-y-2">
                {homeworks.map((hw: any) => (
                  <div
                    key={hw.id}
                    className="flex items-start justify-between gap-3 rounded border p-3"
                  >
                    <div>
                      <p className="font-medium">{hw.title}</p>
                      <p className="text-sm text-muted-foreground">{hw.body}</p>
                      <p className="text-xs mt-1">وضعیت: {hw.status}</p>
                    </div>
                    {hw.status !== "done" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          updateHomework({ id: hw.id, body: { status: "done" } })
                        }
                      >
                        انجام شد
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t pt-4">
                <Label>عنوان تکلیف</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                <Label>توضیح</Label>
                <Textarea
                  rows={3}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
                <Button
                  disabled={storingHomework || !title}
                  onClick={() =>
                    storeHomework({
                      appointmentId,
                      body: { type: "text", title, body },
                    })
                  }
                >
                  افزودن تکلیف
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AppointmentSessionPage;
