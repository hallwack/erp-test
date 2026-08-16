# Mini ERP

Aplikasi Mini ERP berbasis Laravel untuk mengelola kategori, produk, stok, order, dan pembayaran guest checkout. Frontend menggunakan React melalui Inertia.js. Pembayaran menggunakan Xendit Payment Session, sedangkan notifikasi stok rendah diteruskan ke n8n dan Telegram.

## Daftar Isi

- [Fitur](#fitur)
- [Modul Utama](#modul-utama)
- [Teknologi](#teknologi)
- [Instalasi](#instalasi)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Arsitektur Sistem](#arsitektur-sistem)
- [API Connection](#api-connection)
- [Routing dan Controller](#routing-dan-controller)
- [Alur Pembayaran dan Notifikasi](#alur-pembayaran-dan-notifikasi)
- [Dokumentasi Integrasi](#dokumentasi-integrasi)
- [Panduan Demo](#panduan-demo)
- [Struktur Database](#struktur-database)

## Fitur

- CRUD kategori dan produk.
- Penyesuaian stok dengan tipe `in`, `out`, dan `adjustment`.
- Guest checkout tanpa login.
- Pembuatan Xendit Payment Session dan redirect ke halaman pembayaran Xendit.
- Pembaruan status order serta pengurangan stok melalui webhook Xendit.
- Notifikasi stok rendah melalui workflow n8n ke Telegram.
- Dashboard, daftar order, dan riwayat stock movement untuk pengguna terautentikasi.

## Modul Utama

Project ini terdiri dari tiga modul inti dan satu automation pendukung.

### 1. Inventory

Modul Inventory mengelola master data dan ketersediaan barang:

- CRUD kategori melalui `CategoryController` pada route `/category`.
- CRUD produk melalui `ProductController` pada route `/product`.
- Penyesuaian stok masuk, keluar, dan adjustment melalui `/product/{product}/adjust-stock`.
- Riwayat perubahan stok melalui `StockMovementController` pada `/stock-movement`.
- Monitoring produk dengan stok di bawah `stock_threshold`.

Data utama modul ini berada pada tabel `categories`, `products`, dan `stock_movements`.

### 2. Sales / POS

Modul Sales/POS menangani proses penjualan dari cart sampai pembayaran:

- Customer memilih produk dan menyimpannya pada cart berbasis session.
- Guest checkout melalui `CheckoutController` pada `/checkout`.
- Sistem membuat order dan nomor invoice seperti `INV-XXXXXXXX`.
- Detail barang, jumlah, harga, subtotal, pajak, dan total disimpan pada order.
- Payment Session Xendit dibuat dan customer diarahkan ke halaman pembayaran.
- Status pembayaran diperbarui melalui webhook `POST /api/checkout/webhook`.
- Setelah pembayaran berhasil, stok dikurangi dan transaksi dapat dilihat pada `/order`.

Controller utama modul ini adalah `CartController`, `CheckoutController`, `OrderController`, dan `PaymentCallbackController`. Data utamanya berada pada tabel `orders`, `order_details`, dan `payments`.

### 3. Finance / Reporting

Modul Finance/Reporting menyediakan ringkasan dan riwayat transaksi berdasarkan data order dan payment yang sudah tersimpan:

- Ringkasan total pemasukan dari order dengan `payment_status = paid`.
- Jumlah order yang sudah dibayar.
- Lima transaksi paid terbaru pada dashboard.
- Riwayat transaksi lengkap melalui halaman `/order`.
- Detail invoice, customer, total, metode pembayaran, waktu pembayaran, dan detail produk melalui `/order/{order}`.

Controller utama modul ini adalah `DashboardController` dan `OrderController`. Modul ini menggunakan agregasi dari tabel `orders` dan `payments`, tanpa tabel reporting tambahan.

### Automation Pendukung: n8n + Telegram

Automation bukan modul bisnis utama, tetapi mendukung Inventory dan Sales/POS:

- Setelah pembayaran berhasil dan stok berada di bawah threshold, backend mengirim payload ke `N8N_URL/webhook/notif-trigger`.
- Workflow n8n menerima payload tersebut.
- Node Telegram mengirim notifikasi stok rendah kepada user atau channel yang ditentukan.
- Konfigurasi lengkap tersedia pada [docs/n8n.md](docs/n8n.md).

## Teknologi

| Layer | Teknologi |
| --- | --- |
| Backend | Laravel 13, PHP 8.3+ |
| Frontend | React 19, Inertia.js 3 |
| Database | PostgreSQL |
| Authentication | Laravel Fortify |
| Payment | Xendit Payment Session |
| Automation | n8n |
| Notification | Telegram Bot |
| Local webhook tunnel | ngrok |

## Instalasi

### Prasyarat

- PHP 8.3 atau lebih baru dan Composer.
- Node.js dan npm.
- PostgreSQL.
- Docker, jika ingin menjalankan n8n secara lokal.

### Setup aplikasi

Jalankan dari root repository:

```bash
composer install
cp .env.example .env
php artisan key:generate
npm install
```

Atur koneksi PostgreSQL di `.env`:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=laravel_db
DB_USERNAME=laravel_user
DB_PASSWORD=
```

Atur integrasi eksternal sesuai kebutuhan:

```env
APP_URL=http://localhost:8000
XENDIT_SECRET_KEY=xnd_development_...
XENDIT_WEBHOOK_TOKEN=...
N8N_URL=http://localhost:5678
```

Lalu jalankan migrasi dan seeder:

```bash
php artisan migrate --seed
```

Alternatifnya, project menyediakan script setup:

```bash
composer run setup
```

## Menjalankan Aplikasi

Untuk menjalankan backend dan Vite secara bersamaan:

```bash
composer run dev
```

Atau jalankan terpisah:

```bash
php artisan serve
npm run dev
```

Aplikasi tersedia di `http://localhost:8000`. n8n tersedia di `http://localhost:5678` setelah dijalankan. ngrok juga tersedia di `http://localhost:4040`. Panduan lengkap integrasi tersedia di:

- [Instalasi dan konfigurasi n8n](docs/n8n.md)
- [Integrasi Xendit](docs/xendit.md)
- [Instalasi dan penggunaan ngrok](docs/ngrok.md)

## Arsitektur Sistem

Aplikasi menggunakan arsitektur monolith Laravel dengan React dan Inertia.js sebagai frontend. Laravel menangani routing, validasi, business logic, akses database, dan integrasi dengan layanan eksternal.

```text
┌──────────────────────┐
│ React + Inertia.js   │
│ Guest/Admin UI       │
└──────────┬───────────┘
           │ HTTP request / Inertia visit
           ▼
┌──────────────────────┐
│ Laravel Application  │
│ Routes + Controllers │
└──────┬───────┬───────┘
       │       │
       │       └──────────────┐
       ▼                      ▼
┌──────────────┐     ┌──────────────────┐
│ PostgreSQL   │     │ Xendit Payment   │
│ ERP data     │     │ Session API      │
└──────────────┘     └────────┬─────────┘
                              │ payment webhook
                              ▼
                     ┌──────────────────┐
                     │ ngrok (local)    │
                     └────────┬─────────┘
                              ▼
                     /api/checkout/webhook
                              │
                              ▼
                     ┌──────────────────┐
                     │ n8n Webhook      │
                     │ notif-trigger    │
                     └────────┬─────────┘
                              ▼
                     ┌──────────────────┐
                     │ Telegram Bot     │
                     └──────────────────┘
```

### Alur komponen

1. React/Inertia mengirim request ke route Laravel.
2. Controller Laravel memvalidasi request dan menjalankan proses modul Inventory, Sales/POS, atau Finance/Reporting.
3. Data aplikasi disimpan di PostgreSQL.
4. `CheckoutController` memanggil Xendit Payment Session API dan mengarahkan customer ke halaman pembayaran.
5. Xendit mengirim status pembayaran ke endpoint webhook Laravel. Pada development, callback tersebut melewati ngrok.
6. `PaymentCallbackController` memperbarui payment/order, mengurangi stok, dan mencatat stock movement.
7. Jika stok di bawah threshold, Laravel mengirim payload ke webhook n8n.
8. Workflow n8n meneruskan notifikasi ke Telegram melalui bot yang dikonfigurasi.

## API Connection

Project ini mengimplementasikan koneksi ke API eksternal Xendit dan koneksi webhook ke n8n.

### Xendit Payment Session API

Digunakan oleh `CheckoutController@store` untuk membuat halaman pembayaran:

```text
POST https://api.xendit.co/sessions
```

Autentikasi menggunakan HTTP Basic Auth dengan `XENDIT_SECRET_KEY` sebagai username dan password kosong. Data utama yang dikirim meliputi:

- `reference_id`: nomor invoice order.
- `amount`: total pembayaran.
- `currency`: `IDR`.
- `country`: `ID`.
- `customer`: informasi customer guest.
- `items`: detail produk yang dibeli.
- `success_return_url` dan `cancel_return_url`: URL kembali ke aplikasi.

Respons Xendit menyediakan `payment_session_id` dan `payment_link_url`. URL tersebut digunakan untuk mengarahkan customer ke halaman checkout Xendit.

### Xendit Payment Webhook

Xendit mengirim perubahan status pembayaran ke endpoint Laravel berikut:

```text
POST https://<domain-publik>/api/checkout/webhook
```

Pada local development, `<domain-publik>` berasal dari ngrok. Laravel memverifikasi header `X-Callback-Token` dengan nilai `XENDIT_WEBHOOK_TOKEN`, kemudian mengambil detail session/payment dari API Xendit sebelum memperbarui status order.

### n8n Webhook

Laravel mengirim notifikasi stok rendah ke workflow n8n menggunakan:

```text
POST ${N8N_URL}/webhook/notif-trigger
```

Contoh payload:

```json
{
  "product_id": 1,
  "product_name": "Contoh Produk",
  "current_stock": 2,
  "threshold": 5,
  "status": "WARNING",
  "message": "Stock for product Contoh Produk is below threshold. Current stock: 2"
}
```

Workflow n8n membaca field `message`, lalu node Telegram mengirimkannya ke Chat ID yang sudah dikonfigurasi. Detail setup token BotFather dan Chat ID tersedia di [docs/n8n.md](docs/n8n.md).

## Routing dan Controller

Route aplikasi dibagi menjadi `routes/web.php`, `routes/api.php`, dan `routes/settings.php`. Sebagian besar route web mengembalikan halaman Inertia, bukan REST API.

### Route publik

| Method | URI | Controller/action | Nama route |
| --- | --- | --- | --- |
| GET | `/` | `HomeController@home` | `home` |
| POST | `/cart/add/{product}` | `CartController@add` | `cart.add` |
| DELETE | `/cart/remove/{product}` | `CartController@remove` | `cart.remove` |
| GET | `/checkout` | `CheckoutController@index` | `checkout.index` |
| POST | `/checkout` | `CheckoutController@store` | `checkout.store` |
| GET | `/checkout/status` | `CheckoutController@status` | `checkout.status` |
| POST | `/api/checkout/webhook` | `PaymentCallbackController@webhook` | `checkout.webhook` |

Checkout publik menyimpan cart di session. `CheckoutController@store` membuat order, detail order, dan Payment Session Xendit, kemudian mengarahkan pembeli ke `payment_link_url`.

### Route terproteksi (`auth` dan `verified`)

| Method | URI | Controller/action | Nama route |
| --- | --- | --- | --- |
| GET | `/dashboard` | `DashboardController@index` | `dashboard` |
| Resource | `/category` | `CategoryController` | `category.*` |
| Resource | `/product` | `ProductController` | `product.*` |
| GET | `/product/{product}/stock-movement` | `ProductController@stockMovement` | `product.stock-movement` |
| POST | `/product/{product}/adjust-stock` | `ProductController@storeStockMovement` | `product.store-stock-movement` |
| Resource index/show | `/order` | `OrderController` | `order.index`, `order.show` |
| GET | `/stock-movement` | `StockMovementController@index` | `stock-movement.index` |

Route resource kategori hanya memakai `index`, `create`, `store`, `edit`, `update`, dan `destroy`. `ProductController@show` saat ini tersedia karena resource route, tetapi belum memiliki implementasi halaman khusus.

### Settings

Route pengaturan berada di `routes/settings.php` dan memakai `ProfileController` serta `SecurityController` untuk profil, penghapusan akun, dan perubahan password.

### Webhook Xendit

`PaymentCallbackController@webhook` memeriksa header `X-Callback-Token`, mencari order dari `data.reference_id`, mengambil detail session/payment dari Xendit, lalu menandai pembayaran, mengurangi stok, mencatat stock movement, dan memanggil n8n jika stok rendah.

Gunakan `php artisan route:list --except-vendor` untuk melihat route aktual pada environment yang sedang dijalankan.

## Alur Pembayaran dan Notifikasi

```text
Guest memilih produk -> cart session -> POST /checkout
-> CheckoutController membuat order + Xendit Payment Session
-> redirect ke Xendit Hosted Checkout
-> Xendit POST /api/checkout/webhook
-> PaymentCallbackController memproses pembayaran dan stok
-> POST N8N_URL/webhook/notif-trigger jika stok rendah
-> n8n mengirim pesan Telegram
```

## Panduan Demo

Panduan berikut digunakan untuk mendemonstrasikan seluruh alur aplikasi dari Inventory sampai automation Telegram.

### Persiapan demo

Pastikan komponen berikut sudah berjalan:

```bash
php artisan serve
npm run dev
docker start n8n
ngrok http 8000
```

Konfigurasikan `.env` dengan URL ngrok yang aktif dan credential Xendit:

```env
APP_URL=https://<url-ngrok>.ngrok-free.app
XENDIT_SECRET_KEY=xnd_development_...
XENDIT_WEBHOOK_TOKEN=...
N8N_URL=http://localhost:5678
```

Import workflow n8n, pilih credential Telegram, atur Chat ID, dan aktifkan workflow. Pada Xendit Dashboard, gunakan callback URL:

```text
https://<url-ngrok>.ngrok-free.app/api/checkout/webhook
```

### Demo modul Inventory

1. Login sebagai user yang sudah terverifikasi.
2. Buka menu **Category** dan buat kategori baru, misalnya `Minuman`.
3. Buka menu **Product** dan buat produk dengan harga, stok awal, dan `stock_threshold`.
4. Buka stock movement produk tersebut.
5. Uji perubahan stok dengan tipe `in`, `out`, atau `adjustment`.
6. Pastikan jumlah stok dan riwayat movement berubah sesuai transaksi.

### Demo modul Sales/POS

1. Buka halaman utama sebagai customer guest.
2. Tambahkan produk ke cart.
3. Buka `/checkout` dan isi nama customer.
4. Submit checkout.
5. Pastikan aplikasi membuat nomor invoice dan mengarahkan ke Xendit Hosted Checkout.
6. Selesaikan pembayaran menggunakan metode test Xendit.

### Demo modul Finance/Reporting

1. Setelah pembayaran berhasil, buka `/dashboard`.
2. Tunjukkan total revenue, jumlah order paid, jumlah produk low stock, dan lima transaksi terbaru.
3. Buka `/order` untuk melihat riwayat order.
4. Buka detail order untuk menunjukkan nomor invoice, detail produk, total, status pembayaran, metode pembayaran, dan waktu pembayaran.

### Demo automation n8n dan Telegram

1. Pastikan Xendit mengirim callback ke endpoint Laravel melalui ngrok.
2. Pastikan payment berhasil dan stok produk berkurang.
3. Gunakan produk dengan stok akhir di bawah `stock_threshold`.
4. Laravel mengirim payload ke `/webhook/notif-trigger` pada n8n.
5. Workflow n8n meneruskan field `message` ke node Telegram.
6. Tunjukkan notifikasi stok rendah yang diterima pada chat Telegram.

Jika callback atau notifikasi tidak masuk, periksa `storage/logs/laravel.log`, execution history n8n, dan dashboard inspeksi ngrok di `http://127.0.0.1:4040`.

## Struktur Database

| Tabel | Keterangan |
| --- | --- |
| `users` | Akun pengguna aplikasi |
| `categories` | Kategori produk |
| `products` | Produk, stok, dan `stock_threshold` |
| `stock_movements` | Riwayat perubahan stok |
| `orders` | Order dan status pembayaran |
| `order_details` | Detail produk dalam order |
| `payments` | Data transaksi dan respons Xendit |

## Catatan Keamanan

- Jangan commit `.env`, secret key Xendit, callback token, atau credential Telegram.
- Gunakan Xendit mode development/test saat pengembangan.
- URL ngrok gratis dapat berubah setiap kali tunnel dimulai; perbarui webhook Xendit jika URL berubah.
