import { useEffect } from "react";
import { useProductStore } from "../../stores/authStore";
import Loader from "../global-component/Loader";

const ProductCard = () => {
  const { loading, error, fetchProducts, products } = useProductStore();

  useEffect(() => {
    (async () => {
      await fetchProducts();
    })();
  }, [fetchProducts]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
      {products.map((item, id) => {
        return (
          <div className="product-card py-4 px-2 bg-slate-100 overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300" key={id}>
            <div className="relative overflow-hidden h-64 rounded-lg">
              <img
                src={item["image"]}
                className="w-full transform transition-transform duration-300 hover:scale-110"
                alt={item["title"]}
              />
            </div>
            <div className="product-info text-center mt-2">
              <h3 className="text-lg font-semibold">{item["title"]}</h3>
              <p className="text-gray-500">{item["price"]}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductCard;
