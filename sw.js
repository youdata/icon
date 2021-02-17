importScripts("cache-polyfill.js")

var PREFIX = "icon"
var CACHE_VERSION = 'icon-v0.0.3';
var CACHE_FILES = [
    "./manifest.json",
    "./lib/sand.js", 
    "./index.html", 
    "./fonts/XinDiZhaoMeng-1.woff",
    "./fonts/Zhuan.woff",
    "./img/icon-192.png",
    "./img/icon-512.png",
    "./panel.json",
    "./Loading_icon.gif",
    "./style/font.css",
    "./fonts/MaterialIcons.woff2"
];

const cacheResources = async () => {
  const cache = await caches.open(CACHE_VERSION)
  return cache.addAll(CACHE_FILES)
}

self.addEventListener('install', event =>
  event.waitUntil(cacheResources())
)
const myfetch = async req => {
}


const cachedResource = async req => {
  const cache = await caches.open(CACHE_VERSION)
  return await cache.match(req, {'ignoreSearch': true} ).then(function(response) {
                return response || fetch(req).then(function(response) {
                    return response;
                }).catch(function(e){
                    return "not found";
                });
    })
}

self.addEventListener('fetch', event =>
  event.respondWith(cachedResource(event.request))
)
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(keys) {
            return Promise.all(keys.map(function(key, i) {
                var a = key.split("-")
                if (a[0] !== PREFIX) {
                    return 
                }
                if (key !== CACHE_VERSION) {
                    return caches.delete(keys[i]);
                }
            }))
        })
    )
});

self.addEventListener('message', function(event) {
    if (event.data.action === 'skipWaiting') {
        try {
        console.log("calling skipWaiting")
        self.skipWaiting();
        } catch(e) {
            console.log(e)
        }   
    }
    //VERSION API STANDARD For ServiceWorkerBar
    if (event.data.command == "version") {
        event.ports[0].postMessage({
            "version":CACHE_VERSION
        })
    }
});
