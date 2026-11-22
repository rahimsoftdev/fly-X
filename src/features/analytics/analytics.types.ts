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

export interface IAdminOverview {
  year: number;
  stats: {
    totalMembers: number;
    staff: number;
    totalInterestThisMonth: number;
    totalRevenue: number;
  };
  membersOverTime: { month: string; total: number }[];
  dailyActivity: {
    month: string;
    opportunities: number;
    reservations: number;
    flightsBooked: number;
  }[];
  demandOverview: { month: string; members: number }[];
  popularRoutes: IPopularRoute[];
}