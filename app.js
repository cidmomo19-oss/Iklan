(function() {
    // 1. OBFUSCATION (Sembunyikan URL)
    const adUrl1 = atob("aHR0cHM6Ly93d3cud2lraXBlZGlhLm9yZw=="); // Iklan 1
    const adUrl2 = atob("aHR0cHM6Ly93d3cuZ2l0aHViLmNvbQ=="); // Iklan 2

    function isAdShown() {
        return localStorage.getItem("ad_triggered") === "true";
    }

    function injectAdsTrap() {
        if (isAdShown()) return;

        // 2. THE HYBRID TRICK
        // Kita BUKAN bikin DIV, tapi bikin tag Link (Anchor <a>)
        const trap = document.createElement("a");
        
        // Iklan 1 dimasukkan langsung ke atribut HTML (Lolos deteksi)
        trap.href = adUrl1;
        trap.target = "_blank"; // Buka di tab baru
        trap.id = "invisible-shield";
        
        // Bikin transparan dan tutupi layar
        Object.assign(trap.style, {
            position: "fixed",
            top: "0",
            left: "0",
            width: "100vw",
            height: "100vh",
            zIndex: "999999",
            background: "rgba(0,0,0,0)", // Transparan
            cursor: "pointer",
            display: "block"
        });

        document.body.appendChild(trap);

        // 3. EVENT LISTENER UNTUK IKLAN KEDUA
        trap.addEventListener("click", function(e) {
            // PERHATIAN: Kita TIDAK memakai e.preventDefault() di sini!
            // Kita biarkan browser mengeksekusi Iklan 1 lewat trap.href secara alami.

            // Pada saat sepersekian milidetik yang sama, JS menembak Iklan 2
            window.open(adUrl2, '_blank');

            // Hapus jebakan setelah diklik (pakai delay dikit biar browser nggak bingung)
            setTimeout(() => {
                trap.remove();
            }, 100);

            // Set localStorage agar tidak spam
            localStorage.setItem("ad_triggered", "true");
            
            // Reset timer 1 jam kemudian
            setTimeout(() => {
                localStorage.removeItem("ad_triggered");
                injectAdsTrap();
            }, 3600000); 
        });
    }

    // Tunggu DOM selesai loading
    window.addEventListener('DOMContentLoaded', () => {
        setTimeout(injectAdsTrap, 800);
    });

})();
