var data = JSON.parse(localStorage.getItem("pendaftaranData"));

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
    var pesanHasil = lulus ? "Selamat, Anda lulus! Silahkan melakukan pembayaran pada menu pembayaran!" : "Maaf, Anda tidak lulus.";
    if (jawabanBenar > 4) {
      $.ajax({
        type: "POST",
        url: "https://informatikaunwaha.com/tugasapi/naufal/siswa.php",
        data: {
          nisns: randomInteger(900,99999),
          nama: data.nama,
          kelas: data.kelas,
          alamat: data.alamat,
          tglLahir: data.tanggalLahir,
        },
        dataType: "JSON",
        success: function (response) {
          alert(pesanHasil);
          console.log(response);
          localStorage.clear()
          JSON.parse(localStorage.getItem("pendaftaranData"));
          document.getElementById("namaPengguna").textContent = pendaftaranData.username;
          
        },
      });
    } else {
      alert(pesanHasil);
      localStorage.setItem("halaman", "form.html");
      halamanini = localStorage.getItem("halaman");
      window.location = "index.html";
    }
  } else {
    alert("Data pendaftaran tidak ditemukan.");
  }
}