import { TimeRecord } from "../lib/types";
import { API_BASE_URL } from "./apiURL";

export async function getCurrentUserTimeRecords(): Promise<TimeRecord[]> {
  const userId = localStorage.getItem("currentUserId");
  if (!userId) return [];

  try {
    const response = await fetch(
      `${API_BASE_URL}/timeRecords?employeeId=${userId}`,
    );
    return await response.json();
  } catch (error) {
    console.error("Get time records error:", error);
    return [];
  }
}
