import React from 'react';

const Feature = ({ icon, title, desc }) => (
  <div className="bg-white p-7 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
    <div className="h-14 w-14 rounded-lg bg-gray-100 flex items-center justify-center mb-5">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{desc}</p>
  </div>
);

export default Feature;