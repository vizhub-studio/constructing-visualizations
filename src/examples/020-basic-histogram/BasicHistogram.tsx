import { useEffect, useMemo, useRef, useState } from 'react';
import { bin } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
import { usePenguinsDataset, type PenguinRow } from './usePenguinsDataset';

const margin = { top: 60, right: 30, bottom: 70, left: 80 };
const targetBinCount = 20;
const binValue = (penguin: PenguinRow) => penguin.body_mass_g;

// The same body-mass histogram as example 019, without controls, hovering,
// tooltips, or animation. The essential steps are: load, bin, scale, draw.
export function BasicHistogram() {
  const data = usePenguinsDataset();
  const [size, setSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const xAxisRef = useRef<SVGGElement>(null);
  const yAxisRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // d3.bin turns continuous measurements into intervals containing rows.
  const bins = useMemo(() => {
    if (!data) return null;

    // Keep the full dataset; filter only the measurements being binned.
    const filteredData = data.filter((penguin) => Number.isFinite(binValue(penguin)));
    if (!filteredData.length) return null;

    return bin<PenguinRow, number>()
      .value(binValue)
      .thresholds(targetBinCount)(filteredData);
  }, [data]);

  const scales = useMemo(() => {
    if (!bins || !size.width || !size.height) return null;
    const xScale = scaleLinear()
      .domain([bins[0].x0!, bins[bins.length - 1].x1!])
      .range([margin.left, size.width - margin.right]);
    const yScale = scaleLinear()
      .domain([0, Math.max(...bins.map((bucket) => bucket.length))])
      .nice()
      .range([size.height - margin.bottom, margin.top]);
    return { xScale, yScale };
  }, [bins, size.width, size.height]);

  // D3 draws the axes immediately. There are no transitions.
  useEffect(() => {
    if (!scales || !xAxisRef.current || !yAxisRef.current) return;
    select(xAxisRef.current).call(axisBottom(scales.xScale).ticks(8));
    select(yAxisRef.current).call(
      axisLeft(scales.yScale).tickValues(scales.yScale.ticks(5).filter(Number.isInteger)),
    );
  }, [scales]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <svg className="absolute inset-0 w-full h-full" role="img" aria-label="Histogram of Palmer Penguins body mass">
        {bins && scales && (
          <>
            {bins.map((bucket, index) => {
              const x = scales.xScale(bucket.x0!);
              const right = scales.xScale(bucket.x1!);
              const y = scales.yScale(bucket.length);
              return (
                <rect
                  key={index}
                  x={x + 0.5}
                  y={y}
                  width={Math.max(0, right - x - 1)}
                  height={Math.max(0, scales.yScale(0) - y)}
                  fill="black"
                />
              );
            })}
            <g ref={xAxisRef} transform={'translate(0, ' + (size.height - margin.bottom) + ')'} />
            <g ref={yAxisRef} transform={'translate(' + margin.left + ', 0)'} />
            <text x={size.width / 2} y={margin.top / 2} textAnchor="middle" fontSize={20}>
              Palmer Penguins
            </text>
            <text
              x={margin.left + (size.width - margin.left - margin.right) / 2}
              y={size.height - margin.bottom + 44}
              textAnchor="middle"
              fontSize={14}
            >
              Body Mass (g)
            </text>
            <text
              transform={'translate(' + (margin.left - 40) + ', ' + (margin.top + (size.height - margin.top - margin.bottom) / 2) + ') rotate(-90)'}
              textAnchor="middle"
              fontSize={14}
            >
              Count
            </text>
          </>
        )}
      </svg>
    </div>
  );
}
