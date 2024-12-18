import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

interface TTSOptions {
  voice?: string;
  pitch?: string;
  rate?: string;
}

export const synthesizeSpeech = async (
  text: string,
  apiKey: string,
  region: string,
  options: TTSOptions = {}
): Promise<string> => {
  const speechConfig = sdk.SpeechConfig.fromSubscription(apiKey, region);
  
  // Set voice (default to Jenny)
  speechConfig.speechSynthesisVoiceName = options.voice || 'en-US-JennyNeural';
  
  // Create SSML with prosody settings
  const ssml = `
    <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
      <voice name="${speechConfig.speechSynthesisVoiceName}">
        <prosody pitch="${options.pitch || '0%'}" rate="${options.rate || '0%'}">
          ${text}
        </prosody>
      </voice>
    </speak>`;

  const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

  return new Promise((resolve, reject) => {
    synthesizer.speakSsmlAsync(
      ssml,
      result => {
        if (result.audioData) {
          // Convert audio data to base64
          const base64Audio = Buffer.from(result.audioData).toString('base64');
          const audioUrl = `data:audio/wav;base64,${base64Audio}`;
          synthesizer.close();
          resolve(audioUrl);
        } else {
          synthesizer.close();
          reject(new Error('No audio data received'));
        }
      },
      error => {
        synthesizer.close();
        reject(error);
      }
    );
  });
};

// Function to generate speech for multiple texts in parallel
export const generateSpeeches = async (
  texts: string[],
  apiKey: string,
  region: string,
  options: TTSOptions = {}
): Promise<string[]> => {
  try {
    const promises = texts.map(text => 
      synthesizeSpeech(text, apiKey, region, options)
    );
    return await Promise.all(promises);
  } catch (error) {
    console.error('Error generating speeches:', error);
    return texts.map(() => '');
  }
};
