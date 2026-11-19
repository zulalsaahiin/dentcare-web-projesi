(() => {
    "use strict";
    const { schema, createStore } = globalThis.DentCarePanel;
    let storage;
    try { storage = window.localStorage; } catch { storage = null; }
    const store = createStore(storage);
    const view = document.getElementById("panel-gorunum");
    const menu = document.getElementById("panel-menu");
    const heading = document.getElementById("panel-baslik");
    const message = document.getElementById("panel-bildirim");
    let section = "genel";
    let dirty = false;

    function el(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }
    function button(text, className, action) {
        const node = el("button", "dugme " + (className || ""), text);
        node.type = "button";
        node.addEventListener("click", action);
        return node;
    }
    function notify(text, error = false) {
        message.textContent = text;
        message.className = "bildirim" + (error ? " hata" : "");
        message.hidden = false;
    }
    function persistedMessage(result, text) {
        notify(text + (result.persisted ? " Bu tarayıcıya kaydedildi." : " Kalıcı kayıt kullanılamıyor; değişiklik yalnızca bu oturumda tutuluyor. Verileri dışa aktarabilirsiniz."), !result.persisted);
    }
    function canLeave() {
        return !dirty || window.confirm("Kaydedilmemiş değişiklikler var. Bu ekrandan ayrılmak istiyor musunuz?");
    }
    function focusHeading() { heading.tabIndex = -1; heading.focus(); }
    function navigate(next) {
        if (!canLeave()) return;
        dirty = false;
        section = next;
        message.hidden = true;
        heading.textContent = section === "genel" ? "Genel Bakış" : schema[section].label;
        menu.querySelectorAll("button").forEach(node => {
            if (node.dataset.section === section) node.setAttribute("aria-current", "page");
            else node.removeAttribute("aria-current");
        });
        if (section === "genel") dashboard();
        else listView();
        focusHeading();
    }
    for (const [key, label] of [["genel", "Genel Bakış"], ...Object.entries(schema).map(([key, cfg]) => [key, cfg.label])]) {
        const nav = button(label, "", () => navigate(key));
        nav.className = "menu-dugme";
        nav.dataset.section = key;
        menu.appendChild(nav);
    }

    function dashboard() {
        view.replaceChildren();
        const grid = el("div", "ozet-grid");
        Object.entries(schema).forEach(([key, cfg]) => {
            const card = el("div", "kart");
            card.append(el("p", "ozet-ad", cfg.label), el("p", "ozet-sayi", store.list(key).length), button("Yönet", "ikincil kucuk", () => navigate(key)));
            grid.appendChild(card);
        });
        const help = el("section", "kart");
        help.append(el("h2", "", "İçeriklerinizi Tek Yerden Düzenleyin"), el("p", "", "Soldan bir bölüm seçin. Yeni kayıt ekleyebilir, mevcut kaydı düzenleyebilir, önizleyebilir veya silebilirsiniz. Hazır ve Taslak durumları yalnızca panel içindeki hazırlık aşamasını belirtir; bir yayınlama işlemi yapılmaz."));
        help.append(el("p", "", "Hizmet ücretleri, hekimler, duyurular ve istatistikler örnek içeriklerdir. Paneldeki değişiklikler ziyaretçi sayfalarına otomatik uygulanmaz."));
        help.append(button("Panel Verilerini Dışa Aktar", "", exportData));
        view.append(grid, help);
    }
    function exportData() {
        const blob = new Blob([store.export()], { type:"application/json;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = el("a");
        link.href = url;
        link.download = "dentcare-panel-verileri.json";
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        notify("Panel verileri JSON dosyası olarak dışa aktarıldı. Bu dosya ziyaretçi sayfalarını otomatik güncellemez.");
    }
    function detailValue(item) {
        if (section === "hizmetler") return Number(item.ucret).toLocaleString("tr-TR") + " TL · örnek";
        if (section === "duyurular") return item.tarih.split("-").reverse().join(".");
        if (section === "sliderler") return "Sıra: " + item.sira;
        if (section === "istatistikler") return item.deger + " · " + item.donem;
        if (section === "iletisim") return item.telefon;
        return item.sayfa || "—";
    }
    function listView() {
        view.replaceChildren();
        const cfg = schema[section];
        const top = el("div", "bolum-ust");
        const intro = el("div");
        intro.append(el("h2", "", cfg.label), el("p", "", cfg.description));
        top.append(intro, button("Yeni Kayıt Ekle", "", () => formView()));
        const wrapper = el("div", "tablo-kapsayici");
        const table = el("table");
        table.appendChild(el("caption", "", cfg.label + " kayıtları"));
        const thead = el("thead"), tr = el("tr");
        ["Başlık", "Bilgi", "Ekler", "Durum", "İşlemler"].forEach(text => {
            const th = el("th", "", text); th.scope = "col"; tr.appendChild(th);
        });
        thead.appendChild(tr); table.appendChild(thead);
        const tbody = el("tbody");
        const records = store.list(section);
        if (!records.length) {
            const row = el("tr"), td = el("td", "bos", "Henüz kayıt yok. Yeni Kayıt Ekle ile başlayabilirsiniz.");
            td.colSpan = 5; row.appendChild(td); tbody.appendChild(row);
        }
        records.forEach(item => {
            const row = el("tr"), title = el("td");
            title.appendChild(el("span", "hucre-baslik", item.baslik));
            const summary = item.ozet || item.icerik || item.adres || item.altBaslik;
            if (summary) title.appendChild(el("span", "hucre-ozet", summary.length > 115 ? summary.slice(0,115) + "…" : summary));
            const attachments = el("td", "", item.dosyalar.length ? item.dosyalar.length + " dosya" : "—");
            const status = el("td");
            status.appendChild(el("span", "durum " + (item.durum === "hazir" ? "hazir" : ""), item.durum === "hazir" ? "Hazır" : "Taslak"));
            const actions = el("td"), controls = el("div", "satir-islemleri");
            const edit = button("Düzenle", "ikincil kucuk", () => formView(item));
            edit.setAttribute("aria-label", item.baslik + " kaydını düzenle");
            const preview = button("Önizle", "ikincil kucuk", () => previewView(item));
            preview.setAttribute("aria-label", item.baslik + " kaydını önizle");
            const remove = button("Sil", "sil kucuk", () => {
                if (!window.confirm('"' + item.baslik + '" panel kaydını silmek istiyor musunuz? Ziyaretçi sayfaları etkilenmez.')) return;
                try {
                    const result = store.remove(section, item.id);
                    listView();
                    persistedMessage(result, "Panel kaydı silindi.");
                } catch (error) { notify(error.message,true); }
            });
            remove.setAttribute("aria-label", item.baslik + " kaydını sil");
            controls.append(edit,preview,remove); actions.appendChild(controls);
            row.append(title,el("td", "", detailValue(item)),attachments,status,actions); tbody.appendChild(row);
        });
        table.appendChild(tbody); wrapper.appendChild(table); view.append(top,wrapper);
    }
    function previewView(item) {
        view.replaceChildren();
        const card = el("section", "kart");
        card.append(el("h2", "", item.baslik), el("p", "ipucu", "Bu önizleme panel kaydına aittir; ziyaretçi sayfasını değiştirmez."));
        const dl = el("dl", "onizleme");
        schema[section].fields.forEach(f => {
            let value = item[f.key];
            if (f.options) value = f.options.find(([key]) => key === String(value))?.[1] || value;
            dl.append(el("dt", "", f.label), el("dd", "", String(value ?? "") || "—"));
        });
        card.appendChild(dl);
        if (item.dosyalar.length) {
            card.appendChild(el("h3", "", "Dosya Ekleri"));
            const ul = el("ul", "dosya-listesi");
            item.dosyalar.forEach(file => ul.appendChild(el("li", "", file.name)));
            card.append(ul,el("p", "ipucu", "Yalnızca dosya adları kayıtlıdır; dosya içeriği yüklenmemiştir."));
        }
        const controls = el("div", "form-islemleri");
        controls.append(button("Listeye Dön", "ikincil", listView),button("Düzenle", "", () => formView(item)));
        card.appendChild(controls); view.appendChild(card);
    }
    function formView(item) {
        if (!canLeave()) return;
        dirty = false;
        message.hidden = true;
        view.replaceChildren();
        const cfg = schema[section], card = el("section", "kart");
        card.append(el("h2", "", cfg.singular + (item ? " Düzenle" : " Ekle")),el("p", "ipucu", "Yıldızlı alanlar zorunludur. Kaydet işlemi yalnızca bu paneldeki örnek kaydı günceller."));
        const form = el("form"), grid = el("div", "form-grid");
        cfg.fields.forEach(f => {
            const group = el("div", "alan" + (f.type === "textarea" ? " tam" : ""));
            const label = el("label", "", f.label + (f.required ? " *" : ""));
            label.htmlFor = "panel-" + f.key;
            const input = el(f.type === "textarea" ? "textarea" : f.type === "select" ? "select" : "input");
            input.id = label.htmlFor; input.name = f.key; input.required = f.required;
            if (f.type !== "textarea" && f.type !== "select") input.type = f.type;
            if (f.type === "select") {
                f.options.forEach(([value,text]) => { const opt = el("option", "", text); opt.value = value; input.appendChild(opt); });
            }
            if (f.type === "number") { input.min = f.min ?? 0; input.step = f.step || "1"; if (f.max !== undefined) input.max = f.max; }
            if (f.type === "textarea") { input.rows = 5; input.maxLength = 10000; }
            if (["text","email","tel","url"].includes(f.type)) input.maxLength = 1000;
            if (item && item[f.key] !== undefined) input.value = item[f.key];
            else if (f.key === "durum") input.value = "taslak";
            else if (f.type === "date") { const now=new Date(); input.value=[now.getFullYear(),String(now.getMonth()+1).padStart(2,"0"),String(now.getDate()).padStart(2,"0")].join("-"); }
            group.append(label,input);
            if (f.key === "sayfa") group.appendChild(el("p", "ipucu", "Örnek: implant.html. Bu alan yeni bir HTML dosyası oluşturmaz."));
            if (f.key === "gorsel") group.appendChild(el("p", "ipucu", "Örnek: img/carousel-1.jpg"));
            if (f.key === "ucret") group.appendChild(el("p", "ipucu", "Tutar ders projesi içindir. 0, ücretin henüz belirlenmediğini gösterir."));
            grid.appendChild(group);
        });
        let files = (item?.dosyalar || []).map(file => ({...file}));
        if (cfg.files) {
            const group = el("div", "alan tam"), label = el("label", "", cfg.files === "document" ? "PDF, Word ve Resim Ekleri" : "Resim Eki");
            label.htmlFor = "panel-dosya";
            const input = el("input"); input.type = "file"; input.id = label.htmlFor; input.multiple = true;
            input.accept = cfg.files === "document" ? ".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp" : ".png,.jpg,.jpeg,.webp";
            input.setAttribute("aria-describedby", "dosya-aciklama");
            const hint = el("p", "ipucu", "Dosya seçimini gösteren demo alanıdır. Yalnızca ad ve boyut kaydedilir; dosyanın kendisi yüklenmez."); hint.id = "dosya-aciklama";
            const list = el("div");
            function drawFiles() {
                list.replaceChildren();
                files.forEach((file,index) => {
                    const row = el("div", "dosya-satiri");
                    const remove = button("Eki Kaldır", "ikincil kucuk", () => { files.splice(index,1); dirty = true; drawFiles(); });
                    remove.setAttribute("aria-label", file.name + " ekini kaldır");
                    row.append(el("span", "", file.name + " · " + Math.ceil(file.size / 1024) + " KB"),remove); list.appendChild(row);
                });
            }
            input.addEventListener("change", () => {
                const added = Array.from(input.files || []).map(file => ({ name:file.name,size:file.size }));
                const allowed = cfg.files === "document" ? /\.(pdf|docx?|png|jpe?g|webp)$/i : /\.(png|jpe?g|webp)$/i;
                if (added.some(file => !allowed.test(file.name))) { input.value = ""; notify("Seçilen dosya türü bu bölümde desteklenmiyor.",true); return; }
                added.forEach(file => { if (!files.some(existing => existing.name === file.name && existing.size === file.size)) files.push(file); });
                input.value = ""; dirty = true; drawFiles();
            });
            drawFiles(); group.append(label,input,hint,list); grid.appendChild(group);
        }
        form.appendChild(grid);
        const controls = el("div", "form-islemleri");
        const save = el("button", "dugme", "Kaydet"); save.type = "submit";
        controls.append(save,button("Vazgeç", "ikincil", () => { if (canLeave()) { dirty=false;listView(); } }));
        form.appendChild(controls);
        form.addEventListener("input", () => { dirty=true; });
        form.addEventListener("change", () => { dirty=true; });
        form.addEventListener("submit", event => {
            event.preventDefault();
            if (!form.reportValidity()) return;
            const record = Object.fromEntries(new FormData(form).entries());
            record.dosyalar = files;
            try {
                const result = store.save(section,record,item?.id);
                dirty=false; listView();
                persistedMessage(result,"Panel kaydı " + (item ? "güncellendi." : "eklendi."));
                message.focus();
            } catch(error) { notify(error.message,true); message.scrollIntoView({block:"nearest"}); }
        });
        card.appendChild(form); view.appendChild(card);
    }
    window.addEventListener("beforeunload", event => { if(dirty) { event.preventDefault(); event.returnValue=""; } });
    navigate("genel");
    if (store.notice) notify(store.notice,true);
    else if (!storage) notify("Tarayıcıda kalıcı kayıt kullanılamıyor. Değişiklikler bu oturumda tutulacak; dışa aktararak saklayabilirsiniz.",true);
})();
