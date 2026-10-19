import React from 'react';
import { DetailPanelProps } from '../types';
import { MessageSquare } from 'lucide-react';

export const DetailPanel: React.FC<DetailPanelProps> = ({ point }) => {
  if (!point) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-slate-600 bg-slate-900">
        <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
          <MessageSquare className="w-8 h-8 opacity-50" />
        </div>
        <h3 className="text-lg font-medium text-slate-500 mb-2">No Selection</h3>
        <p className="text-sm text-center max-w-[200px]">
          Hover over a data point to view its content, or click to lock the selection.
        </p>
      </div>
    );
  }

  // Determine the display title based on category and index
  const getDisplayTitle = () => {
    const cat = point.category?.toLowerCase() || '';
    if (cat.includes('human')) {
        return `Human Recall #${point.categoryIndex || '?'}`;
    }
    if (cat.includes('model')) {
        return `Model Recall #${point.categoryIndex || '?'}`;
    }
    return point.title || `Data Point #${point.id}`;
  };

  const isModel = point.category?.toLowerCase().includes('model');

  return (
    <div className="h-full flex flex-col bg-slate-900">
      {/* Header */}
      <div className="flex-none p-6 border-b border-slate-800 bg-slate-900/50">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              {getDisplayTitle()}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono flex-wrap">
                {point.storyId && (
                   <span className="bg-slate-800 px-2 py-1 rounded text-slate-500">
                     {point.storyId}
                   </span>
                )}
                <span className="bg-slate-800 px-2 py-1 rounded">
                    Levenshtein distance: {point.x.toFixed(2)}
                </span>
                <span className="bg-slate-800 px-2 py-1 rounded">
                    I(recall; story): {point.y.toFixed(2)}
                </span>
                {point.att_entropy !== undefined && (
                   <span className="bg-slate-800 px-2 py-1 rounded text-indigo-300">
                     {isModel ? 'Attention Temperature' : 'Attention Entropy'}: {point.att_entropy.toFixed(3)}
                   </span>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
        <div className="prose prose-invert prose-slate max-w-none">
          <p className="text-slate-300 leading-relaxed whitespace-pre-wrap text-base">
            {point.text}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-none p-4 border-t border-slate-800 bg-slate-900/50 text-xs text-slate-500 flex justify-between">
         <span>Word count: {point.text.split(/\s+/).length}</span>
         <span>Character count: {point.text.length}</span>
      </div>
    </div>
  );
};
