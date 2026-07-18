import { useUser } from "@/contexts/UserContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

type OtpCredentials = {
  phone: string;
  code: string;
};

async function readAuthResponse(res: Response, fallbackMessage: string) {
  const payload = await res.json().catch(() => null);

  if (!res.ok) {
    const firstValidationError = payload?.errors
      ? Object.values(payload.errors).flat().find(Boolean)
      : null;

    throw new Error(
      (typeof firstValidationError === "string" && firstValidationError) ||
        payload?.message ||
        fallbackMessage
    );
  }

  return payload;
}

export function useLogin(onLoggedIn: () => void) {
  const { setUser } = useUser();
  return useMutation({
    mutationFn: async (data: { phone: string; password: string }) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      return readAuthResponse(
        res,
        res.status === 422
          ? "نام کاربری یا رمز عبور اشتباه است."
          : "خطا در ارسال اطلاعات!"
      );
    },
    onError(error) {
      toast.error(error.message);
    },
    onSuccess: (result) => {
      setUser(result.user);
      toast.success("با موفقیت وارد شدید. لطفا کمی صبر کنید.");
      onLoggedIn();
    },
  });
}

export function useRequestLoginOtp(onCodeSent?: () => void) {
  return useMutation({
    mutationFn: async (phone: string) => {
      const res = await fetch("/api/auth/otp/request", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      });

      return readAuthResponse(res, "خطا در ارسال کد ورود");
    },
    onError(error) {
      toast.error(error.message);
    },
    onSuccess(result) {
      toast.success(result?.message || "کد ورود برای شما ارسال شد.");
      onCodeSent?.();
    },
  });
}

export function useVerifyLoginOtp(onLoggedIn: () => void) {
  const { setUser } = useUser();

  return useMutation({
    mutationFn: async (data: OtpCredentials) => {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      return readAuthResponse(res, "کد واردشده نامعتبر است.");
    },
    onError(error) {
      toast.error(error.message);
    },
    onSuccess(result) {
      setUser(result.user);
      toast.success("با موفقیت وارد شدید.");
      onLoggedIn();
    },
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("خطا در فرایند خروج، لطفا دوباره تلاش کنید.");
      }

      return res.json();
    },
    onError(error) {
      toast.error(error.message);
    },
  });
}

export function useGetMe(enabled = false) {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me", {
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        throw new Error("خطا در دریافت اطلاعات.");
      }

      return res.json();
    },
    enabled,
  });
}

export function useRequestPasswordOtp(onCodeSent?: () => void) {
  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/password/otp", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      return readAuthResponse(res, "خطا در ارسال کد تغییر رمز");
    },
    onError(error) {
      toast.error(error.message);
    },
    onSuccess(result) {
      toast.success(result?.message || "کد تغییر رمز ارسال شد.");
      onCodeSent?.();
    },
  });
}

export function useChangePassword(onSuccess?: () => void) {
  return useMutation({
    mutationFn: async (data: {
      code: string;
      password: string;
      password_confirmation: string;
    }) => {
      const res = await fetch("/api/auth/password", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      return readAuthResponse(res, "خطا در تغییر رمز عبور");
    },
    onError(error) {
      toast.error(error.message);
    },
    onSuccess(result) {
      toast.success(result?.message || "رمز عبور با موفقیت تغییر کرد.");
      onSuccess?.();
    },
  });
}
