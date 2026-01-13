const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

const app = express();
const port = process.env.PORT || 3001; // Support Render PORT or default to 3001

app.use(cors());
app.use(express.json());

// Edge TTS Configuration
const TRUSTED_CLIENT_TOKEN = '6A5AA1D4EAFF4E9FB37E23D68491D6F4';

// Helper to generate Sec-MS-GEC token
const generateSecMsGec = () => {
    // Windows file time epoch is 1601-01-01. Unix is 1970-01-01. Difference is 11644473600 seconds.
    const ticks = Math.floor(Date.now() / 1000) + 11644473600;
    // Round down to nearest 5 minutes (300 seconds)
    const rounded = ticks - (ticks % 300);
    // 1 second = 10,000,000 ticks.
    const windowsTicks = rounded * 10000000; 
    
    // Create the string to hash: ticks + token
    const strToHash = `${windowsTicks}${TRUSTED_CLIENT_TOKEN}`;
    
    // Hash using SHA-256
    return crypto.createHash('sha256').update(strToHash).digest('hex').toUpperCase();
};

const getEdgeWssUrl = (requestId) => {
    const secMsGec = generateSecMsGec();
    const version = '1-143.0.3650.96'; 
    return `wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=${TRUSTED_CLIENT_TOKEN}&Sec-MS-GEC=${secMsGec}&Sec-MS-GEC-Version=${version}&ConnectionId=${requestId}`;
};

// Voice Mapping
const VOICES = {
    'vi-VN': 'vi-VN-NamMinhNeural', // Default Vietnamese
    'vi-VN-Male': 'vi-VN-NamMinhNeural',
    'vi-VN-Female': 'vi-VN-HoaiMyNeural',
    'en-US': 'en-US-AriaNeural',
    'en-US-Male': 'en-US-GuyNeural',
    'en-US-Female': 'en-US-AriaNeural'
};

const createSSML = (text, voiceName, rate = '0%') => {
    return `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'>
        <voice name='${voiceName}'>
            <prosody pitch='+0Hz' rate='${rate}' volume='+0%'>${text}</prosody>
        </voice>
    </speak>`;
};

const getEdgeAudio = async (text, voice) => {
    return new Promise((resolve, reject) => {
        const requestId = uuidv4().replace(/-/g, '');
        const wsUrl = getEdgeWssUrl(requestId);

        const ws = new WebSocket(wsUrl, {
            headers: {
                'Pragma': 'no-cache',
                'Cache-Control': 'no-cache',
                'Origin': 'chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0'
            }
        });

        const audioChunks = [];

        ws.on('open', () => {
            // 1. Send Config
            const configData = JSON.stringify({
                context: {
                    synthesis: {
                        audio: {
                            metadataoptions: { sentenceBoundaryEnabled: "false", wordBoundaryEnabled: "false" },
                            outputFormat: "audio-24khz-48kbitrate-mono-mp3"
                        }
                    }
                }
            });
            
            ws.send(`X-Timestamp:${new Date().toString()}\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n${configData}`);

            // 2. Send SSML
            const ssml = createSSML(text, voice);
            ws.send(`X-RequestId:${requestId}\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:${new Date().toString()}\r\nPath:ssml\r\n\r\n${ssml}`);
        });

        ws.on('message', (data, isBinary) => {
            if (isBinary) {
                // Header length is 2 bytes (big endian)
                const headerLength = (data[0] << 8) | data[1];
                if (data.length > headerLength + 2) {
                    const audioData = data.slice(headerLength + 2);
                    audioChunks.push(audioData);
                }
            } else {
                const message = data.toString();
                if (message.includes('Path:turn.end')) {
                    ws.close();
                }
            }
        });

        ws.on('close', () => {
             const finalBuffer = Buffer.concat(audioChunks);
             resolve(finalBuffer);
        });

        ws.on('error', (err) => {
            reject(err);
        });
    });
};

app.get('/tts', async (req, res) => {
    try {
        const { text, lang } = req.query;
        if (!text) return res.status(400).send('Text is required');

        const voiceKey = lang || 'vi-VN';
        const voiceName = VOICES[voiceKey] || VOICES['vi-VN'];

        console.log(`TTS Request: ${text.substring(0, 20)}... [${voiceName}]`);

        const audioBuffer = await getEdgeAudio(text, voiceName);
        
        res.set({
            'Content-Type': 'audio/mpeg',
            'Content-Length': audioBuffer.length
        });
        
        res.send(audioBuffer);

    } catch (error) {
        console.error('TTS Error:', error);
        res.status(500).send('TTS Generation Failed');
    }
});

app.listen(port, () => {
    console.log(`Edge TTS Server running at http://localhost:${port}`);
});