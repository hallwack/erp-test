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

## Membuat workflow stok rendah

1. Buat workflow baru.
2. Tambahkan node **Webhook** dengan method `POST` dan path `notif-trigger`.
3. Tambahkan node **Telegram** dengan operasi **Send Message**.
4. Buat credential Telegram menggunakan token dari BotFather dan isi Chat ID tujuan.
5. Hubungkan Webhook ke Telegram, lalu aktifkan workflow.

Aplikasi memanggil URL production webhook:

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

