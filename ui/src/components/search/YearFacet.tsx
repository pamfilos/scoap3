import React, { useState } from "react";
import { FlexibleWidthXYPlot, VerticalBarSeries, Hint } from "react-vis";
import { Card, Slider } from "antd";
import { PublicationYear } from "@/types";

interface YearFacetProps {
  data: PublicationYear[];
}

const initialData = [
  { x: 2017, y: 8 },
  { x: 2018, y: 5 },
  { x: 2019, y: 4 },
  { x: 2020, y: 9 },
  { x: 2021, y: 1 },
  { x: 2022, y: 7 },
  { x: 2023, y: 6 },
  { x: 2024, y: 3 },
  { x: 2025, y: 2 },
  { x: 2026, y: 1 },
];

const data = [
  { x: 2020, y: 9 },
  { x: 2021, y: 1 },
  { x: 2022, y: 7 },
  { x: 2023, y: 6 },
];

const YearFacet: React.FC<YearFacetProps> = ({ data }) => {
  const [hoveredBar, setHoveredBar] = useState<any>(null);
  const [initialData, setInitialData] = useState(data);
  const [sliderEndpoints, setSliderEndpoints] = useState([2017, 2026]);

  const onBarClick = (value: number) => {
    const endpoints = [value, value];
    onSliderChange(endpoints);
  };
  const onSliderChange = (range: any) => {
    setSliderEndpoints(range);
    setInitialData(range);
  };

  const onBarMouseHover = (bar: any) => setHoveredBar({ [bar.x]: bar.y });
  const onBarMouseOut = () => setHoveredBar(null);

  return (
    <Card title="Year" className="search-facets-facet mb-5">
      <div className="mx-3">
        <FlexibleWidthXYPlot height={150} margin={0}>
          <VerticalBarSeries
            className="pointer"
            colorType="literal"
            data={data}
            onValueClick={onBarClick}
            onValueMouseOver={onBarMouseHover}
            onValueMouseOut={onBarMouseOut}
          />
          {hoveredBar && (
            <Hint
              value={hoveredBar}
              align={{ vertical: "top", horizontal: "auto" }}
            />
          )}
        </FlexibleWidthXYPlot>
      </div>
      <Slider
        range
        onChange={onSliderChange}
        value={sliderEndpoints}
        min={sliderEndpoints[0]}
        max={sliderEndpoints[1]}
        included
        tooltip={{ open: false }}
      />
    </Card>
  );
};

export default YearFacet;
