import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link, useNavigate, useParams } from "react-router"
import { toast } from "sonner"
import { z } from "zod"
import { EmptyState } from "@/components/data-display/EmptyState"
import { FormField } from "@/components/forms/FormField"
import { FormSection } from "@/components/forms/FormSection"
import { PageHeader } from "@/components/layout/PageHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CUSTOMER_STATUS_META, customers, type CustomerPlan, type CustomerStatus } from "@/mocks/customers"
import { FormTemplate } from "@/templates/form/FormTemplate"

const customerSchema = z.object({
  name: z.string().min(2, "Tên tối thiểu 2 ký tự"),
  email: z.email("Email không hợp lệ"),
  phone: z.string().min(9, "Số điện thoại tối thiểu 9 ký tự"),
  company: z.string().min(2, "Tên công ty tối thiểu 2 ký tự"),
  plan: z.enum(["Cơ bản", "Chuyên nghiệp", "Doanh nghiệp"]),
  status: z.enum(["active", "pending", "blocked"]),
  notes: z.string().max(500, "Tối đa 500 ký tự").optional(),
})

type CustomerFormValues = z.infer<typeof customerSchema>

const PLAN_OPTIONS: CustomerPlan[] = ["Cơ bản", "Chuyên nghiệp", "Doanh nghiệp"]
const STATUS_OPTIONS: CustomerStatus[] = ["active", "pending", "blocked"]

export function CustomerFormPage() {
  const { customerId } = useParams<{ customerId: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(customerId)
  const customer = customerId ? customers.find((item) => item.id === customerId) : undefined

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: customer
      ? {
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          company: customer.company,
          plan: customer.plan,
          status: customer.status,
          notes: customer.notes,
        }
      : {
          name: "",
          email: "",
          phone: "",
          company: "",
          plan: "Cơ bản",
          status: "pending",
          notes: "",
        },
  })

  if (isEdit && !customer) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Chỉnh sửa khách hàng" description="Không tìm thấy bản ghi yêu cầu." />
        <EmptyState
          title="Không tìm thấy khách hàng"
          description={`Mã "${customerId ?? ""}" không tồn tại hoặc đã bị xoá.`}
          action={
            <Button asChild variant="outline">
              <Link to="/customers">Về danh sách khách hàng</Link>
            </Button>
          }
        />
      </div>
    )
  }

  const handleSubmit = async (values: CustomerFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    toast.success(isEdit ? "Đã lưu thay đổi (demo)" : "Đã tạo khách hàng (demo)", {
      description: `${values.name} · ${values.email}`,
    })
    navigate(isEdit && customer ? `/customers/${customer.id}` : "/customers")
  }

  return (
    <FormTemplate
      title={isEdit ? "Chỉnh sửa khách hàng" : "Thêm khách hàng"}
      description={isEdit ? `Cập nhật hồ sơ ${customer?.name}.` : "Điền thông tin để tạo khách hàng mới."}
      mode={isEdit ? "edit" : "create"}
      form={form}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/customers")}
    >
      <FormSection title="Thông tin cơ bản" description="Thông tin liên hệ và gói dịch vụ." columns={2}>
        <FormField<CustomerFormValues, "name"> name="name" label="Họ và tên" required>
          {({ field, id, invalid }) => (
            <Input id={id} {...field} aria-invalid={invalid} placeholder="Nguyễn Văn A" />
          )}
        </FormField>
        <FormField<CustomerFormValues, "email"> name="email" label="Email" required description="Dùng để gửi thông báo.">
          {({ field, id, invalid }) => (
            <Input id={id} {...field} type="email" aria-invalid={invalid} placeholder="email@example.com" />
          )}
        </FormField>
        <FormField<CustomerFormValues, "phone"> name="phone" label="Điện thoại" required>
          {({ field, id, invalid }) => (
            <Input id={id} {...field} type="tel" aria-invalid={invalid} placeholder="0901 234 567" />
          )}
        </FormField>
        <FormField<CustomerFormValues, "company"> name="company" label="Công ty" required>
          {({ field, id, invalid }) => (
            <Input id={id} {...field} aria-invalid={invalid} placeholder="Tên công ty" />
          )}
        </FormField>
        <FormField<CustomerFormValues, "plan"> name="plan" label="Gói dịch vụ" required>
          {({ field, id, invalid }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id={id} className="h-9 w-full" aria-invalid={invalid}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PLAN_OPTIONS.map((plan) => (
                  <SelectItem key={plan} value={plan}>
                    {plan}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </FormField>
        <FormField<CustomerFormValues, "status"> name="status" label="Trạng thái" required>
          {({ field, id, invalid }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id={id} className="h-9 w-full" aria-invalid={invalid}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {CUSTOMER_STATUS_META[status].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </FormField>
      </FormSection>

      <FormSection title="Ghi chú" description="Thông tin nội bộ, không hiển thị cho khách hàng.">
        <FormField<CustomerFormValues, "notes"> name="notes" label="Ghi chú">
          {({ field, id, invalid }) => (
            <Textarea id={id} {...field} aria-invalid={invalid} rows={4} placeholder="Tối đa 500 ký tự" />
          )}
        </FormField>
      </FormSection>
    </FormTemplate>
  )
}

export default CustomerFormPage
