import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import axios from '../../plugins/axios'

import { AppState } from "../store";
import clone from "../../lib/clone";
import { StatementType } from "../../types/model/Statement";


//State
export interface StatementState {
    statements: StatementType[],
    lastCreatedStatement: StatementType,
    lastId: number
}

const initialState: StatementState = {
    statements: [],
    lastCreatedStatement: null,
    lastId: null
};

//Async thunks
export const loadNewStatements = createAsyncThunk('statements/loadNewStatements', async (lastId: number | null): Promise<StatementType[]> => {
        /*
            Load next array of elements startion from lastId up to 20 elements
        */
        const url = 'statements/get/list/' + (lastId == null ? '' : `?last_id=${lastId}`)
        
        let res = await axios.get(url)
        let stArr: StatementType[] = res.data.map(el => ({...el, type: 'statement'}))

        return stArr
    })

export const loadStatement = createAsyncThunk('statements/loadStatement', async (id: number) => {
        const res = await axios.get(`/statements/get/${id}/`)
        const st: StatementType = {...res.data, type: 'statement'}
        if(st){
            return st
        } else {
            throw `Statement with id ${id} not found`
        }
    })

export const createStatement = createAsyncThunk('statements/createStatement', async (newSt: StatementType) => {
        const res = await axios.post('/statements/create/', newSt)
        let st: StatementType = res.data

        return st
    })
    
export const saveStatement = createAsyncThunk('statements/saveStatement', async (st: StatementType) => {
    axios.put('statements/save/', st)
    return st
})

export const deleteStatement = createAsyncThunk('statements/deleteStatement', async (st: StatementType, { getState, dispatch }) => {
    dispatch(deleteStatementFromList(st))
    axios.delete(`statements/delete/${st.id}`)
})

// Reducers
const appendNewStatementsReducer = (state: StatementState, action) => {
    const stArr: StatementType[] = action.payload
    state.statements = [...state.statements, ...stArr]
    let lastId = Math.min(...(stArr.map(el => el.id)))
    
    if (lastId != Infinity)
        state.lastId = lastId
}

const prependNewStatementReducer = (state: StatementState, action) => {
    const st: StatementType = clone<StatementType>(action.payload)

    if(!st || st.id == undefined) {
        throw "Statement which you add has not id. You must add only that statements which are in the database"
    }

    state.statements = [st, ...state.statements]
}

const setLastIdReducer = (state, action) => {
    state.lastId = action.payload
}

const updateStatementReducer = (state: StatementState, action) => {
    const st = clone<StatementType>(action.payload)
    const ids = state.statements.map(el => el.id)
    const index = ids.indexOf(st.id);
    const stArr = [...state.statements]

    if(index > -1){
        stArr[index] = st
        state.statements = [...stArr]
    } else {
        state.statements = [st, ...stArr]
    }
}

const deleteStatementFromListReducer = (state: StatementState, action) => {
    const st = action.payload as StatementType

    state.statements = state.statements.filter(el => el.id !== st.id)
}

// Reducers for thunks
const loadNewStatementsFulfilledReducer = (state, action) => {
    let stArr: StatementType[] = [...state.statements, ...action.payload]

    const ids = []
    stArr = stArr.filter(el => {
        if(ids.indexOf(el.id) == -1) {
            ids.push(el.id)
            return true
        } 
        return false
    })


    state.statements = stArr
}

const loadStatementFulfilledReducer = (state, action) => {}

const createStatementFulfilledReducer = (state, action) => {
    const st: StatementType = {...action.payload, type: 'statement'}
    const ind: number = state.statements.map(el => el.id).indexOf(st.id)

    state.lastCreatedStatement = st

    if(ind == -1) {
        state.statements = [...state.statements, st]
    } else {
        const statements = clone(state.statements)
        statements[ind] = st
        state.statements = statements
    }
}

const saveStatementFulfilledReducer = (state, action) => {
    const st = action.payload

    if(st && st.id) {
        const ind = state.statements.map(el => el.id).indexOf(st.id)
        if(ind > -1) {
            let list: StatementType[] = clone(state.statements)
            list[ind] = st
            state.statements = list
        }
    }
}

const deleteStatementFulfilledReducer = (state, action) => {}

//Slice
export const statementSlice = createSlice({
    name: "records_statements",
    initialState,
    reducers: {
        appendNewStatements: appendNewStatementsReducer,
        prependNewStatement: prependNewStatementReducer,
        setLastId: setLastIdReducer,
        updateStatement: updateStatementReducer,
        deleteStatementFromList: deleteStatementFromListReducer
    },
    extraReducers(builder) {
        builder
        .addCase(HYDRATE, (state, action: any) => {
            console.log("HYDRATE", action.payload);
            return {
                ...state,
                ...action.payload.statement,
            };
        })
        .addCase(loadNewStatements.fulfilled, loadNewStatementsFulfilledReducer)
        .addCase(loadStatement.fulfilled, loadStatementFulfilledReducer)
        .addCase(createStatement.fulfilled, createStatementFulfilledReducer)
        .addCase(saveStatement.fulfilled, saveStatementFulfilledReducer)
        .addCase(deleteStatement.fulfilled, deleteStatementFulfilledReducer)
    }
});


//Exports
export const { 
    appendNewStatements, 
    prependNewStatement,
    setLastId,
    updateStatement,
    deleteStatementFromList
} = statementSlice.actions;

export const getAllStatements = (state: AppState) => state.records_statements.statements;
export const getLastId = (state: AppState) => state.records_statements.lastId
export const getLastCreatedStatement = (state: AppState) => state.records_statements.lastCreatedStatement

export default statementSlice.reducer;