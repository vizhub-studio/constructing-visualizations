import { useEffect, useMemo, useRef } from 'react';
import { axisBottom, axisLeft } from 'd3-axis';
import { scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
import { renderMarks, type HistogramBin } from './renderMarks';
import { useDimensions } from './useDimensions';

const margin = { top: 54, right: 24, bottom: 64, left: 58 };
const binGap = 1;
const yAxisTicks = 5;

interface HistogramProps {
  title: string;
  xAxisLabel: string;
  bins: HistogramBin[];
  yMax: number;
}

// The same chart is reused for each measurement, with independent x domains.
export function Histogram({ title, xAxisLabel, bins, yMax }: HistogramProps) {
  const { ref: containerRef, dimensions: size } = useDimensions();
  const marksRef = useRef<SVGGElement>(null);
  const xAxisRef = useRef<SVGGElement>(null);
  const yAxisRef = useRef<SVGGElement>(null);

  const scales = useMemo(() => {
    if (!bins.length || !size.width || !size.height) return null;
    if (size.width <= margin.left + margin.right || size.height <= margin.top + margin.bottom) {
      return null;
    }

    const xScale = scaleLinear()
      .domain([bins[0].x0, bins[bins.length - 1].x1])
      .range([margin.left, size.width - margin.right]);
    const yScale = scaleLinear()
      .domain([0, yMax])
      .nice()
      .range([size.height - margin.bottom, margin.top]);

    return { xScale, yScale };
  }, [bins, size.width, size.height, yMax]);

  useEffect(() => {
    if (!scales || !marksRef.current) return;
    const { xScale, yScale } = scales;
    renderMarks(select(marksRef.current), { bins, xScale, yScale, binGap });
  }, [bins, scales]);

  useEffect(() => {
    if (!scales || !xAxisRef.current || !yAxisRef.current) return;
    const { xScale, yScale } = scales;
    const xAxisTicks = size.width < 470 ? 4 : 7;
    select(xAxisRef.current).call(axisBottom(xScale).ticks(xAxisTicks));
    select(yAxisRef.current).call(axisLeft(yScale).ticks(yAxisTicks));
  }, [scales, size.width]);

  return (
    <div ref={containerRef} className="relative h-full min-h-[310px] w-full">
      <svg
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label={title + ' histogram of Palmer Penguins measurements'}
      >
        {scales ? (
          <>
            <g ref={marksRef} className="marks" />
            <g ref={xAxisRef} transform={'translate(0, ' + (size.height - margin.bottom) + ')'} />
            <g ref={yAxisRef} transform={'translate(' + margin.left + ', 0)'} />
            <text x={size.width / 2} y={margin.top / 2} textAnchor="middle" fontSize={18}>
              {title}
            </text>
            <text x={size.width / 2} y={size.height - 14} textAnchor="middle" fontSize={13}>
              {xAxisLabel}
            </text>
            <text
              transform={
                'translate(' +
                (margin.left - 38) +
                ', ' +
                (margin.top + (size.height - margin.top - margin.bottom) / 2) +
                ') rotate(-90)'
              }
              textAnchor="middle"
              fontSize={13}
            >
              Count
            </text>
          </>
        ) : bins.length === 0 ? (
          <text x={size.width / 2} y={size.height / 2} textAnchor="middle" fontSize={14}>
            No valid measurements
          </text>
        ) : null}
      </svg>
    </div>
  );
}
