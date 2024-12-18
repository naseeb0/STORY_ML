import { Audio, Sequence, useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate, spring } from 'remotion';
import { nachosStoryData } from './data/nachosStory';
import { staticFile } from 'remotion';
import { useEffect, useState } from 'react';
import { getAudioDurationInSeconds } from '@remotion/media-utils';

const TRANSITION_DURATION = 30;
const MIN_SCALE = 1.1;
const MAX_SCALE = 1.2;

interface StorySegmentProps {
    image: string;
    audioSrc: string;
    text: string;
    duration: number;
    index: number;
}

const StorySegment: React.FC<StorySegmentProps> = ({ image, audioSrc, text, duration, index }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    
    // Fade in effect
    const opacity = Math.min(1, frame / TRANSITION_DURATION);
    
    // Smooth zoom effect
    const scale = interpolate(
        frame,
        [0, duration],
        [MIN_SCALE, MAX_SCALE],
        {
            extrapolateRight: 'clamp',
            extrapolateLeft: 'clamp'
        }
    );

    return (
        <AbsoluteFill style={{ backgroundColor: 'black' }}>
            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity,
                    padding: '20px',
                    height: '100%',
                }}
            >
                <div style={{
                    width: '100%',
                    height: '70%',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '15px',
                    marginBottom: '20px',
                }}>
                    <div style={{
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        <img
                            src={staticFile(image)}
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transform: `scale(${scale})`,
                                transition: 'transform 0.5s ease-out',
                            }}
                        />
                    </div>
                </div>
                <div style={{
                    position: 'absolute',
                    bottom: '80px',
                    left: '0',
                    right: '0',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <div
                        style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.9)',
                            padding: '20px 40px',
                            borderRadius: '15px',
                            border: '3px solid #FFD700',
                            boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
                            fontSize: '64px',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            fontFamily: 'Arial, sans-serif',
                            letterSpacing: '1px',
                            color: '#FFD700',
                            transform: `scale(${spring({
                                frame: useCurrentFrame(),
                                from: 0.7,
                                to: 1,
                                fps: 30,
                                config: {
                                    damping: 15,
                                    stiffness: 150,
                                    mass: 0.5,
                                }
                            })})`,
                        }}
                    >
                        {text}
                    </div>
                </div>
            </div>
            <Audio src={staticFile(audioSrc)} />
        </AbsoluteFill>
    );
};

export const NachosStory: React.FC = () => {
    const [audioDurations, setAudioDurations] = useState<number[]>([]);
    const { fps } = useVideoConfig();

    useEffect(() => {
        const loadAudioDurations = async () => {
            const durations = await Promise.all(
                nachosStoryData.map(async (segment) => {
                    try {
                        const durationInSeconds = await getAudioDurationInSeconds(staticFile(segment.audio));
                        return Math.ceil(durationInSeconds * fps);
                    } catch (error) {
                        console.error('Error loading audio duration:', error);
                        return 300; // Fallback duration of 10 seconds
                    }
                })
            );
            setAudioDurations(durations);
        };

        loadAudioDurations();
    }, [fps]);

    if (audioDurations.length === 0) {
        return null;
    }

    let currentTime = 0;
    
    return (
        <AbsoluteFill style={{ backgroundColor: 'black' }}>
            {nachosStoryData.map((segment, index) => {
                const sequenceStart = currentTime;
                const duration = audioDurations[index];
                currentTime += duration;

                return (
                    <Sequence
                        key={index}
                        from={sequenceStart}
                        durationInFrames={duration}
                    >
                        <StorySegment 
                            image={segment.image}
                            audioSrc={segment.audio}
                            text={segment.text}
                            duration={duration}
                            index={index}
                        />
                    </Sequence>
                );
            })}
        </AbsoluteFill>
    );
};
