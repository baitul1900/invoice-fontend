import { useEffect, useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import { toast } from "react-hot-toast";
import Loader from "../global-component/Loader";
import Counter from "../global-component/Counter";

const ProductCard = () => {
  const { loading, error, fetchProducts, products, addProductToInventory, user, fetchUserProfile } = useAuthStore();
  const [selectedQuantity, setSelectedQuantity] =useState(1);

  useEffect(() => {
    (async () => {
      await fetchProducts();
      if (user === null) {
        await fetchUserProfile(); // Fetch user profile to ensure `user` is populated
      }
    })();
  }, [fetchProducts, fetchUserProfile, user]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const truncatedText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  const handleAddToInventory = (product) => {
    if (!user) {
      toast.error("Please log in to add products to the inventory.");
      return;
    }

    const productData = {
      userId: user._id,
      productId: product.id,
      name: product.title,
      quantity: selectedQuantity,
      price: product.price,
      description: product.description,
      image: product.image,
    };

    addProductToInventory(productData)
      .then(() => {
        toast.success("Product added to inventory");
      })
      .catch(() => {
        toast.error("Failed to add product to inventory");
      });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {products.map((item, id) => {
        return (
          <div
            className="mx-auto mt-11 w-80 transform overflow-hidden rounded-lg bg-white shadow-md duration-300 hover:scale-105 hover:shadow-lg"
            key={id}
          >
            <img
              className="h-80 w-full object-contain"
              src={item["image"]}
              alt="Product Image"
            />
            <div className="p-4">
              <h2 className="mb-2 text-lg font-medium text-gray-900">
                {truncatedText(item["title"], 20)}
              </h2>
              <p className="mb-2 text-base text-gray-700">
                {truncatedText(item["description"], 20)}
              </p>
              <div className="flex items-center">
                <p className="mr-2 text-lg font-semibold text-gray-900 ">
                  ${item["price"]}
                </p>
                <p className="text-base font-medium text-gray-500 line-through ">
                  $25.00
                </p>
                <p className="ml-auto text-base font-medium text-green-500">
                  20% off
                </p>
              </div>
              <Counter
                initialCount={1}
                min={1}
                max={10}
                onChange={(quantity) => setSelectedQuantity(quantity)} 
              />
              <button
                className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                onClick={() => handleAddToInventory(item)}  
              >
                Add to Inventory
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductCard;
