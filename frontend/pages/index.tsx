import { Text, IconButton } from '@chakra-ui/react'
import { Grid, GridItem } from '@chakra-ui/react'
import { useSelector, useDispatch } from "react-redux"
import { useEffect, useRef, useState } from 'react'
import debounce from 'lodash.debounce';

import styles from '../styles/statement/Statement-tile.module.scss'

import type { StatementType } from '../types/model/Statement'
import { loadNewStatements, getAllStatements, getLastId, getCurrentStatement, setCurrentStatement, saveStatement, createStatement } from '../store/statementSlice'
import Statement from '../components/statement/Statement'
import StatementForm from '../components/statement/forms/StatementForm'
import { FaPlus, FaRegSave } from 'react-icons/fa'
import { timeToString } from '../lib/formating'
import StatementGraph from '../components/statement/StatementGraph'


export default function Home() {
  const dispatch = useDispatch()
  const list = useSelector(getAllStatements)
  const selectedStatement = useSelector(getCurrentStatement)
  const lastId = useSelector(getLastId)
  const [doSubmitStatementForm, setDoSubmitStatementForm] = useState(false)
  const [previewStatement, setPreviewStatement] = useState({} as StatementType)
  const [graphConf, setGraphConf] = useState({width:0, height: 0})
  
  let selectNode = (node: StatementType) => {
    dispatch(setCurrentStatement(node))
  }

  useEffect(() => {
    setGraphConf({
      width: window.innerWidth / 12 * 7.95,
      height: window.innerHeight - 400
    })

    dispatch(loadNewStatements(lastId) as any)
  }, [])

  const onStatementFormSubmit = (st: StatementType) => {
    setDoSubmitStatementForm(false)
    if(st.id === undefined){
      dispatch(createStatement(st) as any)
    } else {
      dispatch(saveStatement(st) as any)
    }
  }

  return (<Grid templateColumns='repeat(12, 1fr)' gap={2}>
    <GridItem colSpan={8}>
      <StatementGraph 
        statements={list} 
        width={graphConf.width} 
        height={graphConf.height} 
        selectedNode={selectedStatement} 
        onClick={(e, node) => setPreviewStatement(node)}
        onDblClick={(e, node) => {
          selectNode(node)
        }}
      />
    </GridItem>
    <GridItem colSpan={4}>
      <IconButton 
          icon={<FaPlus/>}
          aria-label="Main page"  
          variant-color="green" 
          rounded="0" 
          roundedBottomRight='md'
          onClick={() => selectNode({
            name: '',
            veracity: 0,
            statement: '',
            use_statements: []
          })}
      />
      {selectedStatement 
        ? (<>
            <IconButton 
              icon={<FaRegSave/>}
              aria-label="Main page"  
              variant-color="green" 
              rounded="0" 
              roundedBottomRight='md'
              onClick={() => setDoSubmitStatementForm(true)}
            />
            <Text ml='2' color="grey">{ timeToString(selectedStatement.created_at) }</Text>
            <StatementForm 
              onSubmit={onStatementFormSubmit} 
              doSubmit={doSubmitStatementForm} 
              statement={selectedStatement}
            />
          </>)
        : (<p>Select node with double click or create new one with plus button.</p>)
      }
    </GridItem>
    <GridItem colSpan={8}>
      <Grid templateColumns='repeat(12, 1fr)' gap={2}>
        {list.map((item: StatementType) => (
          <GridItem 
            onClick={
              debounce(e => {
                if(e.detail >= 2) {
                  selectNode(item)
                } else {
                  setPreviewStatement(item);
                }
              }, 150, true)
            }
            colSpan={4} 
            key={item.id} 
            p={2} 
            className={[
              styles['statement-tile'], 
              previewStatement.id == item.id ? styles['previewed'] : undefined, 
              selectedStatement && selectedStatement.id == item.id ? styles['selected'] : undefined
            ].filter(el => el).join(' ')}
          >
            <p>{item.name}</p>
          </GridItem>))
        }
      </Grid>
    </GridItem>
    <GridItem colSpan={4}>
      {
        previewStatement.id === undefined 
        ? (<p>Select</p>)
        : (<Statement statement={previewStatement} />) 
      }
    </GridItem>
  </Grid>)
}

