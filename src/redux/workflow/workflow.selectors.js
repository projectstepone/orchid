export const getRootNode = (state, workflowTemplateId) => {
  const workflowTemplate = state.workflow.workflowTemplatesById[workflowTemplateId]
  if (workflowTemplate) {
    return {
      name: workflowTemplate.startState.name,
      state: workflowTemplate.startState.name,
      rootNode: true
    }
  }
  return {
    name: 'NA',
    state: 'NA',
    rootNode: false
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
      rootNode: false
    }
  })
}

export const getReactFlowElements = (state, workflowTemplateId) => {
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
    console.log('qSize', qSize)
    while (qSize != 0) {
      const visitingNode = queue.shift()
      console.log('visitingNode', visitingNode)
      if (!(visitingNode.name in visitedNode)) {
        elements.push({
          id: visitingNode.name,
          sourcePosition: 'right',
          data: { label: visitingNode.name },
          position: { x: dx, y: dy }
        })
        const childNodes = getChildNodes(state, workflowTemplateId, visitingNode.state)
        console.log('childNodes', childNodes)
        queue = queue.concat(childNodes)
        const edges = getEdges(state, workflowTemplateId, visitingNode.state)
        console.log('edges', edges)
        console.log('queue', queue)
        edges.forEach(edge => {
          elements.push({
            id: edge.id,
            source: visitingNode.name,
            type: 'smoothstep',
            target: edge.toState.name,
            animated: true,
            type: 'custom',
            data: {
              transition: edge
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
      } else {
        console.log('visitedNode', visitedNode)
      }
      qSize--
    }
    alternate = !alternate
    dx += 600
  }
  return elements
}