import { Sidebar } from '@/components/sidebar'
import { Providers } from '@/context'

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Sidebar />

      <div className="flex flex-col gap-4 py-4 pl-14 max-[480px]:pl-0">
        <main className="grid flex-1 items-start gap-4 p-4 px-6 py-0">
          <Providers>{children}</Providers>
        </main>
      </div>
    </div>
  )
}
