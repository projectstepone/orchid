const DEFAULT_ACTION_PROGRESS = {
  processing: false,
  completed: false,
  failed: false,
  message: ""
}

export const getRootNode = (state, workflowTemplateId) => {
  const workflowTemplate = state.workflow.workflowTemplatesById[workflowTemplateId]
  if (workflowTemplate) {
    return {
      name: workflowTemplate.startState.name,
      state: workflowTemplate.startState.name,
      rootNode: true,
      terminal: workflowTemplate.startState.terminal
    }
  }
  return {
    name: 'NA',
    state: 'NA',
    rootNode: false,
    terminal: false
  }
}

export const getEdges = (state, workflowTemplateId, startState) => {
  if (!state.workflow.transitionsByWorkflowTemplateId[workflowTemplateId]) {
    return []
  }
  const transitionIds = Object.keys(state.workflow.transitionsByWorkflowTemplateId[workflowTemplateId])
  const transitions = transitionIds.map(transitionId => state.workflow.workflowTransitionsById[transitionId]).filter(transition => transition !== undefined)
  return transitions.filter(transition => transition.fromState === startState)
}

export const getChildNodes = (state, workflowTemplateId, startState) => {
  if (!state.workflow.transitionsByWorkflowTemplateId[workflowTemplateId]) {
    return []
  }
  const transitionIds = Object.keys(state.workflow.transitionsByWorkflowTemplateId[workflowTemplateId])
  const transitions = transitionIds.map(transitionId => state.workflow.workflowTransitionsById[transitionId]).filter(transition => transition !== undefined)
  return transitions.filter(transition => transition.fromState === startState).map(transition => {
    return {
      name: transition.toState.name,
      state: transition.toState.name,
      rootNode: false,
      terminal: transition.toState.terminal
    }
  })
}

export const getAllActions = (state) => {
  const workflowActionsById = state.workflow.workflowActionsById
  return Object.keys(workflowActionsById).map(action => ({ id: action }))
}

export const getAllStates = (state, workflowTemplateId) => {
  const rootNode = getRootNode(state, workflowTemplateId)
  if (!rootNode.rootNode) {
    return []
  }
  let queue = []
  const visitedNode = {}
  queue.push(rootNode)
  let states = []
  while (queue.length !== 0) {
    let qSize = queue.length
    while (qSize != 0) {
      const visitingNode = queue.shift()
      if (!(visitingNode.name in visitedNode)) {
        const childNodes = getChildNodes(state, workflowTemplateId, visitingNode.state)
        queue = queue.concat(childNodes)
        visitedNode[visitingNode.name] = true
        states.push({
          name: visitingNode.name,
          state: visitingNode.name,
          terminal: visitingNode.terminal
        })
      }
      qSize--
    }
  }
  return states
}

export const getReactFlowElements = (
  state, workflowTemplateId, updatingTransitionId, 
  onTransitionUpdate, memoizedStates,
  memoizedUpdateTransitionProgress, memoizedActions) => {
  
  let dx = 0
  let dy = 100
  const elements = []
  const rootNode = getRootNode(state, workflowTemplateId)
  if (!rootNode.rootNode) {
    return []
  }
  let queue = []
  const visitedNode = {}
  queue.push(rootNode)
  let alternate = true
  while (queue.length !== 0) {
    let qSize = queue.length
    dy = 100
    while (qSize != 0) {
      const visitingNode = queue.shift()
      if (!(visitingNode.name in visitedNode)) {
        elements.push({
          id: visitingNode.name,
          sourcePosition: 'right',
          data: { label: visitingNode.name },
          position: { x: dx, y: dy }
        })
        const childNodes = getChildNodes(state, workflowTemplateId, visitingNode.state)
        queue = queue.concat(childNodes)
        const edges = getEdges(state, workflowTemplateId, visitingNode.state)
        edges.forEach(edge => {
          elements.push({
            id: edge.id,
            source: visitingNode.name,
            type: 'smoothstep',
            target: edge.toState.name,
            animated: edge.active,
            type: 'custom',
            data: {
              transition: edge,
              onTransitionUpdate,
              updating: updatingTransitionId === edge.id,
              states: memoizedStates,
              updateProgress: updatingTransitionId === edge.id ?  memoizedUpdateTransitionProgress : {},
              actions: memoizedActions
            },
            arrowHeadType: 'arrow'
          })
        })
        if (alternate) {
          dy += 250
        } else {
          dy += 150
        }
        visitedNode[visitingNode.name] = true
      }
      qSize--
    }
    alternate = !alternate
    dx += 600
  }
  return elements
}

export const getTransitionUpdateProgress = (state, worflowTemplateId, transitionId) => {
  const transitionUpdateProgress = state.workflow.transitionUpdateProgress
  if (!transitionUpdateProgress[worflowTemplateId] || !transitionUpdateProgress[worflowTemplateId][transitionId]) {
    return {
      ...DEFAULT_ACTION_PROGRESS
    }
  }
  return transitionUpdateProgress[worflowTemplateId][transitionId]
}

export const getTransitionCreateProgress = (state, worflowTemplateId, transitionId) => {
  const transitionCreateProgress = state.workflow.transitionCreateProgress
  if (!transitionCreateProgress[worflowTemplateId] || !transitionCreateProgress[worflowTemplateId][transitionId]) {
    return {
      ...DEFAULT_ACTION_PROGRESS
    }
  }
  return transitionCreateProgress[worflowTemplateId][transitionId]
}

export const getWorkflowTemplates = (state) => {
  const workflowTemplatesById = state.workflow.workflowTemplatesById
  return Object.keys(workflowTemplatesById)
  .map(id => ({
    ...workflowTemplatesById[id]
  }))
}

export const getWorkflowTemplate = (state, templateId) => {
  const workflowTemplatesById = state.workflow.workflowTemplatesById
  if (!workflowTemplatesById[templateId]) {
    return {
      name: "Loading..."
    }
  }
  return {
    ...workflowTemplatesById[templateId]
  }
}

export const getWorkflowCreateProgress = (state, name) => {
  const workflowTemplateCreateProgress = state.workflow.workflowTemplateCreateProgress
  if (!workflowTemplateCreateProgress[name]) {
    return {
      ...DEFAULT_ACTION_PROGRESS
    }
  }
  return {
    ...workflowTemplateCreateProgress[name]
  }
}

export const getWorkflowUpdateProgress = (state, templateId) => {
  const workflowTemplateUpdateProgress = state.workflow.workflowTemplateUpdateProgress
  if (!workflowTemplateUpdateProgress[templateId]) {
    return DEFAULT_ACTION_PROGRESS
  }
  return workflowTemplateUpdateProgress[templateId]
}

export const getActionUpdateProgress = (state, templateId) => {
  const actionUpdateProgress = state.workflow.actionUpdateProgress
  if (!actionUpdateProgress[templateId]) {
    return DEFAULT_ACTION_PROGRESS
  }
  return actionUpdateProgress[templateId]
}

export const getActionCreateProgress = (state, templateId) => {
  const actionCreateProgress = state.workflow.actionCreateProgress
  if (!actionCreateProgress[templateId]) {
    return DEFAULT_ACTION_PROGRESS
  }
  return actionCreateProgress[templateId]
}

export const workflowTemplateByTemplateName = (state, templateName) => {
  const workflowTemplatesById = state.workflow.workflowTemplatesById
  return Object.keys(workflowTemplatesById).filter(templateId => workflowTemplatesById[templateId].name === templateName).map(templateId => workflowTemplatesById[templateId])[0]
}

export const transitionsByWorkflowTemplateId = (state, workflowTemplateId) => {
  if (!state.workflow.transitionsByWorkflowTemplateId[workflowTemplateId]) {
    return []
  }
  const transitionIds = Object.keys(state.workflow.transitionsByWorkflowTemplateId[workflowTemplateId])
  return transitionIds.map(transitionId => state.workflow.workflowTransitionsById[transitionId]).filter(transition => transition !== undefined)
}