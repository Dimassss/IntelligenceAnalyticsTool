import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import axios from '../plugins/axios'

import { AppState } from "./store";
import clone from "../lib/clone";
import { Statement } from "~~/types/model/Statement";


//State
export interface StatementState {
    statements: Statement[],
    currentStatement: Statement,
    lastId: number
}

const initialState: StatementState = {
    statements: [],
    currentStatement: null,
    lastId: null
};

//Async thunks
export const loadNewStatements = createAsyncThunk('statements/loadNewStatements', async (lastId: number | null): Promise<Statement[]> => {
        /*
            Load next array of elements startion from lastId up to 20 elements
        */
        const url = 'statements/get/list/' + (lastId == null ? '' : `?last_id=${lastId}`)
        
        let res = await axios.get(url)
        let stArr: Statement[] = res.data

        return stArr
    })

export const loadStatement = createAsyncThunk('statements/loadStatement', async (id: number) => {
        const res = await axios.get(`/statements/get/${id}/`)
        const st: Statement = res.data
        if(st){
            return st
        } else {
            throw `Statement with id ${id} not found`
        }
    }/*,
    {
        condition(id, { getState }) {
            const { statements } = getState() as StatementState   
            let st = statements.find(el => el.id == id);

            alert("here")
            
            return !st
        }
    }*/)

export const createStatement = createAsyncThunk('statements/createStatement', async (newSt: Statement) => {
        const res = await axios.post('/statements/create/', newSt)
        let st: Statement = res.data

        return st
    })
    
export const saveStatement = createAsyncThunk('statements/saveStatement', async (st: Statement) => {
    axios.put('statements/save/', st)
    return st
})

//Slice
export const statementSlice = createSlice({
    name: "statements",
    initialState,
    reducers: {
        appendNewStatements(state: StatementState, action){
            const stArr: Statement[] = action.payload
            state.statements = [...state.statements, ...stArr]
            let lastId = Math.min(...(stArr.map(el => el.id)))
            
            if (lastId != Infinity)
                state.lastId = lastId
        },
        prependNewStatement(state: StatementState, action){
            const st: Statement = clone<Statement>(action.payload)
    
            if(!st || st.id == undefined) {
                throw "Statement which you add has not id. You must add only that statements which are in the database"
            }
    
            state.statements = [st, ...state.statements]
        },
        setCurrentStatement(state: StatementState, action){
            const st: Statement = clone<Statement>(action.payload)
            state.currentStatement = st
        },
        setLastId(state, action){
            state.lastId = action.payload
        },
        updateStatement(state: StatementState, action){
            const st = clone<Statement>(action.payload)
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
        .addCase(loadNewStatements.fulfilled, (state, action) => {
            let stArr: Statement[] = [...state.statements, ...action.payload]

            const ids = []
            stArr = stArr.filter(el => {
                if(ids.indexOf(el.id) == -1) {
                    ids.push(el.id)
                    return true
                } 
                return false
            })


            state.statements = stArr
        })
        .addCase(loadStatement.fulfilled, (state, action) => {
            let st: Statement = action.payload

            state.currentStatement = st
        })
        .addCase(createStatement.fulfilled, (state, action) => {
            const st: Statement = action.payload
            const ind: number = state.statements.map(el => el.id).indexOf(st.id)

            state.currentStatement = st

            if(ind == -1) {
                state.statements = [...state.statements, st]
            } else {
                const statements = clone(state.statements)
                statements[ind] = st
                state.statements = statements
            }
        })
        .addCase(saveStatement.fulfilled, (state, action) => {
            const st = action.payload
            state.currentStatement = st

            if(st && st.id) {
                const ind = state.statements.map(el => el.id).indexOf(st.id)
                if(ind > -1) {
                    let list: Statement[] = clone(state.statements)
                    list[ind] = st
                    state.statements = list
                }
            }
        })
    }
});


//Exports
export const { 
    appendNewStatements, 
    prependNewStatement,
    setCurrentStatement,
    setLastId,
    updateStatement 
} = statementSlice.actions;

export const getAllStatements = (state: AppState) => state.statements.statements;
export const getCurrentStatement = (state: AppState) => state.statements.currentStatement;
export const getLastId = (state: AppState) => state.statements.lastId

export default statementSlice.reducer;