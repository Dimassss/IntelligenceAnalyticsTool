// this is store which is abstract layer for objects from database as statement or files

import { AppState } from "./store";
import { createSlice } from "@reduxjs/toolkit"

// Types
export type RecordType = {id?: number, created_at?: string | number, [key: string]: any}

export type RecordsType = {
    [recordType: string]: RecordType[]
}

export interface RecordsState {
    selectedRecord: [string, RecordType],   // first element is record's type
    previewedRecord: [string, RecordType],
    records: RecordsType,
    recordsOrder: {recordType: string, i: number}[],
    usedRecords: {type: string, id: number}[]
}

// Initial state
const initialState: RecordsState = {
    selectedRecord: null,
    previewedRecord: null,
    records: {},
    recordsOrder: [],
    usedRecords: []
}

// Reducers

const setUsedRecordsReducer = (state: RecordsState, action) => {
    state.usedRecords = action.payload
}

const updateRecordReducer = (state: RecordsState, action) => {
    const [recordType, record] = action.payload as [string, RecordType]
    const newRecords = JSON.parse(JSON.stringify(state.records))

    if(state.selectedRecord && state.selectedRecord[0] == recordType && state.selectedRecord[1].id == record.id) {
        state.selectedRecord = [recordType, record]
    }

    if(state.previewedRecord && state.previewedRecord[0] == recordType && state.previewedRecord[1].id == record.id) {
        state.previewedRecord = [recordType, record]
    }

    if(!newRecords[recordType]) {
        newRecords[recordType] = []
    }

    for(let i in newRecords[recordType]) {
        if(newRecords[recordType][i].id == record.id) {
            newRecords[recordType][i] = record
            break;
        }
    }

    state.records = newRecords
}

const setSelectedRecordReducer = (state: RecordsState, action) => {
    state.selectedRecord = (action.payload ? [...action.payload] : null) as [string, RecordType]
}

const setPreviewedRecordReducer = (state: RecordsState, action) => {
    state.previewedRecord = Object.assign({}, action.payload)
}

const setRecordsReducer = (state: RecordsState, action) => {
    const newRecords = action.payload as RecordsType
    const filteredRecords = {} as RecordsType
    const newOrder = [] as {recordType: string, i: number}[]

    for(let recordType in newRecords){
        filteredRecords[recordType] = []

        for(let i in newRecords[recordType]){
            const r = newRecords[recordType][i]

            if(filteredRecords[recordType].find(el => el.id == r.id)) {
                continue
            }

            filteredRecords[recordType].push(r)
        }
    }


    for(let recordType in filteredRecords){
        newOrder.push(...filteredRecords[recordType].map((el, i) => ({recordType, i})))
    }

    newOrder.sort((a,b) => (
            new Date(filteredRecords[a.recordType][a.i].created_at)).getTime() 
            - (new Date(filteredRecords[b.recordType][b.i].created_at)).getTime()
        )
    
    state.records = filteredRecords
    state.recordsOrder = newOrder
    
    state.usedRecords = state.usedRecords.filter(
        ({type, id}) => state.records[type] && state.records[type].find(el => el.id == id)
    )
}

// Slice 
export const recordsSlice = createSlice({
    name: 'records',
    initialState,
    reducers: {
        setSelectedRecord: setSelectedRecordReducer,
        setPreviewedRecord: setPreviewedRecordReducer,
        setRecords: setRecordsReducer,
        updateRecord: updateRecordReducer,
        setUsedRecords: setUsedRecordsReducer
    }
})

// Export actions
export const {
    setPreviewedRecord,
    setSelectedRecord,
    setRecords,
    updateRecord,
    setUsedRecords
} = recordsSlice.actions

export const getPreviewedRecord = (state: AppState) => state.records.previewedRecord
export const getSelectedRecord = (state: AppState) => state.records.selectedRecord
export const getRecords = (state: AppState) => state.records.records
export const getRecordsOrder = (state: AppState) => state.records.recordsOrder
export const getUsedRecords = (state: AppState) => state.records.usedRecords