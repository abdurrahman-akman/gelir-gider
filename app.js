//? selectors
const ekleBtn = document.getElementById("ekle-btn");
const gelirInput = document.getElementById("gelir-input");
const ekleFormu = document.getElementById("ekle-formu");

//? Sonuç Tablosu
const gelirinizTd = document.getElementById("geliriniz");
const giderinizTd = document.getElementById("gideriniz");
const kalanTd = document.getElementById("kalan");

//? harcama formu
const harcamaFormu = document.getElementById("harcama-formu");
const harcamaAlaniInput = document.getElementById("harcama-alani");
const tarihInput = document.getElementById("tarih");
const miktarInput = document.getElementById("miktar");

//? Harcama Tablosu
const harcamaBody = document.getElementById("harcama-body");
const temizleBtn = document.getElementById("temizle-btn");

//? Variables
let gelirler = 0;

//? tum harcamaları saklayacak dizi (JSON)
let harcamaListesi = [];

//? EVENTS

//! Formun submit butonuna basildiğinda
ekleFormu.addEventListener("submit", (e) => {
  e.preventDefault(); //? reload'u engeller
  gelirler = gelirler + Number(gelirInput.value); //? string eklemeyyi engelledik

  //?gelirlerin kalıcı olması için Localstroge a kopyalıyoruz
  localStorage.setItem("gelirler", gelirler);

  //? input degerini sıfırladık
  ekleFormu.reset();

  //? degisiklikleri sonuç tablosuna yazan fonksiyon
  hesaplaVeGuncelle();
});

//! Sayfa her yuklendikten sonra calişan event
window.addEventListener("load", () => {
  //?gelirler bilgisini local stroge dan okuyarak global değişkenimize yaz
  gelirler = Number(localStorage.getItem("gelirler"))

  //? Localstroge den harcama listesini okuyarak global dizimize saklıyoruz.
harcamaListesi = JSON.parse(localStorage.getItem("harcamalar")) || []

//? harcama dizisinin içindeki apileri tek tek DOM a yaziyoruz.
harcamaListesi.forEach((harcama) => harcamayiDomaYaz(harcama))

console.log(harcamaListesi)

//? Tarih inputunu bugun deger ile yukle 
tarihInput.valueAsDate = new Date()

//? degisen bilgileri hesapl ve DOM a bas
hesaplaVeGuncelle()
});

//! harcama formu submit edildiginde calisir

harcamaFormu.addEventListener("submit", (e) => {
    e.preventDefault() //? reload'u engelle

    //? yeni harcama bilgileri ile bir obje oluştur 
    const yeniHarcama = {
        id: new Date().getTime(), //? sistem saatini (ms olarak) verir. Unique gibidir.
        tarih: tarihInput.value,
        alan: harcamaAlaniInput.value,
        miktar: miktarInput.value,
    }

    //? yeni harcama objesini diziye ekle
    harcamaListesi.push(yeniHarcama)

//? dizisin son halini localStorage e gonder.
 localStorage.setItem("harcamalar", JSON.stringify(harcamaListesi))

 harcamayiDomaYaz(yeniHarcama)
 
 hesaplaVeGuncelle()

 //? formdaki verileri sil
 harcamaFormu.reset()
 tarihInput.valueAsDate = new Date()

})

const hesaplaVeGuncelle = () => {
  const giderler = harcamaListesi.reduce((toplam,  harcama) => toplam + Number(harcama.miktar),0)

  gelirinizTd.innerText = gelirler
  giderinizTd.innerText = giderler
  kalanTd.innerText = gelirler - giderler
}

const harcamayiDomaYaz = ({ id, miktar, tarih, alan }) => {
  // const { id, miktar, tarih, alan } = yeniHarcama
  harcamaBody.innerHTML += `
  <tr>
    <td>${tarih}</td>
    <td>${alan}</td>
    <td>${miktar}</td>
    <td><i id=${id} class="fa-solid fa-trash-can text-danger"  type="button"></i></td>
  </tr>
  `
}

//! Harcama tablosunda herhangi bir alana tıklanıldıgında calisir.

harcamaBody.addEventListener("click", (e) => {
  // console.log(e.target)
  //? tıklama sil butonlarından geldi ise
  if (e.target.classList.contains("fa-trash-can")) {
    //? DOM ' dan ilgili row'u sildik.
    e.target.parentElement.remove()

    const id = e.target.id
    console.log(id)
    //? dizideki ilgili objeyi sildik.
    harcamaListesi = harcamaListesi.filter((harcama) => harcama.id != id)

    //?Silinmiş yeni diziyi local Stroge aktardik.
    localStorage.setItem("harcamalar", JSON.stringify(harcamaListesi))

    //?her satir silindikten sonra yeni degerleri hesapla ve DOM a yaz
    hesaplaVeGuncelle()
  }
})

//? temizle butonuna basildiği zaman calis

temizleBtn.addEventListener("click", () => {
  if (confirm("silmek istediğine emin misin")) {
    harcamaListesi = [] //? RAM daki harcama listesini sil
    gelirler = 0 //?RAM daki gelirleri sil
    localStorage.clear() //? localStorage deki tüm verileri sil
    harcamaBody.innerHTML = "" //? dom daki tüm harcamaları sil
    hesaplaVeGuncelle() //? sonuc tablosundaki (DOM) gelirler, giderler ve kalan degerleri sil.
  }
})