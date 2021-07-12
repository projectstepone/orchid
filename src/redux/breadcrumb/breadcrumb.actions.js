import * as breadcrumbTypes from './breadcrumb.types'

export const pushBreadcrumb = (breadcrumb) => {
  return {
    "type": breadcrumbTypes.BREADCRUMB_PUSH,
    "payload": breadcrumb
  }
}

export const popBreadcrumb = () => {
  return {
    "type": breadcrumbTypes.BREADCRUMB_POP,
    "payload": {}
  }
}