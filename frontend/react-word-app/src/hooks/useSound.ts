import { useCallback } from 'react';

interface SoundOptions {
  volume?: number;
  playbackRate?: number;
}

const useSound = () => {
  const playSound = useCallback((soundType: string, options: SoundOptions = {}) => {
    // Create audio context for web audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const { volume = 0.3, playbackRate = 1 } = options;
    
    // Generate different sounds based on type
    switch (soundType) {
      case 'click':
        // Soft click sound
        const clickOscillator = audioContext.createOscillator();
        const clickGain = audioContext.createGain();
        clickOscillator.connect(clickGain);
        clickGain.connect(audioContext.destination);
        clickOscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        clickOscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
        clickGain.gain.setValueAtTime(volume, audioContext.currentTime);
        clickGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        clickOscillator.start(audioContext.currentTime);
        clickOscillator.stop(audioContext.currentTime + 0.1);
        break;
        
      case 'hover':
        // Gentle hover sound
        const hoverOscillator = audioContext.createOscillator();
        const hoverGain = audioContext.createGain();
        hoverOscillator.connect(hoverGain);
        hoverGain.connect(audioContext.destination);
        hoverOscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        hoverOscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.05);
        hoverGain.gain.setValueAtTime(volume * 0.5, audioContext.currentTime);
        hoverGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
        hoverOscillator.start(audioContext.currentTime);
        hoverOscillator.stop(audioContext.currentTime + 0.05);
        break;
        
      case 'success':
        // Success chime
        const successOscillator1 = audioContext.createOscillator();
        const successOscillator2 = audioContext.createOscillator();
        const successGain = audioContext.createGain();
        successOscillator1.connect(successGain);
        successOscillator2.connect(successGain);
        successGain.connect(audioContext.destination);
        successOscillator1.frequency.setValueAtTime(523, audioContext.currentTime); // C5
        successOscillator2.frequency.setValueAtTime(659, audioContext.currentTime); // E5
        successGain.gain.setValueAtTime(volume, audioContext.currentTime);
        successGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        successOscillator1.start(audioContext.currentTime);
        successOscillator2.start(audioContext.currentTime);
        successOscillator1.stop(audioContext.currentTime + 0.3);
        successOscillator2.stop(audioContext.currentTime + 0.3);
        break;
        
      case 'magic':
        // Magical sparkle sound
        const magicOscillator = audioContext.createOscillator();
        const magicGain = audioContext.createGain();
        magicOscillator.connect(magicGain);
        magicGain.connect(audioContext.destination);
        magicOscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
        magicOscillator.frequency.exponentialRampToValueAtTime(2000, audioContext.currentTime + 0.2);
        magicGain.gain.setValueAtTime(volume * 0.7, audioContext.currentTime);
        magicGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        magicOscillator.start(audioContext.currentTime);
        magicOscillator.stop(audioContext.currentTime + 0.2);
        break;
        
      case 'theme':
        // Theme change sound
        const themeOscillator = audioContext.createOscillator();
        const themeGain = audioContext.createGain();
        themeOscillator.connect(themeGain);
        themeGain.connect(audioContext.destination);
        themeOscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        themeOscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.15);
        themeGain.gain.setValueAtTime(volume * 0.8, audioContext.currentTime);
        themeGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        themeOscillator.start(audioContext.currentTime);
        themeOscillator.stop(audioContext.currentTime + 0.15);
        break;
    }
  }, []);

  return { playSound };
};

export default useSound;
