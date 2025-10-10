import React from 'react';

const FooterCol = ({ title, links }) => (
  <div>
    <h4 className="font-semibold mb-3">{title}</h4>
    <ul className="space-y-2 text-gray-400">
      {links.map(([href, text]) => (
        <li key={text}>
          <a href={href} className="hover:text-white transition-colors">
            {text}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export default FooterCol;