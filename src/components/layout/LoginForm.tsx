"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import imagePlaceholder from "../../../public/images/login_placeholder.jpg";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  useLogin,
  useRequestLoginOtp,
  useVerifyLoginOtp,
} from "@/hooks/useAuth";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loginMethod, setLoginMethod] = useState<"password" | "otp">(
    "password"
  );
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
    code: "",
  });
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(0);

  const router = useRouter();
  const onLoggedIn = () => router.push("/");
  const { mutate: login, isPending } = useLogin(() => {
    onLoggedIn();
  });
  const { mutate: requestOtp, isPending: isRequestingOtp } =
    useRequestLoginOtp(() => {
      setIsCodeSent(true);
      setResendSeconds(60);
    });
  const { mutate: verifyOtp, isPending: isVerifyingOtp } =
    useVerifyLoginOtp(onLoggedIn);

  useEffect(() => {
    if (resendSeconds <= 0) return;

    const timer = window.setInterval(() => {
      setResendSeconds((seconds) => Math.max(0, seconds - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendSeconds]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phone || !formData.password) {
      toast.error("لطفا همه فیلد ها را پر کنید");
    } else {
      login(formData);
    }
  };

  const handleRequestOtp = () => {
    if (!/^09\d{9}$/.test(formData.phone)) {
      toast.error("شماره تلفن معتبر وارد کنید.");
      return;
    }

    requestOtp(formData.phone);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isCodeSent) {
      handleRequestOtp();
      return;
    }

    if (!/^\d{6}$/.test(formData.code)) {
      toast.error("کد ۶ رقمی ارسال‌شده را وارد کنید.");
      return;
    }

    verifyOtp({ phone: formData.phone, code: formData.code });
  };

  return (
    <div
      dir="rtl"
      className={cn("flex flex-col gap-6 text-right", className)}
      {...props}
    >
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8 text-right">
            <div className="flex flex-col items-center gap-2 text-center mb-7">
              <h1 className="text-2xl font-bold">خوش برگشتین</h1>
              <p className="text-muted-foreground text-balance">
                ورود به پنل روان‌درمانگران کلینیک ابراز
              </p>
            </div>

            <Tabs
              dir="rtl"
              value={loginMethod}
              onValueChange={(value) => {
                setLoginMethod(value as "password" | "otp");
                setFormData((current) => ({
                  ...current,
                  password: "",
                  code: "",
                }));
              }}
              className="w-full"
            >
              <TabsList className="grid h-10 w-full grid-cols-2" dir="rtl">
                <TabsTrigger value="password">ورود با رمز</TabsTrigger>
                <TabsTrigger value="otp">ورود با کد یک‌بارمصرف</TabsTrigger>
              </TabsList>

              <TabsContent value="password">
                <form
                  className="pt-6"
                  onSubmit={handlePasswordSubmit}
                >
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="password-phone">
                        شماره تلفن
                      </FieldLabel>
                      <Input
                        id="password-phone"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        placeholder="مثلا: 09123456789"
                        className="text-right"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="password">رمز عبور</FieldLabel>
                      <Input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        className="text-right"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            password: e.target.value,
                          }))
                        }
                      />
                    </Field>
                    <Field>
                      <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? "در حال ورود..." : "ورود"}
                      </Button>
                    </Field>
                  </FieldGroup>
                </form>
              </TabsContent>

              <TabsContent value="otp">
                <form className="pt-6" onSubmit={handleOtpSubmit}>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="otp-phone">شماره تلفن</FieldLabel>
                      <Input
                        id="otp-phone"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        placeholder="مثلا: 09123456789"
                        className="text-right"
                        value={formData.phone}
                        disabled={isCodeSent}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                      />
                    </Field>

                    {isCodeSent && (
                      <Field>
                        <FieldLabel htmlFor="otp-code">
                          کد یک‌بارمصرف
                        </FieldLabel>
                        <Input
                          id="otp-code"
                          type="text"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          maxLength={6}
                          placeholder="کد ۶ رقمی"
                          className="text-right tracking-widest"
                          value={formData.code}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              code: e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 6),
                            }))
                          }
                        />
                        <p className="text-muted-foreground text-xs text-right">
                          کد ارسال‌شده ۵ دقیقه اعتبار دارد.
                        </p>
                      </Field>
                    )}

                    <Field>
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isRequestingOtp || isVerifyingOtp}
                      >
                        {isRequestingOtp
                          ? "در حال ارسال کد..."
                          : isVerifyingOtp
                            ? "در حال بررسی کد..."
                            : isCodeSent
                              ? "تأیید کد و ورود"
                              : "ارسال کد ورود"}
                      </Button>
                    </Field>

                    {isCodeSent && (
                      <div className="flex items-center justify-between text-sm">
                        <Button
                          type="button"
                          variant="ghost"
                          className="h-auto px-0"
                          disabled={resendSeconds > 0 || isRequestingOtp}
                          onClick={handleRequestOtp}
                        >
                          {resendSeconds > 0
                            ? `ارسال مجدد تا ${resendSeconds} ثانیه دیگر`
                            : "ارسال مجدد کد"}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          className="h-auto px-0"
                          onClick={() => {
                            setIsCodeSent(false);
                            setResendSeconds(0);
                            setFormData((current) => ({
                              ...current,
                              code: "",
                            }));
                          }}
                        >
                          تغییر شماره
                        </Button>
                      </div>
                    )}
                  </FieldGroup>
                </form>
              </TabsContent>
            </Tabs>

            <FieldGroup className="mt-7">
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                یا
              </FieldSeparator>
              <Field>
                <Button type="button" variant="ghost">
                  بازگشت به سایت
                </Button>
              </Field>
              <FieldDescription className="text-center">
                در صورت بروز مشکل در ورود به مدیر سایت اطلاع دهید.
              </FieldDescription>
            </FieldGroup>
          </div>
          <div className="bg-muted relative hidden md:block">
            <Image
              src={imagePlaceholder}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
