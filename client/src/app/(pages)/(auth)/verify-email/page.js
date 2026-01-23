"use client";

import { authApi } from "@/app/lib/authApi";
import { useAuth } from "@/app/providers/AuthProvider";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  UiButton,
  UiCard,
  UiInput,
  UiPageHeader,
  UiSection,
} from "@/app/components/ui";

export default function Page() {
  const router = useRouter();
  const { user, loading, refreshMe } = useAuth();
  const { register, handleSubmit } = useForm();
  const [sending, setSending] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const disableActions = loading || sending || refreshing || verifying;

  const onSend = async () => {
    if (disableActions) return;
    try {
      setSending(true);
      await authApi.sendVerificationCode();
      toast.success("Verification code sent to your email");
    } catch (e) {
      toast.error(e?.message || "Failed to send code");
    } finally {
      setSending(false);
    }
  };

  const onVerify = async ({ code }) => {
    if (disableActions) return;
    try {
      setVerifying(true);
      await authApi.verifyCode({ code });
      toast.success("Email verified successfully");
      await refreshMe();
      router.push("/account");
    } catch (e) {
      toast.error(e?.message || "Verification failed");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <UiSection>

      <div className="container mx-auto pt-10 md:pt-20">
        <div className="max-w-xl mx-auto">
          <UiCard className="" padded>
            <UiPageHeader title="Verify Email" />

            {loading ? (
              <p className="font-jakarta text-gray-600">Loading...</p>
            ) : !user ? (
              <p className="font-jakarta text-gray-600">
                Please{" "}
                <Link className="text-brand hover:underline" href="/login">
                  login
                </Link>{" "}
                to verify your email.
              </p>
            ) : user?.emailVerified ? (
              <div className="font-jakarta text-gray-600">
                <p>Your email is already verified.</p>
                <Link className="text-brand hover:underline" href="/account">
                  Go to Account
                </Link>
              </div>
            ) : (
              <>
                <p className="font-jakarta text-gray-600 mb-6">
                  We will send a 6-digit code to{" "}
                  <span className="font-semibold">{user?.email}</span>.
                </p>

                <div className="flex gap-3 mb-5">
                  <UiButton
                    type="button"
                    variant="dark"
                    fullWidth
                    disabled={disableActions}
                    loading={sending}
                    onClick={onSend}
                  >
                    Send Code
                  </UiButton>

                  <UiButton
                    type="button"
                    variant="brand"
                    fullWidth
                    disabled={disableActions}
                    loading={refreshing}
                    onClick={async () => {
                      if (disableActions) return;
                      try {
                        setRefreshing(true);
                        await refreshMe();
                        toast.success("Account refreshed");
                      } finally {
                        setRefreshing(false);
                      }
                    }}
                  >
                    Refresh
                  </UiButton>
                </div>

                <form
                  onSubmit={handleSubmit(onVerify)}
                  className="flex font-poppins flex-col gap-5"
                >
                  <UiInput
                    inputMode="numeric"
                    placeholder="Enter 6-digit code"
                    disabled={disableActions}
                    {...register("code", { required: true })}
                  />

                  <UiButton
                    type="submit"
                    variant="brand"
                    fullWidth
                    disabled={disableActions}
                    loading={verifying}
                  >
                    Verify
                  </UiButton>
                </form>
              </>
            )}
          </UiCard>
        </div>
      </div>
    </UiSection>
  );
}
