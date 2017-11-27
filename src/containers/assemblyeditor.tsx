import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Textarea, Text, Button } from 'rebass';

import AssemblyStore from 'stores/assembly';
import ComputeStore from 'stores/compute';

type AssemblyEditorProps = {
  computeStore?: ComputeStore;
  assemblyStore?: AssemblyStore;
};
const AssemblyEditor: React.StatelessComponent<AssemblyEditorProps> = ({ computeStore, assemblyStore }) => (
  <div>
    <Textarea onChange={event => assemblyStore.compile(event.target.value)} />
    {assemblyStore.compileErrors.map((error, i) => (
      <Text key={i}>
        {error.line}: {error.message}
      </Text>
    ))}
    {assemblyStore.program.length > 0 && (
      <Button onClick={() => computeStore.init(assemblyStore.program)}>Load Program</Button>
    )}
  </div>
);

export default inject('computeStore', 'assemblyStore')(observer(AssemblyEditor));
