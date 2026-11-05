import type { Bin } from 'd3-array';
import type { ScaleLinear } from 'd3-scale';
import type { Selection } from 'd3-selection';
import type { PenguinRow } from './usePenguinsDataset';

export interface RenderMarksOptions {
  bins: Bin<PenguinRow, number>[];
  xScale: ScaleLinear<number, number>;
  yScale: ScaleLinear<number, number>;
}

// React owns the marks group; D3 joins one static rectangle per histogram bin.
export function renderMarks(
  marks: Selection<SVGGElement, unknown, null, undefined>,
  { bins, xScale, yScale }: RenderMarksOptions,
) {
  marks
    .selectAll<SVGRectElement, Bin<PenguinRow, number>>('rect')
    .data(bins)
    .join('rect')
    .attr('x', (bin) => xScale(bin.x0!) + 0.5)
    .attr('y', (bin) => yScale(bin.length))
    .attr('width', (bin) => Math.max(0, xScale(bin.x1!) - xScale(bin.x0!) - 1))
    .attr('height', (bin) => Math.max(0, yScale(0) - yScale(bin.length)))
    .attr('fill', 'black');
}
