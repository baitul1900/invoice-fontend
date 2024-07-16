import React, { useEffect, useState } from 'react';
import Loader from '../global-component/Loader';
import { useAuthStore } from '../../stores/authStore';

const InventoryList = () => {
  const { loading, error, inventoryList, fetchInventoryList, user, fetchUserProfile, createInvoice } = useAuthStore();
  const [selectedInventory, setSelectedInventory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        await fetchUserProfile(); // Ensure user profile is fetched
      }
      if (user) {
        await fetchInventoryList(user._id); // Fetch inventory list once user is available
      }
    };
    fetchData();
  }, [user, fetchUserProfile, fetchInventoryList]);

  const handleCreateInvoice = async () => {
    console.log('Selected Inventory:', selectedInventory);  // Debugging

    try {
      if (selectedInventory.length === 0) {
        alert('Please select at least one inventory item.');
        return;
      }

      // Filter out invalid or null IDs
      const validInventoryIds = selectedInventory.filter(id => id && id.trim() !== '');

      console.log('Valid Inventory IDs:', validInventoryIds);  // Debugging

      if (validInventoryIds.length === 0) {
        alert('No valid inventory items selected.');
        return;
      }

      const response = await createInvoice(user._id, validInventoryIds);
      alert(response.message || 'Invoice created successfully');

      // Clear selected items and refresh the inventory list
      setSelectedInventory([]);
      await fetchInventoryList(user._id);
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert(error.message || 'Failed to create invoice');  // Handle the thrown error message
    }
  };

  const handleSelectInventory = (id) => {
    setSelectedInventory((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const truncatedText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + '...';
    }
    return text;
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={handleCreateInvoice}
          disabled={selectedInventory.length === 0}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Create Invoice
        </button>
        <p className="text-gray-500">{selectedInventory.length} item(s) selected</p>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 w-9 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <input
                type="checkbox"
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  setSelectedInventory(isChecked ? inventoryList.map((item) => item._id) : []);
                }}
                checked={selectedInventory.length === inventoryList.length}
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Email</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {inventoryList.map((item) => (
            <tr key={item._id} className='hover:bg-gray-100 border'>
              <td className="border px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <input
                  type="checkbox"
                  checked={selectedInventory.includes(item._id)}
                  onChange={() => handleSelectInventory(item._id)}
                />
              </td>
              <td className="border px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
              <td className="border px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.productId}</td>
              <td className="border px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
              <td className="border px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.price}</td>
              <td className="border px-6 py-4 whitespace-nowrap text-sm text-gray-500">{truncatedText(item.description, 20)}</td>
              <td className="border px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <img src={item.image} alt={item.name} className="h-20 w-20 object-contain" />
              </td>
              <td className="border px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.userName}</td>
              <td className="border px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.userEmail}</td>
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryList;
