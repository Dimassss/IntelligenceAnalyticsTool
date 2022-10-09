import { AppState } from "../store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from '../../plugins/axiosAuth'

export interface SubworkspaceType {
    id?: number,
    created_at?: string,
    title: string,
    used_statements: number[],
    workspace_id: number
}

type StateType = {
    subworkspaces: SubworkspaceType[],
    currentSubworkspace: number,
}

const initialState: StateType = {
    subworkspaces: [],
    currentSubworkspace: null,
}

//Async thunks
export const loadSubworkspaces = createAsyncThunk('subworkspaces/loadSubworkspaces', async (id: any, { getState, dispatch }) => {
    /*
        Load all subworkspaces which belongs to workspace with id=@id
    */
    const url = `workspace/get/${id}/subworkspaces`
    
    let res = await axios.get(url)
    let subworkspaces = res.data as SubworkspaceType[]
    

    dispatch(setSubworkspaces(subworkspaces))
})

export const deleteSubworkspace = createAsyncThunk("subworkspaces/deleteSuborkspace", async (id: number, { getState, dispatch }) => {
    const state = getState() as AppState
    const url = `workspace/delete/subworkspace/${id}`

    await axios.delete(url)

    if(state.subworkspaces.currentSubworkspace && state.subworkspaces.currentSubworkspace == id) {
        dispatch(setCurrentSubworkspace(null))
    }

    dispatch(setSubworkspaces(state.subworkspaces.subworkspaces.filter(w => w.id != id)))
})

export const saveSubworkspace = createAsyncThunk("workspaces/saveSubworkspace", async (sw: SubworkspaceType, { getState, dispatch }) => {
    const state = getState() as AppState

    if('id' in sw) {
        const url = 'workspace/save/subworkspace/'
        await axios.put(url, sw)

        const newSubworkspaces = state.subworkspaces.subworkspaces.map(sw2 => sw2.id == sw.id ? sw : sw2)
        dispatch(setSubworkspaces(newSubworkspaces))
    } else {
        const url = 'workspace/create/subworkspace/'
        const res = await axios.post(url, sw)
        sw = res.data

        dispatch(setSubworkspaces([sw, ...state.subworkspaces.subworkspaces]))
    }
})


// Reducers
const setSubworkspacesReducer = (state: StateType, action) => {
    state.subworkspaces = [...action.payload]
}

const setCurrentSubworkspaceReducer = (state: StateType, action) => {
    state.currentSubworkspace = action.payload ? {...action.payload} : null
}

const updateSubworkspaceReducer = (state: StateType, action) => {
    const newSubworkspace = action.payload as SubworkspaceType
    state.subworkspaces = state.subworkspaces.map(el => el.id == newSubworkspace.id ? newSubworkspace : el)
}



export const subworkspacesSlice = createSlice({
    name: 'subworkspaces',
    initialState,
    reducers: {
        setSubworkspaces: setSubworkspacesReducer,
        setCurrentSubworkspace: setCurrentSubworkspaceReducer,
        updateSubworkspace: updateSubworkspaceReducer
    }
})


// Export actions
export const {
    setCurrentSubworkspace,
    setSubworkspaces,
    updateSubworkspace
} = subworkspacesSlice.actions

export const getSubworkspaces = (state: AppState) => state.subworkspaces.subworkspaces
export const getCurrentWorkspace = (state: AppState) => state.subworkspaces.currentSubworkspace