
import { GoogleGenAI } from "@google/genai";
import fs from 'fs';
import path from 'path';

async function main() {
    try {
        const envPath = path.join(process.cwd(), '.env.local');
        if (!fs.existsSync(envPath)) {
            console.log("No .env.local found");
            return;
        }
        
        const envContent = fs.readFileSync(envPath, 'utf-8');
        const match = envContent.match(/API_KEY=(.+)/);
        const apiKey = match ? match[1].trim() : null;

        if (!apiKey) {
            console.error("No API_KEY found in .env.local");
            return;
        }

        console.log(`Using Key: ${apiKey.substring(0, 5)}...`);

        const ai = new GoogleGenAI({ apiKey });
        
        console.log("Listing models...");
        const response = await ai.models.list();
        
        // The new SDK returns a page or list
        if (response) {
            // @ts-ignore
             for (const m of response) {
                 if (m.name.includes('flash') || m.name.includes('pro')) {
                     console.log(`Model: ${m.name}`);
                     console.log(`   - Methods: ${m.supportedGenerationMethods}`);
                 }
             }
        } else {
            console.log("Response format unexpected:", response);
        }

    } catch (e) {
        console.error("Error listing models:", e);
    }
}

main();
