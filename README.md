# Manajemen Data Karyawan

Proyek ini adalah aplikasi HR (Manajemen Data Karyawan) berbasis Laravel 12 dengan panel admin Filament dan frontend React terpisah (Vite).

## Ringkasan
- Backend: Laravel ^12, PHP ^8.2, Filament ^3.3, Sanctum ^4.
- Tooling: Vite, Tailwind CSS v4, Laravel Vite Plugin.
- Database: default `sqlite` (dapat diubah ke MySQL/PGSQL via `.env`).
- Frontend: React + Vite di folder `hris-frontend`.

## Quickstart
1) Backend
```
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
npm install
npm run dev
php artisan serve
```
Atau:
```
composer run setup
```
2) Frontend
```
cd hris-frontend
npm install
npm run dev
```
3) Konfigurasi base URL API di `hris-frontend/src/api.js` (default `http://localhost:8000/api`).

## Dokumentasi Lengkap
- Backend: `docs/backend.md`
- Frontend: `docs/frontend.md`
- API: `docs/api.md`
- Admin (Filament): `docs/admin.md`

## Skrip Penting
- Dev terintegrasi (server+queue+logs+vite): `composer run dev`
- Testing: `composer run test`

## Lisensi
Berbasis skeleton Laravel (MIT).

## Deploy Gratis
- Frontend (Vercel):
  - Import repo `hris-frontend`.
  - Set `VITE_API_BASE_URL=https://YOUR_BACKEND_DOMAIN`.
  - Build `npm run build`, output `dist`.

- Backend (Railway):
  - Deploy dari GitHub repo backend.
  - Tambahkan `Procfile` dengan `web: php -S 0.0.0.0:$PORT -t public`.
  - Env: `APP_ENV=production`, `APP_DEBUG=false`, `APP_KEY` (hasil `php artisan key:generate --show`), `DB_CONNECTION=sqlite`, optional `CORS_ALLOWED_ORIGINS` set ke domain Vercel.
  - Pastikan `database/database.sqlite` ada (file kosong).
  - Release command: `php artisan migrate --force`.

- CORS:
  - Set `CORS_ALLOWED_ORIGINS` (mis. `https://your-frontend.vercel.app`).

- Catatan:
  - Gratis berarti kuota terbatas/sleep saat idle.
  - Untuk performa produksi gunakan Nginx+PHP-FPM (contoh Docker/Fly.io).
