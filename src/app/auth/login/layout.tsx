import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kirish",
  description: "CaseX akkauntingizga kiring. CS2 skinlarni sotib olish va sotish uchun.",
  openGraph: {
    title: "Kirish — CaseX",
    description: "CaseX akkauntingizga kiring. CS2 skinlarni sotib olish va sotish uchun.",
    url: "https://casex.uz/auth/login",
  },
  alternates: {
    canonical: "https://casex.uz/auth/login",
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
