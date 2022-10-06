import { Grid, GridItem, Flex, Spacer, Switch, Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getPreviewedRecord, getRecords, getRecordsOrder, getSelectedRecord, getUsedRecords, RecordsType, RecordType, setUsedRecords } from "../../../store/recordsSlice";

import styles from '../../../styles/statement/Statement-tile.module.scss'


type Props = {
    onClickRecord: {
        [recordType: string]: (e, recordType: string, record: RecordType) => void
    }
}

export default function SubworkpacePanel({onClickRecord}: Props){
    const dispatch = useDispatch()
    const usedRecords = useSelector(getUsedRecords)
    const selectedRecord = useSelector(getSelectedRecord)
    const previewedRecord = useSelector(getPreviewedRecord)
    const records = useSelector(getRecords)
    const recordsOrder = useSelector(getRecordsOrder)

    return (
        <Grid templateColumns='repeat(12, 1fr)' gap={2}>
            {recordsOrder
                .map(({recordType, i}) => {
                    const record = records[recordType][i]

                    const isPreviewed = previewedRecord && previewedRecord[0] == recordType && previewedRecord[1].id == record.id
                    const isSelected = selectedRecord && selectedRecord[0] == recordType && selectedRecord[1].id == record.id

                    const isChecked = usedRecords[recordType] && !!usedRecords[recordType].find(el => el.id == record.id)

                    return (
                        <GridItem 
                            onClick={e => onClickRecord[recordType](e, recordType, record)}
                            colSpan={4} 
                            key={record.id} 
                            p={2} 
                            className={[
                                styles['statement-tile'], 
                                isPreviewed ? styles['previewed'] : undefined, 
                                isSelected ? styles['selected'] : undefined
                            ].filter(el => el).join(' ')}
                        >
                            <Flex>
                            <Box>
                                <p>{record.name}</p>
                            </Box>
                            <Spacer/>
                            <div onClick={e => e.stopPropagation()}>
                                <Switch
                                    isChecked={isChecked}
                                    colorScheme={"green"}
                                    onChange={(e) => {
                                        let list = []

                                        if(!e.target.checked) {
                                            list = usedRecords.filter(({type, id}) => recordType != type || (recordType == type && id !== record.id))
                                        } else {
                                            list = [{type: recordType, id: record.id}, ...usedRecords]
                                        }

                                        dispatch(setUsedRecords(list))
                                    }}
                                />
                            </div>
                            </Flex>
                        </GridItem>
                    )
                })
            }
        </Grid>
    )
}