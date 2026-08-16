# Instalasi n8n

Dokumen ini menjelaskan cara menjalankan n8n secara lokal menggunakan Docker dan menghubungkannya dengan aplikasi Mini ERP.

## Prasyarat

- Docker Desktop atau Docker Engine + Docker Compose.
- Port `5678` tersedia.

## Menjalankan n8n dengan Docker

Buat volume persisten agar workflow, credential, dan encryption key tidak hilang:

```bash
docker volume create n8n_data
docker run -d \
  --name n8n \
  -p 5678:5678 \
  -e GENERIC_TIMEZONE=Asia/Jakarta \
  -e TZ=Asia/Jakarta \
  -e N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true \
  -e N8N_RUNNERS_ENABLED=true \
  -v n8n_data:/home/node/.n8n \
  docker.n8n.io/n8nio/n8n
```

Buka `http://localhost:5678`, buat akun owner, lalu login.

```bash
docker ps
docker logs -f n8n
docker stop n8n
docker start n8n
```

## Integrasi Telegram dengan workflow JSON

Workflow JSON dapat di-import ke n8n, tetapi credential Telegram biasanya harus dibuat atau dipilih ulang di instance n8n tujuan. Ikuti urutan berikut.

### 1. Buat bot Telegram melalui BotFather

1. Buka Telegram dan cari akun resmi [@BotFather](https://t.me/BotFather).
2. Kirim perintah `/newbot`.
3. Masukkan nama tampilan bot.
4. Masukkan username bot yang unik dan diakhiri `bot`, misalnya `mini_erp_alert_bot`.
5. BotFather akan memberikan **HTTP API token**. Simpan token tersebut secara rahasia.

Token ini memberikan akses untuk mengendalikan bot. Jangan menaruhnya di file workflow JSON yang dibagikan atau di repository.

### 2. Hubungkan token ke credential Telegram di n8n

1. Import workflow JSON ke n8n melalui menu **Workflows → Import from File** atau opsi import JSON.
2. Buka node **Telegram** yang digunakan untuk mengirim pesan.
3. Pada bagian **Credential to connect with**, pilih **Create New Credential** atau credential Telegram yang sudah ada.
4. Masukkan token dari BotFather pada field **Access Token**.
5. Simpan credential dan gunakan tombol **Test** atau **Save** untuk memverifikasi koneksi.

Jika workflow memiliki lebih dari satu node Telegram, pilih credential yang sama pada setiap node tersebut. Import workflow tidak otomatis memberikan credential karena credential dikelola secara terpisah oleh n8n.

### 3. Mulai percakapan dengan bot

Bot Telegram tidak dapat memulai percakapan dengan user. Buka username bot yang dibuat, tekan **Start**, atau kirim pesan:

```text
/start
```

Langkah ini wajib dilakukan sebelum bot dapat mengirim notifikasi ke chat pribadi Anda.

### 4. Dapatkan Chat ID user

Metode yang paling langsung adalah memakai Telegram Bot API:

1. Kirim pesan apa saja, misalnya `test`, ke bot yang baru dibuat.
2. Buka URL berikut di browser. Ganti `<TOKEN_BOT>` dengan token dari BotFather:

   ```text
   https://api.telegram.org/bot<TOKEN_BOT>/getUpdates
   ```

3. Cari object `message` lalu field `chat` → `id`. Contoh struktur respons:

   ```json
   {
     "message": {
       "chat": {
         "id": 123456789,
         "type": "private"
       },
       "text": "test"
     }
   }
   ```

4. Nilai `123456789` adalah **Chat ID** user. Salin angka tersebut ke node Telegram di n8n.

Alternatifnya, Anda dapat menggunakan bot pencari ID seperti `@userinfobot`, tetapi tetap pastikan user sudah menekan **Start** pada bot milik Anda.

> **Catatan:** Jika `getUpdates` mengembalikan `result: []`, kirim pesan baru ke bot lalu refresh URL. Jika bot sedang memakai webhook Telegram/Telegram Trigger, `getUpdates` dapat tidak mengembalikan update; nonaktifkan webhook sementara atau gunakan node Telegram Trigger untuk membaca data chat.

### 5. Atur node Telegram

Pada node **Telegram** yang memiliki operasi **Send Message**:

- **Credential:** credential Telegram yang berisi token BotFather.
- **Chat ID:** angka Chat ID user, misalnya `123456789`.
- **Text/Message:** gunakan payload dari webhook, misalnya `{{$json.message}}`.

Jika node memakai field yang berbeda, gunakan data yang tersedia dari node Webhook. Payload dari aplikasi Mini ERP memiliki field `message`, `product_name`, `current_stock`, dan `threshold`.

### 6. Uji workflow

1. Pastikan node Webhook dan node Telegram terhubung.
2. Jalankan workflow dalam mode test jika memakai URL `webhook-test`, atau aktifkan workflow untuk URL production `webhook`.
3. Kirim request contoh ke webhook n8n:

   ```bash
   curl -X POST http://localhost:5678/webhook-test/notif-trigger \
     -H 'Content-Type: application/json' \
     -d '{"message":"Test notifikasi stok rendah","product_name":"Produk Test","current_stock":2,"threshold":5}'
   ```

4. Pastikan pesan diterima di chat Telegram Anda.

Setelah pengujian berhasil, aktifkan workflow dan gunakan URL production:

```text
http://localhost:5678/webhook/notif-trigger
```

Karena kode aplikasi menambahkan `/webhook/notif-trigger` ke `N8N_URL`, nilai `.env` harus berupa URL dasar:

```env
N8N_URL=http://localhost:5678
```

Payload yang dikirim:

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

Di node Telegram, gunakan field `message`, misalnya `{{$json.message}}`.

## Troubleshooting

- URL `webhook-test` hanya digunakan saat pengujian dari editor. Aplikasi memakai URL `webhook` karena workflow harus aktif.
- Jika credential hilang setelah restart, pastikan volume `n8n_data` tetap terpasang.
- Jika webhook tidak masuk, cek `docker logs -f n8n` dan pastikan `N8N_URL` tidak memiliki path webhook tambahan.

Referensi: [n8n Docker installation](https://docs.n8n.io/hosting/installation/docker/).
