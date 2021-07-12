import React, { useState, useEffect } from 'react'
import { produce } from 'immer'
import {
  Link,
  useRouteMatch
} from 'react-router-dom'

import { 
  Container, List, ListItem, Divider, Fab, Modal,
  TextField, Button, FormControlLabel, Checkbox,
  ListItemText
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

const Home = () => {
  const styles = useStyles()
  const CustomLink = props => <Link to={props.to} {...props} />
  return(
    <Container maxWidth="lg">
      <List>
        <ListItem key="wf-templates-1" button component={ props => <CustomLink to={'/workflowTemplates'} {...props} style={{ textAlign: 'center' }} /> }>
          <ListItemText primary={'Workflow Templates'}/>
        </ListItem>
        <ListItem key="wf-actions-1" button component={ props => <CustomLink to={'/workflowActions'} {...props} style={{ textAlign: 'center' }} /> }>
          <ListItemText primary={'Workflow Actions'}/>
        </ListItem>
      </List>
    </Container>
  )
}

const useStyles = makeStyles((theme) => ({
  link: {
    textDecoration: 'none',
    color: 'black',
    flex: 1,
    height: '100%',
    paddingTop: 12,
    textAlign: 'center'
  },
  fab: {
    position: 'absolute',
    right: 30,
    bottom: 30
  },
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  textField: {
    "marginTop": theme.spacing(1),
    width: '100%'
  }
}))

export default Home