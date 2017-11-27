import * as React from 'react';

import Memory from 'components/memory';
import AssemblyEditor from 'containers/assemblyeditor';

const Root: React.StatelessComponent<{}> = () => (
  <div>
    <Memory />
    <AssemblyEditor />
  </div>
);

export default Root;
