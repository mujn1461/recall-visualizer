import { DataPoint } from './types';

// Precise Hex values converted from user's Matplotlib RGB tuples

// Model: Pastel Magenta Sequence
// (0.95, 0.55, 0.65) -> #F28CA6
// (1.0, 0.65, 0.4)   -> #FFA666
// (1.0, 0.85, 0.1)   -> #FFD91A
const MODEL_COLORS = ["#F28CA6", "#FFA666", "#FFD91A"]; 

// Human: Cool Teal Blue Sequence
// (0.3, 0.5, 0.8)    -> #4C7FCC
// (0.4, 0.7, 0.9)    -> #66B2E5
// (0.5, 0.85, 0.85)  -> #7FD8D8
const HUMAN_COLORS = ["#4C7FCC", "#66B2E5", "#7FD8D8"];

const STORIES = ["Story 1: The Lost City", "Story 2: Quantum Future", "Story 3: Jazz History"];

const generateLoremIpsum = () => {
  const phrases = [
    "The participants recalled the event with high fidelity.",
    "Attention entropy suggests a divergence in narrative understanding.",
    "Levenshtein distance indicates significant textual deviation.",
    "The model's output aligned with the structured recall task.",
    "Subjective interpretation variance was high in this segment."
  ];
  return phrases[Math.floor(Math.random() * phrases.length)] + " " + phrases[Math.floor(Math.random() * phrases.length)];
};

const generateSampleData = (countPerStory: number): DataPoint[] => {
  const points: DataPoint[] = [];

  STORIES.forEach((story, sIdx) => {
    // 1. Generate MODEL Data (approx 40% of points)
    const modelCount = Math.floor(countPerStory * 0.4);
    for (let i = 0; i < modelCount; i++) {
        // Model usually has lower Levenshtein distance (x) and higher recall info (y)
        const scaleIdx = Math.floor(Math.random() * MODEL_COLORS.length);
        const color = MODEL_COLORS[scaleIdx];
        
        points.push({
            id: `m-${sIdx}-${i}`,
            storyId: story,
            category: "Model",
            title: `Model Recall (Scale ${scaleIdx + 1})`,
            x: 10 + Math.random() * 40, // Lower X
            y: 200 + Math.random() * 300, // Higher Y
            color: color,
            text: `[MODEL OUTPUT]\nScale: ${scaleIdx}\n\n${generateLoremIpsum()}`
        });
    }

    // 2. Generate HUMAN Data (approx 60% of points)
    const humanCount = countPerStory - modelCount;
    for (let i = 0; i < humanCount; i++) {
        // Human data is more scattered
        const entropyIdx = Math.floor(Math.random() * HUMAN_COLORS.length);
        const color = HUMAN_COLORS[entropyIdx];

        points.push({
            id: `h-${sIdx}-${i}`,
            storyId: story,
            category: "Human",
            title: `Human Participant ${i}`,
            x: 20 + Math.random() * 80, // Higher X scatter
            y: 50 + Math.random() * 400, // Wide Y scatter
            color: color,
            text: `[HUMAN RECALL]\nAttention Entropy: ${entropyIdx}\n\n${generateLoremIpsum()}`
        });
    }
  });

  return points;
};

export const SAMPLE_DATA: DataPoint[] = generateSampleData(100);
