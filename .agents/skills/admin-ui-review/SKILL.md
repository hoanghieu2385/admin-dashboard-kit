---
name: admin-ui-review
description: Review an admin page or component in this kit before declaring it done. Use to find responsive breakage, spacing and typography issues, weak visual hierarchy, dark-mode problems, accessibility and keyboard gaps, and state/edge-case bugs; report findings with file and line and severity.
---

# Admin UI review

Review có bằng chứng. Không báo "đã ổn" nếu chưa chạy app/không có số liệu.

## 1. Chuẩn bị

1. Đọc `UI_GUIDELINES.md` (nguồn duy nhất về thị giác).
2. Đọc page/component được review + page tương tự đã chuẩn.
3. Chạy `pnpm typecheck && pnpm lint && pnpm build` trước khi review UI.
4. Chạy `pnpm dev`; mở đúng route, không chỉ đọc code.

## 2. Kiểm theo thứ tự

### Chức năng & trạng thái

- [ ] Route trực tiếp không trắng trang; id không tồn tại có `EmptyState`/`ErrorState`.
- [ ] Loading/empty/error có đường thoát (retry/reset/quay lại).
- [ ] Submit form: validation hiện tại field, disable + spinner, không submit 2 lần.
- [ ] Xoá/huỷ nguy hiểm có `ConfirmDialog`; đóng dialog trả focus về trigger.
- [ ] Mutation demo cập nhật UI ngay, toast đúng lúc; reload reset là chấp nhận được.

### Hierarchy & typography

- [ ] Đúng một `<h1>`; section dùng `<h2>`; thứ tự heading không nhảy.
- [ ] Page title `text-2xl sm:text-[1.75rem] font-bold tracking-tight`.
- [ ] Một primary mỗi vùng; action phụ dùng outline/ghost.
- [ ] Số liệu `tabular-nums`; nhãn phụ `text-muted-foreground`; không lạm dụng bold.
- [ ] Khoảng cách section `gap-6`; card `rounded-xl border bg-card`; không shadow nặng.

### Spacing & layout

- [ ] Không có khoảng trắng lệch giữa card/header/table.
- [ ] Bảng rộng cuộn **trong card**, không đẩy vỡ trang.
- [ ] Toolbar/filter wrap đúng; nút không nhảy hàng lẻ loi ở 768.
- [ ] 375 / 768 / 1280: không tràn ngang, không chồng chữ, không cắt action.

### Responsive

- [ ] 375: action full-width; bảng/card không tràn; drawer sidebar mở/đóng được.
- [ ] 768: grid 2 cột hợp lý; filter không bị ép quá hẹp.
- [ ] 1280: stats 4 cột; detail 2/3 + 1/3; chart không méo.
- [ ] Không dùng `h-screen`; shell `h-dvh`, chỉ `<main>` scroll.

### Dark mode

- [ ] Chuyển theme không nháy; reload giữ lựa chọn.
- [ ] Border, disabled, placeholder, badge trạng thái, chart, focus ring đọc được.
- [ ] Không hardcode `text-white`/`bg-black`/hex trong component dùng chung.

### Accessibility & keyboard

- [ ] Tab đầu tiên là skip link → nav → breadcrumb → control chính.
- [ ] Mọi control có label/`aria-label`; icon trang trí `aria-hidden`.
- [ ] Focus ring thấy rõ ở mọi control, kể cả trong bảng.
- [ ] Dialog/Sheet: focus trap, `Esc` đóng, focus trả về trigger.
- [ ] Dòng bảng click được: Enter/Space hoạt động; click trong ô không mở dòng.
- [ ] Lỗi form có text + `aria-invalid`, không chỉ đổi màu.
- [ ] Console 0 error; network không 4xx/5xx (trừ API ngoài có chủ đích).

## 3. Mức độ & cách báo

| Mức | Ví dụ |
| --- | --- |
| Blocker | crash, mất dữ liệu, không dùng được bằng bàn phím, tràn vỡ layout |
| Major | sai template, thiếu state, dark mode không đọc được, a11y label thiếu |
| Minor | spacing lệch 4px, hierarchy yếu, copy chưa rõ |
| Nit | preference thị giác, không ảnh hưởng dùng |

Mỗi finding ghi: **file:line**, hiện tượng, vì sao sai theo guideline, cách sửa ngắn.
Không liệt kê lại ưu điểm dài dòng; nêu 1–2 điểm tốt nếu cần.

## 4. Không được làm khi review

- Không tự đổi design token/stack để "cho đẹp".
- Không sửa file ngoài phạm vi review nếu chưa được yêu cầu.
- Không thêm dependency/test framework.
- Không tuyên bố pass khi chưa chạy app hoặc chưa kiểm đủ 3 breakpoint.

## 5. Ví dụ prompt

> Review trang `/suppliers` và form tạo nhà cung cấp. Kiểm responsive 375/768/1280, dark mode,
> keyboard, empty/loading/error, hierarchy. Báo finding theo mức độ kèm file:line.
