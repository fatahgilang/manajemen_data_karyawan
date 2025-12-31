# Dokumentasi Lengkap: Manajemen Data Karyawan

Dokumentasi ini menjelaskan arsitektur, cara instalasi, konfigurasi, pengembangan, API, dan frontend untuk proyek Manajemen Data Karyawan.

## Ringkasan Arsitektur
- Backend: Laravel ^12, PHP ^8.2, Filament Admin ^3.3, Sanctum ^4 untuk autentikasi API.
- Build & tooling backend: Vite, Tailwind CSS, Laravel Vite Plugin.
- Database: Default `sqlite` (dapat diubah ke `mysql`, `pgsql`, dll melalui `.env`).
- Frontend: React + Vite (terpisah di folder `hris-frontend`), Tailwind CSS v4, axios, React Router.
- Admin: Panel berbasis Filament di `app/Filament/Admin/Resources/*` untuk data HR (Employee, Department, Position, dsb.).

## Isi Dokumentasi
- Backend: `docs/backend.md`
- Frontend: `docs/frontend.md`
- API: `docs/api.md`
- Admin (Filament): `docs/admin.md`

## Quickstart
1) Siapkan backend
```
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
npm install
npm run dev
php artisan serve
```
2) Jalankan frontend (folder `hris-frontend`)
```
cd hris-frontend
npm install
npm run dev
```
3) Ubah base URL API bila perlu di `hris-frontend/src/api.js` (default `http://localhost:8000/api`).

## Struktur Direktori Penting
- `app/Http/Controllers/Api/*`: Controller REST untuk karyawan, departemen, jabatan.
- `routes/api.php`: Definisi rute API (resource) + rute `/user` menggunakan Sanctum.
- `database/migrations/*`: Skema tabel (employees, departments, positions, dll.).
- `app/Filament/Admin/Resources/*`: Resource panel admin.
- `hris-frontend/src/*`: Kode React (komponen, routing, konfigurasi axios).

## Lisensi
Proyek ini berbasis skeleton Laravel (MIT).