# Developer tooling & AI workflow

Tài liệu này mô tả **cách phối hợp công cụ AI** với kit. Không có công cụ nào là dependency của repo;
tất cả đều tùy chọn và không được phép thay đổi kiến trúc, stack hay design tokens.

## 1. Vị trí trong workflow

```text
Đọc context (AGENTS → BRIEF → HANDOFF → UI_GUIDELINES)
  → chọn template + component
  → code (admin-ui-development / admin-ui-component)
  → tra API nếu chưa chắc (Context7)
  → review UI/responsive/a11y (admin-ui-review + impeccable)
  → cắt bớt nếu over-engineer (ponytail)
  → quality gate (typecheck / lint / build + kiểm tay)
  → cập nhật HANDOFF
```

Không chạy song song nhiều công cụ cùng sửa một file. Không để công cụ tự đổi token/thiết kế khi task chỉ là polish.

## 2. Agent Skills

Chuẩn dùng là **Agent Skills** (`SKILL.md` + frontmatter `name`, `description`, thân Markdown). Repo có 3 skill:

| ID | Dùng khi | Không dùng khi |
| --- | --- | --- |
| `admin-ui-development` | thêm/sửa page quản trị, nối mock, route, filter, interaction | chỉ sửa typo docs |
| `admin-ui-component` | tạo component dùng chung mới hoặc mở rộng API component | page chỉ cần ghép component có sẵn |
| `admin-ui-review` | review trước khi báo xong: hierarchy, spacing, responsive, dark, a11y | đang giữa lúc code, chưa có gì để review |

### Vị trí & khả năng tự discover

| Agent | Đường dẫn đọc | Trạng thái trong repo |
| --- | --- | --- |
| Claude Code | `.claude/skills/<id>/SKILL.md` (project), hỗ trợ symlink folder | `.claude/skills/*` là symlink tới `.agents/skills/*` |
| OpenCode (V2) | `.opencode/skills`, `.claude/skills`, `.agents/skills` (project compatibility) | đọc trực tiếp `.agents/skills` hoặc qua symlink |
| Codex CLI | `.agents/skills` từ CWD tới repo root, `$HOME/.agents/skills`; hỗ trợ symlink | đọc trực tiếp `.agents/skills` |
| Cursor / Windsurf | chưa xác minh hỗ trợ Agent Skills | dùng `AGENTS.md`; không tuyên bố tự discover |

- Canonical copy nằm ở `.agents/skills/`. Sửa skill ở đó; `.claude/skills` chỉ là symlink.
- Windows không bật symlink: copy thư mục skill vào `.claude/skills/` (chấp nhận trùng lặp cục bộ, không commit bản copy).
- Cách gọi: Claude Code `/admin-ui-development`; OpenCode `@admin-ui-development` hoặc để agent tự chọn theo `description`;
  Codex `$admin-ui-development` hoặc để agent tự chọn.
- Skill chỉ chứa quy trình; chi tiết API/token nằm ở `docs/` và `UI_GUIDELINES.md` để tránh phình context.

## 3. Ponytail

**Mục đích:** giữ thay đổi nhỏ nhất đủ dùng, tránh abstraction "để sau".

- Dùng khi: bug fix, refactor nhỏ, thêm một page na ná page có sẵn, review xem có over-engineer không.
- Không dùng để bỏ qua validation, error handling, accessibility hoặc test của logic mới.
- Cách dùng: bật skill `ponytail` (nếu harness có) hoặc áp dụng nguyên tắc: chọn giải pháp đầu tiên đủ chạy;
  ưu tiên code có sẵn; không thêm dependency; xoá thay vì thêm.
- Không được: đổi kiến trúc, xoá test/validation để diff ngắn hơn.

## 4. Impeccable / Frontend Design

**Mục đích:** định hướng thị giác, polish có chủ đích, tránh giao diện "template mặc định".

- Dùng khi: thiết kế page mới, page trông generic, hierarchy/spacing lệch, cần audit thị giác.
- Đầu vào nên có: mục tiêu người dùng, loại dữ liệu, breakpoint, trạng thái rỗng/lỗi.
- Guardrail: chỉ dùng token trong `UI_GUIDELINES.md`; không đổi primary/radius/font để polish một màn hình.
  Nếu đề xuất thay đổi design system, dừng và hỏi, ghi quyết định vào `docs/architecture.md` §8.
- Kết hợp `admin-ui-review` sau khi polish để bắt lỗi responsive/a11y.

## 5. Context7

**Mục đích:** tra tài liệu chính thức trước khi dùng API thư viện không chắc, tránh API của phiên bản cũ.

Ưu tiên tra: React 19, React Router 7, Tailwind CSS v4, shadcn/ui 4.x, TanStack Table 8,
React Hook Form 7, Zod 4, Recharts 3.

- Dùng khi: API mới/lạ, migration, behavior không rõ, nghi ngờ tài liệu cũ.
- Không dùng khi: API đã dùng trong repo và có ví dụ rõ — đọc source là đủ.
- Ghi lại phiên bản/tài liệu đã dựa vào nếu quyết định ảnh hưởng kiến trúc.
- Repo không kèm cấu hình MCP; cài/ bật Context7 theo tài liệu của agent đang dùng và kiểm tra nó có trong danh sách MCP.

## 6. Headroom

**Mục đích:** giảm context khi output rất lớn (log build, diff dài, kết quả search).

- Dùng khi: log > vài nghìn dòng, cần giữ ngân sách context cho code/docs.
- Không bắt buộc: repo không phụ thuộc Headroom; không thêm package hay script vì nó.
- Không nén: nội dung bảo mật, secret, dữ liệu người dùng thật.
- Sau khi nén, phải đọc lại phần liên quan trước khi kết luận.

## 7. Công cụ khác

Chỉ thêm khi có lý do rõ và ghi vào PR:

- Formatter: repo dựa vào ESLint + TS strict, chưa cấu hình Prettier; không thêm nếu không cần.
- Test framework: chỉ thêm khi có logic cần test lặp lại; hiện ưu tiên self-check nhỏ và kiểm tay.
- Accessibility audit (axe/Lighthouse): dùng như công cụ kiểm, không thêm dependency runtime.

## 8. Checklist dùng công cụ đúng

- [ ] Đã đọc `AGENTS.md` + `HANDOFF.md` trước khi gọi công cụ.
- [ ] Công cụ không sửa file ngoài phạm vi task.
- [ ] Không thêm dependency/script vì công cụ.
- [ ] Không đổi design token/kiến trúc khi chưa được đồng ý.
- [ ] Có chạy quality gate sau khi công cụ sửa code.
- [ ] Kết luận dựa trên output thực tế, không dựa trên việc "công cụ nói đã xong".
