import * as React from 'react';

export const Footer: React.StatelessComponent = ({ children }) => (
  <div
    style={{
      position: 'fixed',
      bottom: 0,
      width: '100%',
      padding: '10px 0px',
    }}
  >
    {children}
  </div>
);
