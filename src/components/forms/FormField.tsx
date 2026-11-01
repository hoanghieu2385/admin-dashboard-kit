import type { ReactNode } from "react"
import { Controller, useFormContext, type ControllerRenderProps, type FieldValues, type Path } from "react-hook-form"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { cn } from "@/lib/utils"

export interface FormFieldRenderArgs<TValues extends FieldValues, TName extends Path<TValues>> {
  field: ControllerRenderProps<TValues, TName>
  id: string
  invalid: boolean
}

export interface FormFieldProps<TValues extends FieldValues, TName extends Path<TValues>> {
  name: TName
  label: string
  description?: string
  required?: boolean
  className?: string
  /**
   * Render prop: nhận `field` (value/onChange/onBlur/ref) và bind thủ công vào control,
   * nên dùng được cho Input, Select, Switch, Checkbox… mà không cần wrapper riêng cho từng loại.
   */
  children: (args: FormFieldRenderArgs<TValues, TName>) => ReactNode
}

/** Field có label + mô tả + lỗi, đọc `control` từ `useFormContext`. */
export function FormField<TValues extends FieldValues, TName extends Path<TValues>>({
  name,
  label,
  description,
  required = false,
  className,
  children,
}: FormFieldProps<TValues, TName>) {
  const { control } = useFormContext<TValues>()
  const id = `field-${String(name)}`

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={cn(className)}>
          <FieldLabel htmlFor={id}>
            {label}
            {required ? (
              <span className="text-destructive" aria-hidden="true">
                *
              </span>
            ) : null}
          </FieldLabel>
          {children({ field, id, invalid: fieldState.invalid })}
          {description ? <FieldDescription>{description}</FieldDescription> : null}
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  )
}
