# Admin (Filament)

## Ringkasan
Proyek menggunakan Filament v3 sebagai panel admin untuk mengelola data HR. Resource berada di:
```
app/Filament/Admin/Resources/
```
Berikut resource yang tersedia:
- ApplicantResource
- AttendanceResource
- DepartmentResource
- EmployeeResource
- JobPostingResource
- PayrollResource
- PositionResource

## Akses Panel
- Secara umum, Filament menggunakan prefix `/admin`. Pastikan rute dan autentikasi sesuai dengan konfigurasi Filament Anda.
- Jalankan server Laravel dan akses panel admin melalui browser.

## Pengembangan
- Jika menambah resource:
  - Gunakan perintah Filament (lihat dokumentasi resmi) atau buat class `Resource` baru dan definisikan halaman (List, Create, Edit) beserta tabel/form fields.
- Setelah update ke Filament, skrip `@php artisan filament:upgrade` dipanggil dalam `composer.json` (`post-autoload-dump`) untuk memastikan kompatibilitas.

## Catatan
- Pastikan role/permission dan middleware autentikasi diterapkan pada panel admin sesuai kebutuhan keamanan.
- Sesuaikan tampilan dan form sesuai alur bisnis organisasi Anda.