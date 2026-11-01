import type { ReactNode } from "react"
import { FormProvider, type FieldValues, type UseFormReturn } from "react-hook-form"
import { LoadingState } from "@/components/data-display/LoadingState"
import { FormActions } from "@/components/forms/FormActions"
import { PageHeader } from "@/components/layout/PageHeader"
import { cn } from "@/lib/utils"

export type FormMode = "create" | "edit"

export interface FormTemplateProps<TValues extends FieldValues> {
  title: string
  description?: string
  /** Chỉ đổi nhãn submit mặc định; validation và field do trang quyết định. */
  mode?: FormMode
  form: UseFormReturn<TValues>
  onSubmit: (values: TValues) => void | Promise<void>
  onCancel?: () => void
  submitLabel?: string
  cancelLabel?: string
  /** Dùng khi trang cần tải dữ liệu ban đầu (edit từ xa). */
  isLoading?: boolean
  children: ReactNode
  className?: string
}

export function FormTemplate<TValues extends FieldValues>({
  title,
  description,
  mode = "edit",
  form,
  onSubmit,
  onCancel,
  submitLabel,
  cancelLabel,
  isLoading = false,
  children,
  className,
}: FormTemplateProps<TValues>) {
  const isSubmitting = form.formState.isSubmitting

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <PageHeader title={title} description={description} />

      {isLoading ? (
        <LoadingState rows={6} label="Đang tải biểu mẫu" />
      ) : (
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
            <fieldset disabled={isSubmitting} className="m-0 flex min-w-0 flex-col gap-4 border-0 p-0">
              <legend className="sr-only">{title}</legend>
              {children}
            </fieldset>
            <FormActions
              submitLabel={submitLabel ?? (mode === "create" ? "Tạo mới" : "Lưu thay đổi")}
              cancelLabel={cancelLabel}
              onCancel={onCancel}
              isSubmitting={isSubmitting}
            />
          </form>
        </FormProvider>
      )}
    </div>
  )
}
