# CLAUDE.md

Entry point ngắn cho Claude Code. **Toàn bộ luật nằm ở `AGENTS.md`** — không lặp lại ở đây, không tạo bộ luật song song.

## Đọc theo thứ tự

1. `AGENTS.md` — hợp đồng làm việc, stack, quality gate.
2. `PROJECT_BRIEF.md` — sản phẩm là gì, giới hạn.
3. `HANDOFF.md` — trạng thái hiện tại, việc kế tiếp.
4. `UI_GUIDELINES.md` — nếu chạm UI.
5. `docs/architecture.md`, `docs/components.md`, `docs/page-templates.md` — theo phạm vi task.

## Skill dùng kèm

| Skill | Khi nào |
| --- | --- |
| `admin-ui-development` | xây page quản trị từ template + mock |
| `admin-ui-component` | tạo component dùng chung mới |
| `admin-ui-review` | review UI/responsive/a11y trước khi báo xong |
| `frontend-design` / `impeccable` | định hướng thị giác, polish có kiểm soát |
| `ponytail` | thay đổi nhỏ nhất đủ dùng, tránh over-engineer |

Skill project nằm trong `.claude/skills/` (symlink tới `.agents/skills/`). Không giả định skill ngoài đã cài — kiểm tra danh sách skill của môi trường trước khi viện dẫn.

## Claude-specific

- **Plan trước, code sau** với việc > 1 file: liệt kê file sẽ chạm; chờ xác nhận nếu đổi kiến trúc/token.
- **Không tự mở phase mới.** Cuối phase: báo cáo (xong / thiếu / kế tiếp) rồi dừng.
- **Không scaffold tràn lan.** Tạo đúng file cần; thư mục rỗng không được commit.
- Ưu tiên component/template có sẵn; không viết lại shadcn/ui.
- Khi bí API thư viện, tra Context7/tài liệu chính thức thay vì đoán; ghi lại phiên bản nếu quyết định dựa vào đó.
- Trước khi kết thúc: `pnpm typecheck && pnpm lint && pnpm build`, cập nhật `HANDOFF.md`.
- Không `git commit`/`push` trừ khi được yêu cầu rõ.
