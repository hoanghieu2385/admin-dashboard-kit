import { PageHeader } from "@/components/layout/PageHeader"

interface ComingSoonPageProps {
  title: string
  description: string
}

/** Trang tạm cho tới khi template tương ứng hoàn thiện (Phase 3–4). */
export function ComingSoonPage({ title, description }: ComingSoonPageProps) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={title} description={description} />
      <div className="rounded-xl border border-dashed border-border bg-card px-6 py-14 text-center">
        <p className="text-[15px] text-muted-foreground">
          Trang này dùng template tổng quát, sẽ được hoàn thiện ở Phase 4 (Page Templates).
        </p>
      </div>
    </div>
  )
}
