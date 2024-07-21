import React, { useState } from 'react';


// this would be the pop up window that would show the files
const FileManager = () => {
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

export default FileManager;