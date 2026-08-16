# Integrasi Payment Gateway Xendit

Aplikasi menggunakan Xendit Payment Session dengan mode `PAYMENT_LINK`. Secret key hanya digunakan di backend; frontend menerima redirect ke `payment_link_url` dari aplikasi.

## Persiapan akun

1. Gunakan akun Xendit dan aktifkan mode development/test.
2. Buat Secret API Key dari Xendit Dashboard.
3. Buat atau salin Webhook Verification Token.
4. Simpan credential di `.env`, jangan di-commit:

```env
XENDIT_SECRET_KEY=xnd_development_...
XENDIT_WEBHOOK_TOKEN=...
```

Konfigurasi dibaca dari `config/services.php` sebagai `services.xendit.secret_key` dan `services.xendit.webhook_token`.

## Konfigurasi webhook

Set URL webhook di Xendit Dashboard ke:

```text
https://<domain-publik>/api/checkout/webhook
```

Untuk development, gunakan URL ngrok seperti pada [panduan ngrok](ngrok.md). Header yang harus dikirim Xendit adalah `X-Callback-Token`; aplikasi menolak token yang tidak cocok dengan HTTP `403`.

## Alur aplikasi

1. `POST /checkout` divalidasi oleh `CheckoutStoreRequest`.
2. `CheckoutController` membuat `orders`, `order_details`, dan Payment Session melalui `POST https://api.xendit.co/sessions`.
3. Customer diarahkan ke `payment_link_url`.
4. Xendit mengirim callback ke `POST /api/checkout/webhook`.
5. `PaymentCallbackController` mengambil session/payment dari Xendit menggunakan Secret API Key.
6. Saat payment berstatus `SUCCEEDED`, order ditandai paid, payment disimpan, dan stok dikurangi.

## Pengujian

1. Pastikan Laravel dan ngrok berjalan.
2. Pastikan webhook URL sudah disimpan di Xendit Dashboard.
3. Tambahkan produk ke cart dan lakukan checkout.
4. Selesaikan pembayaran menggunakan metode test yang tersedia.
5. Periksa halaman status order, tabel `payments`, dan `stock_movements`.
6. Periksa log jika callback gagal:

```bash
tail -f storage/logs/laravel.log
```

## Catatan

- `APP_URL` harus menunjuk ke URL yang dapat diakses browser untuk return URL checkout.
- Webhook adalah sumber konfirmasi pembayaran; redirect sukses browser bukan bukti pembayaran.
- Endpoint webhook tidak berada di balik middleware login.

Referensi: [Create a Session](https://docs.xendit.co/apidocs/create-session), [Payment webhook notification](https://docs.xendit.co/apidocs/payment-webhook-notification), dan [Handling webhooks](https://docs.xendit.co/docs/handling-webhooks).

