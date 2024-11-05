import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
} from 'recharts';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { HistoricalData } from '../types';

interface TemperatureChartProps {
  data: HistoricalData[];
}

const CustomLegend = (props: any) => {
  const { payload } = props;
  
  return (
    <div className="flex justify-center gap-6 pt-4">
      {payload.map((entry: any, index: number) => (
        <div
          key={`item-${index}`}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg"
        >
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm font-medium text-gray-200">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export function TemperatureChart({ data }: TemperatureChartProps) {
  const [startIndex, setStartIndex] = useState<number>(Math.max(0, data.length - 48));
  const [endIndex, setEndIndex] = useState<number>(data.length - 1);

  const formattedData = data.map(entry => ({
    ...entry,
    timestamp: format(new Date(entry.timestamp), 'dd.MM. HH:mm', { locale: de }),
  }));

  const handleBrushChange = (brushData: any) => {
    if (brushData.startIndex !== undefined && brushData.endIndex !== undefined) {
      setStartIndex(brushData.startIndex);
      setEndIndex(brushData.endIndex);
    }
  };

  return (
    <div className="w-full h-[500px] bg-gray-900 rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-100 mb-4">Temperaturverlauf</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={formattedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="timestamp" 
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            stroke="#4B5563"
          />
          <YAxis 
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            stroke="#4B5563"
            tickFormatter={(value) => `${value}°C`}
            domain={['auto', 'auto']}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937',
              border: 'none',
              borderRadius: '0.5rem',
              color: '#F3F4F6',
              padding: '8px 12px'
            }}
            itemStyle={{ color: '#F3F4F6' }}
            labelStyle={{ color: '#9CA3AF', marginBottom: '4px' }}
          />
          <Legend 
            content={<CustomLegend />}
            verticalAlign="bottom"
            height={50}
          />
          <Line
            type="monotone"
            dataKey="tempMoritz"
            name="Moritz Zimmer"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="tempBad"
            name="Badezimmer"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="tempWohnzimmer"
            name="Wohnzimmer"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
          />
          <Brush
            dataKey="timestamp"
            height={30}
            stroke="#4B5563"
            fill="#1F2937"
            startIndex={startIndex}
            endIndex={endIndex}
            onChange={handleBrushChange}
            travellerWidth={10}
            gap={1}
          >
            <LineChart data={formattedData}>
              <Line
                type="monotone"
                dataKey="tempMoritz"
                stroke="#ef4444"
                strokeWidth={1}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="tempBad"
                stroke="#3b82f6"
                strokeWidth={1}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="tempWohnzimmer"
                stroke="#10b981"
                strokeWidth={1}
                dot={false}
              />
            </LineChart>
          </Brush>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}