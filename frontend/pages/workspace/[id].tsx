import { Text, IconButton, Flex, Tabs, TabList, Tab, TabPanels, TabPanel, Box, Spacer, Switch } from '@chakra-ui/react'
import { Grid, GridItem } from '@chakra-ui/react'
import { useSelector, useDispatch } from "react-redux"
import { useEffect, useRef, useState } from 'react'

import type { StatementType } from '../../types/model/Statement'
import { loadNewStatements, getAllStatements, getLastId, saveStatement, createStatement, deleteStatement, getLastCreatedStatement } from '../../store/records/statementSlice'
import Statement from '../../components/statement/Statement'
import StatementForm from '../../components/statement/forms/StatementForm'
import { FaLocationArrow, FaPlus, FaQuestion, FaRegSave, FaShareAlt, FaTrash } from 'react-icons/fa'
import { timeToString } from '../../lib/formating'
import HelpWindow from '../../components/HelpWindow';
import GraphEditor from '../../components/graph/GraphEditor';
import SubworkpaceTabs from '../../components/workspace/subworkspace/SubworkspaceTabs';
import { getPreviewedRecord, getSelectedRecord, RecordType, setPreviewedRecord, setRecords, setSelectedRecord, updateRecord } from '../../store/recordsSlice';
import { State } from 'swr/dist/types';
import { getCurrentWorkspace, loadNewWorkspaces, loadWorkspace } from '../../store/workspaceSlice'
import { useRouter } from 'next/router'


export default function WorkspacePage() {
  const dispatch = useDispatch()
  const router = useRouter()
  const statements = useSelector(getAllStatements)
  const selectedRecord = useSelector(getSelectedRecord)
  const previewedRecord = useSelector(getPreviewedRecord)
  const lastId = useSelector(getLastId)
  const lastCreatedStatement = useSelector(getLastCreatedStatement)
  const workspace = useSelector(getCurrentWorkspace)
  const [doSubmitStatementForm, setDoSubmitStatementForm] = useState(false)
  const [openHelpWindow, setOpenHelpWindow] = useState(false)
  
  let removeNode = () => {
    if(selectedRecord[0] == 'statement') {
      dispatch(deleteStatement(selectedRecord[1] as StatementType) as any)
    }

    dispatch(setSelectedRecord(null))

    if(previewedRecord && previewedRecord[0] == selectedRecord[0] && previewedRecord[1].id == selectedRecord[1].id) {
      dispatch(setPreviewedRecord(null))
    }
  }

  let selectRecord = (recordType, r: RecordType) => {
    dispatch(setSelectedRecord([recordType, r]))
  }

  useEffect(() => {
    dispatch(loadNewStatements(lastId) as any)
    
    if(!isNaN(+router.query.id)) {
      dispatch(loadWorkspace(router.query.id) as any)
    }

  }, [router.query.id])

  useEffect(() => {
    dispatch(setRecords({statement: statements}))
  }, [statements])

  useEffect(() => {
    if(lastCreatedStatement) {
      dispatch(setSelectedRecord(['statement', lastCreatedStatement]))
    }
  }, [lastCreatedStatement])

  const onStatementFormSubmit = (st: StatementType) => {
    setDoSubmitStatementForm(false)

    if(st.id === undefined){
      dispatch(createStatement(st) as any)
    } else {
      dispatch(saveStatement(st) as any)
    }
  }

  return (<>
    <HelpWindow toOpen={openHelpWindow} onClose={() => setOpenHelpWindow(false)}/>
    <Grid templateColumns='repeat(12, 1fr)' gap={2}>
      <GridItem colSpan={8}>
        <GraphEditor
          onUpdateNode={(nodeType, node: StatementType) => {
            if(nodeType == 'statement') {
              dispatch(saveStatement(node) as any)
            }
            dispatch(updateRecord([nodeType, node]))
          }}
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
                onClick={() => selectRecord('statement',{
                  name: '',
                  veracity: 0,
                  statement: '',
                  use_statements: [],
                  created_at: Date.now()
                })}
            />
            {selectedRecord
              ? (<>
                <IconButton 
                    icon={<FaRegSave/>}
                    aria-label="Save Node"  
                    variant-color="green" 
                    rounded="0" 
                    roundedBottomRight='md'
                    onClick={() => setDoSubmitStatementForm(true)}
                  />
                {'id' in selectedRecord[1] 
                  ? (<IconButton 
                      icon={<FaTrash/>}
                      aria-label="Delete Node"  
                      variant-color="green" 
                      rounded="0" 
                      roundedBottomRight='md'
                      onClick={() => removeNode()}
                    />)
                  : ''
                }
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

        {selectedRecord
          ? (<>
              <Text ml='2' color="grey">{ timeToString(selectedRecord[1].created_at) }</Text>
              <StatementForm 
                onSubmit={onStatementFormSubmit} 
                doSubmit={doSubmitStatementForm} 
                statement={selectedRecord[1] as StatementType}
              />
            </>)
          : (<p>Select node with double click or create new one with plus button.</p>)
        }
      </GridItem>
      <GridItem colSpan={8}>
        <SubworkpaceTabs />
      </GridItem>
      <GridItem colSpan={4}>
        {
          !previewedRecord
          ? ('')
          : (<Statement statement={previewedRecord[1] as StatementType} />) 
        }
      </GridItem>
    </Grid>
  </>)
}

