const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const path = require('path');

const CACHE_FILE = path.join('/tmp', 'arduino_lib_cache.json');

// Function to extract version from HTML
function getVersion(html) {
    const versionMatch = html.match(/(\d+\.\d+\.\d+)<\/a>\s+\(latest\)/);
    return versionMatch ? versionMatch[1] : null;
}

// Function to extract name from HTML
function getName(html) {
    const nameMatch = html.match(/<h1>(.*?)<\/h1>/);
    return nameMatch ? nameMatch[1] : null;
}

// Load cache from file
let cache = {};
if (fs.existsSync(CACHE_FILE)) {
    const cacheData = fs.readFileSync(CACHE_FILE);
    cache = JSON.parse(cacheData);
}

const server = http.createServer((req, res) => {
    const query = url.parse(req.url, true).query;
    const lib = query.lib;

    if (!lib) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Library name is required');
        return;
    }

    const cacheKey = `arduino_lib_${lib}`;

    if (cache[cacheKey] && (Date.now() - cache[cacheKey].timestamp < 86400000)) { // 1 day in milliseconds
        const data = cache[cacheKey].data;
        sendBadgeUrl(res, data.name, data.version);
    } else {
        const libraryUrl = `https://www.arduino.cc/reference/en/libraries/${lib.toLowerCase().replace(/\s+/g, '-')}/`;

        https.get(libraryUrl, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                const version = getVersion(data);
                const name = getName(data);

                if (name && version) {
                    cache[cacheKey] = {
                        data: { name, version },
                        timestamp: Date.now()
                    };
                    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache));
                    sendBadgeUrl(res, name, version);
                } else {
                    sendErrorBadge(res, lib);
                }
            });
        }).on('error', () => {
            sendErrorBadge(res, lib);
        });
    }
});

function sendBadgeUrl(res, name, version) {
    const badgeUrl = `https://img.shields.io/badge/Library%20Manager-${encodeURIComponent(name)}%20${encodeURIComponent(version)}-green?logo=arduino&color=%233C1`;
    res.writeHead(302, { 'Location': badgeUrl });
    res.end();
}

function sendErrorBadge(res, lib) {
    const badgeUrl = `https://img.shields.io/badge/Library%20Manager-${encodeURIComponent(lib)}-red?logo=arduino`;
    res.writeHead(302, { 'Location': badgeUrl });
    res.end();
}

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
