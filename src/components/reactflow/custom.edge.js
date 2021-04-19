import React, { useState, useEffect } from 'react'
import { getBezierPath, getMarkerEnd } from 'react-flow-renderer'
import { Popover, TextField, Button, FormControlLabel, Checkbox } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { produce } from 'immer'

import TransitionEditor from '../transition.editor'

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
  const [openEditor, setOpenEditor] = useState(false)
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
    setOpenEditor(true)
  }

  const onTransitionEditorClosed = () => {
    setOpenEditor(false)
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
          { data.transition.id }
        </textPath>
      </text>
      <TransitionEditor 
        location={popOverLocation}
        open={openEditor}
        onTransitionEditorClosed={onTransitionEditorClosed}
        onTransitionUpdate={data.onTransitionUpdate}
        transition={data.transition}
        updateProgress={data.updateProgress}
        states={data.states}
        actions={data.actions}
      />
    </>
  )
}

const useStyles = makeStyles((theme) => ({
  textField: {
    "marginTop": theme.spacing(1)
  },
}));