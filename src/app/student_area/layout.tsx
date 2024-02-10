import StudentArea from "../components/StudentArea"

export default function DashboardLayout({
    children, 
  }: {
    children: React.ReactNode
  }) {
    return (
        <>
        <StudentArea/>
        {children}
        </>
    )
  }