import * as readline from "readline";

// ==========================================
// 1. STRUKTUR DATA MAHASISWA
// ==========================================

interface Mahasiswa {
  nim: string;
  nama: string;
  nilaiTugas: number;
  nilaiUTS: number;
  nilaiUAS: number;
}

const daftarMahasiswa: Mahasiswa[] = [
  { nim: "246001", nama: "Andi", nilaiTugas: 85, nilaiUTS: 80, nilaiUAS: 90 },
  { nim: "246002", nama: "Budi", nilaiTugas: 75, nilaiUTS: 80, nilaiUAS: 85 },
  { nim: "246003", nama: "Citra", nilaiTugas: 90, nilaiUTS: 88, nilaiUAS: 92 },
  { nim: "246004", nama: "Dina", nilaiTugas: 80, nilaiUTS: 75, nilaiUAS: 85 },
  { nim: "246005", nama: "Eko", nilaiTugas: 70, nilaiUTS: 78, nilaiUAS: 80 },
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// ==========================================
// 2. INPUT DAN VALIDASI
// ==========================================

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
    } else {
      console.log("Input tidak valid. Masukkan angka 0 sampai 100.");
    }
  }
}

async function inputNIM(): Promise<string> {
  while (true) {
    const nim = (await tanya("Masukkan NIM: ")).trim();

    if (nim === "" || !/^\d+$/.test(nim)) {
      console.log("NIM harus diisi dan hanya boleh berisi angka.");
    } else if (nim.length < 5) {
      console.log("NIM minimal terdiri dari 5 angka.");
    } else {
      return nim;
    }
  }
}

async function inputNama(): Promise<string> {
  while (true) {
    const nama = (await tanya("Masukkan nama: ")).trim();

    if (nama === "" || !/[a-zA-Z]/.test(nama)) {
      console.log("Nama tidak boleh kosong dan harus mengandung huruf.");
    } else {
      return nama;
    }
  }
}

// ==========================================
// 3. FUNGSI PERHITUNGAN
// ==========================================

function hitungNilaiAkhir(mahasiswa: Mahasiswa): number {
  let nilaiAkhir = mahasiswa.nilaiTugas * 30;
  nilaiAkhir += mahasiswa.nilaiUTS * 30;
  nilaiAkhir += mahasiswa.nilaiUAS * 40;
  nilaiAkhir /= 100;

  return nilaiAkhir;
}

function tentukanPredikat(nilai: number): string {
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

// ==========================================
// 4. READ - TAMPILKAN SELURUH MAHASISWA
// ==========================================

function tampilkanMahasiswa(): void {
  console.log("\n===== DAFTAR MAHASISWA =====");

  if (daftarMahasiswa.length === 0) {
    console.log("Belum ada data mahasiswa.");
    return;
  }

  for (const mahasiswa of daftarMahasiswa) {
    const nilaiAkhir = hitungNilaiAkhir(mahasiswa);

    console.log("----------------------------------");
    console.log(`NIM          : ${mahasiswa.nim}`);
    console.log(`Nama         : ${mahasiswa.nama}`);
    console.log(`Nilai Tugas  : ${mahasiswa.nilaiTugas}`);
    console.log(`Nilai UTS    : ${mahasiswa.nilaiUTS}`);
    console.log(`Nilai UAS    : ${mahasiswa.nilaiUAS}`);
    console.log(`Nilai Akhir  : ${nilaiAkhir.toFixed(2)}`);
    console.log(`Predikat     : ${tentukanPredikat(nilaiAkhir)}`);
  }

  console.log("----------------------------------");
}

// ==========================================
// 5. CREATE - TAMBAH MAHASISWA
// ==========================================

async function tambahMahasiswa(): Promise<void> {
  console.log("\n===== TAMBAH MAHASISWA =====");

  const nim = await inputNIM();

  const nimTerdaftar = daftarMahasiswa.some(
    (mahasiswa) => mahasiswa.nim === nim
  );

  if (nimTerdaftar) {
    console.log("NIM sudah terdaftar.");
    return;
  }

  const nama = await inputNama();
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

// ==========================================
// 6. SEARCH - CARI MAHASISWA
// ==========================================

async function cariMahasiswa(): Promise<void> {
  console.log("\n===== CARI MAHASISWA =====");

  const nim = (await tanya("Masukkan NIM yang dicari: ")).trim();

  const mahasiswa = daftarMahasiswa.find(
    (data) => data.nim === nim
  );

  if (mahasiswa !== undefined) {
    console.log("\nData mahasiswa ditemukan.");

    const nilaiAkhir = hitungNilaiAkhir(mahasiswa);

    // Nested if tiga tingkat
    if (nilaiAkhir >= 0) {
      if (nilaiAkhir >= 75) {
        if (mahasiswa.nilaiUAS >= 75) {
          console.log("Mahasiswa dinyatakan lulus dengan nilai UAS baik.");
        } else {
          console.log("Nilai akhir lulus, tetapi nilai UAS perlu ditingkatkan.");
        }
      } else {
        console.log("Mahasiswa belum mencapai nilai kelulusan.");
      }
    }

    console.log(`NIM         : ${mahasiswa.nim}`);
    console.log(`Nama        : ${mahasiswa.nama}`);
    console.log(`Nilai Akhir : ${nilaiAkhir.toFixed(2)}`);
    console.log(`Predikat    : ${tentukanPredikat(nilaiAkhir)}`);
  } else {
    console.log("Mahasiswa tidak ditemukan.");
  }
}

// ==========================================
// 7. UPDATE - UBAH DATA MAHASISWA
// ==========================================

async function ubahMahasiswa(): Promise<void> {
  console.log("\n===== UBAH DATA MAHASISWA =====");

  const nim = (await tanya("Masukkan NIM mahasiswa: ")).trim();

  const mahasiswa = daftarMahasiswa.find(
    (data) => data.nim === nim
  );

  if (mahasiswa === undefined) {
    console.log("Mahasiswa tidak ditemukan.");
    return;
  }

  console.log("Masukkan data baru.");

  mahasiswa.nama = await inputNama();
  mahasiswa.nilaiTugas = await inputNilai("Nilai Tugas");
  mahasiswa.nilaiUTS = await inputNilai("Nilai UTS");
  mahasiswa.nilaiUAS = await inputNilai("Nilai UAS");

  console.log("\nData mahasiswa berhasil diperbarui!");
}

// ==========================================
// 8. DELETE - HAPUS MAHASISWA
// ==========================================

async function hapusMahasiswa(): Promise<void> {
  console.log("\n===== HAPUS MAHASISWA =====");

  const nim = (await tanya("Masukkan NIM mahasiswa: ")).trim();

  const indeks = daftarMahasiswa.findIndex(
    (mahasiswa) => mahasiswa.nim === nim
  );

  if (indeks === -1) {
    console.log("Mahasiswa tidak ditemukan.");
    return;
  }

  const konfirmasi = (await tanya("Yakin ingin menghapus data? (y/n): "))
    .trim()
    .toLowerCase();

  if (konfirmasi === "y") {
    daftarMahasiswa.splice(indeks, 1);
    console.log("Data mahasiswa berhasil dihapus!");
  } else {
    console.log("Penghapusan dibatalkan.");
  }
}

// ==========================================
// 9. FILTER - FILTER MAHASISWA LULUS
// ==========================================

function filterMahasiswa(): void {
  console.log("\n===== MAHASISWA YANG LULUS =====");

  const mahasiswaLulus = daftarMahasiswa.filter(
    (mahasiswa) => hitungNilaiAkhir(mahasiswa) >= 75
  );

  if (mahasiswaLulus.length === 0) {
    console.log("Tidak ada mahasiswa yang lulus.");
    return;
  }

  for (const mahasiswa of mahasiswaLulus) {
    console.log(
      `${mahasiswa.nim} - ${mahasiswa.nama} - Nilai: ${hitungNilaiAkhir(mahasiswa).toFixed(2)}`
    );
  }
}

// ==========================================
// 10. STATISTIK NILAI MAHASISWA
// ==========================================

function statistikNilai(): void {
  console.log("\n===== STATISTIK NILAI MAHASISWA =====");

  const jumlahMahasiswa = daftarMahasiswa.length;

  if (jumlahMahasiswa === 0) {
    console.log("Belum ada data untuk dihitung.");
    return;
  }

  let totalNilai = 0;
  let nilaiTertinggi = 0;
  let nilaiTerendah = 100;
  let jumlahLulus = 0;
  let jumlahTidakLulus = jumlahMahasiswa;
  let jumlahNIMGanjil = 0;

  // Perulangan for
  for (let i = 0; i < daftarMahasiswa.length; i++) {
    const mahasiswa = daftarMahasiswa[i];
    const nilaiAkhir = hitungNilaiAkhir(mahasiswa);

    totalNilai += nilaiAkhir;

    if (nilaiAkhir > nilaiTertinggi) {
      nilaiTertinggi = nilaiAkhir;
    }

    if (nilaiAkhir < nilaiTerendah) {
      nilaiTerendah = nilaiAkhir;
    }

    if (nilaiAkhir >= 75) {
      jumlahLulus += 1;
      jumlahTidakLulus -= 1;
    }

    // Operator modulus untuk memeriksa NIM ganjil
    const digitTerakhir = Number(mahasiswa.nim.slice(-1));

    if (digitTerakhir % 2 !== 0) {
      jumlahNIMGanjil += 1;
    }
  }

  let rataRata = totalNilai / jumlahMahasiswa;

  let persentaseLulus = jumlahLulus;
  persentaseLulus *= 100;
  persentaseLulus /= jumlahMahasiswa;

  const selisihNilai = nilaiTertinggi - nilaiTerendah;

  console.log(`Jumlah Mahasiswa  : ${jumlahMahasiswa}`);
  console.log(`Rata-rata Nilai   : ${rataRata.toFixed(2)}`);
  console.log(`Nilai Tertinggi   : ${nilaiTertinggi.toFixed(2)}`);
  console.log(`Nilai Terendah    : ${nilaiTerendah.toFixed(2)}`);
  console.log(`Selisih Nilai     : ${selisihNilai.toFixed(2)}`);
  console.log(`Jumlah Lulus      : ${jumlahLulus}`);
  console.log(`Jumlah Tidak Lulus: ${jumlahTidakLulus}`);
  console.log(`Persentase Lulus  : ${persentaseLulus.toFixed(2)}%`);
  console.log(`NIM Ganjil        : ${jumlahNIMGanjil}`);
}

// ==========================================
// 11. MENU UTAMA
// ==========================================

async function menuUtama(): Promise<void> {
  let berjalan: boolean = true;

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
    console.log("7. Filter mahasiswa lulus");
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

      case "7":
        filterMahasiswa();
        break;

      case "0":
        console.log("\nTerima kasih telah menggunakan program.");
        berjalan = false;
        break;

      default:
        console.log("Pilihan tidak valid. Silakan pilih menu 0 sampai 7.");
        break;
    }
  }
}

// ==========================================
// 12. MENJALANKAN PROGRAM
// ==========================================

menuUtama()
  .then(() => {
    rl.close();
  })
  .catch((error: unknown) => {
    console.error("Terjadi kesalahan:", error);
    rl.close();
  });