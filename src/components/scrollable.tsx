import * as React from 'react';

type ScrollableProps = {
  height: number;
};

const Scrollable: React.StatelessComponent<ScrollableProps> = ({ children, height }) => (
  <div style={{ maxHeight: `${height}px`, overflowY: 'auto' }}>{children}</div>
);

export default Scrollable;
