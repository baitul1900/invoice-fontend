import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MasterLayout from '../master-layout/MasterLayout';
import { useAuthStore } from '../stores/authStore';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, fetchUserProfile, fetchInventoryList, fetchInvoice, token } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState([]);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        await fetchUserProfile();
        const inventoryData = await fetchInventoryList(user?.id);
        const invoiceData = await fetchInvoice(user?.id);
        setInventory(inventoryData || []);  // Ensure that inventoryData is an array
        setInvoices(invoiceData || []);    // Ensure that invoiceData is an array
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, [token, user?.id, navigate, fetchUserProfile, fetchInventoryList, fetchInvoice]);

  if (loading) return <div>Loading...</div>;

  return (
    <MasterLayout>
      <div className="min-h-screen bg-gray-100 flex flex-col p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">User Profile</h2>
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Total Products</h2>
            <p className="text-3xl">{inventory?.length ?? 0}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Total Invoices</h2>
            <p className="text-3xl">{invoices?.length ?? 0}</p>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Inventory</h2>
          <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
            <thead>
              <tr>
                <th className="py-2 px-4 bg-gray-200">Product Name</th>
                <th className="py-2 px-4 bg-gray-200">Quantity</th>
                <th className="py-2 px-4 bg-gray-200">Price</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item._id}>
                  <td className="py-2 px-4">{item.name}</td>
                  <td className="py-2 px-4">{item.quantity}</td>
                  <td className="py-2 px-4">${item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Invoices</h2>
          <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
            <thead>
              <tr>
                <th className="py-2 px-4 bg-gray-200">Invoice ID</th>
                <th className="py-2 px-4 bg-gray-200">Total Amount</th>
                <th className="py-2 px-4 bg-gray-200">Date</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice._id}>
                  <td className="py-2 px-4">{invoice._id}</td>
                  <td className="py-2 px-4">${invoice.totalAmount}</td>
                  <td className="py-2 px-4">{new Date(invoice.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </MasterLayout>
  );
};

export default Dashboard;
