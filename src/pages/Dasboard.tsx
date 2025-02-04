import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "../components/ui/table";

import { TimeRecord } from "../lib/types";
import { formatDate, formatTime } from "../lib/helpers";
import { getCurrentUserTimeRecords } from "../services/apiUser";

export default function Dashboard() {
  const [timeRecords, setTimeRecords] = useState<TimeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTimeRecords() {
      try {
        setIsLoading(true);
        const records = await getCurrentUserTimeRecords();
        setTimeRecords(records);
        setError(null);
      } catch (err) {
        setError("Failed to fetch time records");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTimeRecords();
  }, []);

  if (isLoading) {
    return <div>Loading time records...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="mb-4 text-2xl font-bold">My Time Records</h2>
      {timeRecords.length === 0 ? (
        <p>No time records found.</p>
      ) : (
        <Table variant="bordered">
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell>Time In</TableHeaderCell>
              <TableHeaderCell>Time Out</TableHeaderCell>
              <TableHeaderCell>Total Work Hours</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {timeRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{formatDate(record.date)}</TableCell>
                <TableCell>
                  {record.timeIns.map((timeEntry, index) => (
                    <div key={index} className="mb-1">
                      {formatTime(timeEntry.timeIn)}
                    </div>
                  ))}
                </TableCell>
                <TableCell>
                  {record.timeIns.map((timeEntry, index) => (
                    <div key={index} className="mb-1">
                      {formatTime(timeEntry.timeOut)}
                    </div>
                  ))}
                </TableCell>
                <TableCell>{record.totalWorkHours.toFixed(2)} hrs</TableCell>
                <TableCell>
                  <span
                    className={`rounded px-2 py-1 text-sm ${
                      record.status === "Approved"
                        ? "bg-green-100 text-green-800"
                        : record.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    } `}
                  >
                    {record.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
