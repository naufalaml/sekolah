    function uploadnilaiakumulasi(event, nisn) {
        let url
        let meantugas = document.getElementById("meantugas");
        let meanuts = document.getElementById("meanuts");
        let meanuas = document.getElementById("meanuas");
        let meanuh = document.getElementById("meanuh");
        let meanpr = document.getElementById("meanpr");
        let meanhadir = document.getElementById("meanhadir");
        let meansakit = document.getElementById("meansakit");
        let meanizin = document.getElementById("meanizin");
        let meanalpha = document.getElementById("meanalpha");
        let meansikap = document.getElementById("meansikap");
        if (event == "harian") {
            url = "https://informatikaunwaha.com/tugasapi/sekolah/apisekolah/apinilaimingguan.php";
        } else if (event == "mingguan") {
            meantugas = document.getElementById("meantugas"+event);
            meanuts = document.getElementById("meanuts"+event);
            meanuas = document.getElementById("meanuas"+event);
            meanuh = document.getElementById("meanuh"+event);
            meanpr = document.getElementById("meanpr"+event);
            meanhadir = document.getElementById("meanhadir"+event);
            meansakit = document.getElementById("meansakit"+event);
            meanizin = document.getElementById("meanizin"+event);
            meanalpha = document.getElementById("meanalpha"+event);
            meansikap = document.getElementById("meansikap"+event);
            url = "https://informatikaunwaha.com/tugasapi/sekolah/apisekolah/apinilaibulanan.php";
        } else if (event == "bulanan") {
            url = "https://informatikaunwaha.com/tugasapi/sekolah/apisekolah/apinilaisemester.php";
        }
        let datatoupload = {
            nisn: nisn,
            mingguke: mingguKe,
            bulanke: month,
            semesterke: Smstr,
            tahunajaran: tahunajaran,
            kodeGuru: kodeGuru,
            mataPelajaran: mataPelajaran,
            jenisPenilaian: [],
            nilai: [],
            hadir: meanhadir.innerText,
            sakit: meansakit.innerText,
            izin: meanizin.innerText,
            alpha: meanalpha.innerText,
            nilaiSikap: meansikap.innerText,
        }
        let elements
        let meanElement 
        if (event == "harian") {
            elements = document.querySelectorAll(".jenisPenilaian");
        } else if (event == "mingguan") {
            elements = document.querySelectorAll(".jenisPenilaianmingguan");
        }else if(event == "bulanan"){
            elements = document.querySelectorAll(".jenisPenilaianbulanan");
        }
        elements.forEach(function (element, i) {
            if (event == "harian") {
                meanElement = document.getElementById("mean" + element.innerText);
            } else if (event == "mingguan") {
                meanElement = document.getElementById("mean" + element.innerText + event);
            } else if (event == "bulanan") {
                meanElement = document.getElementById("mean" + element.innerText + event);
            }

            if (meanElement) {
                if (element.innerText == "tugas" || element.innerText == "uh" || element.innerText == "uts" || element.innerText == "uas") {
                    datatoupload.nilai.push(meanElement.innerText);
                    datatoupload.jenisPenilaian.push(element.innerText);
                }
            } else {
            }
        });


        $.ajax({
            url: url,
            type: "POST",
            data: { fungsi: "UPLOAD", ...datatoupload }, // Menambahkan fungsi dan data yang akan ditambahkan
            success: function (response) {
                let message = response.msg
                shownotif(message, "success");
                readapi();
            },
            error: function (error) {
                let message = "-";
                if (JSON.stringify(error.responseText).includes("success")) {
                    if (JSON.stringify(error.responseText).includes("Berhasil Mengubah Nilai")) {
                        message = "Berhasil Mengubah Nilai"
                    }
                    if (JSON.stringify(error.responseText).includes("Berhasil Menambah Nilai")) {
                        message = "Berhasil Menambah Nilai"
                    }
                    shownotif(message, "success");
                } else {
                    if (JSON.stringify(error.responseText).includes("Gagal Mengubah Nilai, Periksa Kembali Isian Anda")) {
                        message = "Gagal Mengubah Nilai, Periksa Kembali Isian Anda"
                    }
                    if (JSON.stringify(error.responseText).includes("Gagal Menambahkan Nilai, Periksa Kembali Isian Anda")) {
                        message = "Gagal Menambahkan Nilai, Periksa Kembali Isian Anda"
                    }
                    shownotif(message, "error");
                }

            }
        })
    }
    if (typeof tabelsiswa === 'undefined') {
        let tabelsiswa
        let tablenilaisiswa
    }
    tabelsiswa = $('#tabelsiswa').DataTable({
        "lengthMenu": [5, 10, 25, 50],
        "pageLength": 5
    });
    tablenilaisiswa = $('#tablenilaisiswa').DataTable();
    readapi();
    //READ
    function readapi() {
        let url = "https://informatikaunwaha.com/tugasapi/sekolah/apisekolah/apisiswa.php";
        $.getJSON(url, { fungsi: "FILTERKELAS", kelas: kelas }, function (result) {
            if (result !== 0) {
                console.log(result)
                tabelsiswa.clear().draw();
                $.each(result, function (i, kolom) {
                    let index = i + 1;
                    let nisn = kolom.nisn;
                    let nama = kolom.nama;
                    let kelas = kolom.kelas;
                    let btnberinilai = '<a href="javascript:void(0)" id="beriNilai" class="mx-1 btn btn-success" onclick="showForm(' + nisn + ',\'' + nama + '\')">beri nilai</a>'
                    let btnshowNilai = '<a href="javascript:void(0)" id="shownilai" class="mx-1 btn btn-info" data-bs-toggle="modal" data-bs-target="#modalnilai" onclick="readapinilai(' + nisn + ',\'' + nama + '\')">Lihat nilai</a>'

                    tabelsiswa.row.add([index, nisn, nama, kelas, btnberinilai + btnshowNilai]).draw();
                })
            } else {
                tabelsiswa.clear().draw();
            }
        })
    }

    function readapinilaiakumulasi(event, nisn) {
        let url
        let btnuploadakumulasinilai = document.getElementById("btnuploadakumulasinilai");
        let titlenilaiakumulasimodal = document.getElementById("titlenilaiakumulasimodal");
        let isitableakumulainilaisiswa = document.getElementById("isitableakumulainilaisiswa");
        let nilaitabelakumulasi = document.getElementById("nilaitabelakumulasi");
        let eventnilaiakumulasi
        if (navigator.onLine) {
            if (event == "mingguan") {
                url = "https://informatikaunwaha.com/tugasapi/sekolah/apisekolah/apinilaimingguan.php"
                btnuploadakumulasinilai.innerHTML = '<td colspan="3"><button class="btn btn-lg btn-primary float-end" onclick="uploadnilaiakumulasi(\'mingguan\',' + nisn + ')">upload</button></td>'
                titlenilaiakumulasimodal.innerHTML = "akumulasi nilai mingguan"
                eventnilaiakumulasi = "mingguke"
            } else if (event == "bulanan") {
                url = "https://informatikaunwaha.com/tugasapi/sekolah/apisekolah/apinilaibulanan.php"
                btnuploadakumulasinilai.innerHTML = '<td colspan="3"><button class="btn btn-lg btn-primary float-end" onclick="uploadnilaiakumulasi(\'bulanan\',' + nisn + ')">upload</button></td>'
                titlenilaiakumulasimodal.innerHTML = "akumulasi nilai bulanan"
                eventnilaiakumulasi = "bulanke"
            } else if (event == "semester") {
                url = "https://informatikaunwaha.com/tugasapi/sekolah/apisekolah/apinilaisemester.php"
                btnuploadakumulasinilai.innerHTML = ""
                titlenilaiakumulasimodal.innerHTML = "akumulasi nilai semester"
                eventnilaiakumulasi = "semesterke"
            }
        } else {
            if (event == "mingguan") {
                url = "https://informatikaunwaha.com/tugasapi/sekolah/apisekolah/apinilaimingguan.php"
                btnuploadakumulasinilai.innerHTML = '<td colspan="3"><button class="btn btn-lg btn-primary float-end" onclick="saveMeanToLocalStorage(\'UPLOAD\',\'mingguan\',' + nisn + ')">upload</button></td>'
                titlenilaiakumulasimodal.innerHTML = "akumulasi nilai mingguan"
                eventnilaiakumulasi = "mingguke"
            } else if (event == "bulanan") {
                url = "https://informatikaunwaha.com/tugasapi/sekolah/apisekolah/apinilaibulanan.php"
                btnuploadakumulasinilai.innerHTML = '<td colspan="3"><button class="btn btn-lg btn-primary float-end" onclick="saveMeanToLocalStorage(\'UPLOAD\',\'bulanan\',' + nisn + ')">upload</button></td>'
                titlenilaiakumulasimodal.innerHTML = "akumulasi nilai bulanan"
                eventnilaiakumulasi = "bulanke"
            } else if (event == "semester") {
                url = "https://informatikaunwaha.com/tugasapi/sekolah/apisekolah/apinilaisemester.php"
                btnuploadakumulasinilai.innerHTML = ""
                titlenilaiakumulasimodal.innerHTML = "akumulasi nilai semester"
                eventnilaiakumulasi = "semesterke"
            }
        }
        let x
        // console.log("tahunajaran",tahunajaran)
        $.getJSON(url, { fungsi: "FILTER", nisn: nisn, mingguke: mingguKe, bulanke: month, semesterke: Smstr, tahunajaran: tahunajaran, kodeGuru: kodeGuru, mataPelajaran: mataPelajaran }, function (result) {
            if (result !== 0) {
                nilaitabelakumulasi.innerHTML = ""
                $.each(result, function (i, kolom) {
                    if (i === "rata2") {
                        return; // Skip rata2
                    }
                    if (event == "mingguan") {
                        x = kolom.mingguke
                    } else if (event == "bulanan") {
                        x = kolom.bulanke
                    } else if (event == "semester") {
                        x = kolom.semesterke
                    }
                    // console.log("index ke",i);
                    // console.log("mingguke",kolom);
                    nilaitabelakumulasi.innerHTML += '<tr>\
                            <td colspan="1">'+ x + '</td>\
                            <td colspan="1">'+ kolom.jenisPenilaian + '</td>\
                            <td colspan="1">'+ kolom.nilai + '</td>\
                        </tr > '
                })
                let rata2 = result["rata2"];
                if (rata2) {
                    $.each(rata2, function (jenisPenilaian, mean) {
                        let nilai;
                        if (mean >= 90 && mean <= 100) {
                            nilai = "A"
                        } else if (mean >= 80 && mean <= 89) {
                            nilai = "B"
                        } else if (mean >= 70 && mean <= 79) {
                            nilai = "B-"
                        } else if (mean >= 60 && mean <= 69) {
                            nilai = "C"
                        } else if (mean >= 0 && mean <= 59) {
                            nilai = "D"
                        } else {
                            nilai = "-";
                        }
                        if (jenisPenilaian == "sakit" || jenisPenilaian == "izin" || jenisPenilaian == "alpha") {
                            if (mean >= 0 && mean <= 3) {
                                nilai = "A"
                            } else if (mean >= 4 && mean <= 6) {
                                nilai = "B"
                            } else if (mean >= 7 && mean <= 9) {
                                nilai = "C"
                            } else if (mean >= 10 && mean <= 12) {
                                nilai = "D"
                            } else if (mean >= 12 && mean <= 30) {
                                nilai = "E"
                            } else {
                                nilai = "-";
                            }
                        } else if (jenisPenilaian == "hadir") {
                            // if (mean >= 0 && mean <= 15) {
                            //     nilai = "E"
                            // } else if (mean >= 16 && mean <= 18) {
                            //     nilai = "D"
                            // } else if (mean >= 19 && mean <= 21) {
                            //     nilai = "C"
                            // } else if (mean >= 22 && mean <= 24) {
                            //     nilai = "B"
                            // } else if (mean >= 25 && mean <= 30) {
                            //     nilai = "A"
                            // } else {
                            nilai = "-";
                            // }
                        }

                        isitableakumulainilaisiswa.innerHTML += '<tr>\
                                <td class="jenisPenilaian'+event+'"> '+ jenisPenilaian + '</td >\
                        <td id="mean'+ jenisPenilaian + event + '">' + mean + '</td>\
                        <td >'+ nilai + '</td>\
                    </tr > '
                    });
                }
            }
        })
    }
    function cleartblakumulasinilai() {
        let isitableakumulainilaisiswa = document.getElementById("isitableakumulainilaisiswa");
        isitableakumulainilaisiswa.innerHTML = ""
    }
    function readapinilai(nisn, nama) {
        $("#titlenilaimodal").html("nilai " + nama)
        let btnuploadmingguan = document.getElementById("btnuploadmingguan");
        let btnlihatnilaiakumulasi = document.getElementById("btnlihatnilaiakumulasi");
        let isibtnakumulasi
        isibtnakumulasi = '<button class="btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modalnilaiakumulasi" onclick="readapinilaiakumulasi(\'mingguan\',' + nisn + ')">nilai minggu ini</button>\
            <button button class="btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modalnilaiakumulasi" onclick = "readapinilaiakumulasi(\'bulanan\','+ nisn + ')" > nilai bulan ini</button >\
                <button class="btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modalnilaiakumulasi" onclick="readapinilaiakumulasi(\'semester\','+ nisn + ')">nilai semester ini</button>'
        if (navigator.onLine) {
            btnuploadmingguan.innerHTML = '<td colspan="3"><button class="btn btn-lg btn-primary float-end" onclick="uploadnilaiakumulasi(\'harian\',' + nisn + ')">upload</button></td>'
        } else {
            btnuploadmingguan.innerHTML = '<td colspan="3"><button class="btn btn-lg btn-primary float-end" onclick="saveMeanToLocalStorage(\'UPLOAD\',\'harian\',' + nisn + ')">upload</button></td>'
        }
        btnlihatnilaiakumulasi.innerHTML = isibtnakumulasi;
        let url = "https://informatikaunwaha.com/tugasapi/sekolah/apisekolah/apinilaiharian.php";
        $.getJSON(url, { fungsi: "FILTER", nisn: nisn, mingguke: mingguKe, kodeGuru: kodeGuru, mataPelajaran: mataPelajaran }, function (result) {
            if (result !== 0) {
                tablenilaisiswa.clear().draw();
                $.each(result, function (i, kolom) {
                    if (i === "rata2") {
                        return; // Skip rata2
                    }
                    let index = parseInt(i) + 1;
                    let id = kolom.id;
                    let jenisPenilaian = kolom.jenisPenilaian;
                    let nilaiAkademik = kolom.nilai;
                    let kehadiran = kolom.kehadiran;
                    let nilaiSikap = kolom.nilaiSikap;
                    let note = kolom.note;
                    let btneditnilai = '<button  id="editnilai" class="mx-1 btn btn-warning" data-bs-target="#modaledit" data-bs-toggle="modal" data-bs-dismiss="modal" onclick="editapi(' + nisn + ',' + id + ')">edit</button>'
                    let btndeletenilai = '<button  id="deletenilai" class="mx-1 btn btn-danger" data-bs-toggle="modal" data-bs-target="#modalnilai" onclick="deleteapi(' + id + ')">hapus</button>'
                    let btnaksi = '<div class="d-flex">' + btneditnilai + btndeletenilai + '</div>'
                    tablenilaisiswa.row.add([index, id, jenisPenilaian, nilaiAkademik, kehadiran, nilaiSikap, note, btnaksi]).draw();
                })

                let rata2 = result["rata2"];
                let meantbnilaiharian = document.getElementById("meantbnilaiharian");
                meantbnilaiharian.innerHTML = ""
                let tableRow
                if (rata2) {
                    let ke = 1;
                    // Iterasi melalui jenis penilaian (tugas, uh, uts, uas, pr)
                    $.each(rata2, function (jenisPenilaian, mean) {
                        let nilai;
                        if (mean >= 90 && mean <= 100) {
                            nilai = "A"
                        } else if (mean >= 80 && mean <= 89) {
                            nilai = "B"
                        } else if (mean >= 70 && mean <= 79) {
                            nilai = "B-"
                        } else if (mean >= 60 && mean <= 69) {
                            nilai = "C"
                        } else if (mean >= 0 && mean <= 59) {
                            nilai = "D"
                        } else {
                            nilai = "-";
                        }
                        if (jenisPenilaian == "sakit" || jenisPenilaian == "izin" || jenisPenilaian == "alpha") {
                            if (mean >= 0 && mean <= 3) {
                                nilai = "A"
                            } else if (mean >= 4 && mean <= 6) {
                                nilai = "B"
                            } else if (mean >= 7 && mean <= 9) {
                                nilai = "C"
                            } else if (mean >= 10 && mean <= 12) {
                                nilai = "D"
                            } else if (mean >= 12 && mean <= 30) {
                                nilai = "E"
                            } else {
                                nilai = "-";
                            }
                        } else if (jenisPenilaian == "hadir") {
                            // if (mean >= 0 && mean <= 15) {
                            //     nilai = "E"
                            // } else if (mean >= 16 && mean <= 18) {
                            //     nilai = "D"
                            // } else if (mean >= 19 && mean <= 21) {
                            //     nilai = "C"
                            // } else if (mean >= 22 && mean <= 24) {
                            //     nilai = "B"
                            // } else if (mean >= 25 && mean <= 30) {
                            //     nilai = "A"
                            // } else {
                            nilai = "-";
                            // }
                        }

                        meantbnilaiharian.innerHTML += '<tr>\
                                <td class="jenisPenilaian"> '+ jenisPenilaian + '</td >\
                        <td id="mean'+ jenisPenilaian + '">' + mean + '</td>\
                        <td >'+ nilai + '</td>\
                    </tr > '
                    });
                }

            } else {
                tablenilaisiswa.clear().draw();
            }
        })
    }
    //CREATE
    function createapi() {
        let nisnform = document.getElementById("nisnform").value
        let tanggal = document.getElementById("tanggal").value
        let jenisPenilaianForm = document.getElementById("jenisPenilaianForm").value
        let nilaiAkademik = document.getElementById("nilaiAkademik").value
        let Kehadiran = document.getElementById("Kehadiran").value
        let sikap = document.getElementById("sikap").value
        let noteGuru = document.getElementById("noteGuru").value

        let dataToInsert = {
            nisn: nisnform,
            mingguke: mingguKe,
            tahunajaran: tahunajaran,
            kodeGuru: kodeGuru,
            mataPelajaran: mataPelajaran,
            bulanke: month,
            semesterke: Smstr,
            jenisPenilaian: jenisPenilaianForm,
            nilai: nilaiAkademik,
            kehadiran: Kehadiran,
            nilaiSikap: sikap,
            note: noteGuru,
        }
        let url = "https://informatikaunwaha.com/tugasapi/sekolah/apisekolah/apinilaiharian.php";
        $.ajax({
            url: url,
            type: "POST",
            data: { fungsi: "CREATE", ...dataToInsert }, // Menambahkan fungsi dan data yang akan ditambahkan
            success: function (response) {
                let message = response.msg;
                shownotif(message, "success");
                kosongform();
                hideForm();
                readapi();
            },
            error: function (error) {
                let message = "Gagal menambahkan data";
                shownotif(message, "error")
            }
        })
    }

    function editapi(nisn, id) {
        let url = "https://informatikaunwaha.com/tugasapi/sekolah/apisekolah/apinilaiharian.php";
        $.getJSON(url, { fungsi: "FILTERID", id: id }, function (result) {
            if (result !== 0) {
                tablenilaisiswa.clear().draw();
                $.each(result, function (i, kolom) {
                    $("#editnisn").val(nisn);
                    $("#editjenisPenilaian").val(kolom.jenisPenilaian);
                    $("#editnilaiAkademik").val(kolom.nilai);
                    $("#editkehadiran").val(kolom.kehadiran);
                    $("#editsikap").val(kolom.nilaiSikap);
                    $("#editnoteGuru").val(kolom.note);
                    let btnupdate = document.getElementById("btnupdate")
                    if (navigator.onLine) {
                        btnupdate.innerHTML = '<button id="btnuploadupdate" class="mx-1 btn btn-success" onclick="updateapi(' + kolom.id + ')">update</button>'
                    } else {
                        btnupdate.innerHTML = '<button id="btnuploadupdate" class="mx-1 btn btn-success" data-id="' + id + '" onclick="saveToLocalStorage(\'UPDATE\')">update</button>'
                    }
                })
            } else {
                kososngmodaledit();
            }
        })
    }
    function updateapi(id) {
        let editnisn = document.getElementById("editnisn").value
        let jenisPenilaian = document.getElementById("editjenisPenilaian").value
        let nilaiAkademik = document.getElementById("editnilaiAkademik").value
        let Kehadiran = document.getElementById("editkehadiran").value
        let sikap = document.getElementById("editsikap").value
        let noteGuru = document.getElementById("editnoteGuru").value

        let dataToInsert = {
            id: id,
            nisn: editnisn,
            jenisPenilaian: jenisPenilaian,
            kodeGuru: kodeGuru,
            mataPelajaran: mataPelajaran,
            nilai: nilaiAkademik,
            kehadiran: Kehadiran,
            nilaiSikap: sikap,
            note: noteGuru,
        }
        let url = "https://informatikaunwaha.com/tugasapi/sekolah/apisekolah/apinilaiharian.php";
        $.ajax({
            url: url,
            type: "POST",
            data: { fungsi: "UPDATE", ...dataToInsert },
            success: function (response) {
                let message = response.msg;
                shownotif(message, "success")
                kososngmodaledit();
                $("#modaledit").modal("hide");
                readapi();
            },
            error: function (error) {
                let message = error.msg;
                shownotif(message, "error")
                kososngmodaledit();
            }
        })
    }
    function deleteapi(id) {
        let url = "https://informatikaunwaha.com/tugasapi/sekolah/apisekolah/apinilaiharian.php";
        $.ajax({
            url: url,
            type: "POST",
            data: { fungsi: "DELETE", id: id }, // Menambahkan fungsi dan data yang akan ditambahkan
            success: function (response) {
                let message = response.msg;
                shownotif(message, "success")
                kosongform();
                readapi();
            },
            error: function (error) {
                let message = error.msg;
                shownotif(message, "error")
            }
        })
    }
    function showForm(nisn, nama) {
        chekconn();
        let namasiswainform = document.getElementById("namasiswainform")
        namasiswainform.innerHTML += nama;
        let nisntext = document.getElementById("nisntext")
        nisntext.innerHTML += nisn;

        let nisnform = document.getElementById("nisnform")
        nisnform.value = nisn;
        $("#formNilai").css("display", "flex");
        $("#actionbtnupdate").addClass("d-none")
        $("#actionbtnsave").removeClass("d-none")
    }
    function hideForm() {
        let namasiswainform = document.getElementById("namasiswainform")
        namasiswainform.innerHTML = "Nama Siswa : ";
        let nisntext = document.getElementById("nisntext")
        nisntext.innerHTML = "Nisn : ";
        let nisnform = document.getElementById("nisnform")
        nisnform.value = "";
        $("#formNilai").css("display", "none");
        kosongform();
    }
    function kososngmodaledit() {
        $("#editjenisPenilaianForm").val("");
        $("#editnilaiAkademik").val("");
        $("#editkehadiran").val("hadir");
        $("#editsikap").val("");
        $("#editnoteGuru").val("");
    }
    function kosongform() {
        let nisnform = document.getElementById("nisnform").value = "";
        let tanggal = document.getElementById("tanggal").value = "";
        let jenisPenilaianForm = document.getElementById("jenisPenilaianForm").value = "";
        let nilaiAkademik = document.getElementById("nilaiAkademik").value = "";
        let Kehadiran = document.getElementById("Kehadiran").value = "hadir";
        let sikap = document.getElementById("sikap").value = "";
        let noteGuru = document.getElementById("noteGuru").value = "";
        let nisntext = document.getElementById("nisntext")
        nisntext.innerHTML = "Nisn : ";
    }
    function closenotif() {
        $("#notif").removeClass("shownotif");
        $("#notif").addClass("hidenotif");
    }
    function shownotif(message, status) {
        if (status == "success") {
            $("#notif").addClass("notifsuccess");
            $("#btnclosenotif").addClass("success");
        } else {
            $("#notif").addClass("notiferror");
            $("#btnclosenotif").addClass("error");
        }
        $("#notif").removeClass("hidenotif");
        $("#notif").addClass("shownotif");
        let notifMsg = document.getElementById("notifMsg").innerHTML = message
        setTimeout(() => {
            $("#notif").removeClass("shownotif");
            $("#notif").addClass("hidenotif");
            $("#notif").removeClass("notifsuccess");
            $("#btnclosenotif").removeClass("success");
            $("#notif").removeClass("notiferror");
            $("#btnclosenotif").removeClass("error");
        }, 3000);
    }
    function chekconn() {
        if (navigator.onLine) {
            $("#btninsert").off("click")
            $("#btninsert").on("click", function () {
                createapi()
            })
        } else {
            $("#btninsert").off("click")
            $("#btninsert").on("click", function () {
                saveToLocalStorage("CREATE");
            })
        }
    }


    function synclstoapi() {
        // Mendapatkan semua kunci dari Local Storage
        var allKeys = Object.keys(localStorage);
        let dataToInsert;
        let url;
        // Iterasi melalui semua kunci di Local Storage
        allKeys.forEach(function (key) {
            // Mengecek apakah kunci mengandung fungsi yang sesuai
            if (key.includes("CREATE_") || key.includes("UPDATE_")) {
                // Mendapatkan data dari Local Storage
                var datalokal = JSON.parse(localStorage.getItem(key));

                // Menyiapkan data untuk dikirim
                dataToInsert = {
                    nisn: datalokal.nisn,
                    id: datalokal.id,
                    kodeGuru: datalokal.kodeGuru,
                    mataPelajaran: datalokal.mataPelajaran,
                    mingguke: datalokal.mingguKe,
                    bulanke: datalokal.bulanke,
                    semesterke: datalokal.semesterke,
                    tahunajaran: datalokal.tahunajaran,
                    jenisPenilaian: datalokal.jenisPenilaian,
                    nilai: datalokal.nilai,
                    kehadiran: datalokal.kehadiran,
                    nilaiSikap: datalokal.nilaiSikap,
                    note: datalokal.note,
                };
                migratetoserver(dataToInsert, key, datalokal.fungsi)
            } else if (key.includes("UPLOAD_")) {
                var datalokal = JSON.parse(localStorage.getItem(key));
                let datatoupload = {
                    nisn: datalokal.nisn,
                    mingguke: datalokal.mingguke,
                    bulanke: datalokal.bulanke,
                    semesterke: datalokal.semesterke,
                    tahunajaran: datalokal.tahunajaran,
                    kodeGuru: datalokal.kodeGuru,
                    mataPelajaran: datalokal.mataPelajaran,
                    jenisPenilaian: datalokal.jenisPenilaian,
                    nilai: datalokal.nilai,
                    hadir: datalokal.hadir,
                    sakit: datalokal.sakit,
                    izin: datalokal.izin,
                    alpha: datalokal.alpha,
                    nilaiSikap: datalokal.nilaiSikap,
                }
                if (key.includes("UPLOAD_harian")) {
                    url = "https://informatikaunwaha.com/tugasapi/sekolah/apisekolah/apinilaimingguan.php";
                    migratemeantoserver(datatoupload, key, url)
                } else if (key.includes("UPLOAD_mingguan")) {
                    url = "https://informatikaunwaha.com/tugasapi/sekolah/apisekolah/apinilaibulanan.php";
                    migratemeantoserver(datatoupload, key, url)
                } else if (key.includes("UPLOAD_bulanan")) {
                    url = "https://informatikaunwaha.com/tugasapi/sekolah/apisekolah/apinilaisemester.php";
                    migratemeantoserver(datatoupload, key, url)
                }
            }
        });
    }
    function migratemeantoserver(datatoupload, key, url) {
        if (datatoupload !== 0) {
            $.ajax({
                url: url,
                type: "POST",
                data: { fungsi: "UPLOAD", ...datatoupload },
                success: function (response) {
                    let message = response.msg;
                    shownotif(message, "success");
                    localStorage.removeItem(key);
                },
                error: function (error) {
                    let message = "-";
                    if (JSON.stringify(error.responseText).includes("success")) {
                        if (JSON.stringify(error.responseText).includes("Berhasil Mengubah Nilai")) {
                            message = "Berhasil Mengubah Nilai"
                        }
                        if (JSON.stringify(error.responseText).includes("Berhasil Menambah Nilai")) {
                            message = "Berhasil Menambah Nilai"
                        }
                        shownotif(message, "success");
                        localStorage.removeItem(key);
                        // console.log(JSON.stringify(error.responseText))
                    } else {
                        if (JSON.stringify(error.responseText).includes("Gagal Mengubah Nilai, Periksa Kembali Isian Anda")) {
                            message = "Gagal Mengubah Nilai, Periksa Kembali Isian Anda"
                        }
                        if (JSON.stringify(error.responseText).includes("Gagal Menambahkan Nilai, Periksa Kembali Isian Anda")) {
                            message = "Gagal Menambahkan Nilai, Periksa Kembali Isian Anda"
                        }
                        shownotif(message, "error");
                    }

                }
            });
        }
    }
    function migratetoserver(dataToInsert, key, fungsi) {
        if (dataToInsert !== 0) {
            var url = "https://informatikaunwaha.com/tugasapi/sekolah/apisekolah/apinilaiharian.php";
            $.ajax({
                url: url,
                type: "POST",
                data: { fungsi: fungsi, ...dataToInsert },
                success: function (response) {
                    let message = response.msg;
                    shownotif(message, "success");
                    kososngmodaledit();
                    $("#modaledit").modal("hide");
                    readapi();
                    localStorage.removeItem(key);
                },
                error: function (error) {
                    let message = error.msg;
                    shownotif(message, "error");
                    kososngmodaledit();
                }
            });
        }
    }
    function saveMeanToLocalStorage(paramfungsi, event, nisn) {
        let url
        let meanhadir = document.getElementById("meanhadir");
        let meansakit = document.getElementById("meansakit");
        let meanizin = document.getElementById("meanizin");
        let meanalpha = document.getElementById("meanalpha");
        let meansikap = document.getElementById("meansikap");
        if (event == "harian") {
        } else if (event == "mingguan") {
            meanhadir = document.getElementById("meanhadirmingguan");
            meansakit = document.getElementById("meansakitmingguan");
            meanizin = document.getElementById("meanizinmingguan");
            meanalpha = document.getElementById("meanalphamingguan");
            meansikap = document.getElementById("meansikapmingguan");
        } else if (event == "bulanan") {
            meanhadir = document.getElementById("meanhadirbulanan");
            meansakit = document.getElementById("meansakitbulanan");
            meanizin = document.getElementById("meanizinbulanan");
            meanalpha = document.getElementById("meanalphabulanan");
            meansikap = document.getElementById("meansikapbulanan");
        }
        let datatoupload = {
            nisn: nisn,
            mingguke: mingguKe,
            bulanke: month,
            semesterke: Smstr,
            tahunajaran: tahunajaran,
            kodeGuru: kodeGuru,
            mataPelajaran: mataPelajaran,
            jenisPenilaian: [],
            nilai: [],
            hadir: meanhadir.innerText,
            sakit: meansakit.innerText,
            izin: meanizin.innerText,
            alpha: meanalpha.innerText,
            nilaiSikap: meansikap.innerText,
        }
        if (event == "harian") {
            let elements = document.querySelectorAll(".jenisPenilaian");
            elements.forEach(function (element, i) {
                let meanElement = document.getElementById("mean" + element.innerText);
                if (meanElement) {
                    if (element.innerText == "tugas" || element.innerText == "uh" || element.innerText == "uts" || element.innerText == "uas") {
                        datatoupload.nilai.push(meanElement.innerText);
                        datatoupload.jenisPenilaian.push(element.innerText);
                    }
                } else {
                    // console.error("Element not found for jenisPenilaian: " + element.innerText);
                }
            });
        } else if (event == "mingguan") {
            let elements = document.querySelectorAll(".jenisPenilaianmingguan");
            elements.forEach(function (element, i) {
                let meanElement = document.getElementById("mean" + element.innerText + "mingguan");
                if (meanElement) {
                    if (element.innerText == "tugas" || element.innerText == "uh" || element.innerText == "uts" || element.innerText == "uas") {
                        datatoupload.nilai.push(meanElement.innerText);
                        datatoupload.jenisPenilaian.push(element.innerText);
                    }
                } else {
                    // console.error("Element not found for jenisPenilaian: " + element.innerText);
                }
            });

        } else if (event == "bulanan") {
            let elements = document.querySelectorAll(".jenisPenilaianbulanan");
            elements.forEach(function (element, i) {
                let meanElement = document.getElementById("mean" + element.innerText + "bulanan");
                if (meanElement) {
                    if (element.innerText == "tugas" || element.innerText == "uh" || element.innerText == "uts" || element.innerText == "uas") {
                        datatoupload.nilai.push(meanElement.innerText);
                        datatoupload.jenisPenilaian.push(element.innerText);
                    }
                } else {
                    // console.error("Element not found for jenisPenilaian: " + element.innerText);
                }
            });
        }
        let unique = generateUniqueId()
        localStorage.setItem(paramfungsi + "_" + event + "_" + unique, JSON.stringify(datatoupload));
        shownotif("Berhasil Menyimpan Di Local Storage", "success")
    }
    function saveToLocalStorage(paramfungsi) {
        let fungsi = paramfungsi;
        let editnisn
        let jenisPenilaian
        let nilaiAkademik
        let Kehadiran
        let sikap
        let noteGuru
        if (paramfungsi == "UPDATE") {
            if (document.getElementById("btnuploadupdate").getAttribute("data-id")) {
                let id = document.getElementById("btnuploadupdate").getAttribute("data-id")
                let editnisn = document.getElementById("editnisn").value
                let jenisPenilaian = document.getElementById("editjenisPenilaian").value
                let nilaiAkademik = document.getElementById("editnilaiAkademik").value
                let Kehadiran = document.getElementById("editkehadiran").value
                let sikap = document.getElementById("editsikap").value
                let noteGuru = document.getElementById("editnoteGuru").value
                var formData = {
                    fungsi: fungsi,
                    id: id,
                    kodeGuru: kodeGuru,
                    mataPelajaran: mataPelajaran,
                    mingguke: mingguKe,
                    bulanke: month,
                    semesterke: Smstr,
                    tahunajaran: tahunajaran,
                    nisn: editnisn,
                    jenisPenilaian: jenisPenilaian,
                    nilai: nilaiAkademik,
                    kehadiran: Kehadiran,
                    nilaiSikap: sikap,
                    note: noteGuru,
                };
            }
        } else {
            let nisnform = document.getElementById("nisnform").value
            jenisPenilaianForm = document.getElementById("jenisPenilaianForm").value
            nilaiAkademik = document.getElementById("nilaiAkademik").value
            Kehadiran = document.getElementById("Kehadiran").value
            sikap = document.getElementById("sikap").value
            noteGuru = document.getElementById("noteGuru").value
            var formData = {
                fungsi: fungsi,
                kodeGuru: kodeGuru,
                mataPelajaran: mataPelajaran,
                mingguke: mingguKe,
                bulanke: month,
                semesterke: Smstr,
                tahunajaran: tahunajaran,
                nisn: nisnform,
                jenisPenilaian: jenisPenilaianForm,
                nilai: nilaiAkademik,
                kehadiran: Kehadiran,
                nilaiSikap: sikap,
                note: noteGuru,
            };
        }
        kosongform();
        hideForm();
        $("#modaledit").modal("hide");
        let unique = generateUniqueId()
        localStorage.setItem(fungsi + "_" + unique, JSON.stringify(formData));
        shownotif("Berhasil Menyimpan Di Local Storage", "success")
    }
    function generateUniqueId() {
        return Date.now().toString();
    }
    //conect input ke form

    jenisPenilaian.addEventListener("input", function () {
        jenisPenilaianForm.value = jenisPenilaian.value;
        // console.log(jenisPenilaian.value)
    });

    if (typeof todayy === "undefined") {
        let todayy;
        let todayFormatted;
        let startSmstr1
        let startSmstr2
        let startDate;
    }
    todayy = new Date();
    todayFormatted = todayy.toISOString().split('T')[0]; // Get today's date in "YYYY-MM-DD" format

    startSmstr1 = new Date("2024-01-07");
    startSmstr2 = new Date("2024-12-24");
    if (typeof todayYear === "undefined") {
        let todayYear, todayMonth, todayDay
        let smstr1Year, smstr1Month, smstr1Day
        let smstr2Year, smstr2Month, smstr2Day
    }
    // Extract day, month, and year components of today's date
    [todayYear, todayMonth, todayDay] = todayFormatted.split('-').map(Number);

    // Extract day, month, and year components of Semester 1 start date
    [smstr1Year, smstr1Month, smstr1Day] = startSmstr1.toISOString().split('T')[0].split('-').map(Number);

    // Extract day, month, and year components of Semester 2 start date
    [smstr2Year, smstr2Month, smstr2Day] = startSmstr2.toISOString().split('T')[0].split('-').map(Number);
    if (
        (todayYear > smstr1Year || (todayYear === smstr1Year && todayMonth > smstr1Month) || (todayYear === smstr1Year && todayMonth === smstr1Month && todayDay >= smstr1Day)) &&
        (todayYear < smstr2Year || (todayYear === smstr2Year && todayMonth < smstr2Month) || (todayYear === smstr2Year && todayMonth === smstr2Month && todayDay < smstr2Day))
    ) {
        // console.log("Hari ini termasuk dalam Semester 1");
        startDate = startSmstr1;
        Smstr = 1;
    } else if (todayYear > smstr2Year || (todayYear === smstr2Year && todayMonth > smstr2Month) || (todayYear === smstr2Year && todayMonth === smstr2Month && todayDay >= smstr2Day)) {
        // console.log("Hari ini termasuk dalam Semester 2");
        startDate = startSmstr2;
        Smstr = 2;
    } else {
        // console.log("Hari ini belum masuk ke dalam salah satu semester");
        // Atur nilai default startDate jika diperlukan
        startDate = todayy;
    }

    // console.log("Start Date:", startDate);

    var inputTanggal = document.getElementById("tanggal");
    var today = new Date().toISOString().split('T')[0];
    inputTanggal.value = today;
    inputTanggal.addEventListener("input", function () {
        chekWeek(); // Panggil fungsi chekWeek() saat nilai input tanggal berubah
    });
    chekWeek();

    function chekWeek() {

        let hariIni = new Date(inputTanggal.value);
        // console.log("hari ini :", hariIni);

        // Menambah 7 hari ke tanggal awal
        const tmbhHari = 7;
        const tmbhBln = 28;
        let tglAwal = new Date(startDate);

        const week1 = new Date(tglAwal);
        const week2 = new Date(tglAwal);
        const week3 = new Date(tglAwal);
        const week4 = new Date(tglAwal);

        const month1 = new Date(tglAwal);
        month1.setDate(month1.getDate() + tmbhBln * 1);
        const month2 = new Date(tglAwal);
        month2.setDate(month2.getDate() + tmbhBln * 2);
        const month3 = new Date(tglAwal);
        month3.setDate(month3.getDate() + tmbhBln * 3);
        const month4 = new Date(tglAwal);
        month4.setDate(month4.getDate() + tmbhBln * 4);
        const month5 = new Date(tglAwal);
        month5.setDate(month5.getDate() + tmbhBln * 5);
        const month6 = new Date(tglAwal);
        month6.setDate(month6.getDate() + tmbhBln * 6);

        if (hariIni <= month1) {
            month = 1;
            week1.setDate(week1.getDate() + (tmbhHari * 1));
            week2.setDate(week2.getDate() + (tmbhHari * 2));
            week3.setDate(week3.getDate() + (tmbhHari * 3));
            week4.setDate(week4.getDate() + (tmbhHari * 4));
        } else if (hariIni <= month2) {
            month = 2;
            week1.setDate(week1.getDate() + (tmbhHari * 1) + (tmbhBln * 1));
            week2.setDate(week2.getDate() + (tmbhHari * 2) + (tmbhBln * 1));
            week3.setDate(week3.getDate() + (tmbhHari * 3) + (tmbhBln * 1));
            week4.setDate(week4.getDate() + (tmbhHari * 4) + (tmbhBln * 1));
        } else if (hariIni <= month3) {
            month = 3;
            week1.setDate(week1.getDate() + (tmbhHari * 1) + (tmbhBln * 2));
            week2.setDate(week2.getDate() + (tmbhHari * 2) + (tmbhBln * 2));
            week3.setDate(week3.getDate() + (tmbhHari * 3) + (tmbhBln * 2));
            week4.setDate(week4.getDate() + (tmbhHari * 4) + (tmbhBln * 2));
        } else if (hariIni <= month4) {
            month = 4;
            week1.setDate(week1.getDate() + (tmbhHari * 1) + (tmbhBln * 3));
            week2.setDate(week2.getDate() + (tmbhHari * 2) + (tmbhBln * 3));
            week3.setDate(week3.getDate() + (tmbhHari * 3) + (tmbhBln * 3));
            week4.setDate(week4.getDate() + (tmbhHari * 4) + (tmbhBln * 3));
        } else if (hariIni <= month5) {
            month = 5;
            week1.setDate(week1.getDate() + (tmbhHari * 1) + (tmbhBln * 4));
            week2.setDate(week2.getDate() + (tmbhHari * 2) + (tmbhBln * 4));
            week3.setDate(week3.getDate() + (tmbhHari * 3) + (tmbhBln * 4));
            week4.setDate(week4.getDate() + (tmbhHari * 4) + (tmbhBln * 4));
        } else if (hariIni <= month6) {
            month = 6;
            week1.setDate(week1.getDate() + (tmbhHari * 1) + (tmbhBln * 5));
            week2.setDate(week2.getDate() + (tmbhHari * 2) + (tmbhBln * 5));
            week3.setDate(week3.getDate() + (tmbhHari * 3) + (tmbhBln * 5));
            week4.setDate(week4.getDate() + (tmbhHari * 4) + (tmbhBln * 5));
        }
        for (let i = 1; i <= 6; i++) {
            if (month == i) {
                // Reset all classes
                for (let i = 1; i <= 6; i++) {
                    $(`#bln` + i).removeClass("btnplhActive");
                }
                //add classes
                $("#bln" + i).addClass("btnplhActive");
            }

        }

        if (hariIni <= week1) {
            $("#mng1").addClass("btnplhActive");
            $("#mng2").removeClass("btnplhActive");
            $("#mng3").removeClass("btnplhActive");
            $("#mng4").removeClass("btnplhActive");
            mingguKe = 1;
        } else if (hariIni <= week2) {
            $("#mng2").addClass("btnplhActive");
            $("#mng1").removeClass("btnplhActive");
            $("#mng3").removeClass("btnplhActive");
            $("#mng4").removeClass("btnplhActive");
            mingguKe = 2;
        } else if (hariIni <= week3) {
            $("#mng3").addClass("btnplhActive");
            $("#mng1").removeClass("btnplhActive");
            $("#mng2").removeClass("btnplhActive");
            $("#mng4").removeClass("btnplhActive");
            mingguKe = 3;
        } else if (hariIni <= week4) {
            $("#mng4").addClass("btnplhActive");
            $("#mng1").removeClass("btnplhActive");
            $("#mng3").removeClass("btnplhActive");
            $("#mng2").removeClass("btnplhActive");
            mingguKe = 4;
        }
        // console.log(mingguKe)
        // console.log(month)
        // console.log(Smstr)
    }
    function plhWeek(no) {
        let weeks = new Date(startDate);
        const senin = 1;
        const selasa = 2;
        const rabu = 3;
        const kamis = 4;
        const jumat = 5;
        const tmbhHari = 7;
        const tmbhBln = 28;
        let hari = senin;
        if (no == 1) {
            if (month == 1) {
                weeks.setDate(weeks.getDate() + hari)
                inputTanggal.value = formatDate(weeks);
            } else if (month == 2) {
                weeks.setDate(weeks.getDate() + hari + (tmbhBln * 1))
                inputTanggal.value = formatDate(weeks);
            } else if (month == 3) {
                weeks.setDate(weeks.getDate() + hari + (tmbhBln * 2))
                inputTanggal.value = formatDate(weeks);
            } else if (month == 4) {
                weeks.setDate(weeks.getDate() + hari + (tmbhBln * 3))
                inputTanggal.value = formatDate(weeks);
            } else if (month == 5) {
                weeks.setDate(weeks.getDate() + hari + (tmbhBln * 4))
                inputTanggal.value = formatDate(weeks);
            } else if (month == 6) {
                weeks.setDate(weeks.getDate() + hari + (tmbhBln * 5))
                inputTanggal.value = formatDate(weeks);
            }
            chekWeek();
            // console.log(weeks) 
        } else if (no == 2) {
            if (month == 1) {
                weeks.setDate(weeks.getDate() + hari + (tmbhHari * 1))
                inputTanggal.value = formatDate(weeks);
            } else if (month == 2) {
                weeks.setDate(weeks.getDate() + hari + (tmbhHari * 1) + (tmbhBln * 1))
                inputTanggal.value = formatDate(weeks);
            } else if (month == 3) {
                weeks.setDate(weeks.getDate() + hari + (tmbhHari * 1) + (tmbhBln * 2))
                inputTanggal.value = formatDate(weeks);
            } else if (month == 4) {
                weeks.setDate(weeks.getDate() + hari + (tmbhHari * 1) + (tmbhBln * 3))
                inputTanggal.value = formatDate(weeks);
            } else if (month == 5) {
                weeks.setDate(weeks.getDate() + hari + (tmbhHari * 1) + (tmbhBln * 4))
                inputTanggal.value = formatDate(weeks);
            } else if (month == 6) {
                weeks.setDate(weeks.getDate() + hari + (tmbhHari * 1) + (tmbhBln * 5))
                inputTanggal.value = formatDate(weeks);
            }
            chekWeek();
            // console.log(weeks)
        } else if (no == 3) {
            if (month == 1) {
                weeks.setDate(weeks.getDate() + hari + (tmbhHari * 2))
                inputTanggal.value = formatDate(weeks);
            } else if (month == 2) {
                weeks.setDate(weeks.getDate() + hari + (tmbhHari * 2) + (tmbhBln * 1))
                inputTanggal.value = formatDate(weeks);
            } else if (month == 3) {
                weeks.setDate(weeks.getDate() + hari + (tmbhHari * 2) + (tmbhBln * 2))
                inputTanggal.value = formatDate(weeks);
            } else if (month == 4) {
                weeks.setDate(weeks.getDate() + hari + (tmbhHari * 2) + (tmbhBln * 3))
                inputTanggal.value = formatDate(weeks);
            } else if (month == 5) {
                weeks.setDate(weeks.getDate() + hari + (tmbhHari * 2) + (tmbhBln * 4))
                inputTanggal.value = formatDate(weeks);
            } else if (month == 6) {
                weeks.setDate(weeks.getDate() + hari + (tmbhHari * 2) + (tmbhBln * 5))
                inputTanggal.value = formatDate(weeks);
            }
            chekWeek();
            // console.log(weeks)
        } else if (no == 4) {
            if (month == 1) {
                weeks.setDate(weeks.getDate() + hari + (tmbhHari * 3))
                inputTanggal.value = formatDate(weeks);
            } else if (month == 2) {
                weeks.setDate(weeks.getDate() + hari + (tmbhHari * 3) + (tmbhBln * 1))
                inputTanggal.value = formatDate(weeks);
            } else if (month == 3) {
                weeks.setDate(weeks.getDate() + hari + (tmbhHari * 3) + (tmbhBln * 2))
                inputTanggal.value = formatDate(weeks);
            } else if (month == 4) {
                weeks.setDate(weeks.getDate() + hari + (tmbhHari * 3) + (tmbhBln * 3))
                inputTanggal.value = formatDate(weeks);
            } else if (month == 5) {
                weeks.setDate(weeks.getDate() + hari + (tmbhHari * 3) + (tmbhBln * 4))
                inputTanggal.value = formatDate(weeks);
            } else if (month == 6) {
                weeks.setDate(weeks.getDate() + hari + (tmbhHari * 3) + (tmbhBln * 5))
                inputTanggal.value = formatDate(weeks);
            }
            chekWeek();
            // console.log(weeks)
        }
    }

    function formatDate(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    function plhBln(no) {
        const senin = 1;
        const selasa = 2;
        const rabu = 3;
        const kamis = 4;
        const jumat = 5;
        let bulan = new Date(startDate);
        const tmbhHari = 7;
        const tmbhBln = 28;
        const hari = senin;

        if (no == 1) {
            if (mingguKe == 1) {
                bulan.setDate(bulan.getDate() + hari + (tmbhBln * 0) + (tmbhHari * 0));
                inputTanggal.value = formatDate(bulan);
            } else if (mingguKe == 2) {
                bulan.setDate(bulan.getDate() + hari + (tmbhBln * 0) + (tmbhHari * 1));
                inputTanggal.value = formatDate(bulan);
            } else if (mingguKe == 3) {
                bulan.setDate(bulan.getDate() + hari + (tmbhBln * 0) + (tmbhHari * 2));
                inputTanggal.value = formatDate(bulan);
            } else if (mingguKe == 4) {
                bulan.setDate(bulan.getDate() + hari + (tmbhBln * 0) + (tmbhHari * 3));
                inputTanggal.value = formatDate(bulan);
            }
        } else if (no == 2) {
            if (mingguKe == 1) {
                bulan.setDate(bulan.getDate() + hari + (tmbhBln * 1) + (tmbhHari * 0));
                inputTanggal.value = formatDate(bulan);
            } else if (mingguKe == 2) {
                bulan.setDate(bulan.getDate() + hari + (tmbhBln * 1) + (tmbhHari * 1));
                inputTanggal.value = formatDate(bulan);
            } else if (mingguKe == 3) {
                bulan.setDate(bulan.getDate() + hari + (tmbhBln * 1) + (tmbhHari * 2));
                inputTanggal.value = formatDate(bulan);
            } else if (mingguKe == 4) {
                bulan.setDate(bulan.getDate() + hari + (tmbhBln * 1) + (tmbhHari * 3));
                inputTanggal.value = formatDate(bulan);
            }
        } else if (no == 3) {
            if (mingguKe == 1) {
                bulan.setDate(bulan.getDate() + hari + (tmbhBln * 2) + (tmbhHari * 0));
                inputTanggal.value = formatDate(bulan);
            } else if (mingguKe == 2) {
                bulan.setDate(bulan.getDate() + hari + (tmbhBln * 2) + (tmbhHari * 1));
                inputTanggal.value = formatDate(bulan);
            } else if (mingguKe == 3) {
                bulan.setDate(bulan.getDate() + hari + (tmbhBln * 2) + (tmbhHari * 2));
                inputTanggal.value = formatDate(bulan);
            } else if (mingguKe == 4) {
                bulan.setDate(bulan.getDate() + hari + (tmbhBln * 2) + (tmbhHari * 3));
                inputTanggal.value = formatDate(bulan);
            }
        } else if (no == 4) {
            if (mingguKe == 1) {
                bulan.setDate(bulan.getDate() + hari + (tmbhBln * 3) + (tmbhHari * 0));
                inputTanggal.value = formatDate(bulan);
            } else if (mingguKe == 2) {
                bulan.setDate(bulan.getDate() + hari + (tmbhBln * 3) + (tmbhHari * 1));
                inputTanggal.value = formatDate(bulan);
            } else if (mingguKe == 3) {
                bulan.setDate(bulan.getDate() + hari + (tmbhBln * 3) + (tmbhHari * 2));
                inputTanggal.value = formatDate(bulan);
            } else if (mingguKe == 4) {
                bulan.setDate(bulan.getDate() + hari + (tmbhBln * 3) + (tmbhHari * 3));
                inputTanggal.value = formatDate(bulan);
            }
        } else if (no == 5) {
            if (mingguKe == 1) {
                bulan.setDate(bulan.getDate() + hari + (tmbhBln * 4) + (tmbhHari * 0));
                inputTanggal.value = formatDate(bulan);
            } else if (mingguKe == 2) {
                bulan.setDate(bulan.getDate() + hari + (tmbhBln * 4) + (tmbhHari * 1));
                inputTanggal.value = formatDate(bulan);
            } else if (mingguKe == 3) {
                bulan.setDate(bulan.getDate() + hari + (tmbhBln * 4) + (tmbhHari * 2));
                inputTanggal.value = formatDate(bulan);
            } else if (mingguKe == 4) {
                bulan.setDate(bulan.getDate() + hari + (tmbhBln * 4) + (tmbhHari * 3));
                inputTanggal.value = formatDate(bulan);
            }
        } else if (no == 6) {
            if (mingguKe == 1) {
                bulan.setDate(bulan.getDate() + hari + (tmbhBln * 5) + (tmbhHari * 0));
                inputTanggal.value = formatDate(bulan);
            } else if (mingguKe == 2) {
                bulan.setDate(bulan.getDate() + hari + (tmbhBln * 5) + (tmbhHari * 1));
                inputTanggal.value = formatDate(bulan);
            } else if (mingguKe == 3) {
                bulan.setDate(bulan.getDate() + hari + (tmbhBln * 5) + (tmbhHari * 2));
                inputTanggal.value = formatDate(bulan);
            } else if (mingguKe == 4) {
                bulan.setDate(bulan.getDate() + hari + (tmbhBln * 5) + (tmbhHari * 3));
                inputTanggal.value = formatDate(bulan);
            }

        }
        chekWeek();
    }
    $(document).ready(function () {
        const filter = $("#filter");
        const itemsTbody = $("tbody tr");

        filter.on("input", function () {
            const filterValue = filter.val().toLowerCase();

            itemsTbody.each(function () {
                const itemText = $(this).text().toLowerCase();

                if (itemText.includes(filterValue)) {
                    $(this).removeClass("d-none");
                } else {
                    $(this).addClass("d-none");
                }
            });
        });
    });
