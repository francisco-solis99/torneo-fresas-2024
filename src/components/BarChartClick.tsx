import { useState } from "react";
import { BarChart } from '@tremor/react';
import type { EventProps } from "@tremor/react";

export function BarChartClick({charData} : {charData: any}) {
  const [value, setValue] = useState<EventProps>(null);
  return (
    <>
      <BarChart
        data={charData}
        index="players"
        categories={["puntos_hechos", "puntos_recibidos"]}
        colors={["emerald", "orange"]}
        yAxisWidth={45}
        className="mt-6 h-80 fill-white text-xs"
        showXAxis={false}
        rotateLabelX={{ angle: -90, verticalShift: 50, xAxisHeight: 150 }}
        tickGap={0}
        onValueChange={(v) => setValue(v)}
      />
    </>
  );
}