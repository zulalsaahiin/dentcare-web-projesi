(() => {
    "use strict";

    // Ders projesine ait örnek veriler; gerçek hasta kayıtları değildir.
    const aylik = [
        { ay: "Haz", ad: "Haziran", sayi: 42 },
        { ay: "Tem", ad: "Temmuz", sayi: 55 },
        { ay: "Ağu", ad: "Ağustos", sayi: 48 },
        { ay: "Eyl", ad: "Eylül", sayi: 64 },
        { ay: "Eki", ad: "Ekim", sayi: 72 },
        { ay: "Kas", ad: "Kasım", sayi: 49 }
    ];
    const hizmetler = [
        { ad: "Genel Diş Muayenesi", sayi: 100, renk: "#087ca5" },
        { ad: "Ortodonti", sayi: 85, renk: "#142e50" },
        { ad: "Diş Beyazlatma", sayi: 60, renk: "#bb4a2b" },
        { ad: "Diş İmplantları", sayi: 50, renk: "#597d39" },
        { ad: "Çocuk Diş Hekimliği", sayi: 35, renk: "#8256a1" }
    ];
    const toplam = aylik.reduce((sum, item) => sum + item.sayi, 0);
    document.getElementById("ornek-randevu-toplam").textContent = toplam.toLocaleString("tr-TR");

    function svgElement(tag, attrs = {}, value) {
        const node = document.createElementNS("http://www.w3.org/2000/svg", tag);
        Object.entries(attrs).forEach(([key, val]) => node.setAttribute(key, val));
        if (value !== undefined) node.textContent = value;
        return node;
    }

    const bar = document.getElementById("aylik-grafik");
    const left = 62, top = 28, bottom = 305, plotWidth = 700;
    for (let value = 0; value <= 80; value += 20) {
        const y = bottom - value / 80 * (bottom - top);
        bar.appendChild(svgElement("line", { x1: left, y1: y, x2: left + plotWidth, y2: y, stroke: "#dae5eb" }));
        bar.appendChild(svgElement("text", { x: left - 15, y: y + 6, "text-anchor": "end" }, value));
    }
    aylik.forEach((item, index) => {
        const x = left + index * (plotWidth / aylik.length) + 26;
        const height = item.sayi / 80 * (bottom - top);
        const rect = svgElement("rect", { x, y: bottom - height, width: 62, height, rx: 5, class: "grafik-sutun" });
        rect.appendChild(svgElement("title", {}, item.ad + " 2026: " + item.sayi + " örnek randevu"));
        bar.appendChild(rect);
        bar.appendChild(svgElement("text", { x: x + 31, y: bottom - height - 12, "text-anchor": "middle", class: "grafik-deger" }, item.sayi));
        bar.appendChild(svgElement("text", { x: x + 31, y: bottom + 32, "text-anchor": "middle" }, item.ay));
    });

    const mobile = document.getElementById("aylik-mobil-grafik");
    const scale = document.createElement("p");
    scale.className = "small text-muted mb-0";
    scale.textContent = "Her çubuk 0–80 randevu ölçeğindedir.";
    mobile.appendChild(scale);
    aylik.forEach(item => {
        const row = document.createElement("div");
        row.className = "mobil-grafik-satir";
        const label = document.createElement("span");
        label.textContent = item.ad;
        const track = document.createElement("div");
        track.className = "mobil-grafik-arka";
        track.setAttribute("aria-hidden", "true");
        const fill = document.createElement("div");
        fill.className = "mobil-grafik-cubuk";
        fill.style.width = item.sayi / 80 * 100 + "%";
        track.appendChild(fill);
        const value = document.createElement("span");
        value.className = "mobil-grafik-sayi";
        value.textContent = item.sayi;
        row.append(label, track, value);
        mobile.appendChild(row);
    });

    const donut = document.getElementById("hizmet-grafik");
    const radius = 105, circumference = 2 * Math.PI * radius;
    let offset = 0;
    hizmetler.forEach((item) => {
        const length = item.sayi / toplam * circumference;
        const circle = svgElement("circle", {
            cx: 170, cy: 170, r: radius, fill: "none", stroke: item.renk,
            "stroke-width": 42, "stroke-dasharray": length + " " + (circumference - length),
            "stroke-dashoffset": -offset, transform: "rotate(-90 170 170)"
        });
        circle.appendChild(svgElement("title", {}, item.ad + ": " + item.sayi + " örnek randevu"));
        donut.appendChild(circle);
        offset += length;

        const li = document.createElement("li");
        const swatch = document.createElement("span");
        swatch.className = "renk";
        swatch.style.backgroundColor = item.renk;
        swatch.setAttribute("aria-hidden", "true");
        const label = document.createElement("span");
        label.textContent = item.ad;
        const value = document.createElement("span");
        value.className = "deger";
        value.textContent = item.sayi + " (%" + (100 * item.sayi / toplam).toFixed(1).replace(".", ",") + ")";
        li.append(swatch, label, value);
        document.getElementById("hizmet-legend").appendChild(li);
    });
    donut.appendChild(svgElement("text", { x: 170, y: 170, "text-anchor": "middle", class: "grafik-deger", style: "font-size:36px" }, toplam));
    donut.appendChild(svgElement("text", { x: 170, y: 199, "text-anchor": "middle" }, "örnek randevu"));

    function tabloyuDoldur(id, items) {
        const tbody = document.getElementById(id);
        items.forEach((item) => {
            const row = document.createElement("tr");
            const label = document.createElement("th");
            label.scope = "row";
            label.textContent = item.ad;
            const value = document.createElement("td");
            value.textContent = item.sayi;
            row.append(label, value);
            tbody.appendChild(row);
        });
    }
    tabloyuDoldur("aylik-tablo", aylik);
    tabloyuDoldur("hizmet-tablo", hizmetler);
})();
