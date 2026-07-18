import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { resourceApiType, resourceType } from "@/types";

export function useResources(
  page: number = 1,
  pageSize: number = 10,
  search: string = ""
) {
  return useQuery({
    queryKey: ["resources", page, pageSize, search],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        search,
      });

      const res = await fetch(`/api/resources?${params.toString()}`);
      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        toast.error(payload?.message || "خطا در دریافت اطلاعات");
        throw new Error(payload?.message || "خطا در دریافت اطلاعات");
      }

      return payload;
    },
    placeholderData: (prev) => prev,
  });
}

function buildResourceFormData(data: resourceType) {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("type", data.type);

  if (data.description != null && data.description !== "") {
    formData.append("description", String(data.description));
  }

  if (data.type === "link" && data.link) {
    formData.append("link", String(data.link));
  }

  if (data.type === "file" && data.file instanceof File) {
    formData.append("file", data.file);
  }

  return formData;
}

export function useCreateResource(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: resourceType) => {
      const res = await fetch("/api/resources", {
        method: "POST",
        body: buildResourceFormData(data),
      });

      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(payload?.message || "خطا در ایجاد منبع");
      }

      return payload;
    },
    onError(error) {
      toast.error(error.message);
    },
    onSuccess() {
      toast.success("منبع با موفقیت ایجاد شد");
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      onSuccess?.();
    },
  });
}

export function useUpdateResource(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: resourceType;
    }) => {
      const res = await fetch(`/api/resources/${id}`, {
        method: "PUT",
        body: buildResourceFormData(data),
      });

      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(payload?.message || "خطا در ویرایش منبع");
      }

      return payload;
    },
    onError(error) {
      toast.error(error.message);
    },
    onSuccess() {
      toast.success("منبع با موفقیت ویرایش شد");
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      onSuccess?.();
    },
  });
}

export function useDeleteResource(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/resources/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.message || "خطا در حذف منبع");
      }

      return true;
    },
    onError(error) {
      toast.error(error.message);
    },
    onSuccess() {
      toast.success("منبع با موفقیت حذف شد");
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      onSuccess?.();
    },
  });
}

export type { resourceApiType };
