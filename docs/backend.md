# Backend (Laravel)

## Prasyarat
- PHP ^8.2
- Composer
- Node.js ^18 (atau yang kompatibel untuk Vite 7)
- Database: default `sqlite` (bisa `mysql`/`pgsql`/`sqlsrv` sesuai kebutuhan)

## Instalasi & Setup
1) Kloning repo dan masuk ke direktori `manajemen_data_karyawan`.
2) Buat file environment:
```
cp .env.example .env
```
3) Instal dependensi PHP:
```
composer install
```
4) Generate app key:
```
php artisan key:generate
```
5) Konfigurasi database di `.env`:
- Default: `DB_CONNECTION=sqlite` dan pastikan file `database/database.sqlite` tersedia.
- Contoh MySQL:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=
```
6) Jalankan migrasi:
```
php artisan migrate
```
7) Instal asset & jalankan Vite (opsional untuk asset Laravel):
```
npm install
npm run dev
```

Atau gunakan skrip composer bawaan untuk otomasi:
```
composer run setup
```
Skrip tersebut melakukan: `composer install`, copy `.env`, `key:generate`, `migrate --force`, `npm install`, `npm run build`.

## Menjalankan Aplikasi
- Server pengembangan Laravel:
```
php artisan serve
```
- Opsi terintegrasi (server + queue + logs + Vite) menggunakan skrip composer:
```
composer run dev
```
Skrip ini menjalankan secara paralel: `php artisan serve`, `php artisan queue:listen`, `php artisan pail` (live logs), dan `npm run dev`.

## Konfigurasi Penting
- `config/database.php`: default koneksi `sqlite`. Ubah via `.env`.
- `vite.config.js`: integrasi Laravel Vite Plugin dan Tailwind CSS v4 untuk asset `resources/css/app.css` dan `resources/js/app.js`.
- `config/sanctum.php`: konfigurasi Sanctum untuk autentikasi API (opsional jika dipakai).

## Panel Admin (Filament)
- Resource berada di `app/Filament/Admin/Resources/*` (Employee, Department, Position, dll.).
- Akses panel admin umumnya melalui prefix standar Filament (contoh umum `/admin`). Jika perlu, sesuaikan sesuai konfigurasi Filament Anda.

## Database & Skema
Migrasi utama (`create_hr_tables`):
- `departments`: `id`, `name`, timestamps, soft deletes.
- `positions`: `id`, `title`, `base_salary (decimal:15,2)`, timestamps, soft deletes.
- `employees`: `id (string primary, NIK)`, `name`, `email (unique)`, `department_id (FK)`, `position_id (FK)`, `join_date`, timestamps, soft deletes.

Model & relasi:
- `Employee` memiliki `belongsTo department` dan `belongsTo position`, serta `hasMany attendances`, `hasMany payrolls`.
- `Department` memiliki `hasMany employees`.
- `Position` memiliki `hasMany employees`.

## Testing
- Jalankan test:
```
composer run test
```
- Perintah menjalankan `php artisan test` setelah `config:clear`.

## Deploy (Ringkas)
- Pastikan environment `.env` terisi benar (APP_KEY, DB_*, QUEUE, dll.).
- Jalankan `php artisan migrate --force`.
- Build asset:
```
npm run build
```
- Konfigurasi web server (Nginx/Apache) diarahkan ke `public/index.php`.

## Troubleshooting
- `Class not found` atau autoload bermasalah: jalankan `composer dump-autoload`.
- Vite tidak memuat: pastikan `npm run dev` berjalan dan port tidak konflik.
- Database `sqlite`: buat file `database/database.sqlite` jika belum ada.
- Autentikasi API (Sanctum): pastikan header token Bearer dikirim jika endpoint memerlukan.