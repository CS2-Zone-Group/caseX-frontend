"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfileHistoryRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/profile/balance");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      Redirecting...
    </div>
  );
}
