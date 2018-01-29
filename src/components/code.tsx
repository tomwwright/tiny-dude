import * as React from 'react';

type CodeProps = {
  lines: string[];
};

export const Code: React.StatelessComponent<CodeProps> = ({ lines }) => (
  <pre
    style={{
      backgroundColor: '#EEE',
      fontFamily: 'Courier New',
      padding: '15px',
      margin: '10px 0px',
      overflowX: 'scroll',
    }}
  >
    {lines.join('\n')}
  </pre>
);
