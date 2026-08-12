"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import CustomDatePicker from "@/components/ui/custom/DatePicker";
import FileUploader from "@/components/common/FileUploader";
import { convertBaseDate, dateConvert } from "@/lib/utils";
import DateObject from "react-date-object";
import { useSaveDoctorProgramRecord } from "@/hooks/useTreatmentPrograms";
import {
  clinicalDefaults,
  clinicalFields,
  ClinicalFormValues,
  MedicalRecordApi,
} from "@/lib/medicalRecord";
import { PuffLoader } from "react-spinners";

const DoctorClientRecordForm = ({
  programId,
  record,
  onSaved,
}: {
  programId: string;
  record?: MedicalRecordApi | null;
  onSaved?: () => void;
}) => {
  const { mutate: saveRecord, isPending } = useSaveDoctorProgramRecord(() => {
    onSaved?.();
  });

  const { register, control, handleSubmit, reset } =
    useForm<ClinicalFormValues>({
      defaultValues: clinicalDefaults(record),
    });

  useEffect(() => {
    reset(clinicalDefaults(record));
  }, [record, reset]);

  const onSubmit = (data: ClinicalFormValues) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "images" && Array.isArray(value)) {
        value.forEach((file) => {
          if (file instanceof File) formData.append("images[]", file);
        });
        return;
      }
      if (value === undefined || value === null || value === "") return;
      formData.append(key, String(value));
    });
    saveRecord({ programId, formData });
  };

  return (
    <form
      className="flex flex-col xl:flex-row gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="w-full space-y-4">
        <div className="rounded-sm border bg-white p-4 dark:bg-gray-800">
          <h3 className="font-semibold">اطلاعات پذیرش / همراه (فقط مشاهده)</h3>
          <p className="text-xs text-muted-foreground mt-1 mb-4">
            این بخش‌ها فقط توسط پذیرش / ادمین قابل ویرایش هستند.
          </p>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <div>
              <Label>شماره پرونده</Label>
              <Input value={record?.record_number || "—"} readOnly />
            </div>
            <div>
              <Label>منبع ارجاع</Label>
              <Input value={record?.reference_source || "—"} readOnly />
            </div>
            <div>
              <Label>درمانگر</Label>
              <Input value={record?.doctor?.name || "—"} readOnly />
            </div>
            <div>
              <Label>سوپروایزر</Label>
              <Input value={record?.supervisor?.name || "—"} readOnly />
            </div>
            <div>
              <Label>پذیرش‌کننده</Label>
              <Input value={record?.admin?.name || "—"} readOnly />
            </div>
            <div>
              <Label>تاریخ پذیرش</Label>
              <Input
                value={
                  record?.admission_date
                    ? dateConvert(record.admission_date)
                    : "—"
                }
                readOnly
              />
            </div>
            <div>
              <Label>نام همراه</Label>
              <Input value={record?.companion?.name || "—"} readOnly />
            </div>
            <div>
              <Label>تلفن همراه</Label>
              <Input value={record?.companion?.phone || "—"} readOnly />
            </div>
            <div>
              <Label>آدرس همراه</Label>
              <Input value={record?.companion?.address || "—"} readOnly />
            </div>
          </div>
        </div>

        <div className="rounded-sm border bg-white p-4 dark:bg-gray-800">
          <h3 className="font-semibold mb-3">تاریخ ویزیت</h3>
          <Controller
            name="visit_date"
            control={control}
            render={({ field }) => (
              <CustomDatePicker
                value={field.value ? dateConvert(field.value) : ""}
                onChange={(date) =>
                  field.onChange(
                    date ? convertBaseDate(date ?? new DateObject()) : ""
                  )
                }
              />
            )}
          />
        </div>

        {clinicalFields.map(({ name, label }) => (
          <div
            key={name}
            className="rounded-sm border bg-white p-4 dark:bg-gray-800"
          >
            <h3 className="font-semibold mb-2">{label}</h3>
            <Textarea {...register(name)} rows={5} />
          </div>
        ))}
      </div>

      <div className="w-full xl:w-[30%] space-y-4">
        <div className="rounded-sm border bg-white p-4 space-y-3 dark:bg-gray-800">
          <h3 className="font-semibold">ذخیره بخش بالینی</h3>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? <PuffLoader size={22} color="#fff" /> : "ذخیره"}
          </Button>
        </div>
        <div className="rounded-sm border bg-white p-4 dark:bg-gray-800">
          <h3 className="font-semibold">تصاویر پرونده</h3>
          <Controller
            name="images"
            control={control}
            render={({ field }) => (
              <FileUploader
                className="flex-col"
                allowMultiple
                onFilesSelected={(files) => field.onChange(files)}
                images={record?.images ?? []}
              />
            )}
          />
        </div>
      </div>
    </form>
  );
};

export default DoctorClientRecordForm;
