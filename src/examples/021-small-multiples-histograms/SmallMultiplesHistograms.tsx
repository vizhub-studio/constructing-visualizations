import { useMemo } from 'react';
import { bin } from 'd3-array';
import { Histogram } from './Histogram';
import type { HistogramBin } from './renderMarks';
import { usePenguinsDataset, type PenguinRow } from './usePenguinsDataset';

const targetBinCount = 20;

const bodyMassValue = (penguin: PenguinRow) => penguin.body_mass_g;
const flipperLengthValue = (penguin: PenguinRow) => penguin.flipper_length_mm;
const billLengthValue = (penguin: PenguinRow) => penguin.bill_length_mm;
const billDepthValue = (penguin: PenguinRow) => penguin.bill_depth_mm;

interface HistogramDefinition {
  id: string;
  title: string;
  xAxisLabel: string;
  binValue: (penguin: PenguinRow) => number;
}

const histogramDefinitions: HistogramDefinition[] = [
  {
    id: 'body-mass',
    title: 'Body Mass',
    xAxisLabel: 'Body Mass (g)',
    binValue: bodyMassValue,
  },
  {
    id: 'flipper-length',
    title: 'Flipper Length',
    xAxisLabel: 'Flipper Length (mm)',
    binValue: flipperLengthValue,
  },
  {
    id: 'bill-length',
    title: 'Bill Length',
    xAxisLabel: 'Bill Length (mm)',
    binValue: billLengthValue,
  },
  {
    id: 'bill-depth',
    title: 'Bill Depth',
    xAxisLabel: 'Bill Depth (mm)',
    binValue: billDepthValue,
  },
];

// Repeat the same chart for four quantitative projections of one dataset.
export function SmallMultiplesHistograms() {
  const data = usePenguinsDataset();

  const prepared = useMemo(() => {
    if (data === null) return null;

    const histograms = histogramDefinitions.map(({ id, title, xAxisLabel, binValue }) => {
      // Keep the full source dataset. Filter only this measurement for binning.
      const filteredData = data.filter((penguin) => Number.isFinite(binValue(penguin)));
      const bins = filteredData.length
        ? (bin<PenguinRow, number>()
            .value(binValue)
            .thresholds(targetBinCount)(filteredData) as HistogramBin[])
        : [];

      return { id, title, xAxisLabel, bins };
    });

    // A shared count domain makes bar heights comparable across the panels.
    const yMax = Math.max(1, ...histograms.flatMap(({ bins }) => bins.map((bin) => bin.length)));

    return { histograms, yMax };
  }, [data]);

  if (prepared === null) {
    return (
      <div className="flex h-full w-full items-center justify-center" role="status">
        Loading Palmer Penguins…
      </div>
    );
  }

  if (data?.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center" role="status">
        No penguin records available.
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-y-auto">
      <div className="grid min-h-full w-full auto-rows-[minmax(310px,1fr)] grid-cols-1 gap-4 p-4 lg:grid-cols-2">
        {prepared.histograms.map(({ id, title, xAxisLabel, bins }) => (
          <div key={id} className="min-h-[310px] min-w-0 rounded border border-gray-200">
            <Histogram title={title} xAxisLabel={xAxisLabel} bins={bins} yMax={prepared.yMax} />
          </div>
        ))}
      </div>
    </div>
  );
}
