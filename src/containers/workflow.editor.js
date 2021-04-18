import React, { useState, useCallback, useEffect } from 'react'
import { produce } from 'immer'
import ReactFlow, { removeElements, addEdge, Background, MiniMap, Controls } from 'react-flow-renderer'
import { useSelector, useDispatch } from 'react-redux';
import Popover from '@material-ui/core/Popover'
import { MenuItem, TextField, Button } from '@material-ui/core'

import * as workflowSelectors from '../redux/workflow/workflow.selectors'
import * as workflowActions from '../redux/workflow/workflow.actions'

import CustomEdge from '../components/reactflow/custom.edge'

import { SnackbarContext } from '../components/notification/SnackbarProvider'

const WORKFLOW_TEMPLATE_ID = 'f3fea53e-b497-4b5c-b146-894c8eae51b1'

const edgeTypes = {
  custom: CustomEdge,
}

const escapeDoubleQuotes = (str) => {
	return str.replace(/\\([\s\S])|(")/g,"\\$1$2"); // thanks @slevithan!
}

const WorkflowEditor = () => {

  const dispatch = useDispatch()
  const [showNodeEditor, setShowNodeEditor] = useState(false)
  const [popOverLocation, setPopOverLocation] = useState({ top: 600, left: 600 })
  const [newStateForm, setNewStateForm] = useState(false)
  const [updatingTransition, setUpdatingTransition] = useState(false)
  const [updatingTransitionId, setUpdatingTransitionId] = useState('')
  const updateTransitionProgress = useSelector(state => workflowSelectors.getTransitionUpdateProgress(state, WORKFLOW_TEMPLATE_ID, updatingTransitionId))

  const snackbarValue = React.useContext(SnackbarContext)
  const { showSuccess, showError } = snackbarValue

  console.log("popOverLocation", popOverLocation)

  const onTransitionUpdate = useCallback((transition) => {
    const updatedTransition = produce(transition, draftTransition => {
      // if (draftTransition.rule) {
      //   draftTransition.rule = escapeDoubleQuotes(draftTransition.rule)
      // }
    })
    dispatch(workflowActions.updateTransition(WORKFLOW_TEMPLATE_ID, updatedTransition))
    setUpdatingTransition(true)
    setUpdatingTransitionId(transition.id)
    setTimeout(() => {
      setUpdatingTransition(false)
      setUpdatingTransitionId('')
    }, 2000)
  }, [dispatch])

  useEffect(() => {
    if (updatingTransition) {
      if (updateTransitionProgress.failed) {
        showError("Transition update failed")
        setUpdatingTransition(false)
      }
      if (updateTransitionProgress.completed) {
        showSuccess("Transition updated")
        setUpdatingTransitionId('')
        setUpdatingTransition(false)
      }
    }
  }, [updateTransitionProgress])

  const elements = useSelector(state => workflowSelectors.getReactFlowElements(state, WORKFLOW_TEMPLATE_ID, updatingTransitionId, onTransitionUpdate))
  console.log("elements", elements)

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

  const onElementClick = (event, element) => {
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