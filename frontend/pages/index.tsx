import { Text, IconButton, Flex } from '@chakra-ui/react'
import { Grid, GridItem } from '@chakra-ui/react'
import { useSelector, useDispatch } from "react-redux"
import { useEffect, useRef, useState } from 'react'
import debounce from 'lodash.debounce';

import styles from '../styles/statement/Statement-tile.module.scss'

import type { StatementType } from '../types/model/Statement'
import { loadNewStatements, getAllStatements, getLastId, getCurrentStatement, setCurrentStatement, saveStatement, createStatement, deleteCurrentStatement } from '../store/statementSlice'
import Statement from '../components/statement/Statement'
import StatementForm from '../components/statement/forms/StatementForm'
import { FaLocationArrow, FaPlus, FaQuestion, FaRegSave, FaShareAlt, FaTrash } from 'react-icons/fa'
import { timeToString } from '../lib/formating'
import HelpWindow from '../components/HelpWindow';
import GraphEditor from '../components/GraphEditor';


export default function Home() {
  const dispatch = useDispatch()
  const list = useSelector(getAllStatements)
  const selectedStatement = useSelector(getCurrentStatement)
  const lastId = useSelector(getLastId)
  const [doSubmitStatementForm, setDoSubmitStatementForm] = useState(false)
  const [previewStatement, setPreviewStatement] = useState(null as StatementType)
  const [graphConf, setGraphConf] = useState({width:1, height: 1})
  const [openHelpWindow, setOpenHelpWindow] = useState(false)
  
  let selectNode = (node: StatementType) => {
    dispatch(setCurrentStatement(node))
  }
  let removeNode = () => {
    dispatch(deleteCurrentStatement() as any)
    if(previewStatement && previewStatement.id == selectedStatement.id) {
      setPreviewStatement(null)
    }
  }

  useEffect(() => {
    setGraphConf({
      width: window.innerWidth * 8 / 12,
      height: window.innerHeight - 400
    })

    dispatch(loadNewStatements(lastId) as any)
  }, [])

  const onStatementFormSubmit = (st: StatementType) => {
    const stWithType = {...st, type: 'statement'}
    setDoSubmitStatementForm(false)
    if(st.id === undefined){
      dispatch(createStatement(stWithType) as any)
    } else {
      dispatch(saveStatement(stWithType) as any)
    }
  }

  return (<>
    <HelpWindow toOpen={openHelpWindow} onClose={() => setOpenHelpWindow(false)}/>
    <Grid templateColumns='repeat(12, 1fr)' gap={2}>
      <GridItem colSpan={8}>
        <GraphEditor
          width={graphConf.width}
          height={graphConf.height}
          selectedNode={selectedStatement}
          previewedNode={previewStatement}
          onPreviewNode={(node) => {
            setPreviewStatement(node)
          }}
          onSelectNode={selectNode}
        />
      </GridItem>
      <GridItem colSpan={4}>
        <Flex flexDirection={'row'} justify={'space-between'}>
          <Flex>
            <IconButton 
                icon={<FaPlus/>}
                aria-label="Create Node"  
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
                    aria-label="Save Node"  
                    variant-color="green" 
                    rounded="0" 
                    roundedBottomRight='md'
                    onClick={() => setDoSubmitStatementForm(true)}
                  />
                <IconButton 
                    icon={<FaTrash/>}
                    aria-label="Delete Node"  
                    variant-color="green" 
                    rounded="0" 
                    roundedBottomRight='md'
                    onClick={() => removeNode()}
                  />
              </>)
              : ('')
            }
          </Flex>

          <Flex>
            <IconButton 
              icon={<FaQuestion/>}
              aria-label="Main page"  
              variant-color="green" 
              rounded="0" 
              roundedBottomRight='md'
              alignSelf={'flex-start'}
              onClick={() => setOpenHelpWindow(true)}
            />
          </Flex>
        </Flex>

        {selectedStatement 
          ? (<>
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
                previewStatement && previewStatement.id == item.id ? styles['previewed'] : undefined, 
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
          !previewStatement 
          ? ('')
          : (<Statement statement={previewStatement} />) 
        }
      </GridItem>
    </Grid>
  </>)
}

