import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import Dialog from "../components/ui/dialog";

import { TimeRecord } from "../lib/types";
import { formatDate, formatTime } from "../lib/helpers";
import {
  getCurrentUserTimeRecords,
  recordTimeIn,
  recordTimeOut,
} from "../services/apiUser";

const RECORDS_PER_PAGE = 10;
const MAX_RECORDS = 100;

export default function Dashboard() {
  const userId = localStorage.getItem("currentUserId");
  const [timeRecords, setTimeRecords] = useState<TimeRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showTimeInDialog, setShowTimeInDialog] = useState(false);
  const [showTimeOutDialog, setShowTimeOutDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPages = Math.min(
    Math.ceil(timeRecords.length / RECORDS_PER_PAGE),
    Math.ceil(MAX_RECORDS / RECORDS_PER_PAGE),
  );

  const paginatedRecords = timeRecords.slice(
    (currentPage - 1) * RECORDS_PER_PAGE,
    currentPage * RECORDS_PER_PAGE,
  );

  const fetchTimeRecords = async () => {
    try {
      setIsLoading(true);
      const records = await getCurrentUserTimeRecords();
      const sortedRecords = records
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, MAX_RECORDS);
      setTimeRecords(sortedRecords);
    } catch (err) {
      toast.error("Failed to fetch time records");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeRecords();
  }, []);

  const handleTimeIn = async () => {
    try {
      setIsSubmitting(true);
      await recordTimeIn(Number(userId));
      await fetchTimeRecords();
      setShowTimeInDialog(false);
    } catch (err) {
      toast.error("Failed to record time in. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTimeOut = async () => {
    try {
      setIsSubmitting(true);

      const currentDate = new Date().toISOString().split("T")[0];
      const todayRecord = timeRecords.find(
        (record) => record.date === currentDate,
      );

      if (!todayRecord) {
        throw new Error("No time in record found for today");
      }

      const lastTimeIn = todayRecord.timeIns[todayRecord.timeIns.length - 1];
      if (!lastTimeIn || lastTimeIn.timeOut !== null) {
        throw new Error("No active time in found for today");
      }

      await recordTimeOut(todayRecord.id, todayRecord.timeIns.length - 1);
      await fetchTimeRecords();
      setShowTimeOutDialog(false);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to record time out. Please try again.",
      );
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasActiveTimeIn = () => {
    const currentDate = new Date().toISOString().split("T")[0];
    const todayRecord = timeRecords.find(
      (record) => record.date === currentDate,
    );

    if (!todayRecord) return false;

    const lastTimeIn = todayRecord.timeIns[todayRecord.timeIns.length - 1];
    return lastTimeIn && lastTimeIn.timeOut === null;
  };

  const canTimeIn = !hasActiveTimeIn();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          size="sm"
          onClick={() => handlePageChange(i)}
          className="mx-1"
        >
          {i}
        </Button>,
      );
    }

    return buttons;
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        Loading time records...
      </div>
    );
  }

  const renderStatusBadge = (status: string) => {
    const statusStyles = {
      completed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      rejected: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`rounded px-2 py-1 text-sm ${
          statusStyles[status as keyof typeof statusStyles]
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex items-end justify-between">
        <h2 className="text-2xl font-bold">My Time Records</h2>
        <div className="flex flex-col items-end">
          <div className="space-x-2">
            {canTimeIn ? (
              <Dialog
                open={showTimeInDialog}
                onOpenChange={setShowTimeInDialog}
              >
                <Dialog.Trigger asChild>
                  <Button size="sm" disabled={isSubmitting}>
                    Time in
                  </Button>
                </Dialog.Trigger>
                <Dialog.Content>
                  <Dialog.Header>
                    <Dialog.Title>Confirm Time In</Dialog.Title>
                    <Dialog.Description>
                      Are you sure you want to time in now?
                    </Dialog.Description>
                  </Dialog.Header>
                  <Dialog.Footer>
                    <Button onClick={handleTimeIn} disabled={isSubmitting}>
                      {isSubmitting ? "Processing..." : "Confirm"}
                    </Button>
                    <Button
                      onClick={() => setShowTimeInDialog(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  </Dialog.Footer>
                </Dialog.Content>
              </Dialog>
            ) : (
              <Dialog
                open={showTimeOutDialog}
                onOpenChange={setShowTimeOutDialog}
              >
                <Dialog.Trigger asChild>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={isSubmitting}
                  >
                    Time out
                  </Button>
                </Dialog.Trigger>
                <Dialog.Content>
                  <Dialog.Header>
                    <Dialog.Title>Confirm Time Out</Dialog.Title>
                    <Dialog.Description>
                      Are you sure you want to time out now?
                    </Dialog.Description>
                  </Dialog.Header>
                  <Dialog.Footer>
                    <Button
                      variant="destructive"
                      onClick={handleTimeOut}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Processing..." : "Confirm"}
                    </Button>
                    <Button
                      onClick={() => setShowTimeOutDialog(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  </Dialog.Footer>
                </Dialog.Content>
              </Dialog>
            )}
          </div>
        </div>
      </div>

      {timeRecords.length === 0 ? (
        <p>No time records found.</p>
      ) : (
        <div className="space-y-4">
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
              {paginatedRecords.map((record) => (
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
                        {timeEntry.timeOut
                          ? formatTime(timeEntry.timeOut)
                          : "-"}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>{record.totalWorkHours.toFixed(2)} hrs</TableCell>
                  <TableCell>{renderStatusBadge(record.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <Button
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                First
              </Button>
              <Button
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {renderPaginationButtons()}
              <Button
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
              <Button
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
              >
                Last
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
