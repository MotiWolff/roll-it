import { useEffect, useRef, useState } from 'react';

// Audio manager for background music and sound effects
function AudioManager({ enabled }) {
    const [musicEnabled, setMusicEnabled] = useState(false);
    const bgMusicRef = useRef(null);
    const rollSoundRef = useRef(null);
    const holdSoundRef = useRef(null);
    const winSoundRef = useRef(null);
    const bustSoundRef = useRef(null);

    // Initialize audio elements
    useEffect(() => {
        // Background music (using a free audio file URL or local file)
        bgMusicRef.current = new Audio();
        bgMusicRef.current.loop = true;
        bgMusicRef.current.volume = 0.3;
        
        // Sound effects
        rollSoundRef.current = new Audio();
        holdSoundRef.current = new Audio();
        winSoundRef.current = new Audio();
        bustSoundRef.current = new Audio();

        return () => {
            // Cleanup
            if (bgMusicRef.current) {
                bgMusicRef.current.pause();
                bgMusicRef.current = null;
            }
        };
    }, []);

    // Handle music toggle
    useEffect(() => {
        if (!bgMusicRef.current) return;

        if (musicEnabled) {
            bgMusicRef.current.play().catch(e => console.log('Audio play blocked:', e));
        } else {
            bgMusicRef.current.pause();
        }
    }, [musicEnabled]);

    // Expose play functions globally via window object
    useEffect(() => {
        globalThis.playRollSound = () => {
            if (!enabled) return;
            // Simple beep using Web Audio API
            const audioContext = new (globalThis.AudioContext || globalThis.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 400;
            oscillator.type = 'sine';
            gainNode.gain.value = 0.1;
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.1);
        };

        globalThis.playHoldSound = () => {
            if (!enabled) return;
            const audioContext = new (globalThis.AudioContext || globalThis.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 600;
            oscillator.type = 'sine';
            gainNode.gain.value = 0.15;
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.2);
        };

        globalThis.playWinSound = () => {
            if (!enabled) return;
            const audioContext = new (globalThis.AudioContext || globalThis.webkitAudioContext)();
            
            // Victory fanfare - multiple notes
            for (const [i, freq] of [523, 659, 784, 1047].entries()) {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = freq;
                oscillator.type = 'sine';
                gainNode.gain.value = 0.1;
                
                const startTime = audioContext.currentTime + (i * 0.15);
                oscillator.start(startTime);
                oscillator.stop(startTime + 0.3);
            }
        };

        globalThis.playBustSound = () => {
            if (!enabled) return;
            const audioContext = new (globalThis.AudioContext || globalThis.webkitAudioContext)();
            
            // Descending "sad" sound
            for (const [i, freq] of [400, 350, 300, 250].entries()) {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = freq;
                oscillator.type = 'sawtooth';
                gainNode.gain.value = 0.08;
                
                const startTime = audioContext.currentTime + (i * 0.1);
                oscillator.start(startTime);
                oscillator.stop(startTime + 0.15);
            }
        };

        return () => {
            // Cleanup global functions
            delete globalThis.playRollSound;
            delete globalThis.playHoldSound;
            delete globalThis.playWinSound;
            delete globalThis.playBustSound;
        };
    }, [enabled]);

    return (
        <div className="audio-controls">
            <label>
                <input
                    type="checkbox"
                    checked={musicEnabled}
                    onChange={(e) => setMusicEnabled(e.target.checked)}
                />
                {' '}
                🎵 Background Music
            </label>
            <label>
                <input
                    type="checkbox"
                    checked={enabled}
                    readOnly
                />
                {' '}
                🔊 Sound Effects
            </label>
        </div>
    );
}

export default AudioManager;
