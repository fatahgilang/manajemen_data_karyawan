# API

## Dasar
- Base URL (dev): `http://localhost:8000/api`
- Format: JSON
- Pagination: respons daftar menggunakan `paginate(10)` (struktur standar Laravel: `data`, `links`, `meta`).

## Autentikasi
- Sanctum diaktifkan untuk rute `/user`:
  - `GET /user` (middleware: `auth:sanctum`) mengembalikan data user yang terkait dengan token.
- Frontend menambahkan header `Authorization: Bearer <token>` melalui interceptor axios bila token tersedia di `localStorage`.
- Resource `employees`, `departments`, `positions` tidak memakai middleware auth secara default di `routes/api.php`. Tambahkan middleware sesuai kebutuhan keamanan Anda.

## Employees
- `GET /employees`
  - Mengembalikan daftar karyawan dengan relasi `department` dan `position`.
- `GET /employees/{id}`
  - `404` bila tidak ditemukan.
- `POST /employees`
  - Body (validasi):
    - `id` (required, unique string)
    - `name` (required, string, max:255)
    - `email` (required, email, unique)
    - `department_id` (required, exists:departments,id)
    - `position_id` (required, exists:positions,id)
    - `join_date` (required, date)
  - Respons `201` dengan `message` dan `data` yang memuat relasi.
- `PUT/PATCH /employees/{id}`
  - Validasi: `name` (string), `email` (email, unique kecuali id saat ini), `department_id` (exists), `position_id` (exists), `join_date` (date).
  - Respons `message` dan `data` (relasi ter-load).
- `DELETE /employees/{id}`
  - `404` bila tidak ditemukan.
  - Respons `message` sukses.

## Departments
- `GET /departments`
  - Daftar departemen dengan `employees_count`.
- `GET /departments/{id}`
  - `404` bila tidak ditemukan.
- `POST /departments`
  - Body: `name` (required, string, max:255)
  - `201` dengan `message` dan `data`.
- `PUT/PATCH /departments/{id}`
  - Body: `name` (required, string, max:255)
- `DELETE /departments/{id}`
  - `404` bila tidak ditemukan.

## Positions
- `GET /positions`
  - Daftar posisi dengan `employees_count`.
- `GET /positions/{id}`
  - `404` bila tidak ditemukan.
- `POST /positions`
  - Body: `title` (required, string, max:255), `base_salary` (required, numeric)
  - `201` dengan `message` dan `data`.
- `PUT/PATCH /positions/{id}`
  - Body: `title` (required), `base_salary` (required, numeric)
- `DELETE /positions/{id}`
  - `404` bila tidak ditemukan.

## Contoh Respons Paginasi (ringkas)
```
{
  "data": [ { /* item */ } ],
  "links": { "first": "...", "last": "...", "prev": null, "next": "..." },
  "meta": { "current_page": 1, "from": 1, "last_page": 10, "path": "...", "per_page": 10, "to": 10, "total": 100 }
}
```

## Catatan
- Soft deletes diaktifkan untuk `employees`, `departments`, dan `positions`. Item yang dihapus tidak langsung hilang dari database.
- Tambahkan middleware `auth:sanctum` ke resource rute bila API harus privat.