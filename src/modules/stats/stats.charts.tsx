import React from 'react';
import {
  CartesianGrid,
  Line,
  Tooltip,
  XAxis,
  YAxis,
  LineChart,
  ReferenceLine,
  Legend,
  DotProps,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { format } from 'date-fns';

type StyledLineChartProps = {
  width?: number;
  height?: number;
  dateFormat?: string;
  dataKeys: string[];
  xDataKey?: string;
  yDataKey?: string;
  data: Record<string, unknown>[];
  tooltipTitle?: string;
  showLegend?: boolean;
};

type StyledPieChartProps = {
  width?: number;
  height?: number;
  dataKeys?: string[];
  nameKey?: string;
  data: Record<string, unknown>[];
};

type CustomDotProps = DotProps & {
  payload?: Record<string, number>;
  // eslint-disable-next-line react/no-unused-prop-types
  dataKey?: string;
};

const CustomDot = (props: CustomDotProps): JSX.Element => {
  const { cx = 0, cy = 0, height, r, fill, payload, dataKey } = props;

  return (
    <circle
      cx={isNaN(cx) ? 0 : cx}
      cy={isNaN(cy) ? 0 : cy}
      height={height}
      r={r}
      fill={fill}
      stroke={
        (payload?.[dataKey ?? 'value'] ?? 0) > 0
          ? 'var(--system-green)'
          : 'var(--system-red)'
      }
    />
  );
};

const CustomActiveDot = (props: CustomDotProps): JSX.Element => {
  const { cx = 0, cy = 0, stroke, height, r, payload, dataKey } = props;

  return (
    <circle
      cx={isNaN(cx) ? 0 : cx}
      cy={isNaN(cy) ? 0 : cy}
      height={height}
      r={r}
      stroke={stroke}
      fill={
        // eslint-disable-next-line react/destructuring-assignment
        (payload?.[dataKey ?? 'value'] ?? 0) > 0
          ? 'var(--system-green)'
          : 'var(--system-red)'
      }
    />
  );
};

export const StyledPieChart = React.memo(
  ({
    width = 300,
    height,
    data,
    dataKeys = ['value'],
    nameKey = 'name',
  }: StyledPieChartProps): JSX.Element => {
    return (
      <PieChart width={width} height={height} style={{ height: 'auto' }}>
        {dataKeys.map(key => (
          <Pie
            data={data}
            dataKey={key}
            key={key}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            innerRadius={width / 8}
            label
            labelLine={false}
          >
            {data.map(entry => (
              <Cell
                key={`cell-${entry.name}`}
                fill={`hsl(${Math.floor(Math.random() * 360)}, 70%, 70%)`}
              />
            ))}
          </Pie>
        ))}
        <Tooltip
          formatter={(value: number, name: string) => [
            `${new Intl.NumberFormat().format(value || 0)} ₽`,
            name,
          ]}
        />
        <Legend
          verticalAlign="top"
          align="center"
          height={36}
          wrapperStyle={{ position: 'relative' }}
        />
      </PieChart>
    );
  },
);

StyledPieChart.displayName = 'StyledPieChart';

export const StyledLineChart = React.memo(
  ({
    data,
    width,
    height,
    dateFormat = 'd LLL',
    tooltipTitle,
    showLegend,
    dataKeys,
    xDataKey = 'date',
    yDataKey,
  }: StyledLineChartProps): JSX.Element => (
    <LineChart
      width={width ?? 700}
      height={height ?? 300}
      data={data}
      style={{ height: 'auto' }}
    >
      {showLegend && (
        <Legend
          verticalAlign="top"
          align="center"
          height={36}
          wrapperStyle={{ position: 'relative' }}
        />
      )}
      <CartesianGrid stroke="var(--system-silver)" strokeDasharray="6 6" />
      {dataKeys.map(dataKey => (
        <Line
          key={dataKey}
          dataKey={dataKey}
          type="monotone"
          stroke={
            dataKeys.length > 1
              ? `hsl(${Math.floor(Math.random() * 360)}, 70%, 70%)`
              : '#0f0f0f'
          }
          dot={<CustomDot />}
          activeDot={<CustomActiveDot />}
        />
      ))}
      <ReferenceLine y={0} stroke="var(--system-black)" />
      <XAxis
        dataKey={xDataKey}
        tickFormatter={value => {
          try {
            return format(new Date(value), dateFormat);
          } catch (e) {
            return value;
          }
        }}
      />
      <YAxis
        dataKey={yDataKey}
        tickFormatter={(value: number) => {
          if (Math.abs(value) < 100_000) {
            return new Intl.NumberFormat().format(value);
          }
          return `${new Intl.NumberFormat().format(value / 1000)}k`;
        }}
      />
      <Tooltip
        formatter={(value: number, name: string) => [
          `${new Intl.NumberFormat().format(value || 0)} ₽`,
          tooltipTitle ?? name,
        ]}
        labelFormatter={value => {
          try {
            return format(new Date(value), 'd LLL yyyy');
          } catch (e) {
            return value;
          }
        }}
      />
    </LineChart>
  ),
);

StyledLineChart.displayName = 'StyledLineChart';
