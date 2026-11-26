
import * as readline from "readline";

// Interface untuk menentukan struktur data mahasiswa
interface Mahasiswa {
  nim: string;
  nama: string;
  nilaiTugas: number;
  nilaiUTS: number;
  nilaiUAS: number;
}

// Data awal mahasiswa
const daftarMahasiswa: Mahasiswa[] = [
  { nim: "246001", nama: "Andi", nilaiTugas: 85, nilaiUTS: 80, nilaiUAS: 90 },
  { nim: "246002", nama: "Budi", nilaiTugas: 75, nilaiUTS: 80, nilaiUAS: 85 },
  { nim: "246003", nama: "Citra", nilaiTugas: 90, nilaiUTS: 88, nilaiUAS: 92 },
  { nim: "246004", nama: "Dina", nilaiTugas: 80, nilaiUTS: 75, nilaiUAS: 85 },
  { nim: "246005", nama: "Eko", nilaiTugas: 70, nilaiUTS: 78, nilaiUAS: 80 },
];

// Membuat interface input dari terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Fungsi untuk menerima input pengguna
function tanya(pertanyaan: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(pertanyaan, (jawaban: string) => {
      resolve(jawaban);
    });
  });
}

// Menghitung nilai akhir mahasiswa
function hitungNilaiAkhir(mahasiswa: Mahasiswa): number {
  return (
    mahasiswa.nilaiTugas * 0.3 +
    mahasiswa.nilaiUTS * 0.3 +
    mahasiswa.nilaiUAS * 0.4
  );
}

// Menentukan grade berdasarkan nilai akhir
function tentukanGrade(nilai: number): string {
  if (nilai >= 85) {
    return "A";
  } else if (nilai >= 75) {
    return "B";
  } else if (nilai >= 65) {
    return "C";
  } else if (nilai >= 50) {
    return "D";
  } else {
    return "E";
  }
}

// Menentukan status kelulusan
function tentukanStatus(nilai: number): string {
  if (nilai >= 60) {
    return "Lulus";
  } else {
    return "Tidak Lulus";
  }
}

// Menampilkan satu data mahasiswa
function tampilkanMahasiswa(mahasiswa: Mahasiswa): void {
  const nilaiAkhir = hitungNilaiAkhir(mahasiswa);

  console.log("\n===== DATA MAHASISWA =====");
  console.log("NIM          :", mahasiswa.nim);
  console.log("Nama         :", mahasiswa.nama);
  console.log("Nilai Tugas  :", mahasiswa.nilaiTugas);
  console.log("Nilai UTS    :", mahasiswa.nilaiUTS);
  console.log("Nilai UAS    :", mahasiswa.nilaiUAS);
  console.log("Nilai Akhir  :", nilaiAkhir.toFixed(2));
  console.log("Grade        :", tentukanGrade(nilaiAkhir));
  console.log("Status       :", tentukanStatus(nilaiAkhir));
}

// Menampilkan seluruh data mahasiswa
function tampilkanSemuaMahasiswa(): void {
  console.log("\n===== DAFTAR SELURUH MAHASISWA =====");

  if (daftarMahasiswa.length === 0) {
    console.log("Belum ada data mahasiswa.");
  } else {
    for (let i = 0; i < daftarMahasiswa.length; i++) {
      console.log(`\nData ke-${i + 1}`);
      tampilkanMahasiswa(daftarMahasiswa[i]);
    }
  }
}

// Mencari mahasiswa berdasarkan NIM
function cariMahasiswa(nim: string): Mahasiswa | undefined {
  return daftarMahasiswa.find(
    (mahasiswa) => mahasiswa.nim === nim
  );
}

// Memeriksa validitas nilai
function nilaiValid(nilai: number): boolean {
  return Number.isFinite(nilai) && nilai >= 0 && nilai <= 100;
}

// Meminta input nilai yang valid
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

// Menambahkan mahasiswa baru
async function tambahMahasiswa(): Promise<void> {
  console.log("\n===== TAMBAH MAHASISWA =====");

  const nim = (await tanya("Masukkan NIM: ")).trim();

  if (nim === "") {
    console.log("NIM tidak boleh kosong.");
    return;
  }

  if (cariMahasiswa(nim) !== undefined) {
    console.log("NIM sudah terdaftar.");
    return;
  }

  const nama = (await tanya("Masukkan nama: ")).trim();

  if (nama === "") {
    console.log("Nama tidak boleh kosong.");
    return;
  }

  const nilaiTugas = await inputNilai("Nilai Tugas");
  const nilaiUTS = await inputNilai("Nilai UTS");
  const nilaiUAS = await inputNilai("Nilai UAS");

  const mahasiswaBaru: Mahasiswa = {
    nim,
    nama,
    nilaiTugas,
    nilaiUTS,
    nilaiUAS,
  };

  daftarMahasiswa.push(mahasiswaBaru);

  console.log("\nData mahasiswa berhasil ditambahkan!");
}

// Mencari dan menampilkan mahasiswa
async function cariDanTampilkanMahasiswa(): Promise<void> {
  console.log("\n===== CARI MAHASISWA =====");

  const nim = (await tanya("Masukkan NIM yang dicari: ")).trim();
  const mahasiswa = cariMahasiswa(nim);

  if (mahasiswa !== undefined) {
    console.log("Data mahasiswa ditemukan.");
    tampilkanMahasiswa(mahasiswa);
  } else {
    console.log("Mahasiswa dengan NIM tersebut tidak ditemukan.");
  }
}

// Mengubah nilai mahasiswa
async function ubahNilai(
  label: string,
  nilaiLama: number
): Promise<number> {
  while (true) {
    const input = await tanya(`${label} [${nilaiLama}] (Enter untuk tetap): `);

    if (input.trim() === "") {
      return nilaiLama;
    }

    const nilaiBaru = Number(input);

    if (nilaiValid(nilaiBaru)) {
      return nilaiBaru;
    }

    console.log("Nilai harus berupa angka 0 sampai 100.");
  }
}

// Mengubah data mahasiswa
async function ubahMahasiswa(): Promise<void> {
  console.log("\n===== UBAH DATA MAHASISWA =====");

  const nim = (await tanya("Masukkan NIM mahasiswa: ")).trim();
  const mahasiswa = cariMahasiswa(nim);

  if (mahasiswa === undefined) {
    console.log("Mahasiswa tidak ditemukan.");
    return;
  }

  console.log("\nData saat ini:");
  tampilkanMahasiswa(mahasiswa);

  const namaBaru = (await tanya("Nama baru (Enter untuk tetap): ")).trim();

  if (namaBaru !== "") {
    mahasiswa.nama = namaBaru;
  }

  mahasiswa.nilaiTugas = await ubahNilai(
    "Nilai Tugas",
    mahasiswa.nilaiTugas
  );

  mahasiswa.nilaiUTS = await ubahNilai(
    "Nilai UTS",
    mahasiswa.nilaiUTS
  );

  mahasiswa.nilaiUAS = await ubahNilai(
    "Nilai UAS",
    mahasiswa.nilaiUAS
  );

  console.log("\nData mahasiswa berhasil diperbarui.");
  tampilkanMahasiswa(mahasiswa);
}

// Menghapus data mahasiswa
async function hapusMahasiswa(): Promise<void> {
  console.log("\n===== HAPUS MAHASISWA =====");

  const nim = (await tanya("Masukkan NIM yang ingin dihapus: ")).trim();

  const indeks = daftarMahasiswa.findIndex(
    (mahasiswa) => mahasiswa.nim === nim
  );

  if (indeks === -1) {
    console.log("Mahasiswa tidak ditemukan.");
    return;
  }

  const konfirmasi = (
    await tanya("Yakin ingin menghapus data ini? (y/n): ")
  ).trim().toLowerCase();

  if (konfirmasi === "y") {
    daftarMahasiswa.splice(indeks, 1);
    console.log("Data mahasiswa berhasil dihapus.");
  } else {
    console.log("Penghapusan dibatalkan.");
  }
}

// Menampilkan statistik nilai mahasiswa
function tampilkanStatistik(): void {
  console.log("\n===== STATISTIK MAHASISWA =====");

  if (daftarMahasiswa.length === 0) {
    console.log("Belum ada data untuk dihitung.");
    return;
  }

  let totalNilai = 0;
  let jumlahLulus = 0;
  let jumlahTidakLulus = 0;

  for (const mahasiswa of daftarMahasiswa) {
    const nilaiAkhir = hitungNilaiAkhir(mahasiswa);

    totalNilai += nilaiAkhir;

    if (nilaiAkhir >= 60) {
      jumlahLulus++;
    } else {
      jumlahTidakLulus++;
    }
  }

  const rataRata = totalNilai / daftarMahasiswa.length;

  console.log("Jumlah Mahasiswa :", daftarMahasiswa.length);
  console.log("Rata-rata Nilai  :", rataRata.toFixed(2));
  console.log("Jumlah Lulus     :", jumlahLulus);
  console.log("Tidak Lulus      :", jumlahTidakLulus);
}

// Menampilkan menu utama dan menjalankan program
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
        tampilkanSemuaMahasiswa();
        break;

      case "2":
        await tambahMahasiswa();
        break;

      case "3":
        await cariDanTampilkanMahasiswa();
        break;

      case "4":
        await ubahMahasiswa();
        break;

      case "5":
        await hapusMahasiswa();
        break;

      case "6":
        tampilkanStatistik();
        break;

      case "0":
        console.log("\nTerima kasih telah menggunakan program.");
        berjalan = false;
        break;

      default:
        console.log("Pilihan tidak valid. Silakan pilih menu 0 sampai 6.");
        break;
    }
  }
}

// Menjalankan program utama
menuUtama()
  .then(() => {
    rl.close();
  })
  .catch((error: unknown) => {
    console.error("Terjadi kesalahan:", error);
    rl.close();
  });
