document.getElementById("checkAge").addEventListener("click", async function () {
  var birthdate = new Date(document.getElementById("tanggal_lahir").value);
  var today = new Date();
  var age = today.getFullYear() - birthdate.getFullYear();

  var nama = document.getElementById("nama").value;
  var tanggalLahir = document.getElementById("tanggal_lahir").value;
  var namaOrangTua = document.getElementById("nama_orang_tua").value;
  var alamat = document.getElementById("alamat").value;
  var email = document.getElementById("email").value;
  var noTelepon = document.getElementById("no_telepon").value;
  var kelas = document.querySelector("select[name='kelas']").value;

  var data = {
    username: nama,
    password: namaOrangTua,
    nama: nama,
    tanggalLahir: tanggalLahir,
    namaOrangTua: namaOrangTua,
    alamat: alamat,
    email: email,
    noTelepon: noTelepon,
    kelas: kelas,
    jenis_kelamin: document.querySelector("input[name='jenis_kelamin']:checked").value,
  };

  // Simpan data ke Local Storage
  var localRegistrations = JSON.parse(localStorage.getItem("localRegistrations")) || [];
  localRegistrations.push(data);
  localStorage.setItem("localRegistrations", JSON.stringify(localRegistrations));

  if (navigator.onLine) {
    try {
      const response = await fetch("https://informatikaunwaha.com/tugasapi/naufal/apisekolah/api.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      setTimeout(2000);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log(result);

      // Menghapus data yang sudah terkirim ke server dari Local Storage
      const existingDataIndex = localRegistrations.findIndex((existingData) => existingData.username === data.username);
      if (existingDataIndex !== -1) {
        localRegistrations.splice(existingDataIndex, 1);
        localStorage.setItem("localRegistrations", JSON.stringify(localRegistrations));
      }

      if (age < 13) {
        Swal.fire({
          title: "Konfirmasi",
          text: "Maaf, usia Anda kurang dari 13 tahun. Apakah Anda yakin ingin melanjutkan?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Lanjut",
          cancelButtonText: "Tidak",
        }).then((result) => {
          if (result.isConfirmed) {
            // Tampilkan informasi pendaftaran
            Swal.fire({
              title: "Informasi Pendaftaran",
              html: "Nama Pengguna (Username): " + data.username,
              icon: "info",
            }).then(() => {
              // Redirect ke halaman "tes.html"
              localStorage.setItem("halaman", "tes.html");
              halamanini = localStorage.getItem("halaman");
              $("#blokkonten").load(halamanini);
              // Simpan data di localStorage
              localStorage.setItem("pendaftaranData", JSON.stringify(data));
            });
          } else {
            Swal.fire("Dibatalkan", "Anda memilih untuk tidak melanjutkan.", "error");
          }
        });
      } else {
        // Tampilkan informasi pendaftaran
        Swal.fire({
          title: "Informasi Pendaftaran",
          html: "Nama Pengguna (Username): " + data.username,
          icon: "info",
        }).then(() => {
          localStorage.setItem("halaman", "tes.html");
          halamanini = localStorage.getItem("halaman");
          $("#blokkonten").load(halamanini);
          // Redirect ke halaman "pembayaran.html"
          // window.location.href = "tes.html";
          // Simpan data di localStorage
          localStorage.setItem("pendaftaranData", JSON.stringify(data));
        });
      }
    } catch (error) {
      console.error("Error:", error);
      // Menampilkan alert untuk kesalahan yang terjadi
      Swal.fire({
        title: "Kesalahan",
        text: "Terjadi kesalahan saat mengirim data. Mohon cek koneksi internet Anda.",
        icon: "error",
      });
    }
  }
});
