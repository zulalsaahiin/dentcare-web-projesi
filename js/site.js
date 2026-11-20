(() => {
    "use strict";
    const pages = [
        { title:"Hakkımızda", url:"about.html", text:"DentCare kliniğini ve hizmet yaklaşımını tanıyın.", words:"klinik tanıtım hakkında" },
        { title:"Misyon ve Vizyon", url:"misyon-vizyon.html", text:"Kliniğin amaçları ve hizmet anlayışı.", words:"misyon vizyon amaç" },
        { title:"Hizmetlerimiz", url:"service.html", text:"Hizmet kategorilerini birlikte inceleyin.", words:"hizmet tedavi" },
        { title:"Ortodonti", url:"ortodonti.html", text:"Ortodonti hizmeti ve örnek ücret bilgileri.", words:"ortodonti diş tel ücret" },
        { title:"Diş Beyazlatma", url:"dis-beyazlatma.html", text:"Diş beyazlatma hizmeti hakkında bilgi.", words:"beyazlatma estetik gülüş" },
        { title:"Diş İmplantları", url:"implant.html", text:"İmplant hizmeti ve örnek ücret bilgileri.", words:"implant eksik diş" },
        { title:"Genel Diş Hekimliği", url:"genel-dis-hekimligi.html", text:"Genel Diş Hekimliği biriminin çalışma alanları.", words:"birim muayene genel" },
        { title:"Estetik Diş Hekimliği", url:"estetik-dis-hekimligi.html", text:"Estetik Diş Hekimliği birimini tanıyın.", words:"birim estetik gülüş" },
        { title:"Çocuk Diş Hekimliği", url:"cocuk-dis-hekimligi.html", text:"Çocuklara ve ailelere yönelik birim tanıtımı.", words:"çocuk pedodonti birim" },
        { title:"Duyurular", url:"duyurular.html", text:"Kliniğimizden haberler ve bilgilendirmeler.", words:"duyuru haber bilgilendirme" },
        { title:"Örnek Ücretler", url:"price.html", text:"Ders projesi için hazırlanmış örnek hizmet ücretleri.", words:"ücret fiyat tl ödeme" },
        { title:"Hekimlerimiz", url:"team.html", text:"Proje için hazırlanmış örnek ekibi tanıyın.", words:"doktor hekim ekip" },
        { title:"Hasta Yorumları", url:"testimonial.html", text:"Ders projesi için hazırlanmış örnek yorumlar.", words:"hasta yorum deneyim" },
        { title:"Randevu", url:"appointment.html", text:"Hizmet, hekim, tarih ve saat tercihlerini içeren demo form.", words:"randevu saat çalışma" },
        { title:"İletişim", url:"contact.html", text:"Adres, harita, telefon ve şikâyet/öneri formu.", words:"iletişim adres konum harita telefon eposta şikayet öneri" },
        { title:"Sayılarla Kliniğimiz", url:"sayilarla-klinigimiz.html", text:"Örnek randevu istatistikleri ve grafikler.", words:"istatistik grafik sayı randevu dağılım" }
    ];
    function normalise(value) {
        return value.toLocaleLowerCase("tr-TR").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ı/g,"i").trim();
    }
    function findPages(query) {
        const terms = normalise(query).split(/\s+/).filter(Boolean);
        if (!terms.length) return [];
        return pages.filter(page => {
            const text = normalise(page.title + " " + page.text + " " + page.words);
            return terms.every(term => text.includes(term));
        });
    }
    document.querySelectorAll("[data-site-arama]").forEach(form => {
        const input = form.elements.namedItem("arama");
        const results = document.querySelector("[data-arama-sonuclari]");
        form.addEventListener("submit", event => {
            event.preventDefault();
            if (!results || !form.reportValidity()) return;
            const query = input.value.trim();
            input.setCustomValidity(query.length < 2 ? "En az iki harf yazınız." : "");
            if (!form.reportValidity()) return;
            const matches = findPages(query);
            results.replaceChildren();
            const info = document.createElement("p");
            info.className = "fw-bold mb-3";
            info.textContent = matches.length ? matches.length + " sayfa bulundu." : "Eşleşen sayfa bulunamadı. Başka bir kelime deneyin.";
            results.appendChild(info);
            if (matches.length) {
                const list = document.createElement("ul");
                list.className = "list-unstyled mb-0";
                matches.forEach(page => {
                    const item = document.createElement("li");
                    item.className = "border-top py-3";
                    const link = document.createElement("a");
                    link.href = page.url;
                    link.className = "fw-bold";
                    link.textContent = page.title;
                    const text = document.createElement("p");
                    text.className = "small text-muted mb-0 mt-1";
                    text.textContent = page.text;
                    item.append(link,text); list.appendChild(item);
                });
                results.appendChild(list);
            }
            results.hidden = false;
            results.focus();
        });
        input.addEventListener("input", () => {
            input.setCustomValidity("");
            if (results) results.hidden = true;
        });
    });
    document.querySelectorAll("[data-abonelik-formu]").forEach(form => {
        const result = form.querySelector("[data-abonelik-sonucu]");
        form.addEventListener("submit", event => {
            event.preventDefault();
            if (!form.reportValidity()) return;
            result.textContent = "Form kontrolü tamamlandı. Bu bir demodur; abonelik oluşturulmadı ve e-posta adresiniz kaydedilmedi.";
        });
        form.addEventListener("input", () => { result.textContent = ""; });
    });
})();
