# Instalasi dan Penggunaan ngrok

ngrok membuat endpoint publik sementara yang meneruskan request webhook ke Laravel lokal. Ini diperlukan karena Xendit tidak dapat mengirim callback ke `localhost`.

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

Salin URL HTTPS yang ditampilkan, misalnya `https://abcd-1234.ngrok-free.app`. Endpoint webhook Xendit menjadi:

```text
https://abcd-1234.ngrok-free.app/api/checkout/webhook
```

Gunakan URL tersebut pada Xendit Dashboard. Jika ingin memakai URL yang sama untuk return URL pembayaran, set juga:

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
- Hentikan proses dengan `Ctrl+C` setelah selesai.

Referensi: [ngrok Quickstart](https://ngrok.com/docs/guides/share-localhost/quickstart) dan [Secure Tunnels](https://ngrok.com/docs/guides/share-localhost/tunnels).

