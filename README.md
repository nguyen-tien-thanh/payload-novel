# Tiralix

Nền tảng đọc truyện xây dựng trên [Payload CMS](https://payloadcms.com) + Next.js + PostgreSQL.

## Tech stack

- **Framework:** Next.js 16 (App Router, standalone output)
- **CMS:** Payload 3.x
- **Database:** PostgreSQL (via Drizzle ORM)
- **Storage:** MinIO (S3-compatible)
- **UI:** HeroUI v3
- **Package manager:** pnpm

---

## Setup môi trường dev

### Yêu cầu

- Node.js >= 20.9.0
- pnpm >= 9
- Docker + Docker Compose (để chạy PostgreSQL và MinIO local)

### Các bước

**1. Clone repo và cài dependencies**

```bash
git clone <repo-url>
cd novel
pnpm install
```

**2. Tạo file `.env`**

```bash
cp .env.example .env
```

Điền các giá trị vào `.env` (xem mô tả từng biến ở phần dưới).

**3. Khởi động PostgreSQL và MinIO**

```bash
docker compose up postgres minio -d
```

**4. Chạy migration để tạo schema DB**

```bash
pnpm payload migrate
```

**5. Chạy dev server**

```bash
pnpm dev
```

Mở [http://localhost:3000/admin](http://localhost:3000/admin) để tạo tài khoản admin đầu tiên.

---

## Biến môi trường

| Biến                     | Mô tả                                                          |
| ------------------------ | -------------------------------------------------------------- |
| `NEXT_PUBLIC_SERVER_URL` | URL public của app (dùng cho server-side)                      |
| `PAYLOAD_SECRET`         | Secret key để Payload mã hoá token, **phải dài và ngẫu nhiên** |
| `DATABASE_URL`           | Connection string PostgreSQL                                   |
| `S3_ENDPOINT`            | Endpoint MinIO/S3                                              |
| `S3_BUCKET`              | Tên bucket chứa media                                          |
| `S3_ACCESS_KEY_ID`       | Access key MinIO/S3                                            |
| `S3_SECRET_ACCESS_KEY`   | Secret key MinIO/S3                                            |
| `S3_REGION`              | Region (để `us-east-1` nếu dùng MinIO local)                   |
| `RESEND_HOST`            | SMTP host để gửi email                                         |
| `RESEND_USER`            | SMTP username                                                  |
| `RESEND_PASS`            | SMTP password / API key                                        |
| `RESEND_LOG`             | Email log                                                      |

---

## Scripts

| Lệnh                                       | Mô tả                                       |
| ------------------------------------------ | ------------------------------------------- |
| `pnpm dev`                                 | Chạy dev server                             |
| `pnpm build`                               | Build production                            |
| `pnpm start`                               | Chạy production build                       |
| `pnpm payload migrate`                     | Apply các migration chưa chạy               |
| `pnpm payload migrate:create --name <tên>` | Tạo migration mới                           |
| `pnpm generate:types`                      | Generate TypeScript types từ Payload schema |
| `pnpm generate`                            | Generate types + import map                 |

---

## Quy trình khi thêm collection hoặc thay đổi schema

> Quan trọng: mỗi thay đổi schema **bắt buộc** phải có migration đi kèm, không được sửa DB thủ công.

**1.** Tạo/sửa collection trong `src/collections/`, thêm vào `src/payload.config.ts` nếu là collection mới.

**2.** Tạo migration:

```bash
pnpm payload migrate:create --name mo_ta_thay_doi
```

**3.** Test migration trên dev:

```bash
pnpm payload migrate
```

**4.** Generate lại types:

```bash
pnpm generate:types
```

**5.** Commit tất cả — collection, migration, types, config:

```bash
git add src/collections/ src/migrations/ src/payload-types.ts src/payload.config.ts
git commit -m "feat: added collection ..."
git push
```

**6.** Deploy lên prod (xem phần Deploy bên dưới).

---

## Deploy lên production

Build image (bao gồm chạy migration tự động):

```bash
docker compose build payload
docker compose up -d payload
```

Docker sẽ tự detect thay đổi trong `src/migrations/` và rebuild đúng layer — không cần `--no-cache`.

**Lưu ý:** Lệnh `docker compose build` cần đọc `DATABASE_URL` và `PAYLOAD_SECRET` từ file `.env` ở root để chạy migration trong quá trình build. Đảm bảo file `.env` production đã được điền đầy đủ trước khi build.
