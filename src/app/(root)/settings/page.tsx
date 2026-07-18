"use client";

import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/contexts/UserContext";
import { useTheme } from "@/contexts/ThemeContext";
import {
  useChangePassword,
  useGetMe,
  useRequestPasswordOtp,
} from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PuffLoader } from "react-spinners";
import Image from "next/image";
import { Moon, Sun, User } from "lucide-react";
import { useRouter } from "next/navigation";

const Settings = () => {
  const router = useRouter();
  const { user, setUser, logout } = useUser();
  const { theme, toggleTheme } = useTheme();
  const { data: meData, isLoading: isLoadingMe, refetch } = useGetMe(true);

  const [isCodeSent, setIsCodeSent] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(0);
  const [passwordForm, setPasswordForm] = useState({
    code: "",
    password: "",
    password_confirmation: "",
  });

  const { mutate: requestPasswordOtp, isPending: isRequestingOtp } =
    useRequestPasswordOtp(() => {
      setIsCodeSent(true);
      setResendSeconds(60);
    });

  const { mutate: changePassword, isPending: isChangingPassword } =
    useChangePassword(() => {
      setIsCodeSent(false);
      setResendSeconds(0);
      setPasswordForm({
        code: "",
        password: "",
        password_confirmation: "",
      });
    });

  useEffect(() => {
    if (meData?.user) {
      setUser(meData.user);
    }
  }, [meData, setUser]);

  useEffect(() => {
    if (resendSeconds <= 0) return;

    const timer = window.setInterval(() => {
      setResendSeconds((seconds) => Math.max(0, seconds - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendSeconds]);

  const profile = meData?.user || user;
  const avatarUrl =
    profile?.doctor_profile?.avatar_url || profile?.avatar_url || null;

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isCodeSent) {
      requestPasswordOtp();
      return;
    }

    if (!/^\d{6}$/.test(passwordForm.code)) {
      toast.error("کد ۶ رقمی ارسال‌شده را وارد کنید.");
      return;
    }

    if (passwordForm.password.length < 8) {
      toast.error("رمز جدید باید حداقل ۸ کاراکتر باشد.");
      return;
    }

    if (passwordForm.password !== passwordForm.password_confirmation) {
      toast.error("تکرار رمز عبور با رمز جدید یکسان نیست.");
      return;
    }

    changePassword(passwordForm);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <Header searchFn={() => {}} isShowSearch={false} />
      <div className="w-full flex flex-col gap-6 p-6 md:p-12">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-bold text-2xl">تنظیمات</h2>
          <Button variant="outline" onClick={() => refetch()}>
            بروزرسانی پروفایل
          </Button>
        </div>

        {isLoadingMe && !profile ? (
          <div className="flex justify-center py-20">
            <PuffLoader size={60} color="#3e86fa" />
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <Card>
              <CardHeader>
                <CardTitle>اطلاعات حساب</CardTitle>
                <CardDescription>
                  این اطلاعات فقط‌خواندنی هستند. برای ویرایش محتوای عمومی به
                  صفحه رزومه بروید.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border bg-gray-50 dark:bg-gray-900">
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt={profile?.name || "avatar"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <User className="text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="text-lg font-semibold">
                      {profile?.name || "بدون نام"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      روان‌درمانگر
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoItem label="شماره تلفن" value={profile?.phone} />
                  <InfoItem label="ایمیل" value={profile?.email || "—"} />
                  <InfoItem
                    label="کد ملی"
                    value={profile?.doctor_profile?.national_code || "—"}
                  />
                  <InfoItem
                    label="شماره نظام پزشکی"
                    value={profile?.doctor_profile?.medical_number || "—"}
                  />
                  <InfoItem
                    label="تاریخ تولد"
                    value={profile?.birth_date || "—"}
                  />
                  <InfoItem
                    label="آدرس"
                    value={profile?.address || "—"}
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button type="button" onClick={() => router.push("/resume")}>
                    ویرایش رزومه
                  </Button>
                  <Button variant="outline" onClick={logout}>
                    خروج از حساب
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>تغییر رمز عبور</CardTitle>
                  <CardDescription>
                    ابتدا کد یک‌بارمصرف برای شماره ثبت‌شده ارسال می‌شود، سپس رمز
                    جدید را ثبت کنید.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" onSubmit={handleChangePassword}>
                    {isCodeSent && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="password-otp-code">کد تأیید</Label>
                          <Input
                            id="password-otp-code"
                            className="text-right tracking-widest"
                            maxLength={6}
                            inputMode="numeric"
                            value={passwordForm.code}
                            onChange={(e) =>
                              setPasswordForm((prev) => ({
                                ...prev,
                                code: e.target.value
                                  .replace(/\D/g, "")
                                  .slice(0, 6),
                              }))
                            }
                            placeholder="کد ۶ رقمی"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password">رمز جدید</Label>
                          <Input
                            id="new-password"
                            type="password"
                            className="text-right"
                            value={passwordForm.password}
                            onChange={(e) =>
                              setPasswordForm((prev) => ({
                                ...prev,
                                password: e.target.value,
                              }))
                            }
                            placeholder="حداقل ۸ کاراکتر"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">تکرار رمز جدید</Label>
                          <Input
                            id="confirm-password"
                            type="password"
                            className="text-right"
                            value={passwordForm.password_confirmation}
                            onChange={(e) =>
                              setPasswordForm((prev) => ({
                                ...prev,
                                password_confirmation: e.target.value,
                              }))
                            }
                            placeholder="تکرار رمز جدید"
                          />
                        </div>
                      </>
                    )}

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isRequestingOtp || isChangingPassword}
                    >
                      {isRequestingOtp
                        ? "در حال ارسال کد..."
                        : isChangingPassword
                          ? "در حال ذخیره..."
                          : isCodeSent
                            ? "ثبت رمز جدید"
                            : "ارسال کد تغییر رمز"}
                    </Button>

                    {isCodeSent && (
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <Button
                          type="button"
                          variant="ghost"
                          className="h-auto px-0"
                          disabled={resendSeconds > 0 || isRequestingOtp}
                          onClick={() => requestPasswordOtp()}
                        >
                          {resendSeconds > 0
                            ? `ارسال مجدد تا ${resendSeconds} ثانیه`
                            : "ارسال مجدد کد"}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          className="h-auto px-0"
                          onClick={() => {
                            setIsCodeSent(false);
                            setResendSeconds(0);
                            setPasswordForm({
                              code: "",
                              password: "",
                              password_confirmation: "",
                            });
                          }}
                        >
                          انصراف
                        </Button>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>ترجیحات نمایش</CardTitle>
                  <CardDescription>
                    تنظیمات محلی این دستگاه؛ روی سرور ذخیره نمی‌شود.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">حالت نمایش</p>
                    <p className="text-sm text-muted-foreground">
                      فعلی: {theme === "dark" ? "تاریک" : "روشن"}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={toggleTheme}
                    className="gap-2"
                  >
                    {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                    تغییر تم
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function InfoItem({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-xl border bg-gray-50 px-4 py-3 dark:bg-gray-900/60">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium wrap-break-word">{value || "—"}</p>
    </div>
  );
}

export default Settings;
