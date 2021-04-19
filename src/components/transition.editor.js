import React, { useState, useCallback, useEffect } from 'react'
import { Popover, TextField, Button, FormControlLabel, Checkbox } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { produce } from 'immer'

const TransitionEditor = (props) => {
  const { location, updateInProgress, open, updateProgress, states, actions } = props
  const styles = useStyles()
  const [editingTransition, setEditingTransition] = useState(false)
  const [transition, setTransition] = useState({})
  const [updatingTransition, setUpdatingTransition] = useState(false)

  useEffect(() => {
    setTransition(JSON.parse(JSON.stringify(props.transition)))
  }, [props.transition.id])

  useEffect(() => {
    if (updatingTransition) {
      if (updateProgress.completed) {
        setEditingTransition(false)
      }
    }
  }, [updateProgress, updatingTransition])

  const onCancelEdit = () => {
    // reset transition from props to state transition
    if (editingTransition) {
      setTransition(JSON.parse(JSON.stringify(props.transition)))
      setEditingTransition(false)
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

  const onToStateChange = (event, value) => {
    setTransition(produce(transition, draftTransition => {
      draftTransition.toState.name = value !== null ? value.name : ''
      draftTransition.toState.terminal = value !== null ? value.terminal : false
    }))
  }

  const onTransitionTypeChange = (event, value) => {
    setTransition(produce(transition, draftTransition => {
      draftTransition.type = value !== null ? value.title : ''
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

  const onActionChange = (event, value) => {
    setTransition(produce(transition, draftTransition => {
      draftTransition.action = value !== null ? value.id : ''
    }))
  }


  const onStartEditingOrSave = () => {
    if (editingTransition) {
      // save clicked
      props.onTransitionUpdate(transition)
      setUpdatingTransition(true)
    } else {
      // edit clicked
      setEditingTransition(true)
    }
  }

  if (Object.keys(transition) == 0) {
    return null
  }

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
        open={open}
        onClose={props.onTransitionEditorClosed}
      >
        <div style={{"display": "flex", flexDirection: 'column', margin: 20, width: 300 }}>
          <TextField
            className={styles.textField}
            label={"id"}
            disabled // we cant edit id of a transition
            value={transition.id}
          />
          <Autocomplete
            id="transition-type-auto"
            className={styles.textField}
            options={[{title: "EVALUATED"}, {"title": "DEFAULT"}]}
            getOptionLabel={(option) => option.title}
            renderInput={(params) => <TextField {...params} label="type"/> }
            disabled={!editingTransition || updateInProgress}
            value={{
              "title": transition.type,
              "value": transition.type
            }}
            getOptionSelected={(option, value) => {
              return option.title === value.title
            }}
            onChange={onTransitionTypeChange}
          />
          <TextField
            className={styles.textField}
            label={"fromState"}
            disabled={true}
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
                disabled={!editingTransition || updateInProgress }
                onChange={onEdgeActiveChange}
              />
            }
            label="is transition active ?"
          />
          <Autocomplete
            id="transition-to-state-auto"
            className={styles.textField}
            options={states.filter(state => state.name !== transition.fromState)}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => <TextField {...params} label="toState"/> }
            disabled={!editingTransition || updateInProgress}
            value={{
              "name": transition.toState.name
            }}
            getOptionSelected={(option, value) => {
              return option.name === value.name
            }}
            onChange={onToStateChange}
          />
          <FormControlLabel
            className={styles.textField}
            control={
              <Checkbox
                checked={transition.toState.terminal}
                name="terminal_state_checkbox"
                color="primary"
                disabled={!editingTransition || updateInProgress }
                onChange={onToStateTerminalStateChange}
              />
            }
            label="is toState terminal ?"
          />
          <Autocomplete
            id="transition-to-state-auto"
            className={styles.textField}
            options={actions.filter(action => action.id !== transition.action)}
            getOptionLabel={(option) => option.id}
            renderInput={(params) => <TextField {...params} label="action"/> }
            disabled={!editingTransition || updateInProgress}
            value={{
              "id": transition.action
            }}
            getOptionSelected={(option, value) => {
              return option.id === value.id
            }}
            onChange={onActionChange}
          />
          <TextField
            className={styles.textField}
            label={"rule"}
            multiline={true}
            disabled={(transition.type === "DEFAULT" ? true : !editingTransition) || updateInProgress }
            value={transition.type === "DEFAULT" ? "" : transition.rule}
            onChange={onRuleChange}
          />
          <Button variant="contained" disabled={updateInProgress} color="primary" className={styles.textField} onClick={onStartEditingOrSave}>
            { editingTransition ? "SAVE" : "EDIT" }
          </Button>
          { 
            editingTransition && <Button disabled={updateInProgress} variant="contained" color="primary" className={styles.textField} onClick={onCancelEdit}>
             { "CANCEL" }
            </Button>
          }
        </div>
      </Popover>
  )
}

const useStyles = makeStyles((theme) => ({
  textField: {
    "marginTop": theme.spacing(1)
  },
}));

export default TransitionEditor