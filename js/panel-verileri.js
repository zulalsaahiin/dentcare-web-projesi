(() => {
    "use strict";
    const field = (key, label, type = "text", required = true, extra = {}) => ({ key, label, type, required, ...extra });
    const status = field("durum", "Durum", "select", true, { options: [["taslak", "Taslak"], ["hazir", "Hazır"]] });
    const schema = {
        hizmetler: {
            label: "Hizmetler", singular: "Hizmet", description: "Hizmet açıklamalarını, özelliklerini ve örnek ücretleri düzenleyin.",
            fields: [field("baslik", "Hizmet Adı"), field("ucret", "Örnek Ücret (TL)", "number"), field("ozet", "Kısa Açıklama", "textarea"), field("icerik", "Detay Açıklaması", "textarea"), field("ozellikler", "Özellikler (her satıra bir özellik)", "textarea"), field("gorsel", "Görsel Yolu", "text", false), field("sayfa", "Detay Sayfası", "text", false), status], files: "image"
        },
        birimler: {
            label: "Birimler", singular: "Birim", description: "Birim tanıtımlarını ve çalışma alanlarını yönetin.",
            fields: [field("baslik", "Birim Adı"), field("icerik", "Birim Açıklaması", "textarea"), field("alanlar", "Çalışma Alanları", "textarea"), field("gorsel", "Görsel Yolu", "text", false), field("sayfa", "Birim Sayfası", "text", false), status], files: "image"
        },
        duyurular: {
            label: "Duyurular", singular: "Duyuru", description: "Duyuru başlığı, tarih, içerik ve PDF, Word ya da resim eklerini düzenleyin.",
            fields: [field("baslik", "Duyuru Başlığı"), field("tarih", "Duyuru Tarihi", "date"), field("icerik", "Duyuru İçeriği", "textarea"), status], files: "document"
        },
        sliderler: {
            label: "Slider", singular: "Slayt", description: "Ana sayfada tanıtılan hizmetlerin görsellerini ve hedef bağlantılarını planlayın.",
            fields: [field("baslik", "Büyük Başlık"), field("altBaslik", "Küçük Başlık"), field("gorsel", "Görsel Yolu"), field("sayfa", "Yönlendirilecek Sayfa"), field("sira", "Gösterim Sırası", "number"), status], files: "image"
        },
        sayfalar: {
            label: "Sayfa İçerikleri", singular: "Sayfa", description: "Hakkımızda, Misyon ve Vizyon gibi sabit sayfaların metinlerini düzenleyin.",
            fields: [field("baslik", "Sayfa Başlığı"), field("sayfa", "Sayfa Dosyası"), field("icerik", "Sayfa İçeriği", "textarea"), status]
        },
        iletisim: {
            label: "İletişim Bilgileri", singular: "İletişim Kaydı", description: "Adres, telefon, e-posta, harita ve sosyal medya bilgilerini düzenleyin.",
            fields: [field("baslik", "Klinik Adı"), field("adres", "Açık Adres", "textarea"), field("telefon", "Telefon", "tel"), field("eposta", "E-posta", "email"), field("enlem", "Harita Enlemi", "number", true, { min: -90, max: 90, step: "any" }), field("boylam", "Harita Boylamı", "number", true, { min: -180, max: 180, step: "any" }), field("saatler", "Çalışma Saatleri", "textarea"), field("instagram", "Instagram Adresi", "url", false), field("facebook", "Facebook Adresi", "url", false), status]
        },
        istatistikler: {
            label: "İstatistikler", singular: "İstatistik", description: "Grafiklerde kullanılabilecek örnek veri başlıklarını ve sayısal değerleri düzenleyin.",
            fields: [field("baslik", "Veri Başlığı"), field("grup", "Grafik Grubu", "select", true, { options: [["aylik", "Aylık Randevu Sayıları"], ["hizmet", "Hizmet Dağılımı"]] }), field("deger", "Sayısal Değer", "number"), field("donem", "Dönem"), status]
        }
    };
    const ready = (id, data) => ({ id, ...data, durum: "hazir", dosyalar: [] });
    function initial() {
        return {
            hizmetler: [
                ready("h1", { baslik: "Genel Diş Muayenesi", ucret: 0, ozet: "Ağız ve diş sağlığı değerlendirmesi.", icerik: "Muayene sonrasında ihtiyaçlar değerlendirilir ve hizmet seçenekleri hakkında bilgi verilir.", ozellikler: "Tedavi öncesi değerlendirme\nKişiye özel planlama", gorsel: "img/about.jpg", sayfa: "genel-dis-hekimligi.html" }),
                ready("h2", { baslik: "Ortodonti", ucret: 25000, ozet: "Ortodonti hakkında değerlendirme ve bilgilendirme.", icerik: "Ortodonti hizmeti, değerlendirme süreci ve örnek ücret bilgileri.", ozellikler: "Tedavi öncesi değerlendirme\nKişiye özel planlama", gorsel: "img/about.jpg", sayfa: "ortodonti.html" }),
                ready("h3", { baslik: "Diş Beyazlatma", ucret: 5000, ozet: "Diş beyazlatma hakkında bilgilendirme.", icerik: "Diş beyazlatma hizmeti hakkında bilgi ve randevu için kliniğimizle iletişime geçebilirsiniz.", ozellikler: "Randevulu muayene\nÜcret bilgilendirmesi", gorsel: "img/service-4.jpg", sayfa: "dis-beyazlatma.html" }),
                ready("h4", { baslik: "Diş İmplantları", ucret: 15000, ozet: "İmplant hizmeti hakkında değerlendirme.", icerik: "İmplant hizmeti ve değerlendirme süreci hakkında bilgilendirme.", ozellikler: "Kişiye özel planlama\nÜcret bilgilendirmesi", gorsel: "img/service-2.jpg", sayfa: "implant.html" }),
                ready("h5", { baslik: "Çocuk Diş Hekimliği", ucret: 0, ozet: "Çocuklar ve aileleri için bilgilendirme.", icerik: "Çocukların ağız ve diş sağlığına yönelik değerlendirme ve bilgilendirme.", ozellikler: "Randevulu muayene\nAilelere bilgilendirme", gorsel: "img/about.jpg", sayfa: "cocuk-dis-hekimligi.html" })
            ],
            birimler: [
                ready("b1", { baslik: "Genel Diş Hekimliği", icerik: "Ağız ve diş sağlığı değerlendirmeleri ile genel diş tedavilerine yönelik hizmet sunar.", alanlar: "Muayene\nGenel diş tedavileri\nAğız bakımı bilgilendirmesi", gorsel: "img/about.jpg", sayfa: "genel-dis-hekimligi.html" }),
                ready("b2", { baslik: "Estetik Diş Hekimliği", icerik: "Gülüş görünümüne yönelik beklentiler değerlendirilir.", alanlar: "Estetik değerlendirme\nDiş beyazlatma bilgilendirmesi\nKişiye özel planlama", gorsel: "img/about.jpg", sayfa: "estetik-dis-hekimligi.html" }),
                ready("b3", { baslik: "Çocuk Diş Hekimliği", icerik: "Çocuklar ve aileleri için değerlendirme ve bilgilendirme hizmetleri.", alanlar: "Çocuk muayenesi\nAğız bakımı bilgilendirmesi\nAilelere koruyucu bakım bilgilendirmesi", gorsel: "img/about.jpg", sayfa: "cocuk-dis-hekimligi.html" })
            ],
            duyurular: [
                ready("d1", { baslik: "Randevu Bilgilendirmesi", tarih: "2026-10-31", icerik: "Randevu talepleriniz ve saat değişiklikleri hakkında bilgi almak için iletişim sayfamızdaki kanalları kullanabilirsiniz." }),
                ready("d2", { baslik: "Çocuk Diş Hekimliği Birimimiz", tarih: "2026-10-29", icerik: "Çocuk Diş Hekimliği birimimizin çalışma alanlarını Birimlerimiz menüsünden inceleyebilirsiniz." }),
                ready("d3", { baslik: "Estetik Diş Hekimliği Bilgilendirmesi", tarih: "2026-10-27", icerik: "Estetik Diş Hekimliği birimimiz hakkında bilgi almak için ilgili birim sayfamızı ziyaret edebilirsiniz." }),
                ready("d4", { baslik: "Hizmet Sayfalarımızı İnceleyin", tarih: "2026-10-25", icerik: "Ortodonti, diş beyazlatma ve implant hizmetlerine ait açıklamalara Hizmetlerimiz menüsünden ulaşabilirsiniz." }),
                ready("d5", { baslik: "Görüş ve Önerileriniz", tarih: "2026-10-23", icerik: "Görüş ve önerilerinizi iletişim sayfamız üzerinden paylaşabilirsiniz. Bu duyurular ders projesi için hazırlanmış örnek içeriklerdir." })
            ],
            sliderler: [
                ready("s1", { baslik: "Sağlıklı Dişler, Güvenle Gülümseyen Yüzler", altBaslik: "Ağız ve Diş Sağlığınız İçin", gorsel: "img/carousel-1.jpg", sayfa: "ortodonti.html", sira: 1 }),
                ready("s2", { baslik: "Estetik Bir Gülüş İçin Yanınızdayız", altBaslik: "Ağız ve Diş Sağlığınız İçin", gorsel: "img/carousel-2.jpg", sayfa: "dis-beyazlatma.html", sira: 2 }),
                ready("s3", { baslik: "Eksik Dişleriniz İçin Tedavi Seçeneklerini Keşfedin", altBaslik: "Diş İmplantları", gorsel: "img/carousel-1.jpg", sayfa: "implant.html", sira: 3 })
            ],
            sayfalar: [
                ready("p1", { baslik: "Hakkımızda", sayfa: "about.html", icerik: "Kliniğimizde koruyucu diş hekimliği, genel diş tedavileri ve estetik diş hekimliği alanlarında hizmet sunuyoruz. Hastalarımızın ihtiyaçlarını dinliyor ve hizmet seçeneklerini anlaşılır biçimde açıklıyoruz." }),
                ready("p2", { baslik: "Misyonumuz", sayfa: "misyon-vizyon.html", icerik: "Ağız ve diş sağlığı alanında hasta ihtiyaçlarını önemseyen, anlaşılır bilgilendirmeye ve özenli hizmete dayanan bir yaklaşım sunmak." }),
                ready("p3", { baslik: "Vizyonumuz", sayfa: "misyon-vizyon.html", icerik: "Hasta memnuniyetini, erişilebilirliği ve sürekli gelişimi temel alan bir diş sağlığı kliniği olmak." })
            ],
            iletisim: [ready("i1", { baslik: "DentCare Ağız ve Diş Sağlığı Polikliniği", adres: "Harbiye Mahallesi, Bostan Sokak, Nişantaşı, Şişli / İstanbul", telefon: "+90 (212) 000 00 00", eposta: "info@dentcare-ornek.com", enlem: 41.0499568, boylam: 28.9929205, saatler: "Hafta içi: 08.00–21.00\nCumartesi: 08.00–19.00\nPazar: Kapalı", instagram: "https://www.instagram.com/", facebook: "https://www.facebook.com/" })],
            istatistikler: [
                ...[["Haziran",42],["Temmuz",55],["Ağustos",48],["Eylül",64],["Ekim",72],["Kasım",49]].map(([baslik,deger],i) => ready("a"+i,{baslik,deger,grup:"aylik",donem:"2026"})),
                ...[["Genel Diş Muayenesi",100],["Ortodonti",85],["Diş Beyazlatma",60],["Diş İmplantları",50],["Çocuk Diş Hekimliği",35]].map(([baslik,deger],i) => ready("g"+i,{baslik,deger,grup:"hizmet",donem:"Haziran–Kasım 2026"}))
            ]
        };
    }

    function normalise(section, input) {
        const config = schema[section];
        if (!config) throw new Error("Yönetim bölümü bulunamadı.");
        const output = {};
        for (const f of config.fields) {
            const raw = String(input[f.key] ?? "").trim();
            if (f.required && !raw) throw new Error(f.label + " alanını doldurun.");
            if (raw.length > 10000) throw new Error(f.label + " alanı çok uzun.");
            if (f.type === "number" && raw) {
                const n = Number(raw);
                if (!Number.isFinite(n) || n < (f.min ?? 0) || (f.max !== undefined && n > f.max)) throw new Error(f.label + " için geçerli bir sayı girin.");
                if (f.step !== "any" && !Number.isInteger(n)) throw new Error(f.label + " için tam sayı girin.");
                output[f.key] = n;
            } else {
                if (f.options && !f.options.some(([value]) => value === raw)) throw new Error(f.label + " seçimini kontrol edin.");
                if (f.type === "date") {
                    const date = new Date(raw + "T12:00:00Z");
                    if (!/^\d{4}-\d{2}-\d{2}$/.test(raw) || Number.isNaN(date.getTime()) || date.toISOString().slice(0,10) !== raw) throw new Error("Geçerli bir tarih seçin.");
                }
                if (f.type === "email" && raw && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) throw new Error("Geçerli bir e-posta adresi girin.");
                if (f.type === "url" && raw && !/^https?:\/\/[^\s]+$/i.test(raw)) throw new Error("Web adresini https:// ile girin.");
                if (f.key === "sayfa" && raw && !/^[a-zA-Z0-9_-]+\.html$/.test(raw)) throw new Error("Sayfa adını implant.html biçiminde girin.");
                if (f.key === "gorsel" && raw && !/^img\/[a-zA-Z0-9_./-]+\.(png|jpe?g|webp|svg)$/i.test(raw)) throw new Error("Görsel yolunu img/dosya.jpg biçiminde girin.");
                output[f.key] = raw;
            }
        }
        const allowed = config.files === "image" ? /\.(png|jpe?g|webp)$/i : /\.(pdf|docx?|png|jpe?g|webp)$/i;
        output.dosyalar = [];
        if (config.files && Array.isArray(input.dosyalar)) {
            for (const file of input.dosyalar) {
                if (!file || typeof file.name !== "string" || !allowed.test(file.name)) throw new Error("Desteklenmeyen dosya türü.");
                if (!Number.isFinite(file.size) || file.size < 0) throw new Error("Dosya bilgisi geçersiz.");
                output.dosyalar.push({ name: file.name.slice(0,255), size: file.size });
            }
        }
        return output;
    }

    function createStore(storage) {
        const key = "dentcare-panel-demo-v1";
        let records = initial();
        let notice = "";
        try {
            const saved = storage && storage.getItem(key);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.version !== 1 || !parsed.records) throw new Error("Kayıt biçimi geçersiz.");
                const checked = {};
                for (const section of Object.keys(schema)) {
                    if (!Array.isArray(parsed.records[section])) throw new Error("Bölüm verisi eksik.");
                    const ids = new Set();
                    checked[section] = parsed.records[section].map(item => {
                        if (typeof item.id !== "string" || ids.has(item.id)) throw new Error("Kayıt numarası geçersiz.");
                        ids.add(item.id);
                        return { id: item.id, ...normalise(section,item) };
                    });
                }
                records = checked;
            }
        } catch {
            notice = "Önceki kayıtlar okunamadı. Panel örnek verilerle açıldı; bu oturumdaki değişikliklerinizi dışa aktarabilirsiniz.";
        }
        const copy = value => JSON.parse(JSON.stringify(value));
        function persist() {
            try {
                if (!storage) return false;
                storage.setItem(key, JSON.stringify({ version:1, records }));
                return true;
            } catch { return false; }
        }
        return {
            notice,
            list(section) {
                if (!schema[section]) throw new Error("Bölüm bulunamadı.");
                const list = copy(records[section]);
                if (section === "duyurular") list.sort((a,b) => b.tarih.localeCompare(a.tarih));
                if (section === "sliderler") list.sort((a,b) => a.sira - b.sira);
                return list;
            },
            save(section, input, id) {
                const value = normalise(section, input);
                const index = id ? records[section].findIndex(item => item.id === id) : -1;
                if (id && index < 0) throw new Error("Düzenlenecek kayıt bulunamadı.");
                const record = { id: id || "kayit-" + Date.now() + "-" + Math.random().toString(36).slice(2,9), ...value };
                if (index >= 0) records[section][index] = record;
                else records[section].push(record);
                return { record:copy(record), persisted:persist() };
            },
            remove(section, id) {
                if (!schema[section]) throw new Error("Bölüm bulunamadı.");
                const index = records[section].findIndex(item => item.id === id);
                if (index < 0) throw new Error("Silinecek kayıt bulunamadı.");
                records[section].splice(index,1);
                return { persisted:persist() };
            },
            export() { return JSON.stringify({ version:1, records:copy(records) },null,2); }
        };
    }
    globalThis.DentCarePanel = { schema, createStore, normalise };
})();
