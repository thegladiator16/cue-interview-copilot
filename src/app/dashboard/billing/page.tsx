import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth";
import { BillingClient } from "@/components/dashboard/BillingClient";

export default async function BillingPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const minutesLeft = Math.floor((user.freeSecondsLeft + user.creditSeconds) / 60);

  return (
    <Suspense>
      <BillingClient plan={user.plan} minutesLeft={minutesLeft} />
    </Suspense>
  );
}
