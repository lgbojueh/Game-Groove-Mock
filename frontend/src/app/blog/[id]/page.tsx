import { Suspense } from "react";
import BlogPostClient from "./BlogPostClient";

export const dynamic = "force-dynamic";

export default function BlogPostPage() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <BlogPostClient />
    </Suspense>
  );
}