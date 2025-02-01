const http = require('http');
const { net } = require('electron');

async function initSession() {
    // Get an ephemeral key from your server - see server code below
    return new Promise((resolve, reject) => {
        const tokenRequest = http.request("http://localhost:5500/realtime/session", (response) => {
            let body = '';
            response.on('data', (chunk) => {
                body += chunk;
            });
            response.on('end', () => {
                try {
                    const data = JSON.parse(body);
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            });
        });

        tokenRequest.on('error', (error) => {
            reject(error);
        });

        tokenRequest.end();
    });
}

async function getSdpResponse(event, session, offer) {
    const baseUrl = "https://api.openai.com/v1/realtime";

    const response = await net.fetch(`${baseUrl}?model=${session.model}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${session.client_secret.value}`,
            "Content-Type": "application/sdp",
        },
        body: offer.sdp
    });

    if (response.ok) {
        const result = await response.text();
        console.log('Success:', result);
        return result;
    } else {
        console.error('Error:', response.statusText);
    }

}

module.exports = { initSession, getSdpResponse };
