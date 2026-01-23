import React from 'react';
import { X, MousePointer2 } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50">
          <h2 className="text-xl font-semibold text-white">Using TextSpace</h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          
          <div className="flex gap-4">
            <div className="flex-none w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center">
              <MousePointer2 className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-medium text-slate-200 mb-1">Interaction Guide</h3>
              <ul className="text-sm text-slate-400 space-y-3 leading-relaxed mt-2">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2 flex-none" />
                  <span>
                    <strong>Hover</strong> over any dot to see a preview of the text and metrics.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2 flex-none" />
                  <span>
                    <strong>Click</strong> a dot to "lock" it. This opens the detail panel on the right where you can read the full text content.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2 flex-none" />
                  <span>
                    Use the <strong>Story Tabs</strong> (if available) at the top of the chart to switch between different narrative datasets.
                  </span>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/30 border-t border-slate-800 text-center">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};