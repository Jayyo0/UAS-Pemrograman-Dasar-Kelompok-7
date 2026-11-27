
import * as readline from "readline";

// 1. STRUKTUR DATA MAHASISWA
interface Mahasiswa {
  nim: string;
  nama: string;
  nilaiTugas: number;
  nilaiUTS: number;
  nilaiUAS: number;
}

// 2. DATA AWAL MAHASISWA
const daftarMahasiswa: Mahasiswa[] = [
  { nim: "246001", nama: "Andi", nilaiTugas: 85, nilaiUTS: 80, nilaiUAS: 90 },
  { nim: "246002", nama: "Budi", nilaiTugas: 75, nilaiUTS: 80, nilaiUAS: 85 },
  { nim: "246003", nama: "Citra", nilaiTugas: 90, nilaiUTS: 88, nilaiUAS: 92 },
  { nim: "246004", nama: "Dina", nilaiTugas: 80, nilaiUTS: 75, nilaiUAS: 85 },
  { nim: "246005", nama: "Eko", nilaiTugas: 70, nilaiUTS: 78, nilaiUAS: 80 },
];

// 3. INPUT DAN VALIDASI
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function tanya(pertanyaan: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(pertanyaan, (jawaban: string) => resolve(jawaban));
  });
}

function nilaiValid(nilai: number): boolean {
  return Number.isFinite(nilai) && nilai >= 0 && nilai <= 100;
}

async function inputNilai(label: string): Promise<number> {
  while (true) {
    const input = await tanya(`${label} (0-100): `);
    const nilai = Number(input);

    if (input.trim() !== "" && nilaiValid(nilai)) {
      return nilai;
    }

    console.log("Input tidak valid. Masukkan angka 0 sampai 100.");
  }
}

async function inputNIM(): Promise<string> {
  while (true) {
    const nim = (await tanya("Masukkan NIM: ")).trim();

    if (!/^\d+$/.test(nim)) {
      console.log("NIM hanya boleh berisi angka.");
      continue;
    }

    return nim;
  }
}

async function inputNama(): Promise<string> {
  while (true) {
    const nama = (await tanya("Masukkan nama: ")).trim();

    if (nama === "" || !/[a-zA-Z]/.test(nama)) {
      console.log("Nama tidak boleh kosong dan harus mengandung huruf.");
      continue;
    }

    return nama;
  }
}

// 4. FUNGSI READ - TAMPILKAN SELURUH MAHASISWA
function tampilkanMahasiswa(): void {
  console.log("\n===== DAFTAR MAHASISWA =====");

  if (daftarMahasiswa.length === 0) {
    console.log("Belum ada data mahasiswa.");
    return;
  }

  console.log(
    "NIM".padEnd(12) +
    "NAMA".padEnd(15) +
    "TUGAS".padEnd(10) +
    "UTS".padEnd(10) +
    "UAS".padEnd(10)
  );

  console.log("-".repeat(57));

  daftarMahasiswa.forEach((m) => {
    console.log(
      m.nim.padEnd(12) +
      m.nama.padEnd(15) +
      String(m.nilaiTugas).padEnd(10) +
      String(m.nilaiUTS).padEnd(10) +
      String(m.nilaiUAS).padEnd(10)
    );
  });
}

// 5. FUNGSI CREATE - TAMBAH MAHASISWA
async function tambahMahasiswa(): Promise<void> {
  console.log("\n===== TAMBAH MAHASISWA =====");

  const nim = await inputNIM();

  if (daftarMahasiswa.some((m) => m.nim === nim)) {
    console.log("NIM sudah terdaftar.");
    return;
  }

  const nama = await inputNama();
  const nilaiTugas = await inputNilai("Nilai Tugas");
  const nilaiUTS = await inputNilai("Nilai UTS");
  const nilaiUAS = await inputNilai("Nilai UAS");

  daftarMahasiswa.push({
    nim,
    nama,
    nilaiTugas,
    nilaiUTS,
    nilaiUAS,
  });

  console.log("\nData mahasiswa berhasil ditambahkan!");
}

// 6. FUNGSI SEARCH - CARI MAHASISWA
async function cariMahasiswa(): Promise<void> {
  console.log("\n===== CARI MAHASISWA =====");

  const nim = (await tanya("Masukkan NIM yang dicari: ")).trim();

  const mahasiswa = daftarMahasiswa.find((m) => m.nim === nim);

  if (!mahasiswa) {
    console.log("Data mahasiswa tidak ditemukan.");
    return;
  }

  console.log("\nData mahasiswa ditemukan:");
  console.log(`NIM         : ${mahasiswa.nim}`);
  console.log(`Nama        : ${mahasiswa.nama}`);
  console.log(`Nilai Tugas : ${mahasiswa.nilaiTugas}`);
  console.log(`Nilai UTS   : ${mahasiswa.nilaiUTS}`);
  console.log(`Nilai UAS   : ${mahasiswa.nilaiUAS}`);
}

// 7. FUNGSI UPDATE - UBAH DATA MAHASISWA
async function ubahMahasiswa(): Promise<void> {
  console.log("\n===== UBAH DATA MAHASISWA =====");

  const nim = (await tanya("Masukkan NIM mahasiswa: ")).trim();

  const mahasiswa = daftarMahasiswa.find((m) => m.nim === nim);

  if (!mahasiswa) {
    console.log("Data mahasiswa tidak ditemukan.");
    return;
  }

  console.log("\nMasukkan data baru:");
  mahasiswa.nama = await inputNama();
  mahasiswa.nilaiTugas = await inputNilai("Nilai Tugas");
  mahasiswa.nilaiUTS = await inputNilai("Nilai UTS");
  mahasiswa.nilaiUAS = await inputNilai("Nilai UAS");

  console.log("\nData mahasiswa berhasil diperbarui!");
}

// 8. FUNGSI DELETE - HAPUS MAHASISWA
async function hapusMahasiswa(): Promise<void> {
  console.log("\n===== HAPUS MAHASISWA =====");

  const nim = (await tanya("Masukkan NIM mahasiswa: ")).trim();

  const index = daftarMahasiswa.findIndex((m) => m.nim === nim);

  if (index === -1) {
    console.log("Data mahasiswa tidak ditemukan.");
    return;
  }

  const konfirmasi = (await tanya(
    `Yakin ingin menghapus data ${daftarMahasiswa[index].nama}? (y/n): `
  )).trim().toLowerCase();

  if (konfirmasi !== "y") {
    console.log("Penghapusan dibatalkan.");
    return;
  }

  daftarMahasiswa.splice(index, 1);
  console.log("Data mahasiswa berhasil dihapus!");
}

// 9. FUNGSI STATISTIK NILAI
function statistikNilai(): void {
  console.log("\n===== STATISTIK NILAI MAHASISWA =====");

  if (daftarMahasiswa.length === 0) {
    console.log("Belum ada data mahasiswa.");
    return;
  }

  const rataRata = (total: number): number => total / daftarMahasiswa.length;

  const totalTugas = daftarMahasiswa.reduce(
    (total, m) => total + m.nilaiTugas, 0
  );

  const totalUTS = daftarMahasiswa.reduce(
    (total, m) => total + m.nilaiUTS, 0
  );

  const totalUAS = daftarMahasiswa.reduce(
    (total, m) => total + m.nilaiUAS, 0
  );

  const rataTugas = rataRata(totalTugas);
  const rataUTS = rataRata(totalUTS);
  const rataUAS = rataRata(totalUAS);

  console.log(`Jumlah mahasiswa : ${daftarMahasiswa.length}`);
  console.log(`Rata-rata Tugas  : ${rataTugas.toFixed(2)}`);
  console.log(`Rata-rata UTS    : ${rataUTS.toFixed(2)}`);
  console.log(`Rata-rata UAS    : ${rataUAS.toFixed(2)}`);

  const nilaiTertinggi = [...daftarMahasiswa].sort(
    (a, b) => b.nilaiUAS - a.nilaiUAS
  )[0];

  const nilaiTerendah = [...daftarMahasiswa].sort(
    (a, b) => a.nilaiUAS - b.nilaiUAS
  )[0];

  console.log("\nBerdasarkan nilai UAS:");
  console.log(
    `Nilai tertinggi : ${nilaiTertinggi.nama} (${nilaiTertinggi.nilaiUAS})`
  );
  console.log(
    `Nilai terendah  : ${nilaiTerendah.nama} (${nilaiTerendah.nilaiUAS})`
  );
}

// 10. MENU UTAMA
async function menuUtama(): Promise<void> {
  let berjalan = true;

  while (berjalan) {
    console.log("\n==================================");
    console.log(" SISTEM MANAJEMEN DATA MAHASISWA");
    console.log("==================================");
    console.log("1. Tampilkan seluruh mahasiswa");
    console.log("2. Tambah mahasiswa");
    console.log("3. Cari mahasiswa");
    console.log("4. Ubah data mahasiswa");
    console.log("5. Hapus mahasiswa");
    console.log("6. Statistik nilai mahasiswa");
    console.log("0. Keluar");
    console.log("==================================");

    const pilihan = (await tanya("Pilih menu: ")).trim();

    switch (pilihan) {
      case "1":
        tampilkanMahasiswa();
        break;
      case "2":
        await tambahMahasiswa();
        break;
      case "3":
        await cariMahasiswa();
        break;
      case "4":
        await ubahMahasiswa();
        break;
      case "5":
        await hapusMahasiswa();
        break;
      case "6":
        statistikNilai();
        break;
      case "0":
        console.log("\nTerima kasih telah menggunakan program.");
        berjalan = false;
        break;
      default:
        console.log("Pilihan tidak valid. Silakan pilih menu 0 sampai 6.");
    }
  }
}

// 11. MENJALANKAN PROGRAM
menuUtama()
  .then(() => {
    rl.close();
  })
  .catch((error: unknown) => {
    console.error("Terjadi kesalahan:", error);
    rl.close();
  });
