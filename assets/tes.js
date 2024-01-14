var data = JSON.parse(localStorage.getItem("pendaftaranData"));
var kode_regis = randomInteger(99999, 99999999);
var isijawaban = 0;
$("input[type='radio']").click(function () {
  isijawaban++;
  if (isijawaban > 3) {
    $("#kirimHasilTes").attr("disabled", false);
  }
});
var pendaftaranData = JSON.parse(localStorage.getItem("pendaftaranData"));
document.getElementById("namaPengguna").textContent = pendaftaranData.username;

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function kirim() {
  if (pendaftaranData) {
    var soalContainer = document.getElementById("soalContainer");
    var kirimHasilTesButton = document.getElementById("kirimHasilTes");
    var jawabanA = document.querySelector("input[name='jawabanA']:checked").value;
    var jawabanB = document.querySelector("input[name='jawabanB']:checked").value;
    var jawabanC = document.querySelector("input[name='jawabanC']:checked").value;
    var jawabanD = document.querySelector("input[name='jawabanD']:checked").value;
    var jawabanE = document.querySelector("input[name='jawabanE']:checked").value;
    // Hitung jumlah jawaban yang benar
    var jawabanBenar = 0;
    if (jawabanA === "A") {
      jawabanBenar++;
    }
    if (jawabanB === "A") {
      jawabanBenar++;
    }
    if (jawabanC === "A") {
      jawabanBenar++;
    }
    if (jawabanD === "B") {
      jawabanBenar++;
    }
    if (jawabanE === "B") {
      jawabanBenar++;
    }

    // Menentukan apakah pengguna lulus atau tidak
    var lulus = jawabanBenar >= 4;
    var pesanHasil = lulus ? "" : "Maaf, Anda tidak lulus.";
    $("#modalId").modal("show");
    $("#kodereg").text(kode_regis);

    $("#dataregis").append(`
    <table class="table table-bordered">
    <tbody>
      <tr>
        <td>Nama Lengkap</td>
        <td>${data.nama}</td>
      </tr>
      <tr>
        <td>Tanggal Lahir</td>
        <td>${data.tanggalLahir}</td>
      </tr>
      <tr>
        <td>Alamat</td>
        <td>${data.alamat}</td>
      </tr>
      <tr>
        <td>Kelas Yang Di Pilih</td>
        <td>${data.kelas}</td>
      </tr>
    </tbody>
  </table>
    
    `);

    if (jawabanBenar > 4) {
      $.ajax({
        type: "POST",
        url: "https://informatikaunwaha.com/tugasapi/naufal/siswa.php",
        data: {
          nisns: randomInteger(900, 99999),
          koderegister: kode_regis,
          nama: data.nama,
          kelas: data.kelas,
          alamat: data.alamat,
          tglLahir: data.tanggalLahir,
          status: 0,
        },
        dataType: "JSON",
        success: function (response) {
          //     alert(pesanHasil);
          console.log(response);
          localStorage.clear();
          JSON.parse(localStorage.getItem("pendaftaranData"));
          document.getElementById("namaPengguna").textContent = pendaftaranData.username;
        },
      });
    } else {
      // alert(pesanHasil);
      // localStorage.setItem("halaman", "form.html");
      // halamanini = localStorage.getItem("halaman");
      // window.location = "index.html";
    }
  } else {
    alert("Data pendaftaran tidak ditemukan.");
  }
}

function direk() {
  localStorage.setItem("halamanakhir", '{"halaman":"pembayaran/pembayaran.html","id":"#registrasi"}');
  window.location.reload();
}
