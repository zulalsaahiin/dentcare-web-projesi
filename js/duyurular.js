const duyurular = [
    {
        id: 1,
        baslik: "Randevu Bilgilendirmesi",
        tarih: "2026-10-31",
        icerik: "Randevu talepleriniz ve saat değişiklikleri hakkında bilgi almak için iletişim sayfamızdaki kanalları kullanabilirsiniz."
    },
    {
        id: 2,
        baslik: "Çocuk Diş Hekimliği Birimimiz",
        tarih: "2026-10-29",
        icerik: "Çocuk Diş Hekimliği birimimizin çalışma alanlarını Birimlerimiz menüsünden inceleyebilirsiniz."
    },
    {
        id: 3,
        baslik: "Estetik Diş Hekimliği Bilgilendirmesi",
        tarih: "2026-10-27",
        icerik: "Estetik Diş Hekimliği birimimiz hakkında bilgi almak için ilgili birim sayfamızı ziyaret edebilirsiniz."
    },
    {
        id: 4,
        baslik: "Hizmet Sayfalarımızı İnceleyin",
        tarih: "2026-10-25",
        icerik: "Ortodonti, diş beyazlatma ve implant hizmetlerine ait açıklamalara Hizmetlerimiz menüsünden ulaşabilirsiniz."
    },
    {
        id: 5,
        baslik: "Görüş ve Önerileriniz",
        tarih: "2026-10-23",
        icerik: "Görüş ve önerilerinizi iletişim sayfamız üzerinden paylaşabilirsiniz. Bu duyurular ders projesi için hazırlanmış örnek içeriklerdir."
    }
];

// Duyuruları en yeniden en eskiye sırala.
const siraliDuyurular = [...duyurular].sort(
    (a, b) => b.tarih.localeCompare(a.tarih)
);

const duyuruListesi = document.getElementById("duyuruListesi");

function tarihiYaz(tarih) {
    return new Date(tarih + "T12:00:00").toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

if (duyuruListesi) {
    const hepsiniGoster = duyuruListesi.dataset.tum === "evet";

    const gosterilecekler = hepsiniGoster
        ? siraliDuyurular
        : siraliDuyurular.slice(0, 5);

    gosterilecekler.forEach((duyuru) => {
        const kart = document.createElement("div");
        kart.className = "col-md-6 col-lg-4";

        kart.innerHTML = `
            <article class="bg-light rounded p-4 h-100">
                <p class="duyuru-tarih text-muted small"></p>
                <h3 class="duyuru-baslik h5"></h3>
                <button type="button"
                        class="btn btn-outline-primary mt-3"
                        data-bs-toggle="modal"
                        data-bs-target="#duyuruModal">
                    Ayrıntıları Gör
                </button>
            </article>
        `;

        kart.querySelector(".duyuru-tarih").textContent =
            tarihiYaz(duyuru.tarih);

        kart.querySelector(".duyuru-baslik").textContent =
            duyuru.baslik;

        kart.querySelector("button").dataset.duyuruId = duyuru.id;

        duyuruListesi.appendChild(kart);
    });

    if (hepsiniGoster) {
        document.getElementById("tumDuyurularAlani").hidden = true;
    }
}

const duyuruModal = document.getElementById("duyuruModal");

if (duyuruModal) {
    duyuruModal.addEventListener("show.bs.modal", (event) => {
        const dugme = event.relatedTarget;

        if (!dugme) return;

        const secilen = duyurular.find(
            (duyuru) => duyuru.id === Number(dugme.dataset.duyuruId)
        );

        if (!secilen) return;

        document.getElementById("duyuruBasligi").textContent =
            secilen.baslik;

        document.getElementById("duyuruTarihi").textContent =
            tarihiYaz(secilen.tarih);

        document.getElementById("duyuruMetni").textContent =
            secilen.icerik;
    });
}