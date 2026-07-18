"use client";

import ErrorComponent from "@/components/layout/ErrorComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useGetResume, useSaveResume } from "@/hooks/useResume";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { PuffLoader } from "react-spinners";
import { Trash2 } from "lucide-react";
import Header from "@/components/layout/Header";
import RichTextEditor from "@/components/common/rich-text-editor";
import { Label } from "@/components/ui/label";

const DoctorResume = () => {
  const { data: resume, isLoading, error, refetch } = useGetResume();
  const { mutate: saveResume, isPending } = useSaveResume(() => {});
  const { register, control, setValue, handleSubmit, reset } = useForm();
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!resume) return;

    const socialLinks = Array.isArray(resume.social_links)
      ? {
          linkedin: "",
          instagram: "",
          website: "",
          twitter: "",
        }
      : resume.social_links ?? {
          linkedin: "",
          instagram: "",
          website: "",
          twitter: "",
        };

    reset({
      title: resume?.title ?? "",
      bio: resume?.bio ?? "",
      specialization: resume?.specialization ?? "",
      educations: resume?.educations?.length
        ? resume.educations
        : [{ degree: "", institution: "", year: "" }],
      experiences: resume?.experiences?.length
        ? resume.experiences
        : [{ role: "", organization: "", from: "", to: "" }],
      content: resume?.content ?? "",
      skills: resume?.skills ?? [""],
      certifications: resume?.certifications ?? [""],
      social_links: socialLinks,
    });
    setContent(resume?.content ?? "");
  }, [resume, reset]);

  const {
    fields: eduFields,
    append: addEdu,
    remove: removeEdu,
  } = useFieldArray({
    control,
    name: "educations",
  });

  const onSubmit = (data: any) => {
    if (typeof data.skills === "string") {
      data.skills = data.skills
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);
    } else if (
      Array.isArray(data.skills) &&
      typeof data.skills[0] === "string"
    ) {
      data.skills = data.skills
        .flatMap((s: string) => s.split(","))
        .map((s: string) => s.trim())
        .filter(Boolean);
    }

    saveResume({ formData: data });
  };

  return (
    <div className="w-full h-full flex flex-col">
      <Header searchFn={() => {}} isShowSearch={false} />
      <div className="w-full flex flex-col p-6">
        <div className="w-full">
          {isLoading && (
            <div className="w-full h-full flex items-center justify-center">
              <PuffLoader size={60} color="#3e86fa" />
            </div>
          )}
          {error && <ErrorComponent refetch={refetch} />}
          {resume && (
            <div className="w-full space-y-3 p-2">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6 w-full mx-auto"
              >
                <h2 className="text-xl font-bold">ویرایش رزومه</h2>

                <h3 className="mt-4 font-semibold">عنوان</h3>
                <Input
                  {...register("title")}
                  placeholder="عنوان"
                  className="bg-white"
                />
                <p className="text-sm">
                  این بخش صرفا برای درک بهتر موتور های جستجو از رزومه شماست و به
                  کاربران عادی نمایش داده نمیشود.
                </p>

                <h3 className="mt-4 font-semibold">معرفی کوتاه</h3>
                <Textarea
                  {...register("bio")}
                  placeholder="توضیحات"
                  className="bg-white"
                />
                <p className="text-sm">
                  این بخش صرفا برای درک بهتر موتور های جستجو از رزومه شماست و به
                  کاربران عادی نمایش داده نمیشود.
                </p>

                <h3 className="mt-4 font-semibold">تخصص اصلی</h3>
                <Textarea
                  {...register("specialization")}
                  placeholder="تخصص اصلی"
                  className="bg-white"
                />

                <h3 className="font-semibold mt-4">تحصیلات</h3>
                <div className="space-y-2">
                  {eduFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-2 rounded-md relative"
                    >
                      <Input
                        {...register(`educations.${index}.degree`)}
                        placeholder="مدرک"
                        className="bg-white"
                      />
                      <Input
                        {...register(`educations.${index}.institution`)}
                        placeholder="دانشگاه"
                        className="bg-white"
                      />
                      <Input
                        {...register(`educations.${index}.year`)}
                        placeholder="سال"
                        className="bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => removeEdu(index)}
                        className="p-2 text-red-500 hover:text-red-700"
                        title="حذف"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      addEdu({ degree: "", institution: "", year: "" })
                    }
                    className="text-blue-600 hover:underline mt-1"
                  >
                    + افزودن مورد جدید
                  </button>
                </div>

                <h3 className="font-semibold mt-4">رزومه</h3>
                <div>
                  <RichTextEditor
                    content={content}
                    onChange={(val) => {
                      setContent(val);
                      setValue("content", val);
                    }}
                  />
                </div>

                {resume?.file_url && (
                  <div className="space-y-1">
                    <Label>فایل رزومه فعلی</Label>
                    <a
                      href={resume.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 text-sm hover:underline"
                    >
                      مشاهده / دانلود PDF
                    </a>
                  </div>
                )}

                <div className="space-y-1">
                  <Label>آپلود فایل PDF (اختیاری)</Label>
                  <Input
                    type="file"
                    accept="application/pdf"
                    className="bg-white"
                    onChange={(e) => {
                      setValue("file", e.target.files);
                    }}
                  />
                </div>

                <h3 className="font-semibold mt-4">
                  رویکرد های درمان / مشاوره
                </h3>
                <Input
                  {...register("skills")}
                  placeholder="مثلاً CBT, ACT, Mindfulness"
                  className="bg-white"
                />
                <p className="text-xs text-gray-500 mt-1">
                  رویکرد را با ویرگول جدا کنید.
                </p>

                <h3 className="font-semibold mt-4">لینک‌ها</h3>
                <Label className="mt-4">لینکداین</Label>
                <Input
                  {...register("social_links.linkedin")}
                  placeholder="LinkedIn URL"
                  className="bg-white"
                />

                <Label className="mt-4">توییتر (X)</Label>
                <Input
                  {...register("social_links.twitter")}
                  placeholder="Twitter URL"
                  className="bg-white"
                />

                <Label className="mt-4">اینستاگرام</Label>
                <Input
                  {...register("social_links.instagram")}
                  placeholder="Instagram URL"
                  className="bg-white"
                />

                <Label className="mt-4">وبسایت شخصی</Label>
                <Input
                  {...register("social_links.website")}
                  placeholder="Website URL"
                  className="bg-white"
                />

                <Button type="submit" disabled={isPending} className="mt-4">
                  ذخیره رزومه
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorResume;
