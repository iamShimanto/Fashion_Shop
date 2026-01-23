import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] grid place-items-center">
      <div className="text-center">
        <div className="text-6xl font-extrabold text-dark/15">404</div>
        <div className="mt-2 text-xl font-bold text-dark">Page not found</div>
        <div className="mt-1 text-sm text-dark/60">
          The page you are looking for doesn’t exist.
        </div>
        <div className="mt-4">
          <Link to="/">
            <Button>Go to dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
