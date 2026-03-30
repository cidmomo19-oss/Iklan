(function() {
    // 1. OBFUSCATION (Menyamarkan Link)
    // Gunakan atob() untuk mengubah Base64 menjadi URL asli
    // aHR0cHM6Ly93d3cud2lraXBlZGlhLm9yZw== -> https://www.wikipedia.org
    // aHR0cHM6Ly93d3cuZ2l0aHViLmNvbQ== -> https://www.github.com
    const adUrl1 = atob("aHR0cHM6Ly93d3cud2lraXBlZGlhLm9yZw=="); 
    const adUrl2 = atob("aHR0cHM6Ly93d3cuZ2l0aHViLmNvbQ==");

    // 2. FREQUENCY CAPPING (Agar user nggak curiga)
    // Cek apakah hari ini user sudah kena jebakan iklan?
    function isAdShown() {
        return localStorage.getItem("ad_triggered") === "true";
    }

    // 3. DYNAMIC INJECTION (Membangun jebakan via JS, bukan HTML)
    function injectAdsTrap() {
        if (isAdShown()) return; // Kalau sudah pernah kena, hentikan fungsi.

        // Bikin elemen div transparan raksasa penutup layar
        const trap = document.createElement("div");
        trap.id = "invisible-shield";
        
        // Styling CSS langsung di JS agar tidak ada jejak di style.css
        Object.assign(trap.style, {
            position: "fixed",
            top: "0",
            left: "0",
            width: "100vw",
            height: "100vh",
            zIndex: "999999", // Paling atas menutupi semua tombol
            background: "rgba(0,0,0,0)", // 100% Transparan
            cursor: "pointer"
        });

        // Masukkan ke dalam HTML (Body)
        document.body.appendChild(trap);

        // 4. EVENT LISTENER (Saat dijebak)
        trap.addEventListener("click", function(e) {
            e.preventDefault(); // Mencegah fungsi klik standar

            // Buka 2 Tab Sekaligus
            window.open(adUrl1, '_blank');
            window.open(adUrl2, '_blank');

            // Hapus jebakan dari halaman, agar tombol asli bisa diklik
            trap.remove();

            // Set LocalStorage agar iklan tidak muncul lagi hari ini
            // (Atau atur timer misalnya 1 jam kemudian baru muncul lagi)
            localStorage.setItem("ad_triggered", "true");
            
            // Opsi: Reset timer setelah 1 jam (3600000 ms)
            setTimeout(() => {
                localStorage.removeItem("ad_triggered");
                injectAdsTrap(); // Pasang jebakan lagi
            }, 3600000); 
        });
    }

    // Tunggu sampai seluruh web selesai di-load, baru jalankan script
    window.addEventListener('DOMContentLoaded', (event) => {
        // Beri sedikit delay (misal 1 detik) agar tidak terlihat agresif oleh Adblock
        setTimeout(injectAdsTrap, 1000);
    });

})();
