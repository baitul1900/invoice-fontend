import React, { useState, useEffect } from 'react';
import MasterLayout from '../master-layout/MasterLayout';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  
  const dummyUser = {
    name: "John Doe",
    email: "john.doe@example.com",
  };

  const dummyInventory = [
    { _id: '1', name: 'Product 1', quantity: 10, price: 100 },
    { _id: '2', name: 'Product 2', quantity: 5, price: 200 },
    { _id: '3', name: 'Product 3', quantity: 15, price: 150 },
  ];

  const dummyInvoices = [
    { _id: '1', totalAmount: 1000, createdAt: '2023-07-10T12:00:00Z' },
    { _id: '2', totalAmount: 1500, createdAt: '2023-07-11T12:00:00Z' },
    { _id: '3', totalAmount: 2000, createdAt: '2023-07-12T12:00:00Z' },
  ];

  useEffect(() => {
    setLoading(false);
  }, []);

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
          <p><strong>Name:</strong> {dummyUser.name}</p>
          <p><strong>Email:</strong> {dummyUser.email}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Total Products</h2>
          <p className="text-3xl">{dummyInventory.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Total Invoices</h2>
          <p className="text-3xl">{dummyInvoices.length}</p>
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
            {dummyInventory.map((item) => (
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
            {dummyInvoices.map((invoice) => (
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
