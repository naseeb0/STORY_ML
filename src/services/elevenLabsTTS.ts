import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

namespace ElevenLabsService {
    const ELEVEN_LABS_API_KEY = 'sk_4c2eec51741005f0f7f915cd8b990b840ecfd8a64e3e7f23';
    const BRAIN_VOICE_ID = 'nPczCjzI2devNBz1zQrb';

    export const generateSpeech = async (text: string, outputFileName: string): Promise<string> => {
        try {
            const response = await axios({
                method: 'POST',
                url: `https://api.elevenlabs.io/v1/text-to-speech/${BRAIN_VOICE_ID}`,
                headers: {
                    'Accept': 'audio/mpeg',
                    'Content-Type': 'application/json',
                    'xi-api-key': ELEVEN_LABS_API_KEY
                },
                data: {
                    text,
                    model_id: 'eleven_monolingual_v1',
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.75
                    }
                },
                responseType: 'arraybuffer'
            });

            const audioDir = path.join(process.cwd(), 'public', 'audio');
            if (!fs.existsSync(audioDir)) {
                fs.mkdirSync(audioDir, { recursive: true });
            }

            const outputPath = path.join(audioDir, `${outputFileName}.mp3`);
            fs.writeFileSync(outputPath, response.data);
            
            return `/audio/${outputFileName}.mp3`;
        } catch (error) {
            console.error('Error generating speech:', error);
            throw error;
        }
    };

    export const generateAllSpeeches = async (texts: string[]): Promise<string[]> => {
        const audioUrls: string[] = [];
        
        for (let i = 0; i < texts.length; i++) {
            console.log(`Generating audio ${i + 1}/${texts.length}...`);
            const url = await generateSpeech(texts[i], `audio${i + 1}`);
            audioUrls.push(url);
            
            if (i < texts.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        return audioUrls;
    };
}

export = ElevenLabsService;
