---
name: admin-ui-component
description: Create or extend a reusable component in this admin dashboard kit after checking existing components and shadcn/ui. Use when a page needs a UI building block that does not exist, when deciding whether to add a shadcn primitive, or when designing a generic props API with accessibility and dark mode.
---

# Admin UI component

Tạo component **dùng chung** đúng tầng, đúng API. Component không biết nghiệp vụ.

## 1. Kiểm tra trước khi viết

Theo thứ tự bắt buộc:

1. `src/components/**` đã có? → dùng hoặc mở rộng API.
2. shadcn/ui có primitive? → `pnpm dlx shadcn@latest add <component>`; đọc lại file vừa sinh.
3. Radix có primitive? → bọc theo phong cách shadcn.
4. Ghép 2–3 component có sẵn? → đặt composition ở `components/common/`.
5. Chỉ khi (1)–(4) không đủ → tự viết.

Không tạo wrapper 1-1 quanh shadcn/ui nếu không thêm giá trị. Không thêm dependency cho một component nhỏ.

## 2. Đặt đúng chỗ

| Loại | Thư mục |
| --- | --- |
| shadcn primitive | `components/ui/` (không fork) |
| layout trang/shell | `components/layout/` |
| breadcrumb/nav | `components/navigation/` |
| hiển thị dữ liệu, trạng thái | `components/data-display/` |
| bảng/phân trang/sort | `components/data-table/` |
| tìm kiếm/lọc | `components/filters/` |
| field/form action | `components/forms/` |
| dialog/xác nhận/toast | `components/feedback/` |
| composition dùng chung | `components/common/` |

## 3. Thiết kế props

- `export interface <Name>Props` đặt trên component.
- Dữ liệu vào qua props; hành vi ra qua callback (`onChange`, `onRetry`, `onRowClick`).
- Luôn có `className?: string` để override.
- Ưu tiên `ReactNode` cho slot; tránh prop `variant` mới nếu đã có tone/variant chuẩn.
- Không nhận `useNavigate`/`useParams`/mock trong component (trừ tầng layout/navigation được phép biết router).
- Generic khi cần tái sử dụng thật (`DataTable<TData>`); không generic hoá sớm.
- Không thêm option "để sau"; chỉ thêm khi có caller thật.

```tsx
export interface InfoTileProps {
  title: string
  value: ReactNode
  description?: string
  action?: ReactNode
  className?: string
}

export function InfoTile({ title, value, description, action, className }: InfoTileProps) {
  return (
    <section className={cn("flex flex-col gap-1 rounded-xl border border-border bg-card p-5", className)}>
      <h2 className="text-sm font-medium text-muted-foreground">{title}</h2>
      <div className="text-2xl font-bold tabular-nums">{value}</div>
      {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      {action}
    </section>
  )
}
```

## 4. Bắt buộc về chất lượng

- Chỉ token màu: `bg-card`, `text-muted-foreground`, `border-border`, `ring-ring`… Không hex/`slate-*`.
- Light + dark cùng đọc được; kiểm disabled, placeholder, border, focus.
- Keyboard: focus thấy rõ; control tương tác nhận Enter/Space; dialog đóng bằng `Esc`.
- A11y: label/`aria-label`, icon trang trí `aria-hidden`, trạng thái động có `role`/`aria-live` khi cần.
- Responsive: không tràn ngang ở 375; dùng `min-w-0` cho vùng co giãn.
- Không hardcode copy nghiệp vụ; nhận text qua props hoặc `children`.
- Comment một dòng chỉ khi giải thích **vì sao**.

## 5. Cập nhật tài liệu & showcase

- Thêm API + ví dụ ngắn vào `docs/components.md` (hoặc `docs/page-templates.md` nếu là template).
- Nếu component đáng minh hoạ, thêm vào `src/pages/ComponentsPage.tsx`.
- Nếu là quyết định kiến trúc (tầng mới, API khác chuẩn), ghi `docs/architecture.md` §8.
- Không copy toàn bộ `UI_GUIDELINES.md` vào docs component.

## 6. Checklist

- [ ] Đã kiểm component có sẵn + shadcn/ui trước khi viết.
- [ ] Đúng thư mục, đúng luật phụ thuộc một chiều.
- [ ] Props generic, có `className`, không gắn mock/router/nghiệp vụ.
- [ ] Responsive 375/768/1280; light + dark.
- [ ] Keyboard + aria cơ bản; focus ring rõ.
- [ ] `docs/components.md` cập nhật; showcase nếu phù hợp.
- [ ] `pnpm typecheck && pnpm lint && pnpm build` sạch.

## 7. Ví dụ prompt

> Cần component `InfoTile` để hiển thị một số liệu kèm mô tả và action. Kiểm component có sẵn trước,
> thiết kế props generic, hỗ trợ dark mode, cập nhật docs và showcase.
