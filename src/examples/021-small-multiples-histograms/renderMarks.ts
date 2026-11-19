import type { Bin } from 'd3-array';
import type { ScaleLinear } from 'd3-scale';
import type { Selection } from 'd3-selection';
import type { PenguinRow } from './usePenguinsDataset';

export type HistogramBin = Bin<PenguinRow, number> & { x0: number; x1: number };

interface RenderMarksOptions {
  bins: HistogramBin[];
  xScale: ScaleLinear<number, number>;
  yScale: ScaleLinear<number, number>;
  binGap: number;
}

// React owns the groups. D3 draws the data-driven rectangles in each panel.
export function renderMarks(
  selection: Selection<SVGGElement, unknown, null, undefined>,
  { bins, xScale, yScale, binGap }: RenderMarksOptions,
) {
  selection
    .selectAll<SVGRectElement, HistogramBin>('rect')
    .data(bins)
    .join('rect')
    .attr('x', (bin) => xScale(bin.x0) + binGap / 2)
    .attr('y', (bin) => yScale(bin.length))
    .attr('width', (bin) => Math.max(0, xScale(bin.x1) - xScale(bin.x0) - binGap))
    .attr('height', (bin) => yScale(0) - yScale(bin.length))
    .attr('fill', 'black');
}
