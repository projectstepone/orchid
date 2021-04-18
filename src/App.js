import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import * as workflowActions from './redux/workflow/workflow.actions'

import WorkflowEditor from './containers/workflow.editor'

import OSnackbar from './components/notification/OSnackbar'
import SnackbarProvider from './components/notification/SnackbarProvider'

function App() {
  
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(workflowActions.fetchWorkflowTemplates())
    dispatch(workflowActions.fetchWorkflowActions())
    dispatch(workflowActions.fetchWrokflowTransitions(('f3fea53e-b497-4b5c-b146-894c8eae51b1')))
  }, [dispatch])

  return (
    <div className="App">
      <SnackbarProvider>
        <h1 style={{ marginLeft: 50 }}>Orchid</h1>
        <WorkflowEditor />
        <OSnackbar />
     </SnackbarProvider>
    </div>
  );
}

export default App;
