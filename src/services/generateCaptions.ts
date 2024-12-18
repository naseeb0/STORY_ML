import * as fs from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';

interface WordTiming {
    word: string;
    start: number;
    end: number;
}

// Function to download and set up Whisper.cpp if not already present
async function setupWhisper(): Promise<string> {
    const whisperPath = path.join(process.cwd(), 'whisper');
    if (!fs.existsSync(whisperPath)) {
        fs.mkdirSync(whisperPath, { recursive: true });
        
        // Download Whisper.cpp (you'll need to implement this based on your OS)
        console.log('Downloading Whisper.cpp...');
        // TODO: Add download logic
    }
    return whisperPath;
}

export async function generateCaptionsFromAudio(audioPath: string, outputPath: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            const whisperPath = path.join(process.cwd(), 'whisper');
            const modelPath = path.join(whisperPath, 'models', 'ggml-base.en.bin');
            const whisperExe = path.join(whisperPath, 'whisper-cpp.exe');

            if (!fs.existsSync(whisperExe)) {
                throw new Error('Whisper executable not found. Please run npm run setup-whisper first.');
            }

            // Run Whisper command
            const whisperProcess = spawn(
                whisperExe,
                [
                    '-m', modelPath,
                    '-f', audioPath,
                    '--output-srt',
                    '-of', outputPath
                ]
            );

            whisperProcess.stdout.on('data', (data) => {
                console.log(`Whisper output: ${data}`);
            });

            whisperProcess.stderr.on('data', (data) => {
                console.error(`Whisper error: ${data}`);
            });

            whisperProcess.on('close', (code) => {
                if (code === 0) {
                    console.log(`Generated captions for ${path.basename(audioPath)}`);
                    resolve();
                } else {
                    reject(new Error(`Whisper process exited with code ${code}`));
                }
            });
        } catch (error) {
            console.error('Error generating captions:', error);
            reject(error);
        }
    });
}

// Function to watch for new audio files and automatically generate captions
export function watchAndGenerateCaptions(audioDir: string, subtitlesDir: string): void {
    if (!fs.existsSync(subtitlesDir)) {
        fs.mkdirSync(subtitlesDir, { recursive: true });
    }

    // Process existing files
    const audioFiles = fs.readdirSync(audioDir).filter(file => file.endsWith('.mp3'));
    for (const audioFile of audioFiles) {
        const audioPath = path.join(audioDir, audioFile);
        const srtFile = `subtitle${audioFile.replace('.mp3', '')}.srt`;
        const srtPath = path.join(subtitlesDir, srtFile);

        if (!fs.existsSync(srtPath)) {
            generateCaptionsFromAudio(audioPath, srtPath)
                .catch(error => console.error(`Failed to generate captions for ${audioFile}:`, error));
        }
    }

    // Watch for new files
    fs.watch(audioDir, (eventType, filename) => {
        if (eventType === 'rename' && filename && filename.endsWith('.mp3')) {
            const audioPath = path.join(audioDir, filename);
            const srtFile = `subtitle${filename.replace('.mp3', '')}.srt`;
            const srtPath = path.join(subtitlesDir, srtFile);

            // Check if file exists (to handle both creation and deletion events)
            if (fs.existsSync(audioPath) && !fs.existsSync(srtPath)) {
                generateCaptionsFromAudio(audioPath, srtPath)
                    .catch(error => console.error(`Failed to generate captions for ${filename}:`, error));
            }
        }
    });
}

export async function generateAllCaptions(): Promise<void> {
    const audioDir = path.join(process.cwd(), 'public', 'audio');
    const subtitlesDir = path.join(process.cwd(), 'public', 'subtitles');
    
    // Start watching for new audio files
    watchAndGenerateCaptions(audioDir, subtitlesDir);
}
