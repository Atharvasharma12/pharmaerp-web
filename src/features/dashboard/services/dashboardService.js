import { apiClient, ENDPOINTS } from "@/services";

const dashboardService = {
  async getDashboardOverview() {
    const response = await apiClient.get(ENDPOINTS.DASHBOARD.OVERVIEW);
    return response.data?.data || null;
  },
};

export default dashboardService;
