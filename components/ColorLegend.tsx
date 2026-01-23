import React from 'react';

export const ColorLegend: React.FC = () => {
  // CSS Gradients derived from your Python matplotlib logic
  
  // Model: Pastel Magenta Sequence (Discrete steps in Python, rendered as gradient here)
  // colors = [(0.95, 0.55, 0.65), (1.0, 0.65, 0.4), (1.0, 0.85, 0.1)]
  // Hex: #F28CA6 -> #FFA666 -> #FFD91A
  const modelGradient = 'linear-gradient(to right, #F28CA6, #FFA666, #FFD91A)';

  // Human: Cool Teal Blue (Continuous)
  // colors = [(0.3, 0.5, 0.8), (0.4, 0.7, 0.9), (0.5, 0.85, 0.85)]
  // Hex: #4C7FCC -> #66B2E5 -> #7FD8D8
  const humanGradient = 'linear-gradient(to right, #4C7FCC, #66B2E5, #7FD8D8)';

  return (
    <div className="flex flex-col gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800 shadow-sm min-w-[220px]">
      
      {/* Model Scale Legend */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-baseline">
          <span className="text-xs font-semibold text-slate-300">Model Recall</span>
          <span className="text-[10px] text-slate-500 uppercase tracking-wider">Temperature</span>
        </div>
        <div className="h-2.5 w-full rounded-md relative overflow-hidden ring-1 ring-slate-800">
           {/* Background Gradient */}
           <div style={{ background: modelGradient }} className="absolute inset-0 opacity-90" />
           {/* Grid lines to suggest discrete steps */}
           <div className="absolute inset-0 flex">
             <div className="flex-1 border-r border-slate-900/20"></div>
             <div className="flex-1 border-r border-slate-900/20"></div>
             <div className="flex-1"></div>
           </div>
        </div>
      </div>

      {/* Human Entropy Legend */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-baseline">
          <span className="text-xs font-semibold text-slate-300">Human Recall</span>
          <span className="text-[10px] text-slate-500 uppercase tracking-wider">Entropy</span>
        </div>
        <div className="h-2.5 w-full rounded-md relative overflow-hidden shadow-inner ring-1 ring-slate-800">
           <div style={{ background: humanGradient }} className="absolute inset-0" />
        </div>
      </div>

      {/* Shared Scale Indicator */}
      <div className="pt-2 mt-1 border-t border-slate-800/50">
        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium">
            <span>Detailed</span>
            <div className="flex-1 h-px bg-slate-600 relative">
                 <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[3px] border-y-transparent border-l-[6px] border-l-slate-600" />
            </div>
            <span>Summary</span>
        </div>
      </div>

    </div>
  );
};