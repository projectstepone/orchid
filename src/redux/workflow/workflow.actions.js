import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import * as workflowTypes from './workflow.types'

import * as workflowSelectors from '../../redux/workflow/workflow.selectors'

const BASE_URL = process.env.REACT_APP_ORCHID_HOST + "/api"

export const fetchWorkflowTemplates = () => {
  return (dispatch) => {
    dispatch({
      "type": workflowTypes.FETCH_WORKFLOW_TEMPLATES_IN_PROGRESS
    })
    axios.get(`${BASE_URL}/v1/templates/workflow`)
    .then(response => {
      const workflowTemplates = response.data
      dispatch({
        "type": workflowTypes.FETCH_WORKFLOW_TEMPLATES_COMPLETED,
        "payload": { workflowTemplates }
      })
      workflowTemplates.forEach((workflowTemplate) => {
        dispatch(fetchWrokflowTransitions(workflowTemplate.id))
      })
    })
    .catch(err => {
      console.log("err in fetchWorkflowTemplates", err)
      dispatch({
        "type": workflowTypes.FETCH_WORKFLOW_TEMPLATES_FAILED,
        payload: {
          err
        }
      })
    })
  }
}

export const fetchWrokflowTransitions = (workflowTemplateId) => {
  return (dispatch) => {
    dispatch({
      "type": workflowTypes.FETCH_WORKFLOW_TEMPLATES_IN_PROGRESS
    })
    axios.get(`${BASE_URL}/v1/templates/workflow/${workflowTemplateId}/transitions?onlyActive=false`)
    .then(response => {
      const transitions = response.data
      dispatch({
        "type": workflowTypes.FETCH_WORKFLOW_TRANSITIONS_COMPLETED,
        "payload": {
          workflowTemplateId, 
          transitions
        }
      })
    })
    .catch(err => {
      console.log("err in fetchWorkflowTemplates", err)
      dispatch({
        "type": workflowTypes.FETCH_WORKFLOW_TEMPLATES_FAILED,
        payload: {
          err
        }
      })
    })
  }
}

export const fetchWorkflowActions = () => {
  return (dispatch) => {
    dispatch({
      "type": workflowTypes.FETCH_WORKFLOW_ACTIONS_IN_PROGRESS
    })
    axios.get(`${BASE_URL}/v1/templates/action/get/all`)
    .then(response => {
      const actions = response.data
      dispatch({
        "type": workflowTypes.FETCH_WORKFLOW_ACTIONS_COMPLETED,
        "payload": { actions }
      })
    })
    .catch(err => {
      console.log("err in fetchWorkflowActions", err)
      dispatch({
        "type": workflowTypes.FETCH_WORKFLOW_ACTIONS_FAILED,
        payload: {
          err
        }
      })
    })
  }
}

export const updateTransition = (workflowTemplateId, transition) => {
  return (dispatch) => {
    dispatch({
      "type": workflowTypes.UPDATE_TRANSITION_IN_PROGRESS,
      "payload": {
        workflowTemplateId,
        "transitionId": transition.id
      }
    })
    axios.put(`${BASE_URL}/v1/templates/workflow/${workflowTemplateId}/transitions`, transition)
    .then(response => {
      dispatch({
        "type": workflowTypes.UPDATE_TRANSITION_COMPLETED,
        "payload": { 
          workflowTemplateId,
          "transitionId": transition.id
        }
      })
      dispatch({
        "type": workflowTypes.FETCH_WORKFLOW_TRANSITIONS_COMPLETED,
        "payload": {
          workflowTemplateId, 
          transitions: [transition]
        }
      })
    })
    .catch(err => {
      console.log("err in updateTransition", err)
      dispatch({
        "type": workflowTypes.UPDATE_TRANSITION_FAILED,
        "payload": { 
          workflowTemplateId,
          "transitionId": transition.id,
          err
        }
      })
    })
  }
}

export const createTransition = (workflowTemplateId, transition) => {
  return (dispatch) => {
    dispatch({
      "type": workflowTypes.CREATE_TRANSITIONS_IN_PROGRESS,
      "payload": {
        workflowTemplateId,
        "transitionId": transition.id
      }
    })
    axios.post(`${BASE_URL}/v1/templates/workflow/${workflowTemplateId}/transitions`, [transition])
    .then(response => {
      dispatch({
        "type": workflowTypes.CREATE_TRANSITIONS_COMPLETED,
        "payload": { 
          workflowTemplateId,
          "transitionId": transition.id
        }
      })
      dispatch({
        "type": workflowTypes.FETCH_WORKFLOW_TRANSITIONS_COMPLETED,
        "payload": {
          workflowTemplateId,
          transitions: [transition]
        }
      })
    })
    .catch(err => {
      console.log("err in createTransition", err)
      dispatch({
        "type": workflowTypes.CREATE_TRANSITIONS_FAILED,
        "payload": { 
          workflowTemplateId,
          "transitionId": transition.id,
          err
        }
      })
    })
  }
}

export const createTransitions = (workflowTemplateId, transitions, templateName) => {
  return (dispatch) => {
    dispatch({
      "type": workflowTypes.CREATE_TRANSITIONS_IN_PROGRESS,
      "payload": {
        workflowTemplateId,
        templateName
      }
    })
    axios.post(`${BASE_URL}/v1/templates/workflow/${workflowTemplateId}/transitions`, transitions)
    .then(response => {
      dispatch({
        "type": workflowTypes.CREATE_TRANSITIONS_COMPLETED,
        "payload": { 
          workflowTemplateId,
          templateName
        }
      })
      dispatch({
        "type": workflowTypes.FETCH_WORKFLOW_TRANSITIONS_COMPLETED,
        "payload": {
          workflowTemplateId,
          templateName,
          transitions
        }
      })
    })
    .catch(err => {
      console.log("err in createTransitions", err)
      dispatch({
        "type": workflowTypes.CREATE_TRANSITIONS_FAILED,
        "payload": { 
          workflowTemplateId,
          templateName,
          err
        }
      })
    })
  }
}

export const createWorkflowTemplate = (payload) => {
  return (dispatch, getState) => {
    let workflowTemplate = { ...payload }
    const copy = "templateName" in workflowTemplate && workflowTemplate['templateName'] !== undefined
    let templateName = ""
    let transitions = []
    let copyWorkflowTemplate = null
    if (copy) {
      templateName = workflowTemplate["templateName"]
      delete workflowTemplate["templateName"]
      copyWorkflowTemplate = workflowSelectors.workflowTemplateByTemplateName(getState(), templateName)
      transitions = workflowSelectors.transitionsByWorkflowTemplateId(getState(), copyWorkflowTemplate.id).map(template => ({
        ...template,
        id: uuidv4()
      }))
    }
    dispatch({
      "type": workflowTypes.CREATE_WORKFLOW_TEMPLATE_IN_PROGRESS,
      "payload": {
        workflowTemplateName: workflowTemplate.name
      }
    })
    axios.post(`${BASE_URL}/v1/templates/workflow`, workflowTemplate)
    .then(response => {
      dispatch({
        "type": workflowTypes.FETCH_WORKFLOW_TEMPLATES_COMPLETED,
        "payload": {
          workflowTemplates: [response.data]
        }
      })
      dispatch({
        "type": workflowTypes.CREATE_WORKFLOW_TEMPLATE_COMPLETED,
        "payload": { 
          workflowTemplateName: workflowTemplate.name
        }
      })
      if (copy) {
        dispatch(createTransitions(response.data.id, transitions, templateName))
      }
    })
    .catch(err => {
      console.log("err in createWorkflowTemplate", err)
      dispatch({
        "type": workflowTypes.CREATE_WORKFLOW_TEMPLATE_FAILED,
        "payload": { 
          workflowTemplateName: workflowTemplate.name
        },
        err
      })
    })
  }
}

export const updateWorkflowTemplate = (workflowTemplate) => {
  return (dispatch) => {
    dispatch({
      "type": workflowTypes.UPDATE_WORKFLOW_TEMPLATE_IN_PROGRESS,
      "payload": {
        templateId: workflowTemplate.id
      }
    })
    axios.put(`${BASE_URL}/v1/templates/workflow`, workflowTemplate)
    .then(response => {
      dispatch({
        "type": workflowTypes.UPDATE_WORKFLOW_TEMPLATE_COMPLETED,
        "payload": {
          templateId: workflowTemplate.id
        }
      })
      dispatch({
        "type": workflowTypes.FETCH_WORKFLOW_TEMPLATES_COMPLETED,
        "payload": { 
          workflowTemplates: [workflowTemplate] 
        }
      })
    })
    .catch(err => {
      console.log("err in updateWorkflowTemplate", err)
      dispatch({
        "type": workflowTypes.UPDATE_WORKFLOW_TEMPLATE_FAILED,
        "payload": { 
          templateId: workflowTemplate.id
        },
        err
      })
    })
  }
}

export const createWorkflowAction = (action) => {
  return (dispatch) => {
    dispatch({
      "type": workflowTypes.CREATE_WORKFLOW_ACTION_IN_PROGRESS,
      "payload": {
        action
      }
    })
    axios.post(`${BASE_URL}/v1/templates/action`, action)
    .then(response => {
      dispatch({
        "type": workflowTypes.FETCH_WORKFLOW_ACTIONS_COMPLETED,
        "payload": {
          actions: [response.data]
        }
      })
      dispatch({
        "type": workflowTypes.CREATE_WORKFLOW_ACTION_COMPLETED,
        "payload": { 
          action
        }
      })
    })
    .catch(err => {
      console.log("err in createWorkflowAction", err)
      dispatch({
        "type": workflowTypes.CREATE_WORKFLOW_ACTION_FAILED,
        "payload": { 
          action
        },
        err
      })
    })
  }
}

export const updateWorkflowAction = (action) => {
  return (dispatch) => {
    dispatch({
      "type": workflowTypes.UPDATE_WORKFLOW_ACTION_IN_PROGRESS,
      "payload": {
        action
      }
    })
    axios.put(`${BASE_URL}/v1/templates/action`, action)
    .then(response => {
      dispatch({
        "type": workflowTypes.UPDATE_WORKFLOW_ACTION_COMPLETED,
        "payload": {
          action
        }
      })
      dispatch({
        "type": workflowTypes.FETCH_WORKFLOW_ACTIONS_COMPLETED,
        "payload": { 
          actions: [action]
        }
      })
    })
    .catch(err => {
      console.log("err in updateWorkflowAction", err)
      dispatch({
        "type": workflowTypes.UPDATE_WORKFLOW_ACTION_FAILED,
        "payload": { 
          action
        },
        err
      })
    })
  }
}