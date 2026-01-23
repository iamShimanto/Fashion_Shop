import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = useMemo(() => location.state?.from?.pathname || "/", [location]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="text-3xl font-extrabold tracking-tight text-dark">
            Welcome <span className="text-brand">Admin</span>
          </div>
          <div className="mt-1 text-sm text-dark/60">
            Sign in to manage products and orders.
          </div>
        </div>

        <Card>
          <form className="space-y-4" onSubmit={onSubmit}>
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@email.com"
              autoComplete="email"
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
            <Button type="submit" className="w-full" loading={busy}>
              Sign in
            </Button>
            <div className="text-xs text-dark/55">
              API base:{" "}
              <span className="font-semibold">
                {import.meta.env.VITE_API_BASE_URL ||
                  "https://fashion-server.shimanto.dev/api"}
              </span>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
