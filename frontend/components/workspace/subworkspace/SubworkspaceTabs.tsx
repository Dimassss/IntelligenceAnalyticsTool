import { Box, Flex, Grid, GridItem, Spacer, Switch, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getAllStatements } from "../../../store/records/statementSlice";
import { getRecords, getRecordsOrder, setPreviewedRecord, setSelectedRecord } from "../../../store/recordsSlice";
import { StatementType } from "../../../types/model/Statement";
import SubworkpacePanel from "./SubworkspacePanel";
import { useState } from "react";

export default function SubworkpaceTabs(){
    const dispatch = useDispatch()
    const [timeouts, setTimeouts] = useState(null as [string, number, NodeJS.Timeout])      //[type, id, clearTimeoutId]
    
    return (
        <Tabs>
            <TabList>
                <Tab>Subworkpace 1</Tab>
            </TabList>

            <TabPanels>
                <TabPanel>
                    <SubworkpacePanel
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
                </TabPanel>
            </TabPanels>
        </Tabs>
    )
}
