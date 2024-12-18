import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { createWriteStream } from 'fs';
import { promisify } from 'util';
import { pipeline } from 'stream';
import { Extract } from 'unzipper';

const streamPipeline = promisify(pipeline);

// Updated Windows binary URL with correct release name
const WHISPER_WINDOWS_URL = 'https://github.com/ggerganov/whisper.cpp/releases/download/v1.5.4/whisper-cpp-v1.5.4-windows.zip';
const MODEL_URL = 'https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.en.bin';

async function downloadFile(url: string, outputPath: string): Promise<void> {
    console.log(`Downloading from ${url}...`);
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
        maxRedirects: 5
    });

    await streamPipeline(response.data, createWriteStream(outputPath));
}

async function setupWhisper(): Promise<void> {
    const whisperDir = path.join(process.cwd(), 'whisper');
    const modelDir = path.join(whisperDir, 'models');
    const tempFile = path.join(whisperDir, 'whisper.zip');

    // Create directories
    if (!fs.existsSync(whisperDir)) {
        fs.mkdirSync(whisperDir, { recursive: true });
    }
    if (!fs.existsSync(modelDir)) {
        fs.mkdirSync(modelDir, { recursive: true });
    }

    try {
        // Download Windows binary
        console.log('Downloading Whisper.cpp Windows binary...');
        await downloadFile(WHISPER_WINDOWS_URL, tempFile);

        // Extract binary
        console.log('Extracting binary...');
        await fs.createReadStream(tempFile)
            .pipe(Extract({ path: whisperDir }))
            .promise();

        // Clean up temp file
        fs.unlinkSync(tempFile);

        // Download model
        console.log('Downloading model...');
        const modelPath = path.join(modelDir, 'ggml-base.en.bin');
        if (!fs.existsSync(modelPath)) {
            await downloadFile(MODEL_URL, modelPath);
        }

        console.log('Whisper.cpp setup complete!');
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Download error:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                url: error.config?.url
            });
        }
        console.error('Error setting up Whisper:', error);
        throw error;
    }
}

setupWhisper().catch(console.error);
