"use client";

import { useAuth } from "@/app/providers/AuthProvider";
import { authApi } from "@/app/lib/authApi";
import { orderApi } from "@/app/lib/orderApi";
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
  const [tab, setTab] = useState("profile");
  const [refreshing, setRefreshing] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orders, setOrders] = useState([]);

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

  useEffect(() => {
    let cancelled = false;

    const loadOrders = async () => {
      if (!user) {
        setOrders([]);
        return;
      }

      setOrdersLoading(true);
      try {
        const res = await orderApi.my({ limit: 10 });
        const items = res?.data?.items || [];
        if (!cancelled) setOrders(items);
      } catch (e) {
        if (!cancelled) {
          setOrders([]);
          toast.error(e?.message || "Failed to load orders");
        }
      } finally {
        if (!cancelled) setOrdersLoading(false);
      }
    };

    if (!loading) loadOrders();
    return () => {
      cancelled = true;
    };
  }, [user, loading]);

  const badgeClass = (variant) => {
    switch (variant) {
      case "green":
        return "bg-green-50 text-green-700 border-green-200";
      case "yellow":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "red":
        return "bg-red-50 text-red-700 border-red-200";
      case "blue":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const statusVariant = (status) => {
    switch (status) {
      case "delivered":
        return "green";
      case "cancelled":
        return "red";
      case "shipped":
      case "confirmed":
        return "blue";
      case "pending":
        return "yellow";
      default:
        return "gray";
    }
  };

  const paymentVariant = (status) => {
    switch (status) {
      case "paid":
        return "green";
      case "failed":
        return "red";
      case "refunded":
        return "gray";
      case "pending":
        return "yellow";
      default:
        return "gray";
    }
  };

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
    <section className="pt-28 px-3 bg-linear-to-b from-[#fff3e7] via-[#fffcfc] to-white">
      <div className="container mx-auto pt-8 md:pt-14">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl border border-lightBrand/25 bg-white/90 backdrop-blur nav-custom-shadow overflow-hidden">
            <div className="p-5 md:p-10">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-3xl md:text-5xl font-bebas text-dark text-shadow-light">
                    Account
                  </h2>
                  <p className="font-jakarta text-gray-600 text-sm">
                    Profile, security and recent orders.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
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
                  {/* Header */}
                  <div className="mt-6 rounded-2xl border border-lightBrand/25 bg-linear-to-br from-white via-white to-[#fff4e7] p-5 md:p-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto] md:items-center">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border border-lightBrand/40 bg-white overflow-hidden flex items-center justify-center shadow-sm shrink-0">
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

                        <div className="min-w-0">
                          <h3 className="text-2xl md:text-3xl font-bebas text-dark text-shadow-lighter leading-tight">
                            {user?.fullName || "Customer"}
                          </h3>
                          <p className="font-jakarta text-gray-700 truncate">
                            {user?.email}
                          </p>

                          <div className="flex flex-wrap items-center gap-2 mt-2">
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
                            {!user.emailVerified ? (
                              <Link
                                className="text-sm text-brand hover:underline font-jakarta"
                                href="/verify-email"
                              >
                                Verify now
                              </Link>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                        <div className="rounded-xl border border-dark/10 bg-white/80 p-3">
                          <div className="text-[11px] uppercase tracking-wider text-gray-500 font-jakarta">
                            Orders
                          </div>
                          <div className="text-2xl font-bebas text-dark">
                            {orders?.length ?? 0}
                          </div>
                        </div>
                        <div className="rounded-xl border border-dark/10 bg-white/80 p-3">
                          <div className="text-[11px] uppercase tracking-wider text-gray-500 font-jakarta">
                            Status
                          </div>
                          <div className="text-2xl font-bebas text-dark">
                            {user.emailVerified ? "Verified" : "Pending"}
                          </div>
                        </div>
                        <div className="rounded-xl border border-dark/10 bg-white/80 p-3">
                          <div className="text-[11px] uppercase tracking-wider text-gray-500 font-jakarta">
                            Member
                          </div>
                          <div className="text-2xl font-bebas text-dark">
                            Active
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="mt-6 overflow-x-auto -mx-1 px-1">
                    <div className="flex flex-nowrap gap-2 rounded-2xl border border-dark/10 bg-gray-50 p-2 min-w-max">
                      {[
                        { key: "profile", label: "Profile" },
                        { key: "security", label: "Security" },
                        { key: "orders", label: "Orders" },
                      ].map((t) => (
                        <button
                          key={t.key}
                          type="button"
                          onClick={() => setTab(t.key)}
                          className={
                            "whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold font-jakarta transition border " +
                            (tab === t.key
                              ? "bg-white border-lightBrand/40 text-dark shadow-sm"
                              : "bg-transparent border-transparent text-gray-600 hover:text-dark hover:bg-white/70")
                          }
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mt-6">
                    {tab === "profile" ? (
                      <div className="rounded-2xl border border-lightBrand/25 bg-white p-5 md:p-6">
                        <div className="flex items-center justify-between gap-3 mb-5">
                          <div>
                            <h3 className="text-2xl md:text-3xl font-bebas text-dark text-shadow-lighter">
                              Profile Details
                            </h3>
                            <p className="font-jakarta text-sm text-gray-600">
                              Update your name, contact info, address and
                              avatar.
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
                              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <div className="w-12 h-12 rounded-xl border border-lightBrand/40 bg-gray-50 overflow-hidden flex items-center justify-center">
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
                    ) : null}

                    {tab === "security" ? (
                      <div className="rounded-2xl border border-lightBrand/25 bg-white p-5 md:p-6">
                        <h3 className="text-2xl md:text-3xl font-bebas text-dark text-shadow-lighter mb-1">
                          Security
                        </h3>
                        <p className="font-jakarta text-sm text-gray-600 mb-5">
                          Change your password to keep your account safe.
                        </p>

                        <div className="mb-4 rounded-xl border border-dark/10 bg-gray-50 p-4">
                          <p className="text-sm text-gray-700 font-jakarta">
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
                    ) : null}

                    {tab === "orders" ? (
                      <div className="rounded-2xl border border-lightBrand/25 bg-white p-5 md:p-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-4">
                          <div>
                            <h3 className="text-2xl md:text-3xl font-bebas text-dark text-shadow-lighter">
                              My Orders
                            </h3>
                            <p className="font-jakarta text-sm text-gray-600">
                              Latest orders and current status.
                            </p>
                          </div>

                          <UiButton
                            type="button"
                            size="sm"
                            variant="light"
                            disabled={disableActions || ordersLoading}
                            loading={ordersLoading}
                            loadingText="Loading..."
                            onClick={async () => {
                              if (!user) return;
                              setOrdersLoading(true);
                              try {
                                const res = await orderApi.my({ limit: 10 });
                                setOrders(res?.data?.items || []);
                              } catch (e) {
                                toast.error(
                                  e?.message || "Failed to load orders",
                                );
                              } finally {
                                setOrdersLoading(false);
                              }
                            }}
                          >
                            Refresh Orders
                          </UiButton>
                        </div>

                        {ordersLoading ? (
                          <p className="font-jakarta text-gray-600">
                            Loading orders...
                          </p>
                        ) : orders.length === 0 ? (
                          <div className="rounded-xl border border-dashed border-dark/15 bg-gray-50 p-6 text-center">
                            <p className="font-jakarta text-gray-600">
                              No orders yet.
                            </p>
                            <Link
                              href="/shop"
                              className="mt-2 inline-block text-brand hover:underline font-semibold font-jakarta"
                            >
                              Start shopping
                            </Link>
                          </div>
                        ) : (
                          <>
                            {/* Mobile cards */}
                            <div className="grid grid-cols-1 gap-3 md:hidden">
                              {orders.map((o) => (
                                <div
                                  key={o._id}
                                  className="rounded-xl border border-dark/10 bg-gray-50 p-4"
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                      <div className="font-semibold text-dark truncate">
                                        {o.orderNumber || o._id}
                                      </div>
                                      <div className="mt-0.5 text-xs text-gray-500">
                                        {o.createdAt
                                          ? new Date(
                                              o.createdAt,
                                            ).toLocaleDateString()
                                          : "—"}
                                        <span className="mx-2">•</span>
                                        Items: {o.items?.length ?? 0}
                                      </div>
                                    </div>
                                    <Link
                                      href={`/account/orders/${o._id}`}
                                      className="shrink-0 text-brand hover:underline font-semibold"
                                    >
                                      View
                                    </Link>
                                  </div>

                                  <div className="mt-3 grid grid-cols-2 gap-2">
                                    <div className="rounded-lg bg-white border border-dark/10 p-2">
                                      <div className="text-[11px] uppercase tracking-wider text-gray-500">
                                        Total
                                      </div>
                                      <div className="font-semibold text-dark">
                                        {Number(o.total || 0).toFixed(2)}{" "}
                                        {o.currency || ""}
                                      </div>
                                    </div>
                                    <div className="rounded-lg bg-white border border-dark/10 p-2">
                                      <div className="text-[11px] uppercase tracking-wider text-gray-500">
                                        Payment
                                      </div>
                                      <span
                                        className={`inline-flex mt-1 text-xs font-semibold px-2 py-1 rounded-full border ${badgeClass(
                                          paymentVariant(o.paymentStatus),
                                        )}`}
                                      >
                                        {o.paymentStatus || "—"}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="mt-2">
                                    <span
                                      className={`text-xs font-semibold px-2 py-1 rounded-full border ${badgeClass(
                                        statusVariant(o.status),
                                      )}`}
                                    >
                                      {o.status || "—"}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Desktop table */}
                            <div className="hidden md:block overflow-x-auto rounded-xl border border-dark/10">
                              <table className="w-full text-left font-jakarta text-sm">
                                <thead className="bg-gray-50">
                                  <tr className="border-b text-xs uppercase tracking-wider text-gray-500">
                                    <th className="py-3 px-3">Order</th>
                                    <th className="py-3 px-3">Date</th>
                                    <th className="py-3 px-3">Total</th>
                                    <th className="py-3 px-3">Payment</th>
                                    <th className="py-3 px-3">Status</th>
                                    <th className="py-3 px-3">Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {orders.map((o) => (
                                    <tr
                                      key={o._id}
                                      className="border-b border-gray-100 hover:bg-gray-50/60"
                                    >
                                      <td className="py-3 px-3">
                                        <div className="font-semibold text-dark">
                                          {o.orderNumber || o._id}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          Items: {o.items?.length ?? 0}
                                        </div>
                                      </td>
                                      <td className="py-3 px-3">
                                        {o.createdAt
                                          ? new Date(
                                              o.createdAt,
                                            ).toLocaleString()
                                          : "—"}
                                      </td>
                                      <td className="py-3 px-3">
                                        {Number(o.total || 0).toFixed(2)}{" "}
                                        {o.currency || ""}
                                      </td>
                                      <td className="py-3 px-3">
                                        <span
                                          className={`text-xs font-semibold px-2 py-1 rounded-full border ${badgeClass(
                                            paymentVariant(o.paymentStatus),
                                          )}`}
                                        >
                                          {o.paymentStatus || "—"}
                                        </span>
                                      </td>
                                      <td className="py-3 px-3">
                                        <span
                                          className={`text-xs font-semibold px-2 py-1 rounded-full border ${badgeClass(
                                            statusVariant(o.status),
                                          )}`}
                                        >
                                          {o.status || "—"}
                                        </span>
                                      </td>
                                      <td className="py-3 px-3">
                                        <Link
                                          href={`/account/orders/${o._id}`}
                                          className="text-brand hover:underline font-semibold"
                                        >
                                          View
                                        </Link>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}
                      </div>
                    ) : null}
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
