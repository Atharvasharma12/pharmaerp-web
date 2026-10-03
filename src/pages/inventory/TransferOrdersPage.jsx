import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiEye, FiCheck, FiFilter, FiRefreshCw, FiEdit, FiX } from "react-icons/fi";
import transferOrderService from "../../features/transfer-order/services/transferOrderService";
import useBranch from "../../features/branch/hooks/useBranch";
import { uiToast as toast } from "@/components/ui";

const TransferOrdersPage = () => {
  const [transferOrders, setTransferOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [receivingId, setReceivingId] = useState(null);
  
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const { branches, getCompanyBranches, currentBranch } = useBranch();
  
  const [filters, setFilters] = useState({
    status: "",
    sourceBranchId: "",
    destinationBranchId: "",
  });

  // Modal State
  const [viewingOrder, setViewingOrder] = useState(null);
  const [loadingViewId, setLoadingViewId] = useState(null);

  useEffect(() => {
    getCompanyBranches();
  }, [getCompanyBranches]);

  const fetchTransferOrders = async () => {
    try {
      setLoading(true);
      const res = await transferOrderService.getTransferOrders({
        page,
        limit,
        ...filters,
      });
      setTransferOrders(res?.data?.data?.transferOrders || []);
      setTotal(res?.data?.data?.total || 0);
    } catch (error) {
      toast.error("Failed to load transfer orders");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransferOrders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters]);

  const handleReceive = async (id) => {
    if (!window.confirm("Are you sure you want to receive this order and update inventory?")) return;
    
    try {
      setReceivingId(id);
      await transferOrderService.receiveTransferOrder(id);
      toast.success("Transfer order received successfully");
      fetchTransferOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to receive transfer order");
    } finally {
      setReceivingId(null);
    }
  };

  const handleView = async (id) => {
    try {
      setLoadingViewId(id);
      const res = await transferOrderService.getTransferOrderById(id);
      setViewingOrder(res?.data?.data || res?.data);
    } catch (error) {
      toast.error("Failed to load transfer order details");
      console.error(error);
    } finally {
      setLoadingViewId(null);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Transfer Orders</h1>
          <p className="text-gray-500 text-sm">Manage stock transfers between facilities</p>
        </div>
        <Link
          to="/inventory/transfer-orders/create"
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <FiPlus /> New Transfer
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-2xs border border-gray-200 mb-6 p-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">All Statuses</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-gray-700 mb-1">Source Facility</label>
            <select
              name="sourceBranchId"
              value={filters.sourceBranchId}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">All Facilities</option>
              {branches.map(b => (
                <option key={b._id} value={b._id}>{b.name}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-gray-700 mb-1">Destination Facility</label>
            <select
              name="destinationBranchId"
              value={filters.destinationBranchId}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">All Facilities</option>
              {branches.map(b => (
                <option key={b._id} value={b._id}>{b.name}</option>
              ))}
            </select>
          </div>
          <button
            onClick={fetchTransferOrders}
            className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600"
            title="Refresh"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-2xs border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-600 uppercase">
                <th className="p-4 font-semibold">Transfer No</th>
                <th className="p-4 font-semibold">Source</th>
                <th className="p-4 font-semibold">Destination</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">Loading...</td>
                </tr>
              ) : transferOrders.length > 0 ? (
                transferOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-800">{order.transferNo}</td>
                    <td className="p-4 text-sm text-gray-600">{order.sourceBranchId?.name}</td>
                    <td className="p-4 text-sm text-gray-600">{order.destinationBranchId?.name}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        order.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                        order.status === 'IN_TRANSIT' ? 'bg-amber-100 text-amber-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleView(order._id)}
                        disabled={loadingViewId === order._id}
                        className="p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 rounded transition-colors"
                        title="View Details"
                      >
                        {loadingViewId === order._id ? <FiRefreshCw className="size-4 animate-spin" /> : <FiEye className="size-4" />}
                      </button>
                      
                      {order.status === "IN_TRANSIT" && currentBranch?._id === order.sourceBranchId?._id && (
                        <Link
                          to={`/inventory/transfer-orders/${order._id}/edit`}
                          className="p-1.5 text-blue-500 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors"
                          title="Edit Transfer"
                        >
                          <FiEdit className="size-4" />
                        </Link>
                      )}

                      {order.status === "IN_TRANSIT" && currentBranch?._id === order.destinationBranchId?._id && (
                        <button
                          onClick={() => handleReceive(order._id)}
                          disabled={receivingId === order._id}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                        >
                          <FiCheck /> {receivingId === order._id ? "Receiving..." : "Receive"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    No transfer orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {total > limit && (
          <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50 text-sm">
            <span className="text-gray-600">Showing {transferOrders.length} of {total}</span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1 bg-white border border-gray-300 rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={page * limit >= total}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1 bg-white border border-gray-300 rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Details Modal */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Transfer Order Details</h3>
                <p className="text-sm text-gray-500 font-mono mt-0.5">{viewingOrder.transferNo}</p>
              </div>
              <button onClick={() => setViewingOrder(null)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
                <FiX className="text-xl" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Source Facility</p>
                  <p className="font-medium text-gray-800">{viewingOrder.sourceBranchId?.name}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Destination Facility</p>
                  <p className="font-medium text-gray-800">{viewingOrder.destinationBranchId?.name}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Status</p>
                  <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${
                    viewingOrder.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                    viewingOrder.status === 'IN_TRANSIT' ? 'bg-amber-100 text-amber-800' :
                    'bg-gray-200 text-gray-800'
                  }`}>
                    {viewingOrder.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Created At</p>
                  <p className="font-medium text-gray-800">{new Date(viewingOrder.createdAt).toLocaleString()}</p>
                </div>
              </div>

              {viewingOrder.remarks && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">Remarks</h4>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm text-gray-700">
                    {viewingOrder.remarks}
                  </div>
                </div>
              )}

              <h4 className="text-sm font-semibold text-gray-800 mb-3 border-b pb-2">Transfer Items</h4>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-600 uppercase">
                      <th className="p-3 font-semibold">Product</th>
                      <th className="p-3 font-semibold">Batch No</th>
                      <th className="p-3 font-semibold text-right">Transfer Qty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {viewingOrder.items?.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50">
                        <td className="p-3 font-medium text-gray-800 text-sm">{item.product?.name || "Unknown Product"}</td>
                        <td className="p-3 text-sm text-gray-600 font-mono">{item.batchNo}</td>
                        <td className="p-3 text-sm text-gray-800 font-medium text-right">{item.transferQty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransferOrdersPage;
