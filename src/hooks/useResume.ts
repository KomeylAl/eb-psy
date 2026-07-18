import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useGetResume() {
  return useQuery({
    queryKey: ["resume"],
    queryFn: async () => {
      const res = await fetch("/api/resume");
      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(payload?.message || "خطا در دریافت اطلاعات");
      }

      return payload;
    },
  });
}

export function useSaveResume(onSuccess: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ formData }: { formData: Record<string, unknown> }) => {
      const newData = new FormData();
      newData.append("title", String(formData.title ?? ""));
      newData.append("bio", String(formData.bio ?? ""));
      newData.append("content", String(formData.content ?? ""));
      newData.append("specialization", String(formData.specialization ?? ""));
      newData.append(
        "educations",
        JSON.stringify(formData.educations ?? [])
      );
      newData.append(
        "experiences",
        JSON.stringify(formData.experiences ?? [])
      );
      newData.append("skills", JSON.stringify(formData.skills ?? []));
      newData.append(
        "certifications",
        JSON.stringify(formData.certifications ?? [])
      );
      newData.append(
        "social_links",
        JSON.stringify(formData.social_links ?? {})
      );

      const fileValue = formData.file;
      if (fileValue instanceof FileList && fileValue.length > 0) {
        newData.append("file", fileValue[0]);
      } else if (fileValue instanceof File) {
        newData.append("file", fileValue);
      }

      const res = await fetch("/api/resume", {
        method: "POST",
        body: newData,
      });
      const json = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(json?.message || "خطا در ذخیره رزومه");
      }

      return json;
    },
    onError(error) {
      toast.error(error.message || "خطا در ذخیره رزومه");
    },
    onSuccess: () => {
      toast.success("رزومه با موفقیت ذخیره شد");
      queryClient.invalidateQueries({ queryKey: ["resume"] });
      onSuccess();
    },
  });
}
