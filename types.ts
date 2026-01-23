export interface DataPoint {
  id: string;
  x: number;
  y: number;
  text: string;
  storyId?: string; // New field for filtering
  title?: string;
  category?: string;
  categoryIndex?: number; // Order index within its category
  color?: string;
  att_entropy?: number;
  [key: string]: any;
}

export interface ScatterVisProps {
  data: DataPoint[];
  hoveredPoint: DataPoint | null;
  selectedPoint: DataPoint | null;
  onHover: (point: DataPoint | null) => void;
  onClick: (point: DataPoint) => void;
}

export interface DetailPanelProps {
  point: DataPoint | null;
}