"use client";

import Breadcrumb from "@/app/components/common-components/Breadcrumb";
import { useAuth } from "@/app/providers/AuthProvider";
import { authApi } from "@/app/lib/authApi";
import Link from "next/link";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import UiButton from "@/app/components/ui/UiButton";
import UiInput from "@/app/components/ui/UiInput";

export default function Page() {
  const router = useRouter();
  const { user, loading, refreshMe, logout } = useAuth();
  const [avatarFile, setAvatarFile] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const profileForm = useForm();
  const passwordForm = useForm();

  const email = useMemo(() => user?.email || "", [user]);

  useEffect(() => {
    if (user) {
      profileForm.reset({
        fullName: user.fullName || "",
        phone: user.phone || "",
        address: user.address || "",
      });
      passwordForm.reset({ oldPassword: "", newPassword: "" });
    }
  }, [user, profileForm, passwordForm]);

  const disableActions =
    loading || refreshing || loggingOut || updatingProfile || changingPassword;

  const onUpdateProfile = async (values) => {
    try {
      setUpdatingProfile(true);
      await authApi.updateProfile({
        fullName: values.fullName,
        phone: values.phone,
        address: values.address,
        avaterFile: avatarFile,
      });
      toast.success("Profile updated");
      setAvatarFile(null);
      await refreshMe();
    } catch (e) {
      toast.error(e?.message || "Failed to update profile");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const onChangePassword = async (values) => {
    try {
      setChangingPassword(true);
      await authApi.changePassword({
        email,
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      toast.success("Password changed successfully");
      passwordForm.reset({ oldPassword: "", newPassword: "" });
    } catch (e) {
      toast.error(e?.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  const onLogout = async () => {
    if (disableActions) return;
    try {
      setLoggingOut(true);
      await logout();
      toast.success("Logged out");
      router.push("/");
    } catch (e) {
      toast.error(e?.message || "Logout failed");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <section className="pt-28 px-3">
      <Breadcrumb />

      <div className="container mx-auto pt-10 md:pt-20">
        <div className="max-w-4xl mx-auto">
          <div className="nav-custom-shadow bg-white/95 backdrop-blur rounded-2xl border border-lightBrand/25 overflow-hidden">
            <div className="p-6 md:p-10">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-3xl md:text-5xl font-bebas text-dark text-shadow-light">
                    Account
                  </h2>
                  <p className="font-jakarta text-gray-600">
                    Manage your profile, verification and password.
                  </p>
                </div>

                <UiButton
                  onClick={onLogout}
                  variant="dark"
                  size="md"
                  disabled={disableActions}
                  loading={loggingOut}
                  loadingText="Logging out..."
                >
                  Logout
                </UiButton>
              </div>

              {loading ? (
                <div className="py-10">
                  <p className="font-jakarta text-gray-600">Loading...</p>
                </div>
              ) : !user ? (
                <div className="py-10">
                  <p className="font-jakarta text-gray-600">
                    Please{" "}
                    <Link className="text-brand hover:underline" href="/login">
                      login
                    </Link>{" "}
                    to view your account.
                  </p>
                </div>
              ) : (
                <>
                  {/* Profile header */}
                  <div className="rounded-2xl border border-lightBrand/25 bg-gradient-to-br from-white via-white to-[#fff4e7] p-5 md:p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full border-2 border-lightBrand bg-white overflow-hidden flex items-center justify-center">
                          {user?.avater ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={user.avater}
                              alt="avatar"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-2xl font-bebas text-dark">
                              {user?.fullName?.slice(0, 1) || "U"}
                            </span>
                          )}
                        </div>

                        <div>
                          <h3 className="text-2xl md:text-3xl font-bebas text-dark text-shadow-lighter leading-tight">
                            {user?.fullName || "Customer"}
                          </h3>
                          <p className="font-jakarta text-gray-700">
                            {user?.email}
                          </p>

                          <div className="flex items-center gap-2 mt-2">
                            <span
                              className={`text-xs font-semibold px-2 py-1 rounded-full border ${
                                user.emailVerified
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-orange-50 text-orange-700 border-orange-200"
                              }`}
                            >
                              {user.emailVerified
                                ? "Email Verified"
                                : "Email Not Verified"}
                            </span>
                            {!user.emailVerified && (
                              <Link
                                className="text-sm text-brand hover:underline"
                                href="/verify-email"
                              >
                                Verify now
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <UiButton
                          type="button"
                          variant="brand"
                          size="md"
                          disabled={disableActions}
                          loading={refreshing}
                          loadingText="Refreshing..."
                          onClick={async () => {
                            if (disableActions) return;
                            try {
                              setRefreshing(true);
                              await refreshMe();
                              toast.success("Account refreshed");
                            } catch (e) {
                              toast.error(e?.message || "Refresh failed");
                            } finally {
                              setRefreshing(false);
                            }
                          }}
                        >
                          Refresh
                        </UiButton>

                        <Link
                          href="/wishlist"
                          className="bg-white text-dark text-2xl font-bebas py-2 px-5 border-2 border-dark/20 rounded cardButtonHover text-shadow-lighter text-center"
                        >
                          Wishlist
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Main cards */}
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Profile */}
                    <div className="lg:col-span-3 rounded-2xl border border-lightBrand/25 bg-white p-5 md:p-6">
                      <div className="flex items-center justify-between gap-3 mb-5">
                        <div>
                          <h3 className="text-2xl md:text-3xl font-bebas text-dark text-shadow-lighter">
                            Profile Details
                          </h3>
                          <p className="font-jakarta text-sm text-gray-600">
                            Update your name, contact info, address and avatar.
                          </p>
                        </div>
                      </div>

                      <form
                        onSubmit={profileForm.handleSubmit(onUpdateProfile)}
                        className="font-jakarta"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <UiInput
                              label="Full Name"
                              placeholder="Your name"
                              disabled={disableActions}
                              {...profileForm.register("fullName")}
                            />
                          </div>

                          <div>
                            <UiInput
                              label="Phone"
                              placeholder="Phone number"
                              disabled={disableActions}
                              {...profileForm.register("phone")}
                            />
                          </div>

                          <div>
                            <label className="block text-sm text-gray-700 mb-2">
                              Avatar
                            </label>
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full border border-lightBrand/40 bg-gray-50 overflow-hidden flex items-center justify-center">
                                {avatarFile ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={URL.createObjectURL(avatarFile)}
                                    alt="avatar preview"
                                    className="w-full h-full object-cover"
                                  />
                                ) : user?.avater ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={user.avater}
                                    alt="avatar"
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="text-lg font-bebas text-dark">
                                    {user?.fullName?.slice(0, 1) || "U"}
                                  </span>
                                )}
                              </div>

                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                  setAvatarFile(e.target.files?.[0] || null)
                                }
                                className="w-full text-sm"
                                disabled={disableActions}
                              />
                            </div>
                          </div>

                          <div className="md:col-span-2">
                            <UiInput
                              as="textarea"
                              rows={4}
                              label="Address"
                              placeholder="Your address"
                              disabled={disableActions}
                              {...profileForm.register("address")}
                            />
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-6">
                          <p className="text-xs text-gray-500">
                            Tip: use a square image for best results.
                          </p>
                          <UiButton
                            type="submit"
                            variant="brand"
                            disabled={disableActions}
                            loading={updatingProfile}
                            loadingText="Saving..."
                          >
                            Save Changes
                          </UiButton>
                        </div>
                      </form>
                    </div>

                    {/* Security */}
                    <div className="lg:col-span-2 rounded-2xl border border-lightBrand/25 bg-white p-5 md:p-6">
                      <h3 className="text-2xl md:text-3xl font-bebas text-dark text-shadow-lighter mb-1">
                        Security
                      </h3>
                      <p className="font-jakarta text-sm text-gray-600 mb-5">
                        Change your password to keep your account safe.
                      </p>

                      <div className="mb-4 rounded-xl border border-dark/10 bg-gray-50 p-4">
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold">Signed in as:</span>
                          <span className="ml-2">{email}</span>
                        </p>
                      </div>

                      <form
                        onSubmit={passwordForm.handleSubmit(onChangePassword)}
                        className="flex font-jakarta flex-col gap-4"
                      >
                        <UiInput
                          type="password"
                          showToggle
                          label="Old Password"
                          placeholder="Enter old password"
                          disabled={disableActions}
                          {...passwordForm.register("oldPassword", {
                            required: true,
                          })}
                        />

                        <UiInput
                          type="password"
                          showToggle
                          label="New Password"
                          placeholder="Enter new password"
                          disabled={disableActions}
                          {...passwordForm.register("newPassword", {
                            required: true,
                          })}
                        />

                        <UiButton
                          type="submit"
                          variant="dark"
                          fullWidth
                          disabled={disableActions}
                          loading={changingPassword}
                          loadingText="Updating..."
                        >
                          Update Password
                        </UiButton>

                        <p className="text-xs text-gray-500">
                          Forgot your password? Use{" "}
                          <Link
                            className="text-brand hover:underline"
                            href="/forgot-password"
                          >
                            Reset via Email
                          </Link>
                          .
                        </p>
                      </form>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
