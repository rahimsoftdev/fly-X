export interface IPopularRoute {
  origin: string;
  destination: string;
  count: number;
  percentage: number;
}

export interface IInsights {
  totalInterest: number;
  scheduledFlights: number;
  weeklyDemand: { day: string; members: number }[];
  popularRoutes: IPopularRoute[];
}