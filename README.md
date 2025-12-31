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
