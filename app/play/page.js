import { Suspense } from "react";
import PageContent from "./PageContent"

export const metadata = {
  title: "Spleef",
  robots: {
    index: false,
    follow: true,
  },
};

export default function Play() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}
