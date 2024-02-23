import { useState } from "react";
import { Renderer } from "./renderer";
import { Tooltip } from "./tooltip";
import { COLOR_LEGEND_HEIGHT } from "./constants";
import { ColorLegend } from "./colorLegend";
import * as d3 from "d3";
import { COLORS, THRESHOLDS } from "./constants";
// heatmap.tsx

import { Dataset } from "./data";
export type interactionData = {
  xLabel: number;
  yLabel: string;
  xPos: number;
  yPos: number;
  value: number | null;
};

export const Heatmap = ({
  width,
  height,
  data,
}: {
  width: number;
  height: number;
  data: Dataset;
}) => {
  const [hoveredCell, setHoveredCell] = useState<interactionData | null>(null);

  // Color scale is computed here bc it must be passed to both the renderer and the legend
  const values = data
    .map((d) => d.value)
    .filter((d): d is number => d !== null);

  const max = d3.max(values) ?? 0;

  const colorScale = d3
    .scaleLinear<string>()
    .domain(THRESHOLDS.map((t) => t * max))
    .range(COLORS);
  
  return (
    <div style={{ position: "absolute" }}>
      <Renderer
        width={width}
        height={height - 150}
        data={data}
        setHoveredCell={setHoveredCell}
        colorScale={colorScale}
      />
      <Tooltip
        interactionData={hoveredCell}
        width={width}
        height={height - COLOR_LEGEND_HEIGHT}
      />
      <div style={{ position: "relative" }}>
        <ColorLegend
          height={height}
          width={width}
          colorScale={colorScale}
          interactionData={hoveredCell}
        />
      </div>
    </div>
    
  );
};
