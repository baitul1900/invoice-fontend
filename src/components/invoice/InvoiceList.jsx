import React, { useEffect, useState } from "react";
import { Button, Modal, message } from "antd";
import Loader from "../global-component/Loader";
import { useAuthStore } from "../../stores/authStore";
import { FaRegEye } from "react-icons/fa6";
import { FaPrint } from "react-icons/fa6";
import { IoTrashBin } from "react-icons/io5";

const InvoiceList = () => {
  const {
    loading,
    error,
    invoiceList,
    fetchUserProfile,
    fetchInvoice,
    user,
    viewInvoice,
    viewInvoiceData,
    printInvoice,
    deleteInvoice, // Import deleteInvoice from the store
  } = useAuthStore();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        await fetchUserProfile(); // Ensure user profile is fetched
      }
      if (user) {
        await fetchInvoice(user._id); // Fetch invoice list once user is available
      }
    };
    fetchData();
  }, [user, fetchUserProfile, fetchInvoice]);

  const handleViewInvoice = async (invoiceId) => {
    try {
      await viewInvoice(invoiceId);
      setSelectedInvoice(viewInvoiceData);
      setIsModalVisible(true);
    } catch (error) {
      console.error("Failed to view invoice:", error);
    }
  };

  const handlePrintInvoice = async (e, invoiceId) => {
    e.preventDefault(); // Prevent default button behavior if it's a form submit
    try {
      await printInvoice(invoiceId); // Calls the printInvoice function
    } catch (error) {
      console.error("Failed to print invoice:", error);
    }
  };

  const handleDeleteInvoice = async (invoiceId) => {
    try {
      await deleteInvoice(invoiceId); // Call the deleteInvoice function from the store
      message.success("Invoice deleted successfully");
    } catch (error) {
      console.error("Failed to delete invoice:", error);
      message.error("Failed to delete invoice");
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Invoice ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date Created
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {invoiceList.map((invoice) => (
            <tr key={invoice._id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {invoice._id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {invoice.user?.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {invoice.user?.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${invoice.totalAmount.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(invoice.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <Button
                  onClick={() => handleViewInvoice(invoice._id)}
                  className="mr-2"
                >
                  <FaRegEye />
                </Button>
                <Button
                  onClick={(e) => handlePrintInvoice(e, invoice._id)}
                  type="primary"
                  className="mr-2"
                >
                  <FaPrint />
                </Button>
                <Button
                  onClick={() => handleDeleteInvoice(invoice._id)}
                  type=""
                  className="bg-red-700 text-slate-100"
                >
                  <IoTrashBin />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        title="Invoice Details"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null} // Remove default footer
      >
        {selectedInvoice && (
          <div className="p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Invoice Details</h2>
            <div className="mb-4">
              <p>
                <strong>User Name:</strong> {selectedInvoice.user?.name}
              </p>
              <p>
                <strong>User Email:</strong> {selectedInvoice.user?.email}
              </p>
              <p>
                <strong>Total Amount:</strong> $
                {selectedInvoice.totalAmount.toFixed(2)}
              </p>
              <p>
                <strong>Date Created:</strong>{" "}
                {new Date(selectedInvoice.createdAt).toLocaleDateString()}
              </p>
            </div>

            <h3 className="text-xl font-semibold mb-4">Products</h3>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              {selectedInvoice.products.map((product, index) => (
                <div key={index} className="border p-1 rounded-lg shadow-sm">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-16 object-contain mb-4 rounded"
                  />
                  <p className="text-lg font-semibold">
                    {product.name || "No name available"}
                  </p>
                  <p className="text-gray-600 mb-2">
                    {product.description || "No description available"}
                  </p>
                  <p className="text-gray-800">
                    <strong>Price:</strong> ${product.price.toFixed(2)}
                  </p>
                  <p className="text-gray-800">
                    <strong>Quantity:</strong> {product.quantity}
                  </p>
                  <p className="text-gray-800">
                    <strong>Total:</strong> ${product.total.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InvoiceList;
