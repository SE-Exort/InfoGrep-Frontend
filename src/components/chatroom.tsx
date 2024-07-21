import React, { useState } from 'react';

// Left side of the screen
const Chatroom = () => {
  const [count, setCount] = useState(0);

  // Handler functions here
  const incrementCount = () => {
    setCount(count + 1);
  };

  // Component render
  // need Settings component
  // 
  return (
    <div>
      <h1>Hello, World!</h1>
      <p>Count: {count}</p>
      <button onClick={incrementCount}>Increment</button>
    </div>
  );
};

export default Chatroom;