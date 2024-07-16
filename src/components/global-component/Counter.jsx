import React, { useState } from "react";

const Counter = ({ initialCount, min, max, onChange }) => {
  const [count, setCount] = useState(initialCount);

  const increment = () => {
    if (count < max) {
      setCount(count + 1);
      onChange(count + 1);
    }
  };

  const decrement = () => {
    if (count > min) {
      setCount(count - 1);
      onChange(count - 1);
    }
  };

  return (
    <div className="flex items-center">
      <button onClick={decrement} className="bg-gray-200 p-2 rounded-l-md">-</button>
      <span className="p-2">{count}</span>
      <button onClick={increment} className="bg-gray-200 p-2 rounded-r-md">+</button>
    </div>
  );
};

export default Counter;
