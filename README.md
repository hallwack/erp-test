# Mini ERP

Aplikasi Mini ERP berbasis Laravel untuk mengelola kategori, produk, stok, order, dan pembayaran guest checkout. Frontend menggunakan React melalui Inertia.js. Pembayaran menggunakan Xendit Payment Session, sedangkan notifikasi stok rendah diteruskan ke n8n dan Telegram.

## Daftar Isi

- [Fitur](#fitur)
- [Teknologi](#teknologi)
- [Instalasi](#instalasi)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Routing dan Controller](#routing-dan-controller)
- [Alur Pembayaran dan Notifikasi](#alur-pembayaran-dan-notifikasi)
- [Dokumentasi Integrasi](#dokumentasi-integrasi)
- [Struktur Database](#struktur-database)
- [Pengujian](#pengujian)

## Fitur

- CRUD kategori dan produk.
- Penyesuaian stok dengan tipe `in`, `out`, dan `adjustment`.
- Guest checkout tanpa login.
- Pembuatan Xendit Payment Session dan redirect ke halaman pembayaran Xendit.
- Pembaruan status order serta pengurangan stok melalui webhook Xendit.
- Notifikasi stok rendah melalui workflow n8n ke Telegram.
- Dashboard, daftar order, dan riwayat stock movement untuk pengguna terautentikasi.

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
