import React, { useState } from 'react';

const questions = [
  { 
    id: 1, 
    q: "Look at the veins on your inner wrist in natural daylight. What color do they appear most?", 
    options: ["Blue/Purple (cool/rosy undertone)", "Green/Olive (warm/golden or olive undertone)", "Mix of both or hard to tell (neutral/beige undertone)"] 
  },
  { 
    id: 2, 
    q: "How does your skin usually react when you step out in summer sun without sunscreen?", 
    options: ["Burns quickly and turns red (cooler undertone)", "Burns a little then tans to golden/brown (warm undertone)", "Tans easily without much burning (neutral or warm-leaning)"] 
  },
  { 
    id: 3, 
    q: "Which jewelry makes your face look brighter and more 'glowing' on you?", 
    options: ["Silver or white gold (cool undertone)", "Yellow gold or rose gold (warm undertone)", "Both look equally good (neutral undertone)"] 
  },
  { 
    id: 4, 
    q: "What best describes the natural color of your eyes?", 
    options: ["Bright black/dark brown with cool sparkle", "Warm brown with golden flecks", "Deep black or hazel with neutral depth"] 
  },
  { 
    id: 5, 
    q: "How much contrast is there between your natural hair color and skin tone?", 
    options: ["High contrast – very dark hair against lighter skin (cooler seasons)", "Medium contrast – dark hair on medium brown skin (warm seasons)", "Soft/low contrast – hair and skin blend softly (neutral seasons)"] 
  },
  { 
    id: 6, 
    q: "In bright sunlight, your natural hair shows highlights that are...", 
    options: ["Ashy or cool brown", "Golden, coppery, or reddish", "Neutral dark or minimal highlights"] 
  },
  { 
    id: 7, 
    q: "Which 'neutral' color top or kurta makes your skin look freshest and most even?", 
    options: ["Stark white or icy off-white (cool undertone)", "Creamy ivory or warm beige (warm undertone)", "Soft grey or taupe (neutral undertone)"] 
  },
  { 
    id: 8, 
    q: "Your natural lip color (without lipstick) is closest to...", 
    options: ["Cool mauve, berry, or pinkish-brown", "Warm peach, terracotta, or brownish-orange", "Deep rose or neutral brownish"] 
  },
  { 
    id: 9, 
    q: "When you wear pure black (e.g., black saree or kurta), how does it make you feel/look?", 
    options: ["Sharp, powerful, and clear (cool undertone)", "A bit harsh or ashy (may need warmer black)", "Heavy or draining (neutral – softer blacks suit better)"] 
  },
  { 
    id: 10, 
    q: "If you pinch your cheek lightly, what undertone shows up most?", 
    options: ["Pink or rosy flush (cool undertone)", "Yellow/golden or peachy (warm undertone)", "Neutral beige or olive (neutral undertone)"] 
  },
  { 
    id: 11, 
    q: "In the morning before makeup, your skin tone looks most like...", 
    options: ["Bright and slightly translucent with cool tones", "Matte/velvety with warm golden glow", "Warm/opaque with neutral beige base"] 
  },
  { 
    id: 12, 
    q: "Which color makes your eyes 'pop' the most when you wear it near your face?", 
    options: ["Jewel tones like emerald or sapphire (cooler seasons)", "Earthy terracotta, mustard, or olive (warmer seasons)", "Powdery pastels or soft mauves (neutral seasons)"] 
  },
  { 
    id: 13, 
    q: "When you naturally blush or get flushed (e.g., after exercise), the color is...", 
    options: ["Cool berry or pinkish-red", "Warm coral or peachy-orange", "Soft rose or neutral flush"] 
  },
  { 
    id: 14, 
    q: "Which traditional Indian color shade suits your skin best in ethnic wear?", 
    options: ["Icy blues, royal purples, or cool pinks", "Mustard yellow, deep maroon, or earthy oranges", "Lavender, sage green, or soft neutrals"] 
  },
  { 
    id: 15, 
    q: "Which natural landscape or vibe feels most like your personal energy/skin vibe?", 
    options: ["Cool Himalayan misty valleys or blue lagoons", "Golden Rajasthan deserts or warm sunset fields", "Lush Kerala backwaters or balanced monsoon greens"] 
  }
];

export default function ColorAnalysisQuiz({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [scores, setScores] = useState({ cool: 0, warm: 0, neutral: 0 });

  const handleAnswer = (idx) => {
    const selected = questions[currentStep].options[idx];
    setAnswers(prev => ({ ...prev, [questions[currentStep].id]: selected }));

    const newScores = { ...scores };
    if (idx === 0) newScores.cool += 1;
    if (idx === 1) newScores.warm += 1;
    if (idx === 2) newScores.neutral += 0.5;
    setScores(newScores);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
 
      const result = calculateSeason(newScores, answers);
      onComplete(result);
    }
  };

  const calculateSeason = (scores, answers) => {
    const total = scores.cool + scores.warm + scores.neutral;
    const coolPercent = (scores.cool / total) * 100;
    const warmPercent = (scores.warm / total) * 100;

    let season, description, palette, accent;

    if (coolPercent > 60) {
      season = "Cool Winter / Cool Summer";
      description = "Strong cool undertone – clear, bright or soft icy colors suit you best.";
      palette = ["#0A1D37", "#3C1D5C", "#4B0082", "#C71585", "#00CED1", "#FFFFFF", "#000000", "#B0C4DE"];
      accent = "blue-500";
    } else if (warmPercent > 60) {
      season = "Warm Autumn / Warm Spring";
      description = "Golden, warm undertone – rich earthy or fresh peach tones look beautiful on you.";
      palette = ["#8B4513", "#D2691E", "#CD853F", "#F4A460", "#DEB887", "#FFD700", "#556B2F"];
      accent = "amber-600";
    } else {
      season = "Soft Neutral (Summer-Autumn blend)";
      description = "Balanced / neutral undertone – muted, sophisticated shades are most harmonious.";
      palette = ["#8A7D6F", "#A0522D", "#C19A6B", "#B8860B", "#D8BFD8", "#B0C4DE", "#D3D3D3"];
      accent = "purple-400";
    }

    return {
      season,
      description,
      palette,
      accent,
      answers,
      scores
    };
  };

  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="max-w-xl mx-auto py-4">
      <div className="w-full h-[1px] bg-slate-100 mb-12 relative">
        <div className="absolute top-0 left-0 h-full bg-pink-400 transition-all duration-700 ease-in-out" 
          style={{ width: `${progress}%` }} />

        <span className="absolute -bottom-6 left-0 text-[10px] tracking-[0.2em] text-slate-300 uppercase font-sans">
          Question {currentStep + 1} of {questions.length}
        </span>
      </div>

      <div className="space-y-12">
        <h2 className="text-3xl md:text-4xl font-serif italic text-slate-900 leading-tight">
          {questions[currentStep].q}
        </h2>

        <div className="grid gap-3">
          {questions[currentStep].options.map((option, idx) => (
            <button key={idx} onClick={() => handleAnswer(idx)} className="group relative w-full text-left p-6 rounded-2xl border border-slate-100 hover:border-pink-200 hover:bg-pink-50/30 transition-all duration-300 ease-out">
              <div className="flex items-center justify-between">
                <span className="font-sans text-sm tracking-wide text-slate-600 group-hover:text-pink-700 transition-colors">
                  {option}
                </span>
                <div className="w-2 h-2 rounded-full bg-slate-100 group-hover:bg-pink-400 transition-all duration-300" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}