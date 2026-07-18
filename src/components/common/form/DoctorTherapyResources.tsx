"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Controller, useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  useCreateResource,
  useUpdateResource,
} from "@/hooks/useResources";
import { resourceApiType, resourceType } from "@/types";
import { useEffect, useMemo } from "react";

interface AddDoctorTherapyResourcesFormProps {
  onClose: () => void;
  onSuccess: () => void;
  mode?: "create" | "edit";
  resource?: resourceApiType | null;
}

const AddDoctorTherapyResourcesForm = ({
  onClose,
  onSuccess,
  mode = "create",
  resource = null,
}: AddDoctorTherapyResourcesFormProps) => {
  const hasExistingFile = Boolean(resource?.file_url);

  const schema = useMemo(
    () =>
      yup.object({
        title: yup
          .string()
          .required("عنوان الزامی است")
          .max(255, "عنوان حداکثر ۲۵۵ کاراکتر است"),
        type: yup
          .mixed<"link" | "file">()
          .oneOf(["link", "file"], "نوع منبع نامعتبر است")
          .required("انتخاب نوع منبع الزامی است"),
        description: yup.string().nullable(),
        link: yup.string().when("type", {
          is: "link",
          then: (s) =>
            s
              .required("لینک الزامی است")
              .url("لینک معتبر وارد کنید")
              .max(255, "لینک حداکثر ۲۵۵ کاراکتر است"),
          otherwise: (s) => s.notRequired().nullable(),
        }),
        file: yup.mixed().when("type", {
          is: "file",
          then: (s) =>
            mode === "edit" && hasExistingFile
              ? s.notRequired().nullable()
              : s.required("فایل الزامی است"),
          otherwise: (s) => s.notRequired().nullable(),
        }),
      }),
    [mode, hasExistingFile]
  );

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      type: "link" as const,
      description: "",
      link: "",
      file: undefined,
    },
  });

  const selectedType = watch("type");
  const { mutate: createResource, isPending: isCreating } = useCreateResource(
    () => onSuccess()
  );
  const { mutate: updateResource, isPending: isUpdating } = useUpdateResource(
    () => onSuccess()
  );

  useEffect(() => {
    if (mode === "edit" && resource) {
      reset({
        title: resource.title ?? "",
        type: (resource.type as "link" | "file") || "link",
        description: resource.description ?? "",
        link: resource.link ?? "",
        file: undefined,
      });
    }
  }, [mode, resource, reset]);

  const onSubmit = (data: resourceType) => {
    if (mode === "edit" && resource?.id) {
      updateResource({ id: resource.id, data });
      return;
    }

    createResource(data);
  };

  const isPending = isCreating || isUpdating;

  return (
    <div className="w-full p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-xl font-bold">
          {mode === "edit" ? "ویرایش منبع" : "افزودن منبع جدید"}
        </h2>

        <div className="space-y-1">
          <label className="text-sm font-medium">عنوان</label>
          <Input
            {...register("title")}
            placeholder="مثلاً تمرین تنفس روزانه"
            className="bg-white"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">نوع منبع</label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select
                dir="rtl"
                onValueChange={field.onChange}
                value={field.value}
              >
                <SelectTrigger className="w-full text-right bg-white">
                  <SelectValue placeholder="انتخاب کنید" />
                </SelectTrigger>
                <SelectContent className="z-1000">
                  <SelectItem value="link" className="text-right">
                    لینک
                  </SelectItem>
                  <SelectItem value="file" className="text-right">
                    فایل
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.type && (
            <p className="text-red-500 text-sm">{errors.type.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">توضیحات (اختیاری)</label>
          <Textarea
            {...register("description")}
            placeholder="توضیح کوتاه برای مراجع"
            className="bg-white"
          />
        </div>

        {selectedType === "link" && (
          <div className="space-y-1">
            <label className="text-sm font-medium">لینک</label>
            <Input
              {...register("link")}
              placeholder="https://example.com"
              className="bg-white"
            />
            {errors.link && (
              <p className="text-red-500 text-sm">{errors.link.message}</p>
            )}
          </div>
        )}

        {selectedType === "file" && (
          <div className="space-y-1">
            <label className="text-sm font-medium">فایل</label>
            <Controller
              name="file"
              control={control}
              render={({ field }) => (
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                  className="bg-white"
                />
              )}
            />
            {mode === "edit" && resource?.file_url && (
              <p className="text-xs text-gray-500">
                اگر فایل جدید انتخاب نکنید، فایل قبلی حفظ می‌شود.
              </p>
            )}
            {errors.file && (
              <p className="text-red-500 text-sm">
                {String(errors.file.message)}
              </p>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" type="button" onClick={onClose}>
            بازگشت
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "در حال ذخیره..." : "ذخیره منبع"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddDoctorTherapyResourcesForm;
