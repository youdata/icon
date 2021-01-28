var count = 0
var appChan = new BroadcastChannel("mos")
var buffer = []

function nameToIdx(s) {
    if (s == "Main") return 1
    return parseInt(s.replace("Extend-", "")) + 1
}
appChan.onmessage = function(d) {
    if (d.data.code == "bye") {
        var k = nameToIdx(d.data.id)
        if (k == count) {
            count -= 1
        } else {
            buffer.push(k)
        }
    }
}
onconnect = function(e) {
    var port = e.ports[0];
    appChan.postMessage("worker postmessage from mos channel")
    port.onmessage = function(e) {
        console.log("in worker",e)
        if (e.data.code == "get") {
            if (buffer.length == 0) {
                count += 1
                port.postMessage(count);
            } else {
                var k = buffer.pop()
                port.postMessage(k);
            }
        } else {
            port.postMessage("other")
        }
    }

}
