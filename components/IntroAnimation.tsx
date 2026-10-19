import React, { useEffect, useState } from 'react';
import { FastForward } from 'lucide-react';

interface IntroAnimationProps {
  onComplete: () => void;
}

// Fallback text if intro_txt.txt is missing
const DEFAULT_FLOW_TEXT = `The explorers found the entrance covered in vines. It had been hidden for centuries, waiting for the right moment to reveal its secrets. Inside the chamber, the air was cool and still. Dust motes danced in the single beam of light piercing through the cracked ceiling. The neural link stabilized at 98% efficiency. The subject reported seeing colors that did not exist in the standard visible spectrum. System alert: Temporal anomaly detected in sector 7. The simulation is beginning to diverge from predicted historical baselines. Recall accuracy dropped significantly when the temperature variable was introduced. The AI suggests a correlation with entropy levels. They deciphered the first line of the tablet: 'Those who seek the truth must first abandon what they know.' We asked human participants and a language model to listen to a narrative, then immediately recall the story. Humans vary in the degree of gist vs. detail in their recall. The off-the-shelf LLM, however, recall in very high detail. By manipulating the attention temperature, we made the LLM recall in varying levels of details, matching human performance.`;

interface TextStream {
  id: number;
  text: string;
  startX: number; // vw
  startY: number; // vh
  delay: number;
  duration: number;
}

export const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'loading' | 'flow' | 'dissolve'>('loading');
  const [streams, setStreams] = useState<TextStream[]>([]);
  const [displayText, setDisplayText] = useState<string | null>(null);

  // 1. Fetch Text
  useEffect(() => {
    const loadText = async () => {
      try {
        const response = await fetch('intro_txt.txt');
        if (!response.ok) throw new Error("File not found");
        
        const text = await response.text();
        if (!text || text.trim().length < 10) throw new Error("Text too short");

        // Clean up newlines for better flow
        setDisplayText(text.replace(/\s+/g, ' '));
      } catch (err) {
        console.log("Using default intro text (intro_txt.txt not found or empty)");
        setDisplayText(DEFAULT_FLOW_TEXT);
      }
    };

    loadText();
  }, []);

  // 2. Generate Streams & Start Animation Sequence
  useEffect(() => {
    if (!displayText) return; // Wait for text to load

    setPhase('flow');

    // Generate Text Streams
    const count = 120; 
    const newStreams: TextStream[] = [];
    
    // Safety check: ensure text is long enough for substring logic
    const sourceText = displayText.length < 200 ? displayText.repeat(5) : displayText;
    
    for (let i = 0; i < count; i++) {
      const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
      let startX = 0, startY = 0;
      
      switch(side) {
        case 0: // Top
            startX = Math.random() * 100; 
            startY = -10; 
            break;
        case 1: // Right
            startX = 110; 
            startY = Math.random() * 100; 
            break;
        case 2: // Bottom
            startX = Math.random() * 100; 
            startY = 110; 
            break;
        case 3: // Left
            startX = -10; 
            startY = Math.random() * 100; 
            break;
      }

      // Calculate random segment of text
      const maxStart = Math.max(0, sourceText.length - 60);
      const textStart = Math.floor(Math.random() * maxStart);
      const textChunk = sourceText.substring(textStart, textStart + 25 + Math.random() * 30);

      newStreams.push({
        id: i,
        text: textChunk,
        startX,
        startY,
        delay: Math.random(),
        duration: 1 + Math.random() * 0.5,
      });
    }
    setStreams(newStreams);

    // Sequence Timers
    const timer1 = setTimeout(() => setPhase('dissolve'), 2500);
    const timer2 = setTimeout(onComplete, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [displayText, onComplete]);

  // Don't render until text is loaded to avoid flickering
  if (!displayText) return null;

  return (
    <div className={`fixed inset-0 z-[100] bg-slate-950 flex items-center justify-center overflow-hidden transition-opacity duration-500 ${phase === 'dissolve' ? 'opacity-0' : 'opacity-100'}`}>
      
      {/* Skip Button */}
      <button 
        onClick={onComplete}
        className="absolute top-6 right-6 z-50 text-slate-500 hover:text-white text-xs uppercase tracking-widest flex items-center gap-2 transition-colors cursor-pointer"
      >
        Skip Intro <FastForward className="w-4 h-4" />
      </button>

      {/* Text Streams */}
      {streams.map((s) => (
        <div
            key={`stream-${s.id}`}
            className="absolute font-mono text-sm md:text-base font-medium text-indigo-200 pointer-events-none whitespace-nowrap"
            style={{
                left: 0, 
                top: 0,
                // Using CSS variables to pass random start positions to the keyframe
                '--sx': `${s.startX}vw`,
                '--sy': `${s.startY}vh`,
                animation: `flowToCenter ${s.duration}s ease-in ${s.delay}s forwards`,
                opacity: 0,
            } as React.CSSProperties}
        >
            {s.text}
        </div>
      ))}
      
      <style>{`
        @keyframes flowToCenter {
            0% {
                opacity: 0;
                transform: translate3d(var(--sx), var(--sy), 0) scale(1);
            }
            10% {
                opacity: 0.9;
            }
            85% {
                opacity: 0.9;
            }
            100% {
                opacity: 0;
                /* Move to absolute center */
                transform: translate3d(50vw, 50vh, 0) translate3d(-50%, -50%, 0) scale(0.1);
            }
        }
      `}</style>

    </div>
  );
};
