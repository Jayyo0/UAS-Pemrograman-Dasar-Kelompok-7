import * as readline from "readline";

// 1. STRUKTUR DATA MAHASISWA
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

// 2. INPUT DAN VALIDASI
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function tanya(pertanyaan: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(pertanyaan, (jawaban: string) => {
      resolve(jawaban);
    });
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

// 3. CREATE - TAMBAH MAHASISWA

async function tambahMahasiswa(): Promise<void> {
  console.log("\n===== TAMBAH MAHASISWA =====");

  const nim = (await tanya("Masukkan NIM: ")).trim();

  if (nim === "") {
    console.log("NIM tidak boleh kosong.");
    return;
  }

  if (!/^\d+$/.test(nim)) {
    console.log("NIM hanya boleh berisi angka.");
    return;
  }

  // Pemeriksaan NIM duplikat untuk kebutuhan Create
  const nimTerdaftar = daftarMahasiswa.some(
    (mahasiswa) => mahasiswa.nim === nim
  );

  if (nimTerdaftar) {
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

// 4. MENU UTAMA

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
        console.log("Fitur Read belum diimplementasikan.");
        break;

      case "2":
        await tambahMahasiswa();
        break;

      case "3":
        console.log("Fitur Search belum diimplementasikan.");
        break;

      case "4":
        console.log("Fitur Update belum diimplementasikan.");
        break;

      case "5":
        console.log("Fitur Delete belum diimplementasikan.");
        break;

      case "6":
        console.log("Fitur Statistik belum diimplementasikan.");
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

// 5. MENJALANKAN PROGRAM

menuUtama()
  .then(() => {
    rl.close();
  })
  .catch((error: unknown) => {
    console.error("Terjadi kesalahan:", error);
    rl.close();
  });
