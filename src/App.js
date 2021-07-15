import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  useLocation
} from 'react-router-dom'

import { AppBar, Toolbar, Typography } from '@material-ui/core'

import * as workflowActions from './redux/workflow/workflow.actions'
import * as breadcrumbSelectors from './redux/breadcrumb/breadcrumb.selectors'
import * as workflowSelectors from './redux/workflow/workflow.selectors'

import WorkflowEditor from './containers/workflow.editor'
import WorkflowTemplates from './containers/workflow.templates'
import WorkflowActions from './containers/workflow.actions'
import Home from './containers/home'

import OSnackbar from './components/notification/OSnackbar'
import SnackbarProvider from './components/notification/SnackbarProvider'

import { Breadcrumbs, Container } from '@material-ui/core'
// import Link from '@material-ui/core/Link'

import PrivateRoute from './route/private.route'

const tempId = "f3fea53e-b497-4b5c-b146-894c8eae51b1"

const pathsRegex = [
  {
    pattern: "\/workflowTemplates",
    group: false,
    title: '/Workflow Templates'
  },
  {
    pattern: "\/workflowTemplates\/(.*)",
    group: true,
    isTemplate: true
  },
  {
    pattern: "\/workflowActions",
    group: false,
    title: '/Workflow Actions'
  },
  {
    pattern: "\/workflowActions\/(.*)",
    group: true,
    isAction: true
  }
]

function App() {
  
  const dispatch = useDispatch()
  const location = useLocation()
  const [breadcrumbs, setBreadcrumbs] = useState([])
  const workflowTemplates = useSelector(state => state.workflow.workflowTemplatesById)
  const wfCounts = Object.keys(workflowTemplates).length
  useEffect(() => {
    dispatch(workflowActions.fetchWorkflowTemplates())
    // dispatch(workflowActions.fetchWorkflowActions())
  }, [dispatch])

  useEffect(() => {
    console.log('location', location)
    const bc = pathsRegex.filter(pathRegex => {
      return new RegExp(pathRegex.pattern).test(location.pathname)
    }).map(pathRegex => {
      const matches = new RegExp(pathRegex.pattern).exec(location.pathname)
      console.log('matches', matches)
      if (matches.length == 1) {
        return [{
          title: pathRegex.group ? matches[0] : pathRegex.title,
          link: matches[0],
        }]
      } else {
        let b = []
        b.push({
          title: resolveTitle(pathRegex, matches[matches.length-1]),
          link: matches[matches.length-1],
          id: matches[matches.length-1],
          isTemplate: pathRegex.isTemplate,
          isAction: pathRegex.isAction
        })
        return b
      }
    }).flat()
    setBreadcrumbs(bc)
  }, [location, wfCounts])

  const resolveTitle = (pathRegex, id) => {
    if (pathRegex.isTemplate) {
      return workflowTemplates[id] ? workflowTemplates[id].name : "Loading..."
    }
    return id
  }

  return (
    <div className="App">
      <AppBar position='sticky'>
        <Toolbar>
          <Typography variant="h6">
            <Link color="inherit" to="/" style={{ color: '#fff', textDecoration: 'none'}}>Orchid</Link>
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
          <SnackbarProvider>
            <div style={{ marginTop: '10px' }}>
              <Breadcrumbs aria-label="breadcrumb">
              {
                breadcrumbs.map((breadcrumb, i) => {
                  return <Link color="inherit" to={breadcrumb.link} key={i + '_bc'} style={{ textDecoration: 'none' }}>
                    {breadcrumb.title}
                  </Link>
                })
              }
              </Breadcrumbs>
            </div>
            <Switch style={{ flex: 1 }}>
              <PrivateRoute exact path="/">
                <Home />
              </PrivateRoute>
              <PrivateRoute exact path="/workflowTemplates">
                <WorkflowTemplates />
              </PrivateRoute>
              <PrivateRoute exact path="/workflowActions">
                <WorkflowActions />
              </PrivateRoute>
              <PrivateRoute path="/workflowTemplates/:workflowTemplateId">
                <WorkflowEditor />
              </PrivateRoute>
            </Switch>
            <OSnackbar />
        </SnackbarProvider>
      </Container>
    </div>
  );
}

export default App;
