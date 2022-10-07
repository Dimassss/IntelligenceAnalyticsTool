import { Box, Button, Flex, Grid, GridItem, IconButton, Input, Spacer, Switch, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getAllStatements } from "../../../store/records/statementSlice";
import { getRecords, getRecordsOrder, setPreviewedRecord, setSelectedRecord, setUsedRecords } from "../../../store/recordsSlice";
import { StatementType } from "../../../types/model/Statement";
import { BiX } from "react-icons/bi";
import SubworkpacePanel from "./SubworkspacePanel";
import { useEffect, useState } from "react";
import { deleteSubworkspace, getSubworkspaces, loadSubworkspaces, saveSubworkspace, updateSubworkspace } from "../../../store/workspaces/subworkspaceSlice";
import { useRouter } from "next/router";
import { FaPlus } from "react-icons/fa";

export default function SubworkpaceTabs(){
    const dispatch = useDispatch()
    const router = useRouter()
    const subworkspaces = useSelector(getSubworkspaces)
    const [timeouts, setTimeouts] = useState(null as [string, number, NodeJS.Timeout])      //[type, id, clearTimeoutId]
    const [tabIndex, setTabIndex] = useState(0)

    useEffect(() => {
        if(!isNaN(+router.query.id)){
            dispatch(loadSubworkspaces(router.query.id) as any)
        }
    },  [router.query.id])
    
    return (
        <Tabs variant='enclosed' colorScheme='green' index={tabIndex} onChange={i => setTabIndex(i)}>
            <TabList 
                style={{
                    overflow: "hidden",
                    scrollbarWidth: "none",
                    height: "calc(4em - 20px)",
                    width: "100%",
                }}
            >
                <IconButton
                    variant='outline'
                    colorScheme='green'
                    aria-label='Create subworkspace'
                    icon={<FaPlus />}
                    mr={2}
                    ml={2}
                    onClick={e => {
                        const sw = {
                            title: `Subworkspace ${subworkspaces.length}`,
                            workspace_id: +router.query.id,
                            used_statements: []
                        }

                        dispatch(saveSubworkspace(sw) as any)
                        dispatch(setUsedRecords([]))
                        setTabIndex(0)
                    }}
                />
                <Flex style={{
                    overflowX: "scroll",
                    overflowY: "hidden",
                    paddingBottom: "20px",
                    scrollbarWidth: "none",
                    boxSizing: "content-box",
                    width: "100%",
                    height: "4em"
                }}>
                    {
                        subworkspaces.filter(el => el.workspace_id == +router.query.id)
                            .map(sw => (<Tab
                                    maxWidth={"300"}
                                    minWidth={"150"}
                                    key={sw.id}
                                    pr={0.5}
                                    onClick={e => {
                                            const usedRecords = [];

                                            usedRecords.push(...sw.used_statements.map(st_id => ({type: 'statement', id:st_id})))

                                            dispatch(setUsedRecords(usedRecords))
                                        }
                                    }
                                >
                                    <Flex>
                                        <span style={{
                                            display: "block", 
                                            wordBreak: "break-all", 
                                            height: '1.8em',
                                            marginRight: '0.5em',
                                            overflow: "hidden" 
                                        }}>
                                            {sw.title}
                                        </span>
                                        <BiX 
                                            size="1.5em"
                                            color='#C53030'
                                            aria-label='Delete subworkspace'
                                            onClick={e => {
                                                e.stopPropagation()
                                                dispatch(deleteSubworkspace(sw.id) as any)
                                                dispatch(setUsedRecords([]))
                                                setTabIndex(-1)
                                            }}
                                        />
                                    </Flex>
                                </Tab>)
                            )
                    }
                </Flex>
            </TabList>

            <TabPanels>
                {
                    subworkspaces.filter(el => el.workspace_id == +router.query.id)
                        .map(sw => (<TabPanel key={sw.id}>
                            <Input 
                                placeholder='Title' 
                                size='sm' 
                                mb="2" 
                                value={sw.title} 
                                onChange={e => {
                                    const v = e.target.value
                                    if(v.length < 70) {
                                        dispatch(updateSubworkspace({...sw, title:v}))
                                    }
                                }}
                                onBlur={e => {
                                    dispatch(saveSubworkspace(sw) as any)
                                }}
                            />
                            <SubworkpacePanel
                                subworkspace={sw}
                                onClickRecord={{
                                    statement: (e, recordType, record) => {
                                        if(timeouts && recordType == timeouts[0] && record.id == timeouts[1]) {
                                            clearTimeout(timeouts[2])
                                            dispatch(setSelectedRecord([recordType, record]))
                                            setTimeouts(null)
                                        } else {
                                            const clearTimeoutId = setTimeout(() => {
                                                dispatch(setPreviewedRecord([recordType, record]))
                                            }, 150)
        
                                            setTimeouts([recordType, record.id, clearTimeoutId])
                                        }
                                    }
                                }}
                            />
                        </TabPanel>))
                }
            </TabPanels>
        </Tabs>
    )
}
