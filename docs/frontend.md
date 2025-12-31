# Frontend (React + Vite)

## Prasyarat
- Node.js versi terbaru (disarankan >= 18)
- NPM (atau PNPM/Yarn sesuai preferensi)

## Struktur
Lokasi kode frontend: `hris-frontend/`
- `src/api.js`: konfigurasi `axios` (base URL API dan interceptor token).
- `src/App.jsx`: routing utama menggunakan `react-router-dom`.
- `src/components/*`: komponen halaman seperti Employees, Departments, Positions, dsb.
- `tailwind.config.js` dan `postcss.config.js`: konfigurasi Tailwind CSS v4.

## Instalasi
```
cd hris-frontend
npm install
```

## Menjalankan Dev Server
```
npm run dev
```
- Secara default Vite akan berjalan di `http://localhost:5173` (atau port lain jika sudah terpakai).

## Build Produksi
```
npm run build
```
Output akan berada di direktori `dist/`.

## Preview Build
```
npm run preview
```
Menjalankan server preview untuk hasil build.

## Integrasi API
- Base URL API diatur di `src/api.js`:
```
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});
```
- Sesuaikan dengan URL backend Anda (misal saat deploy).
- Interceptor otomatis menambahkan header `Authorization: Bearer <token>` jika token tersimpan di `localStorage`.

## Routing
- Router `react-router-dom` memetakan:
  - `/` (landing: Hero, Features, About, Contact)
  - `/employees`
  - `/departments`
  - `/positions`

## Styling & Animasi
- Tailwind CSS v4 untuk styling utilitas.
- `framer-motion` digunakan pada beberapa transisi dan animasi UI.

## Catatan
- Jika ingin memindahkan konfigurasi base URL ke environment Vite, dapat menggunakan `import.meta.env` dan mendefinisikan `VITE_API_URL`. Saat ini base URL masih hardcoded di `src/api.js`.