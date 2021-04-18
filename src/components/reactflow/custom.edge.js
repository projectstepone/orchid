import React, { useState, useEffect } from 'react'
import { getBezierPath, getMarkerEnd } from 'react-flow-renderer'
import { Popover, TextField, Button, FormControlLabel, Checkbox } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { produce } from 'immer'

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  arrowHeadType,
  markerEndId,
}) {
  const styles = useStyles()
  const [editingEdge, setEditingEdge] = useState(false)
  const [edgeEditor, setEdgeEditor] = useState(false)
  const [transition, setTransition] = useState({})
  const [updatingEdge, setUpdatingEdge] = useState(false)
  const [popOverLocation, setPopOverLocation] = useState({ top: 600, left: 600 })
  const edgePath = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });
  const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);
  const onPathClicked = (event) => {
    const { pageX, pageY } = event
    event.preventDefault()
    setPopOverLocation({
      ...popOverLocation,
      top: pageY,
      left: pageX
    })
    const transitionId = event.target.id
    setEdgeEditor(true)
  }

  useEffect(() => {
    if (updatingEdge) {
      if (!data.updating) {
        setUpdatingEdge(false)
        setEditingEdge(false)
      }
    }
  }, [data.updating])

  useEffect(() => {
    setTransition(JSON.parse(JSON.stringify(data.transition)))
  }, [data.transition.id])

  const onCancelEdit = () => {
    // reset transition from props to state transition
    if (editingEdge) {
      setTransition(JSON.parse(JSON.stringify(data.transition)))
      setEditingEdge(false)
    }
  }

  const onRuleChange = (event) => {
    setTransition(produce(transition, draftTransition => {
      draftTransition.rule = event.target.value
    }))
  }

  const onFromStateChange = (event) => {
    setTransition(produce(transition, draftTransition => {
      draftTransition.fromState = event.target.value
    }))
  }

  const onToStateChange = (event) => {
    setTransition(produce(transition, draftTransition => {
      draftTransition.toState.name = event.target.value
    }))
  }

  const onTransitionTypeChange = (event) => {
    setTransition(produce(transition, draftTransition => {
      draftTransition.type = event.target.value
    }))
  }

  const onEdgeActiveChange = () => {
    setTransition(produce(transition, draftTransition => {
      draftTransition.active = !transition.active
    }))
  }

  const onToStateTerminalStateChange = () => {
    setTransition(produce(transition, draftTransition => {
      draftTransition.toState.terminal = !transition.toState.terminal
    }))
  }

  const onActionChange = (event) => {
    setTransition(produce(transition, draftTransition => {
      draftTransition.action = event.target.value
    }))
  }

  const onUpdateOrSave = () => {
    
    if (editingEdge) {
      // save clicked
      data.onTransitionUpdate(transition)
      setUpdatingEdge(true)
    } else {
      // edit clicked
      setEdgeEditor(true)
      setEditingEdge(true)
    }
  }

  if (Object.keys(transition) == 0) {
    return null
  }

  return (
    <>
      <path id={'path_'+ id} style={style} className="react-flow__edge-path" d={edgePath} markerEnd={markerEnd} />
      <text
        style={{
          "cursor": "pointer"
        }}
        onClick={onPathClicked}>
        <textPath id={id} href={`#path_${id}`} style={{ fontSize: '12px' }} startOffset="50%" textAnchor="middle">
          { transition.id }
        </textPath>
      </text>
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
        open={edgeEditor}
        onClose={() => {
          setEdgeEditor(false)
        }}
      >
        <div style={{"display": "flex", flexDirection: 'column', margin: 20, width: 300 }}>
          <TextField
            className={styles.textField}
            label={"id"}
            disabled // we cant edit id of a transition
            value={transition.id}
          />
          <TextField
            className={styles.textField}
            label={"type"}
            disabled={!editingEdge || data.updating }
            value={transition.type}
            onChange={onTransitionTypeChange}
          />
          <TextField
            className={styles.textField}
            label={"fromState"}
            disabled={!editingEdge || data.updating }
            value={transition.fromState}
            onChange={onFromStateChange}
          />
          <FormControlLabel
            className={styles.textField}
            control={
              <Checkbox
                checked={transition.active}
                name="active_checkbox"
                color="primary"
                disabled={!editingEdge || data.updating}
                onChange={onEdgeActiveChange}
              />
            }
            label="is transition active ?"
          />
          <TextField
            className={styles.textField}
            label={"toState"}
            disabled={!editingEdge || data.updating}
            value={transition.toState.name}
            onChange={onToStateChange}
          />
          <FormControlLabel
            className={styles.textField}
            control={
              <Checkbox
                checked={transition.toState.terminal}
                name="terminal_state_checkbox"
                color="primary"
                disabled={!editingEdge || data.updating}
                onChange={onToStateTerminalStateChange}
              />
            }
            label="is toState terminal ?"
          />
          <TextField
            className={styles.textField}
            label={"action"}
            disabled={(transition.type === "DEFAULT" ? true : !editingEdge) || data.updating}
            value={transition.type === "DEFAULT" ? "NA" : transition.action}
            onChange={onActionChange}
          />
          <TextField
            className={styles.textField}
            label={"rule"}
            multiline={true}
            disabled={(transition.type === "DEFAULT" ? true : !editingEdge) || data.updating}
            value={transition.type === "DEFAULT" ? "NA" : transition.rule}
            onChange={onRuleChange}
          />
          <Button variant="contained" disabled={data.updating} color="primary" className={styles.textField} onClick={onUpdateOrSave}>
            { editingEdge ? "SAVE" : "EDIT" }
          </Button>
          { 
            editingEdge && <Button disabled={data.updating} variant="contained" color="primary" className={styles.textField} onClick={onCancelEdit}>
             { "CANCEL" }
            </Button>
          }
        </div>
      </Popover>
    </>
  )
}

const useStyles = makeStyles((theme) => ({
  textField: {
    "marginTop": theme.spacing(1)
  },
}));