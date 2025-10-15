import React from 'react';

const Stat = ({ label, value }) => (
  <div className="text-center">
    <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-1">
      {value}
    </div>
    <div className="text-gray-600">{label}</div>
  </div>
);

export default Stat;