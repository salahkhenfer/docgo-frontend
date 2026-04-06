/**
 * ============================================================================
 * USER - ALL PAYMENTS PAGE
 * ============================================================================
 * User dashboard page to view all their own payments
 * Shows accepted, rejected, and pending payments
 * Can download screenshots and see details
 */

import React, { useState, useEffect } from "react";
import {
  Download,
  Filter,
  AlertCircle,
  Check,
  X,
  Clock,
  Eye,
  Search,
} from "lucide-react";
import apiClient from "../../utils/apiClient";

const UserAllPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    status: "all", // all, pending, approved, rejected
    itemType: "all", // all, course, program
  });

  const [pagination, setPagination] = useState({
    limit: 25,
    offset: 0,
    total: 0,
  });

  const [expandedRow, setExpandedRow] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    byStatus: {},
    byType: {},
  });

  // Fetch payments
  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.status !== "all") params.append("status", filters.status);
      if (filters.itemType !== "all")
        params.append("itemType", filters.itemType);
      params.append("limit", pagination.limit);
      params.append("offset", pagination.offset);

      const response = await apiClient.get(
        `/user/payment-history/all?${params}`,
      );

      if (response.data.success) {
        setPayments(response.data.data);
        setPagination((prev) => ({
          ...prev,
          total: response.data.pagination.total,
        }));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch your payments");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await apiClient.get("/user/payment-history/stats");
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch payment stats:", err);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [filters, pagination.offset]);

  useEffect(() => {
    fetchStats();
  }, []);

  // Download screenshot
  const handleDownload = async (paymentId) => {
    try {
      const response = await apiClient.get(
        `/user/payment-history/${paymentId}/download`,
        { responseType: "blob" },
      );

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `payment-${paymentId}.png`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (err) {
      alert("Failed to download screenshot");
      console.error(err);
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const Statuses = {
      approved: {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: Check,
      },
      rejected: {
        bg: "bg-red-100",
        text: "text-red-800",
        icon: X,
      },
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        icon: Clock,
      },
    };

    const config = Statuses[status] || Statuses.pending;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}
      >
        <Icon className="w-4 h-4" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);
  const currentPage = pagination.offset / pagination.limit + 1;

  if (loading && payments.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Payments</h1>
          <p className="text-gray-600">
            View all your payment history and download payment receipts
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-2">Total Payments</p>
            <p className="text-3xl font-bold text-gray-900">
              {stats.total || 0}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg shadow p-6">
            <p className="text-sm text-green-600 mb-2">Approved</p>
            <p className="text-3xl font-bold text-green-600">
              {stats.byStatus?.approved || 0}
            </p>
          </div>
          <div className="bg-yellow-50 rounded-lg shadow p-6">
            <p className="text-sm text-yellow-600 mb-2">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">
              {stats.byStatus?.pending || 0}
            </p>
          </div>
          <div className="bg-red-50 rounded-lg shadow p-6">
            <p className="text-sm text-red-600 mb-2">Rejected</p>
            <p className="text-3xl font-bold text-red-600">
              {stats.byStatus?.rejected || 0}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="font-semibold text-gray-900">Filter</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Status
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    status: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Type
              </label>
              <select
                value={filters.itemType}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    itemType: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="course">Courses</option>
                <option value="program">Programs</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Payments Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {payments.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No payments found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Item
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <React.Fragment key={payment.id}>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-gray-900">
                                {payment.item.title}
                              </p>
                              <p className="text-sm text-gray-500 capitalize">
                                {payment.itemType}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-medium text-gray-900">
                              {payment.amount} {payment.currency}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(payment.status)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(payment.uploadDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() =>
                                setExpandedRow(
                                  expandedRow === payment.id
                                    ? null
                                    : payment.id,
                                )
                              }
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>

                        {/* Expanded Row */}
                        {expandedRow === payment.id && (
                          <tr className="bg-blue-50">
                            <td colSpan="5" className="px-6 py-4">
                              <div className="space-y-4">
                                {payment.rejectionReason && (
                                  <div className="bg-red-50 border border-red-200 rounded p-4">
                                    <p className="text-xs font-medium text-red-700 uppercase mb-2">
                                      Rejection Reason
                                    </p>
                                    <p className="text-red-800">
                                      {payment.rejectionReason}
                                    </p>
                                  </div>
                                )}

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                  <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                                      Transaction ID
                                    </p>
                                    <p className="text-gray-900 font-mono text-sm">
                                      {payment.transactionId || "N/A"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                                      Verification Date
                                    </p>
                                    <p className="text-gray-900 text-sm">
                                      {payment.verificationDate
                                        ? new Date(
                                            payment.verificationDate,
                                          ).toLocaleDateString()
                                        : "Pending"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                                      Upload Date
                                    </p>
                                    <p className="text-gray-900 text-sm">
                                      {new Date(
                                        payment.uploadDate,
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>

                                <div>
                                  {payment.hasScreenshot && (
                                    <button
                                      onClick={() => handleDownload(payment.id)}
                                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                    >
                                      <Download className="w-4 h-4" />
                                      Download Screenshot
                                    </button>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {pagination.offset + 1} to{" "}
                  {Math.min(
                    pagination.offset + pagination.limit,
                    pagination.total,
                  )}{" "}
                  of {pagination.total} payments
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        offset: Math.max(0, prev.offset - prev.limit),
                      }))
                    }
                    disabled={pagination.offset === 0}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        offset: prev.offset + prev.limit,
                      }))
                    }
                    disabled={currentPage >= totalPages}
                    className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserAllPaymentsPage;
