import type { DashboardData } from "../types/dashboard/dashboard-types";
import { api } from "./api";

export async function getDashboardData(): Promise<DashboardData> {
    const response = await api.get("/dashboard")
    return response.data;
}