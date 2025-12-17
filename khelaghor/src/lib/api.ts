import { API_BASE_URL } from "../config/api";

export async function fetchThemeConfig() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/theme-config`);
    if (!response.ok) {
      throw new Error("Failed to fetch theme config");
    }
    const data = await response.json();
    return data.themeConfig;
  } catch (error) {
    console.error("Error fetching theme config:", error);
    throw error;
  }
}
