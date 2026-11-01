# Contributing

Cảm ơn bạn quan tâm. Repo này là **UI kit không backend**; thay đổi phải giữ tính tái sử dụng và template-ready.

## Trước khi bắt đầu

1. Đọc `AGENTS.md` (hợp đồng làm việc) và `PROJECT_BRIEF.md` (phạm vi).
2. Đọc `HANDOFF.md` để biết trạng thái hiện tại.
3. Kiểm `git status`; không ghi đè thay đổi chưa commit.

## Cài đặt

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Yêu cầu Node 20.19+ / 22.12+ / 24, pnpm 11.

## Quy tắc thay đổi

- Ưu tiên component/template có sẵn; không viết lại shadcn/ui.
- Không thêm dependency nếu không thật cần; nếu có, giải thích trong PR.
- Không thêm backend/API/auth/RBAC, không publish npm.
- Không hardcode màu ngoài token; light + dark cùng đẹp.
- Không đổi design token/stack để giải quyết một màn hình.
- Mock data phải hư cấu, không thông tin cá nhân thật/secret.
- Tài liệu cập nhật cùng code: `docs/components.md`, `docs/page-templates.md`, `HANDOFF.md` khi phạm vi đổi.

## Quality gate

Chạy trước khi mở PR:

```bash
pnpm typecheck
pnpm lint
pnpm build
```

Kiểm thêm trên app: route bị ảnh hưởng, 375/768/1280, light/dark, keyboard, console 0 error.
Build warning từ dependency (ví dụ zod) không tính là lỗi repo; warning từ code repo phải sửa.

## Commit / PR

- Commit nhỏ, tập trung; không gộp file không liên quan.
- Thông điệp nói **vì sao** thay đổi, không chỉ "update".
- Không commit `dist/`, `node_modules/`, `.env`, secret.
- Điền PR template, ghi rõ đã kiểm gì và chưa kiểm gì.
- Không `git push --force`, không tự tag/publish.

## Trở thành template repository

Nếu repo này được dùng làm template:

1. Cập nhật chủ sở hữu bản quyền trong `LICENSE` theo dự án mới.
2. Đổi `package.json` name/version, `src/config/site.ts`, `index.html` title/favicon.
3. Xoá demo không cần (`pages/examples|orders|reports`, `mocks`, route/nav) nhưng giữ template/component/docs.
4. Kiểm `.agents/skills` và `.claude/skills` còn resolve đúng.
5. Chạy lại quality gate.
6. GitHub → Settings → General → Template repository (thao tác thủ công của chủ repo).

## License

Đóng góp được phát hành theo MIT License của repo. Xem `LICENSE`.
