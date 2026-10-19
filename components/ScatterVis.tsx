import React, { useCallback, useMemo } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label
} from 'recharts';
import { ScatterVisProps } from '../types';

export const ScatterVis: React.FC<ScatterVisProps> = ({ 
  data, 
  hoveredPoint, 
  selectedPoint,
  onHover, 
  onClick,
  onClearSelection
}) => {

  // Calculate domains with padding
  const domain = useMemo(() => {
    if (data.length === 0) return { x: ['auto', 'auto'], y: ['auto', 'auto'] };

    const xValues = data.map(d => d.x);
    const yValues = data.map(d => d.y);

    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);

    // Add ~5% padding on each side based on the range magnitude
    // Use a minimum buffer if variance is 0
    const xRange = maxX - minX || 10;
    const yRange = maxY - minY || 10;
    
    const xPadding = xRange * 0.05;
    const yPadding = yRange * 0.05;

    return {
      x: [minX - xPadding, maxX + xPadding],
      y: [minY - yPadding, maxY + yPadding]
    };
  }, [data]);

  // Custom shape renderer
  const renderCustomNode = useCallback((props: any) => {
    const { cx, cy, payload } = props;
    
    // Safety check for NaN values to prevent rendering errors
    // Fix: Return empty group instead of null to satisfy Typescript/Recharts
    if (isNaN(cx) || isNaN(cy)) return <g />;

    const isHovered = hoveredPoint?.id === payload.id;
    const isSelected = selectedPoint?.id === payload.id;
    const isActive = isHovered || isSelected;

    // Base radius
    const r = isActive ? 10 : 6;
    
    const baseColor = payload.color || '#6366f1';
    const fill = baseColor;
    const stroke = isActive ? '#ffffff' : 'none';
    const strokeWidth = isActive ? 2 : 0;
    
    const isAnyActive = hoveredPoint || selectedPoint;
    const opacity = isAnyActive && !isActive ? 0.3 : 0.8;

    return (
      <g 
        className="transition-all duration-300 ease-out cursor-pointer"
        onClick={(e) => {
            e.stopPropagation();
            onClick(payload);
        }}
        onMouseEnter={() => onHover(payload)}
        onMouseLeave={() => onHover(null)}
      >
        {isActive && (
          <circle 
            cx={cx} 
            cy={cy} 
            r={18} 
            fill={baseColor} 
            opacity={0.3} 
            className="animate-pulse"
          />
        )}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          fillOpacity={opacity}
        />
      </g>
    );
  }, [hoveredPoint, selectedPoint, onHover, onClick]);

  return (
    <div className="w-full h-full" onClick={onClearSelection}>
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart
        margin={{ top: 50, right: 30, bottom: 40, left: 40 }}
      >
        <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#1e293b" 
            vertical={true} 
            horizontal={true} 
            opacity={0.3}
        />
        <XAxis 
            type="number" 
            dataKey="x" 
            name="X" 
            axisLine={{ stroke: '#334155' }}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickFormatter={(value) => Math.round(value).toString()}
            domain={domain.x}
        >
             <Label 
               value="Levenshtein distance to story" 
               offset={-20} 
               position="insideBottom" 
               fill="#94a3b8" 
               fontSize={16}
             />
        </XAxis>
        <YAxis 
            type="number" 
            dataKey="y" 
            name="Y" 
            axisLine={{ stroke: '#334155' }}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickFormatter={(value) => Math.round(value).toString()}
            domain={domain.y}
        >
            <Label 
               value="I(recall;story) (bits)" 
               angle={-90} 
               position="insideLeft" 
               fill="#94a3b8" 
               fontSize={16}
               offset={0}
               style={{ textAnchor: 'middle' }}
             />
        </YAxis>
        <Tooltip 
            cursor={{ strokeDasharray: '3 3', stroke: '#334155' }}
            content={() => null} 
        />
        <Scatter 
            key={data.length > 0 ? data[0].storyId : 'empty'}
            name="Text Embeddings" 
            data={data} 
            shape={renderCustomNode}
            isAnimationActive={false} // Disable animation to prevent visual glitches
        />
      </ScatterChart>
    </ResponsiveContainer>
    </div>
  );
};
