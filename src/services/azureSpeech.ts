import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

export const synthesizeSpeech = async (text: string, apiKey: string, region: string): Promise<ArrayBuffer> => {
    const speechConfig = sdk.SpeechConfig.fromSubscription(apiKey, region);
    speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural";
    
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig);
    
    return new Promise((resolve, reject) => {
        synthesizer.speakTextAsync(
            text,
            result => {
                if (result.audioData) {
                    resolve(result.audioData);
                } else {
                    reject(new Error('No audio data received'));
                }
                synthesizer.close();
            },
            error => {
                synthesizer.close();
                reject(error);
            }
        );
    });
};
