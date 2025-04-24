import { Suspense } from "react";
import SignUpClient from "./SignUpClient";

export const dynamic = "force-dynamic";

export default function SignUpPage() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <SignUpClient />
    </Suspense>
  );
}