"use client";

import React from "react";
import Header from "@/components/layout/Header";
import { useDoctorProgramRecord } from "@/hooks/useTreatmentPrograms";
import { PuffLoader } from "react-spinners";
import DoctorClientRecordForm from "@/components/medical-record/DoctorClientRecordForm";
import TransitionLink from "@/components/common/TransitionLink";

interface Params {
  programId: string;
}

interface PageProps {
  params: React.Usable<Params>;
}

const ProgramMedicalRecordPage = ({ params }: PageProps) => {
  const { programId } = React.use<Params>(params);
  const { data, isLoading, error, refetch } = useDoctorProgramRecord(programId);

  const program = data?.data?.program;
  const record = data?.data?.record;

  return (
    <div className="w-full h-full flex flex-col">
      <Header searchFn={() => {}} isShowSearch={false} />
      <div className="p-6 md:p-12 space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-2xl">
              پرونده — {program?.title || "برنامه درمان"}
            </h2>
            <p className="text-sm text-muted-foreground">
              مراجع: {program?.client?.name || "—"}
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
          <p className="text-rose-500 text-center">دسترسی به این برنامه ممکن نیست.</p>
        )}

        {data && !isLoading && (
          <DoctorClientRecordForm
            programId={programId}
            record={record}
            onSaved={() => refetch()}
          />
        )}
      </div>
    </div>
  );
};

export default ProgramMedicalRecordPage;
