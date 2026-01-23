"use client";

import React from "react";
import Breadcrumb from "@/app/components/common-components/Breadcrumb";
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
  const { register, handleSubmit } = useForm();
  const router = useRouter();
  const { register: registerUser } = useAuth();

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      toast.success("Registration successful! Please log in.");
      router.push("/login");
    } catch (error) {
      toast.error(error?.message || "Registration failed");
    }
  };

  return (
    <UiSection>
      <Breadcrumb />

      <div className="container mx-auto pt-10 md:pt-20">
        <div className="flex flex-col md:flex-row items-start justify-center gap-5 md:gap-10">
          <div className="w-full mx-auto">
            <UiCard padded>
              <UiPageHeader title="Register" />

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex font-poppins flex-col gap-5"
              >
                <UiInput
                  type="text"
                  placeholder="Full Name"
                  required
                  {...register("fullName", { required: true })}
                />

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

                <UiButton type="submit" variant="brand" fullWidth>
                  Register
                </UiButton>
              </form>
            </UiCard>
          </div>

          <div className="hidden md:block w-px bg-gray-300"></div>

          <div className="w-full mx-auto">
            <UiCard padded>
              <UiPageHeader title="Already have an account?" />
              <p className="font-poppins text-gray-600 mb-6">
                If you already have an account, please login to access your
                personalized dashboard, orders, and exclusive offers.
              </p>
              <UiLinkButton href="/login" variant="dark" fullWidth>
                Login
              </UiLinkButton>
            </UiCard>
          </div>
        </div>
      </div>
    </UiSection>
  );
};

export default Page;
