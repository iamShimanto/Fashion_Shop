"use client";

import Breadcrumb from "@/app/components/common-components/Breadcrumb";
import { authApi } from "@/app/lib/authApi";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  UiButton,
  UiCard,
  UiInput,
  UiPageHeader,
  UiSection,
} from "@/app/components/ui";

export default function Page() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");

  const sendForm = useForm();
  const confirmForm = useForm();

  const onSendCode = async ({ email }) => {
    try {
      await authApi.sendForgetPasswordCode({ email });
      setEmail(email);
      toast.success("Reset code sent to your email");
      setStep(2);
    } catch (e) {
      toast.error(e?.message || "Failed to send reset code");
    }
  };

  const onConfirm = async ({ code, newPassword }) => {
    try {
      await authApi.forgetPasswordConfirm({ email, code, newPassword });
      toast.success("Password updated. Please login.");
      router.push("/login");
    } catch (e) {
      toast.error(e?.message || "Failed to reset password");
    }
  };

  return (
    <UiSection>
      <Breadcrumb />

      <div className="container mx-auto pt-10 md:pt-20">
        <div className="max-w-xl mx-auto">
          <UiCard>
            <UiPageHeader title="Forgot Password" />
            <p className="font-jakarta text-gray-600 mb-6">
              {step === 1
                ? "Enter your email to receive a reset code."
                : "Enter the code from your email and set a new password."}
            </p>

            {step === 1 ? (
              <form
                onSubmit={sendForm.handleSubmit(onSendCode)}
                className="flex font-poppins flex-col gap-5"
              >
                <UiInput
                  type="email"
                  placeholder="Email"
                  {...sendForm.register("email", { required: true })}
                />

                <UiButton type="submit" variant="brand" fullWidth>
                  Send Code
                </UiButton>
              </form>
            ) : (
              <form
                onSubmit={confirmForm.handleSubmit(onConfirm)}
                className="flex font-poppins flex-col gap-5"
              >
                <div className="text-sm text-gray-600">
                  Email: <span className="font-semibold">{email}</span>
                </div>

                <UiInput
                  inputMode="numeric"
                  placeholder="6-digit code"
                  {...confirmForm.register("code", { required: true })}
                />

                <UiInput
                  type="password"
                  showToggle
                  placeholder="New Password"
                  {...confirmForm.register("newPassword", { required: true })}
                />

                <div className="flex gap-3">
                  <UiButton
                    type="button"
                    variant="dark"
                    fullWidth
                    onClick={() => setStep(1)}
                  >
                    Back
                  </UiButton>
                  <UiButton type="submit" variant="brand" fullWidth>
                    Reset
                  </UiButton>
                </div>
              </form>
            )}
          </UiCard>
        </div>
      </div>
    </UiSection>
  );
}
