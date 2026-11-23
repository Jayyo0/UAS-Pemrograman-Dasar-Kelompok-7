import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("Hello console!");

rl.question("Masukkan nama kamu: ", (nama: string) => {
  console.log("Halo, " + nama + "! Project berhasil dijalankan.");
  rl.close();
});