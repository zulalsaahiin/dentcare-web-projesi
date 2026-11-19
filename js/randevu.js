document.querySelectorAll("[data-randevu-formu]").forEach((form) => {
    const tarih = form.elements.namedItem("tarih");
    const saat = form.elements.namedItem("saat");
    const ad = form.elements.namedItem("adSoyad");
    const sonuc = form.querySelector("[data-randevu-sonucu]");

    function bugun() {
        const simdi = new Date();
        return [
            simdi.getFullYear(),
            String(simdi.getMonth() + 1).padStart(2, "0"),
            String(simdi.getDate()).padStart(2, "0")
        ].join("-");
    }

    function tarihiKontrolEt() {
        tarih.min = bugun();
        const pazar = tarih.value && new Date(tarih.value + "T12:00:00").getDay() === 0;
        const cumartesi = tarih.value && new Date(tarih.value + "T12:00:00").getDay() === 6;
        tarih.setCustomValidity(
            tarih.value && tarih.value < tarih.min
                ? "Bugün veya ileri bir tarih seçiniz."
                : pazar ? "Kliniğimiz pazar günleri kapalıdır. Başka bir gün seçiniz."
                : ""
        );
        saat.min = "08:00";
        saat.max = cumartesi ? "19:00" : "21:00";
        let uyari = "";
        if (saat.value && (saat.value < saat.min || saat.value > saat.max)) {
            uyari = "Lütfen 08.00 ile " + saat.max.replace(":", ".") + " arasında bir saat seçiniz.";
        } else if (tarih.value === bugun() && saat.value) {
            const simdi = new Date();
            const suAn = String(simdi.getHours()).padStart(2, "0") + ":" + String(simdi.getMinutes()).padStart(2, "0");
            if (saat.value < suAn) uyari = "Bugün için geçmiş bir saat seçemezsiniz.";
        }
        saat.setCustomValidity(uyari);
    }

    tarihiKontrolEt();
    tarih.addEventListener("input", tarihiKontrolEt);
    tarih.addEventListener("focus", tarihiKontrolEt);
    saat.addEventListener("input", tarihiKontrolEt);
    saat.addEventListener("focus", tarihiKontrolEt);
    ad.addEventListener("input", () => {
        ad.setCustomValidity(
            ad.value.trim().length < 2 ? "Adınızı ve soyadınızı yazınız." : ""
        );
    });
    form.addEventListener("input", () => {
        sonuc.textContent = "";
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        tarihiKontrolEt();
        ad.setCustomValidity(
            ad.value.trim().length < 2 ? "Adınızı ve soyadınızı yazınız." : ""
        );
        if (!form.reportValidity()) return;

        sonuc.textContent =
            "Form kontrolü tamamlandı. Bu bir ders projesi demosudur; " +
            "gerçek randevu oluşturulmadı, bilgileriniz kaydedilmedi ve gönderilmedi.";
    });
});
