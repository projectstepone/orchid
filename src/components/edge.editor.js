import React, { useState, useCallback, useEffect } from 'react'
import { Popover, TextField, Button, FormControlLabel, Checkbox } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { produce } from 'immer'
import Popover from '@material-ui/core/Popover'

const EdgeEditor = (props) => {
  const { location } = props
  return (
    <Popover
        anchorReference="anchorPosition"
        anchorPosition={{
          top: location.top,
          left: location.left
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
  )
}

export default EdgeEditor