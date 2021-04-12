import React from 'react'
import ReactFlow, { removeElements, addEdge, MiniMap, Controls } from 'react-flow-renderer'
import { useSelector } from 'react-redux';

import * as workflowSelectors from '../redux/workflow/workflow.selectors'

const WORKFLOW_TEMPLATE_ID = 'f3fea53e-b497-4b5c-b146-894c8eae51b1'

const WorkflowEditor = () => {

  const elements = useSelector(state => workflowSelectors.getReactFlowElements(state, WORKFLOW_TEMPLATE_ID))

  console.log("elements", elements)

  return (
    <div style={{ width: '100%', height: '90vh' }}>
      <ReactFlow
        style={{
          flex: 1
        }}
        elements={elements}
      >
        <MiniMap />
        <Controls />
     </ReactFlow> 
    </div>
  )
}

export default WorkflowEditor