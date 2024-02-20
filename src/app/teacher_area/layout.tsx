"use client";

import TeacherArea from "../components/TeacherArea";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TeacherArea />
      {children}
    </>
  );
}
