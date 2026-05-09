import api from '@/src/lib/axios';
import { ApiResponse } from '../auth/api';
import { OrderGroup } from '@/src/types';

interface HomeStats {
  totalOrderCount: number;
  totalOrderAmount: number;
  percentage: number;
  activeOrders: OrderGroup[];
}

export const getStats = (): Promise<ApiResponse<HomeStats>> =>
  api.get('/stores/stats').then((r) => r.data);
