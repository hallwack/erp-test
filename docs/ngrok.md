# Instalasi dan Penggunaan ngrok

ngrok membuat endpoint publik sementara yang meneruskan request webhook ke Laravel lokal. Pada project ini, ngrok digunakan sebagai perantara callback dari payment gateway Xendit: Xendit mengirim status pembayaran ke URL publik ngrok, kemudian ngrok meneruskannya ke endpoint webhook Laravel di `localhost`.

```text
Xendit Payment Gateway
        -> URL publik ngrok
        -> Laravel POST /api/checkout/webhook
        -> update status payment, order, dan stok
```

## Instalasi

Install ngrok sesuai sistem operasi dari [halaman download resmi](https://ngrok.com/download). Contoh macOS dengan Homebrew:

```bash
brew install ngrok
```

Verifikasi dan autentikasi agent:

```bash
ngrok version
ngrok config add-authtoken <NGROK_AUTHTOKEN>
```

## Membuka Laravel ke internet

Jalankan Laravel terlebih dahulu:

```bash
php artisan serve
```

Pada terminal lain:

```bash
ngrok http 8000
```

Salin URL HTTPS yang ditampilkan, misalnya `https://abcd-1234.ngrok-free.app`. URL ini digunakan sebagai base URL callback payment gateway. Endpoint webhook Xendit menjadi:

```text
https://abcd-1234.ngrok-free.app/api/checkout/webhook
```

Masukkan URL tersebut pada konfigurasi webhook/callback di Xendit Dashboard. Dengan begitu, setiap perubahan status payment dapat diteruskan ke Laravel untuk diproses oleh `PaymentCallbackController@webhook`.

Jika ingin memakai URL yang sama untuk return URL pembayaran, set juga:

```env
APP_URL=https://abcd-1234.ngrok-free.app
```

Setelah mengubah `.env`:

```bash
php artisan config:clear
```

## Monitoring request

Dashboard inspeksi lokal ngrok biasanya tersedia di `http://127.0.0.1:4040`. Gunakan untuk melihat method, URL, header, payload, dan response webhook.

## Catatan keamanan dan keterbatasan

- Jangan membagikan authtoken ngrok atau secret Xendit.
- URL domain gratis dapat berubah ketika tunnel dimulai ulang; perbarui webhook Xendit setiap kali URL berubah.
- Tunnel ini ditujukan untuk development/demo, bukan deployment production.
- Pastikan Laravel tetap berjalan selama Xendit mengirim callback; jika server lokal atau ngrok berhenti, callback tidak dapat diterima.
- Hentikan proses dengan `Ctrl+C` setelah selesai.

Referensi: [ngrok Quickstart](https://ngrok.com/docs/guides/share-localhost/quickstart) dan [Secure Tunnels](https://ngrok.com/docs/guides/share-localhost/tunnels).
