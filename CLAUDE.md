# CLAUDE.md

Hướng dẫn bổ sung cho Claude Code. **Đọc `AGENTS.md` trước** — file đó chứa toàn bộ luật chung (stack, cấu trúc, quy ước, quality gate). Không lặp lại ở đây.

## Thứ tự đọc trong phiên mới

1. `HANDOFF.md` — đang ở đâu, việc kế tiếp là gì.
2. `AGENTS.md` — luật làm việc.
3. `UI_GUIDELINES.md` — nếu có đụng UI.
4. `docs/architecture.md` — nếu có đụng cấu trúc/route/tầng.

## Claude-specific

- **Plan trước, code sau** với mọi việc > 1 file: liệt kê file sẽ chạm, chờ xác nhận nếu có thay đổi kiến trúc.
- **Không tự mở phase mới.** Cuối mỗi phase: báo cáo (đã xong / còn thiếu / kế tiếp) rồi dừng.
- **Không scaffold tràn lan.** Tạo đúng file cần cho bước đang làm; thư mục rỗng không được commit.
- Sau khi thêm component shadcn/ui, **đọc lại file vừa sinh** và chỉnh cho khớp token dự án thay vì để mặc định.
- Trước khi kết thúc: chạy `pnpm typecheck && pnpm lint && pnpm build`, cập nhật `HANDOFF.md`.
- Khi bí về API thư viện: tra Context7 (`resolve-library-id` → `query-docs`) thay vì đoán; ghi lại link/phiên bản nếu quyết định dựa vào đó.

## Skill dùng kèm (nếu môi trường có)

| Skill | Khi nào |
| --- | --- |
| `frontend-design` / `impeccable` | thiết kế hoặc tinh chỉnh UI, audit thị giác |
| `ui-review` (`.agents/skills/`) | trước khi báo xong một trang/component |
| `ponytail` | khi cần thay đổi nhỏ nhất đủ dùng, tránh over-engineer |
| `context7` | tra API mới nhất của thư viện |

Không giả định các skill trên đã được cài — kiểm tra danh sách skill của môi trường trước khi viện dẫn.

## Cấm riêng với Claude Code

- Không tự `git commit`/`git push` trừ khi được yêu cầu rõ.
- Không sửa `.agents/skills/**` khi đang làm task UI (trừ khi task là về skills).
- Không "dọn dẹp" file không liên quan trong cùng commit.
