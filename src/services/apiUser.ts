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

export const recordTimeIn = async (employeeId: number) => {
  try {
    const currentDate = new Date().toISOString().split("T")[0];
    const timeInData = {
      employeeId,
      date: currentDate,
      timeIns: [
        {
          timeIn: new Date().toISOString(),
          timeOut: null,
          type: "morning",
        },
      ],
      totalWorkHours: 0,
      status: "pending",
    };

    const response = await fetch("http://localhost:8000/timeRecords", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(timeInData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to record time in");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in recordTimeIn:", error);
    throw error;
  }
};

export const recordTimeOut = async (recordId: number, timeInIndex: number) => {
  try {
    const getResponse = await fetch(
      `http://localhost:8000/timeRecords/${recordId}`,
    );
    if (!getResponse.ok) {
      throw new Error("Failed to fetch current record");
    }
    const currentRecord = await getResponse.json();

    const updatedTimeIns = [...currentRecord.timeIns];
    updatedTimeIns[timeInIndex] = {
      ...updatedTimeIns[timeInIndex],
      timeOut: new Date().toISOString(),
    };

    const timeIn = new Date(updatedTimeIns[timeInIndex].timeIn);
    const timeOut = new Date(updatedTimeIns[timeInIndex].timeOut);
    const hoursWorked =
      (timeOut.getTime() - timeIn.getTime()) / (1000 * 60 * 60);

    const response = await fetch(
      `http://localhost:8000/timeRecords/${recordId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          timeIns: updatedTimeIns,
          totalWorkHours: hoursWorked,
          status: "completed",
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to record time out");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in recordTimeOut:", error);
    throw error;
  }
};
