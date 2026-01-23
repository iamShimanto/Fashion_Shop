"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";
import {
  UiButton,
  UiCard,
  UiInput,
  UiLinkButton,
  UiPageHeader,
  UiSection,
} from "@/app/components/ui";

const Page = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const { login, user } = useAuth();

  const onSubmit = async (data) => {
    try {
      const me = await login({ email: data.email, password: data.password });
      toast.success("Login successful!");
      if (me?.emailVerified === false) {
        router.push("/verify-email");
      } else {
        router.push("/");
      }
    } catch (error) {
      toast.error(error?.message || "Login failed");
    }
  };

  return (
    <UiSection>

      <div className="container mx-auto pt-10 md:pt-20">
        <div className="flex flex-col md:flex-row items-start justify-center gap-5 md:gap-10">
          <div className="w-full mx-auto">
            <UiCard className="" padded>
              <UiPageHeader title="Login" />

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex font-poppins flex-col gap-5"
              >
                <UiInput
                  type="email"
                  placeholder="Email"
                  required
                  {...register("email", { required: true })}
                />

                <UiInput
                  type="password"
                  showToggle
                  placeholder="Password"
                  required
                  {...register("password", { required: true })}
                />

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4" />
                    <span>Remember me</span>
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-brand hover:underline"
                  >
                    Forgot Your Password?
                  </Link>
                </div>

                {user?.emailVerified === false && (
                  <Link
                    href="/verify-email"
                    className="text-sm text-brand hover:underline"
                  >
                    Verify your email
                  </Link>
                )}

                <UiButton type="submit" variant="brand" fullWidth>
                  Login
                </UiButton>
              </form>
            </UiCard>
          </div>

          <div className="hidden md:block w-px bg-gray-300"></div>

          <div className="w-full mx-auto">
            <UiCard className="" padded>
              <UiPageHeader title="New Customer" />
              <p className="font-poppins text-gray-600 mb-6">
                Be part of our growing family of new customers! Join us today
                and unlock a world of exclusive benefits, offers, and
                personalized experiences.
              </p>
              <UiLinkButton href="/registration" variant="dark" fullWidth>
                Register
              </UiLinkButton>
            </UiCard>
          </div>
        </div>
      </div>
    </UiSection>
  );
};

export default Page;
