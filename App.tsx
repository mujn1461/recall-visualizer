import React, { useState, useMemo, useEffect } from 'react';
import { BrainCircuit, HelpCircle, Loader2, AlertTriangle } from 'lucide-react';
import { ScatterVis } from './components/ScatterVis';
import { DetailPanel } from './components/DetailPanel';
import { HelpModal } from './components/HelpModal';
import { ColorLegend } from './components/ColorLegend';
import { IntroAnimation } from './components/IntroAnimation';
import { DataPoint } from './types';
import { parseCSV } from './utils/dataUtils';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [data, setData] = useState<DataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<DataPoint | null>(null);
  const [selectedStory, setSelectedStory] = useState<string>('');
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Fetch data.csv on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('data.csv');
        
        if (!response.ok) {
          throw new Error('Could not find "data.csv" in the project root.');
        }

        const text = await response.text();
        const parsedData = parseCSV(text);

        if (parsedData.length === 0) {
          throw new Error('CSV is empty or missing required columns (x, y).');
        }

        setData(parsedData);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'An unexpected error occurred loading data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Extract unique stories
  const stories = useMemo(() => {
    const distinct = Array.from(new Set(data.map(d => d.storyId || 'Default Story')));
    return distinct.sort();
  }, [data]);

  // Set default story when data loads
  useEffect(() => {
    if (stories.length > 0) {
        // If currently selected story is not in the list, switch to the first one
        if (!selectedStory || !stories.includes(selectedStory)) {
            setSelectedStory(stories[0]);
        }
    }
  }, [stories, selectedStory]);

  // Filter data based on selected story AND calculate category indices
  const filteredData = useMemo(() => {
    if (!selectedStory && stories.length > 0) return []; // Wait for selection
    
    const storyPoints = data.filter(d => (d.storyId || 'Default Story') === selectedStory);
    
    let humanCount = 0;
    let modelCount = 0;

    return storyPoints.map(point => {
        const cat = point.category?.toLowerCase() || '';
        let idx = 0;
        
        if (cat.includes('human')) {
            humanCount++;
            idx = humanCount;
        } else if (cat.includes('model')) {
            modelCount++;
            idx = modelCount;
        }

        return {
            ...point,
            categoryIndex: idx
        };
    });
  }, [data, selectedStory, stories]);

  // Calculate stats for the current view
  const statsText = useMemo(() => {
    const h = filteredData.filter(d => d.category?.toLowerCase().includes('human')).length;
    const m = filteredData.filter(d => d.category?.toLowerCase().includes('model')).length;
    const parts = [];
    
    if (h > 0) parts.push(`${h} human recalls`);
    if (m > 0) parts.push(`${m} model recalls`);
    
    if (parts.length === 0) return `${filteredData.length} data points`;
    
    // If there are other points not categorized as human/model
    const others = filteredData.length - h - m;
    if (others > 0) parts.push(`${others} other points`);
    
    return parts.join(', ');
  }, [filteredData]);


  // The active point is either the one explicitly clicked (locked) or the one currently hovered
  const activePoint = hoveredPoint || selectedPoint;

  const handlePointClick = (point: DataPoint) => {
    if (selectedPoint?.id === point.id) {
      setSelectedPoint(null);
    } else {
      setSelectedPoint(point);
    }
  };

  // 1. Render Intro Animation if enabled
  if (showIntro) {
    return <IntroAnimation onComplete={() => setShowIntro(false)} />;
  }

  // 2. Loading State
  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
        <p className="font-medium">Loading data.csv...</p>
      </div>
    );
  }

  // 3. Error State
  if (error) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-4 p-6 text-center">
        <div className="bg-red-500/10 p-4 rounded-full">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-xl font-semibold text-slate-200">Data Load Error</h2>
        <p className="max-w-md text-slate-500">{error}</p>
        <div className="bg-slate-900 p-4 rounded-lg text-sm border border-slate-800 mt-4 text-left">
          <p className="font-semibold text-slate-300 mb-2">Instructions:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Ensure a file named <code className="text-indigo-400">data.csv</code> is in the root folder.</li>
            <li>The CSV must have <code className="text-indigo-400">x</code> and <code className="text-indigo-400">y</code> columns.</li>
            <li>Refresh this page after adding the file.</li>
          </ul>
        </div>
      </div>
    );
  }

  // 4. Main App UI
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-200 animate-in fade-in duration-1000">
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      {/* Header */}
      <header className="flex-none border-b border-slate-800 bg-slate-900/50 backdrop-blur-md px-6 py-4 z-10">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-500/10 p-2 rounded-lg">
                <BrainCircuit className="w-5 h-5 text-indigo-400" />
              </div>
              <h1 className="text-xl font-medium tracking-tight text-slate-100">
                Recall <span className="text-slate-500 font-normal">Visualizer</span>
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
               <button 
                 onClick={() => setIsHelpOpen(true)}
                 className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors px-3 py-1.5 rounded-md hover:bg-slate-800/50"
               >
                 <HelpCircle className="w-4 h-4" /> Help
               </button>
            </div>
        </div>
        
        {/* Description Box - Removed max-w to span width */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 w-full shadow-sm backdrop-blur-sm">
          <p className="text-sm text-slate-400 leading-relaxed">
            We asked human participants and a language model (Llama3-8b-inst) to listen/"read" a narrative, then immediately retell the story. 
            Humans vary in the degree of gist (summary-like, light blue) vs. detail (dark blue) in their recall. The off-the-shelf LLM, however, recall in very high detail (pink dots). 
            By manipulating the attention temperature, we made the LLM recall in varying levels of details, matching human performance. 
            At medium-high levels of attention temperature, the model displays human-like summarization behavior. 
            At the highest attention temperature, the model tends to suffer from hallucinations and failed generations, although sometimes it produces high level summaries. 
            The plot below is a rate-distortion plot. Rate (y-axis, quantified using mutual information) indicates the amount of resources (in bits) one spends to remember the story. Distortion (x-axis, quantified as an edit distance) indicates how much the recall deviates from the original narrative.
          </p>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col md:flex-row relative">
        
        {/* Visualization Area */}
        <main className="flex-1 bg-slate-950 flex flex-col">
            
          {/* Top Control Bar: Stories + Legend */}
          <div className="flex-none px-6 pt-6 pb-2 z-10 flex flex-col-reverse md:flex-row items-start md:items-start justify-between gap-4 min-h-[80px]">
            {/* Story Selector (Left) */}
            <div className="flex-1 min-w-0 flex items-center h-full">
                {stories.length > 1 && (
                    <div className="inline-flex p-1 bg-slate-900/50 border border-slate-800 rounded-xl gap-1 overflow-x-auto max-w-full">
                        {stories.map(story => (
                            <button
                                key={story}
                                onClick={() => setSelectedStory(story)}
                                className={`
                                    px-4 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap
                                    ${selectedStory === story 
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}
                                `}
                            >
                                {story}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Legend (Right) */}
            <div className="flex-none self-end md:self-auto">
                <ColorLegend />
            </div>
          </div>

          <div className="relative p-4 pb-8 sm:p-6 flex flex-col">
             {/* Chart Container - Fixed large height (75vh) to ensure visibility and trigger scroll */}
             <div className="w-full h-[75vh] min-h-[500px] rounded-2xl border border-slate-800/50 bg-slate-900/20 shadow-inner overflow-hidden relative">
                <ScatterVis 
                  data={filteredData} 
                  hoveredPoint={hoveredPoint}
                  selectedPoint={selectedPoint}
                  onHover={setHoveredPoint}
                  onClick={handlePointClick}
                />
                
                {/* Stats Overlay (Top Left) */}
                <div className="absolute top-0 left-6 pointer-events-none opacity-50 text-left pt-2">
                  <p className="text-xs text-slate-400 font-mono">
                    {statsText}
                  </p>
                </div>

                {/* Instructions Overlay (Bottom Left) - Only when idle */}
                {!activePoint && (
                  <div className="absolute bottom-6 left-6 pointer-events-none opacity-50">
                    <p className="text-xs text-slate-400 max-w-[200px]">
                      Hover to preview. Click to lock.
                    </p>
                  </div>
                )}
             </div>
          </div>
        </main>

        {/* Detail Panel - Sidebar */}
        <aside 
          className={`
            fixed inset-y-0 right-0 z-50 w-full md:w-[400px] lg:w-[480px] 
            bg-slate-900/95 backdrop-blur-xl border-l border-slate-800 shadow-2xl
            transition-transform duration-300 ease-in-out transform
            flex flex-col
            ${activePoint ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
            md:sticky md:top-0 md:h-screen md:transform-none md:bg-slate-900 md:z-auto
          `}
        >
          <div className="flex-1 overflow-hidden h-full">
             <DetailPanel point={activePoint} />
          </div>
        </aside>
      </div>
    </div>
  );
}