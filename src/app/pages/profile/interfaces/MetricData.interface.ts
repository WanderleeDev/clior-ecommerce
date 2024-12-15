export interface MetricData {
  title: string;
  type: MetricType;
  value: number;
  percentage: number;
  date: Date;
  status: 'up' | 'down';
}

export type MetricType = 'orders' | 'reviews' | 'favorites' | 'returns';
