import { isRouteErrorResponse, Link, useRouteError } from "react-router"
import { PageHeader } from "@/components/layout/PageHeader"
import { Button } from "@/components/ui/button"

/** Dùng cho cả route "*" (không có lỗi) và errorElement (có lỗi). */
export function ErrorPage() {
  const error = useRouteError()
  const status = isRouteErrorResponse(error) ? error.status : undefined
  const isMissing = error === undefined || error === null || status === 404

  return (
    <div className="mx-auto flex w-full max-w-page flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title={isMissing ? "Không tìm thấy trang" : "Đã có lỗi xảy ra"}
        description={
          isMissing
            ? "Đường dẫn không tồn tại hoặc đã bị đổi."
            : "Trang không tải được. Bạn thử lại hoặc quay về bảng điều khiển."
        }
      />
      <Button asChild variant="outline" className="h-11 self-start">
        <Link to="/">Về bảng điều khiển</Link>
      </Button>
      {status ? (
        <p className="text-sm text-muted-foreground">
          Mã lỗi: {status} {isRouteErrorResponse(error) ? error.statusText : null}
        </p>
      ) : null}
    </div>
  )
}
