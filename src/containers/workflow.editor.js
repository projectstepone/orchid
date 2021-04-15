import React, { useState } from 'react'
import ReactFlow, { removeElements, addEdge, Background, MiniMap, Controls } from 'react-flow-renderer'
import { useSelector } from 'react-redux';
import Popover from '@material-ui/core/Popover'
import { MenuItem, TextField, Button } from '@material-ui/core'

import * as workflowSelectors from '../redux/workflow/workflow.selectors'

import CustomEdge from '../components/reactflow/custom.edge'

const WORKFLOW_TEMPLATE_ID = 'f3fea53e-b497-4b5c-b146-894c8eae51b1'

const edgeTypes = {
  custom: CustomEdge,
}

const WorkflowEditor = () => {

  const [showNodeEditor, setShowNodeEditor] = useState(false)
  const [popOverLocation, setPopOverLocation] = useState({ top: 600, left: 600 })
  const [newStateForm, setNewStateForm] = useState(false)
  const [newStates, setNewStates] = useState({ byId: {} })
  const [newState, setNewState] = useState("")
  const [terminalState, setTerminalState] = useState("false")
  const elements = useSelector(state => workflowSelectors.getReactFlowElements(state, WORKFLOW_TEMPLATE_ID))

  console.log("elements", elements)
  console.log("popOverLocation", popOverLocation)

  const onPaneClick = (event) => {
    console.log('event', event)
    setShowNodeEditor(false)
  }

  const onContextMenu = (event) => {
    event.preventDefault()
    const { pageX, pageY } = event
    setPopOverLocation({
      ...popOverLocation,
      top: pageY,
      left: pageX
    })
    setShowNodeEditor(true)
    console.log('event', event)
  }

  const handleMenuClick = () => {
    setShowNodeEditor(false)
    setNewStateForm(true)
  }

  const onConnect = (params) => {
    console.log('params', params)
  }

  const onElementClick = (element) => {
    console.log('element', element)
  }

  return (
    <div id="editor" style={{ width: '100%', height: '90vh' }}>
      <Popover
        anchorReference="anchorPosition"
        anchorPosition={{
          top: popOverLocation.top,
          left: popOverLocation.left
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        open={showNodeEditor}
        onClose={() => {
          setShowNodeEditor(false)
        }}
      >
        <MenuItem onClick={handleMenuClick}>NEW STATE</MenuItem>
      </Popover>
      <Popover
        anchorReference="anchorPosition"
        anchorPosition={{
          top: popOverLocation.top,
          left: popOverLocation.left
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        open={newStateForm}
        onClose={() => {
          setNewStateForm(false)
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', padding: 10 }}>
          <TextField style={{ margin: 5 }} required id="standard-required" label="State" defaultValue="" />
          <TextField style={{ margin: 5 }} required id="standard-required" label="Is terminal state" defaultValue="false" />
          <Button style={{ marginTop: 5 }} variant="contained" color="primary">Create</Button>
        </div>
      </Popover>
      <ReactFlow
        style={{
          flex: 1
        }}
        snapToGrid
        elements={elements}
        onPaneClick={onPaneClick}
        onContextMenu={onContextMenu}
        onConnect={onConnect}
        onElementClick={onElementClick}
        edgeTypes={edgeTypes}
      >
        <MiniMap />
        <Controls />
        <Background color="#aaa" gap={10} />
     </ReactFlow> 
    </div>
  )
}

export default WorkflowEditor