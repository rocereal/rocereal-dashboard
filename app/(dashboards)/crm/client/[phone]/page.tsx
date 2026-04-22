import { metadataTemplates } from "@/lib/metadata";
import type { Metadata } from "next";
import ClientDetailPage from "./(components)/ClientDetailPage";

export const metadata: Metadata = metadataTemplates.dashboard(
  "Fișă Client",
  "Detalii complete despre client — apeluri, facturi și traseu"
);

interface Props {
  params: Promise<{ phone: string }>;
}

export default async function Page({ params }: Props) {
  const { phone } = await params;
  return <ClientDetailPage phone={decodeURIComponent(phone)} />;
}
