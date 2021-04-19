import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link
} from 'react-router-dom'

import * as workflowActions from './redux/workflow/workflow.actions'
import * as breadcrumbSelectors from './redux/breadcrumb/breadcrumb.selectors'

import WorkflowEditor from './containers/workflow.editor'
import WorkflowTemplates from './containers/workflow.templates'

import OSnackbar from './components/notification/OSnackbar'
import SnackbarProvider from './components/notification/SnackbarProvider'

import { Breadcrumbs, Container } from '@material-ui/core'
// import Link from '@material-ui/core/Link'

const tempId = "f3fea53e-b497-4b5c-b146-894c8eae51b1"

function App() {
  
  const dispatch = useDispatch()
  const breadcrumbs = useSelector(state => breadcrumbSelectors.getBreadcrumbs(state))
  
  useEffect(() => {
    dispatch(workflowActions.fetchWorkflowTemplates())
    dispatch(workflowActions.fetchWorkflowActions())
  }, [dispatch])

  return (
    <div className="App">
      <Router>
        <SnackbarProvider>
          <Link to="/workflowTemplates" style={{ textDecoration: 'none' }}>
            <h1 style={{ marginLeft: 50 }}>Orchid</h1>
          </Link>
          <div>
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
          <Switch>
            <Route exact path="/workflowTemplates">
              <WorkflowTemplates />
            </Route>
            <Route path="/workflowTemplates/:workflowTemplateId">
              <WorkflowEditor />
            </Route>
          </Switch>
          <OSnackbar />
      </SnackbarProvider>
      </Router>
    </div>
  );
}

export default App;
