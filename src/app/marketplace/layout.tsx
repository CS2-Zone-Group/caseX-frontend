import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CS2 Skinlar Bozori — Arzon narxda sotib oling",
  description:
    "CS2 skinlarni eng arzon narxda sotib oling. AK-47, AWP, M4A4, pichoqlar va boshqa skinlar. O'zbekistonda xavfsiz tranzaksiyalar, so'mda to'lov.",
  keywords: [
    "CS2 skin sotib olish", "CS2 skin arzon", "CS2 AWP skin",
    "CS2 AK-47 skin", "CS2 knife", "CS2 pichoq sotib olish",
    "CS2 skin market", "CS2 skin bozor", "CS2 skin narxlari",
  ],
  openGraph: {
    title: "CS2 Skinlar Bozori — CaseX",
    description: "CS2 skinlarni eng arzon narxda sotib oling. Xavfsiz va tez tranzaksiyalar.",
    url: "https://casex.uz/marketplace",
  },
  alternates: {
    canonical: "https://casex.uz/marketplace",
  },
};

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
