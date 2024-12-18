import { generateAllCaptions } from '../src/services/generateCaptions';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
    try {
        await generateAllCaptions();
        console.log('Successfully generated all captions!');
    } catch (error) {
        console.error('Error generating captions:', error);
        process.exit(1);
    }
}

main();
