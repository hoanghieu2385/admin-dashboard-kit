import { zodResolver } from "@hookform/resolvers/zod"
import { Bell, Palette, User } from "lucide-react"
import { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { FormActions } from "@/components/forms/FormActions"
import { FormField } from "@/components/forms/FormField"
import { FormSection } from "@/components/forms/FormSection"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { SettingsTemplate, type SettingsSection } from "@/templates/settings/SettingsTemplate"

const settingsSchema = z.object({
  fullName: z.string().min(2, "Tên tối thiểu 2 ký tự"),
  email: z.email("Email không hợp lệ"),
  company: z.string().min(2, "Tên công ty tối thiểu 2 ký tự"),
  timezone: z.enum(["Asia/Ho_Chi_Minh", "Asia/Tokyo", "UTC"]),
  orderUpdates: z.boolean(),
  weeklyDigest: z.boolean(),
  productNews: z.boolean(),
  density: z.enum(["comfortable", "compact"]),
  showHints: z.boolean(),
})

type SettingsFormValues = z.infer<typeof settingsSchema>

const TIMEZONES = [
  { value: "Asia/Ho_Chi_Minh", label: "Việt Nam (GMT+7)" },
  { value: "Asia/Tokyo", label: "Nhật Bản (GMT+9)" },
  { value: "UTC", label: "UTC" },
] as const

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState("general")

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      fullName: "Nguyễn Văn A",
      email: "admin@example.com",
      company: "Admin Dashboard Kit",
      timezone: "Asia/Ho_Chi_Minh",
      orderUpdates: true,
      weeklyDigest: true,
      productNews: false,
      density: "comfortable",
      showHints: true,
    },
  })

  const handleSubmit = async (values: SettingsFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    toast.success("Đã lưu cài đặt (demo, không gọi API)", {
      description: `${values.fullName} · ${TIMEZONES.find((item) => item.value === values.timezone)?.label}`,
    })
  }

  const sections: SettingsSection[] = [
    {
      id: "general",
      label: "Thông tin chung",
      icon: User,
      content: (
        <FormSection title="Thông tin chung" description="Thông tin tài khoản và đơn vị hiển thị." columns={2}>
          <FormField<SettingsFormValues, "fullName"> name="fullName" label="Họ và tên" required>
            {({ field, id, invalid }) => <Input id={id} {...field} aria-invalid={invalid} />}
          </FormField>
          <FormField<SettingsFormValues, "email"> name="email" label="Email" required>
            {({ field, id, invalid }) => <Input id={id} {...field} type="email" aria-invalid={invalid} />}
          </FormField>
          <FormField<SettingsFormValues, "company"> name="company" label="Đơn vị" required>
            {({ field, id, invalid }) => <Input id={id} {...field} aria-invalid={invalid} />}
          </FormField>
          <FormField<SettingsFormValues, "timezone"> name="timezone" label="Múi giờ" required>
            {({ field, id, invalid }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id={id} className="h-9 w-full" aria-invalid={invalid}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((timezone) => (
                    <SelectItem key={timezone.value} value={timezone.value}>
                      {timezone.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </FormField>
        </FormSection>
      ),
    },
    {
      id: "notifications",
      label: "Thông báo",
      icon: Bell,
      content: (
        <FormSection title="Thông báo" description="Chọn loại thông báo bạn muốn nhận qua email.">
          <FormField<SettingsFormValues, "orderUpdates"> name="orderUpdates" label="Cập nhật đơn hàng" description="Có đơn mới hoặc đổi trạng thái.">
            {({ field, id }) => <Switch id={id} checked={field.value} onCheckedChange={field.onChange} />}
          </FormField>
          <FormField<SettingsFormValues, "weeklyDigest"> name="weeklyDigest" label="Báo cáo hàng tuần" description="Tổng hợp số liệu vào sáng thứ Hai.">
            {({ field, id }) => <Switch id={id} checked={field.value} onCheckedChange={field.onChange} />}
          </FormField>
          <FormField<SettingsFormValues, "productNews"> name="productNews" label="Tin sản phẩm" description="Thông tin về tính năng và bản cập nhật mới.">
            {({ field, id }) => <Switch id={id} checked={field.value} onCheckedChange={field.onChange} />}
          </FormField>
        </FormSection>
      ),
    },
    {
      id: "appearance",
      label: "Giao diện",
      icon: Palette,
      content: (
        <FormSection title="Giao diện" description="Tùy chọn hiển thị trên thiết bị của bạn.">
          <FormField<SettingsFormValues, "density"> name="density" label="Mật độ nội dung" required>
            {({ field, id, invalid }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id={id} className="h-9 w-full" aria-invalid={invalid}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comfortable">Thoải mái</SelectItem>
                  <SelectItem value="compact">Gọn</SelectItem>
                </SelectContent>
              </Select>
            )}
          </FormField>
          <FormField<SettingsFormValues, "showHints"> name="showHints" label="Hiện gợi ý" description="Hiển thị mô tả ngắn dưới các trường nhập liệu.">
            {({ field, id }) => <Switch id={id} checked={field.value} onCheckedChange={field.onChange} />}
          </FormField>
        </FormSection>
      ),
    },
  ]

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} noValidate>
        <SettingsTemplate
          title="Cài đặt"
          description="Thông tin chung, thông báo và tùy chọn hiển thị."
          sections={sections}
          activeSectionId={activeSection}
          onSectionChange={setActiveSection}
          actions={
            <FormActions
              submitLabel="Lưu thay đổi"
              cancelLabel="Đặt lại"
              onCancel={() => form.reset()}
              isSubmitting={form.formState.isSubmitting}
            />
          }
        />
      </form>
    </FormProvider>
  )
}

export default SettingsPage
