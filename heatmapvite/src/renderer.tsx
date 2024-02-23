import {  useMemo } from "react";
import * as d3 from "d3";
import { interactionData } from "./heatmap";
import { MARGIN } from "./constants";
import styles from "./renderer.module.css";
import { Dataset } from "./data";

type RendererProps = {
  width: number;
  height: number;
  data: Dataset;
  setHoveredCell: (hoveredCell: interactionData | null) => void;
  colorScale: d3.ScaleLinear<string, string, never>;
};

export const Renderer = ({
  width,
  height,
  data,
  setHoveredCell,
  colorScale,
}: RendererProps) => {
  // bounds = area inside the axis
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;
  const allYGroups = useMemo(
    () => [...new Set(data.map((d) => String(d.y)))],
    [data]
  );
  const allXGroups = useMemo(
    () => [...new Set(data.map((d) => String(d.x)))],
    [data]
  );

  const xScale = useMemo(() => {
    return d3
      .scaleBand()
      .range([0, boundsWidth])
      .domain(allXGroups)
      .padding(0.2);
  }, [data, width]);

  const yScale = useMemo(() => {
    return d3
      .scaleBand<string>()
      .range([0, boundsHeight])
      .domain(allYGroups)
      .padding(0.2);
  }, [data, height]);

  const allRects = data.map((d, i) => {
    const xPos = xScale(String(d.x));
    const yPos = yScale(String(d.y));

    if (d.value === null || !xPos || !yPos) {
      return;
    }

    return (
      <rect
        key={i}
        x={xPos}
        y={yPos}
        className={styles.rectangle}
        width={xScale.bandwidth()}
        height={yScale.bandwidth()}
        fill={d.value ? colorScale(d.value) : "#000000"}
        onMouseEnter={() => {
          setHoveredCell({
            xLabel: +(d.x),
            yLabel: d.y,
            xPos: xPos + xScale.bandwidth() + MARGIN.left,
            yPos: yPos + xScale.bandwidth() / 2 + MARGIN.top,
            value: d.value ? Math.round(d.value * 100) / 100 : null,
          });
        }}
      />
    );
  });
  const title = "Number of Measles Cases Across 70 Years and 50 States";
  const xlab = "Years";
  const ylab = "States";
  const leg = "Color Legend";
  const xLabels = allXGroups.map((name, i) => {
    if (name && Number(name) % 10 === 0) {
      return (
        <text
          key={i}
          x={xScale(name)}
          y={boundsHeight + 10}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={10}
          stroke="none"
          fill="black"
        >
          {name}
          
        </text>
        
      );
    }
  });

  const yLabels = allYGroups.map((name, i) => {
    const yPos = yScale(name);
    if (yPos && i % 2 === 0) {
      return (
        <text
          key={i}
          x={-5}
          y={yPos + yScale.bandwidth() / 2}
          textAnchor="end"
          dominantBaseline="middle"
          fontSize={10}
        >
          {name}
        </text>
        
      );
    }
  });

  return (
    <svg
      width={width}
      height={height}
      onMouseLeave={() => setHoveredCell(null)}
    >
      <g
        width={boundsWidth}
        height={boundsHeight}
        transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
      >
        {allRects}
        {xLabels}
        {yLabels}
      </g>
      <text
        x={width / 2}
        y={MARGIN.top / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={20}
        fontWeight="bold"
        font-family="sans-serif"
      >
        {title}
      </text>
      <text
        x={width / 2.3}
        y={MARGIN.bottom + 465}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={20}
        
        font-family="sans-serif"
      >
        {xlab}
      </text>
      <text
        x={height / 10}
        y={MARGIN.right + 140}
        transform={`rotate(-90, ${height / 18}, ${MARGIN.right + 150})`}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={20}
        
        font-family="sans-serif"
      >
        {ylab}
      </text>
      <text
        x={height / 4}
        y={MARGIN.right + 750}
        transform={`rotate(-90, ${height / 18}, ${MARGIN.right + 150})`}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={20}
        
        font-family="sans-serif"
      >
        {leg}
      </text>
    </svg>
  );
};
