import type { Metadata } from "next";
import RenderPage from "./(components)/RenderPage";

export const metadata: Metadata = {
  title: "Fisio Dashboard - The Ultimate Dashboard for Modern Teams",
  description:
    "Streamline your workflow, boost productivity, and make data-driven decisions with Fisio's comprehensive dashboard solution. Built for teams that demand excellence.",
  keywords: [
    "dashboard",
    "analytics",
    "team collaboration",
    "productivity",
    "business intelligence",
    "workflow management",
  ],
  openGraph: {
    title: "Fisio Dashboard - The Ultimate Dashboard for Modern Teams",
    description:
      "Streamline your workflow, boost productivity, and make data-driven decisions with Fisio's comprehensive dashboard solution.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fisio Dashboard - The Ultimate Dashboard for Modern Teams",
    description:
      "Streamline your workflow, boost productivity, and make data-driven decisions with Fisio's comprehensive dashboard solution.",
  },
};

export default function FisioPage() {
  return <RenderPage />;
}
