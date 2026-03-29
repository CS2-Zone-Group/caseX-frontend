import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ro'yxatdan o'tish",
  description: "CaseX'da bepul ro'yxatdan o'ting. CS2 skinlarni arzon narxda sotib oling va soting.",
  openGraph: {
    title: "Ro'yxatdan o'tish — CaseX",
    description: "CaseX'da bepul ro'yxatdan o'ting. CS2 skinlarni arzon narxda sotib oling va soting.",
    url: "https://casex.uz/auth/register",
  },
  alternates: {
    canonical: "https://casex.uz/auth/register",
  },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
