import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import Loader from '../global-component/Loader';
import { useAuthStore } from '../../stores/authStore';

const InvoiceList = () => {
  const { loading, error, invoiceList, fetchUserProfile, fetchInvoice, user, viewInvoice, viewInvoiceData, printInvoice } = useAuthStore();
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
      console.error('Failed to view invoice:', error);
    }
  };

  const handlePrintInvoice = async (e, invoiceId) => {
    e.preventDefault(); // Prevent default button behavior if it's a form submit
    try {
      await printInvoice(invoiceId); // Calls the printInvoice function
    } catch (error) {
      console.error('Failed to print invoice:', error);
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
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Created</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {invoiceList.map((invoice) => (
            <tr key={invoice._id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{invoice._id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.user?.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.user?.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${invoice.totalAmount.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(invoice.createdAt).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <Button onClick={(e) => handleViewInvoice(invoice._id)} className="mr-2">
                  View
                </Button>
                <Button onClick={(e) => handlePrintInvoice(e, invoice._id)} type="primary">
                  Print
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
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {selectedInvoice && (
          <div>
            <p><strong>User Name:</strong> {selectedInvoice.user?.name}</p>
            <p><strong>User Email:</strong> {selectedInvoice.user?.email}</p>
            <p><strong>Total Amount:</strong> ${selectedInvoice.totalAmount.toFixed(2)}</p>
            <p><strong>Date Created:</strong> {new Date(selectedInvoice.createdAt).toLocaleDateString()}</p>
            <h3>Products:</h3>
            <ul>
              {selectedInvoice.products.map((product, index) => (
                <li key={index} className="mb-4">
                  <img src={product.product?.image} alt={product.product?.name} className="w-24 h-24 object-cover mb-2" />
                  <p><strong>Product Name:</strong> {product.product?.name || 'No name available'}</p>
                  <p><strong>Description:</strong> {product.product?.description || 'No description available'}</p>
                  <p><strong>Price:</strong> ${product.product?.price?.toFixed(2) || 'N/A'}</p>
                  {product.total.map((total, idx) => (
                    <p key={idx}><strong>Total for inventory {idx + 1}:</strong> ${total.toFixed(2)}</p>
                  ))}
                </li>
              ))} 
            </ul>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InvoiceList;
