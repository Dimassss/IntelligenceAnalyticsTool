import { AppState } from "./store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from '../plugins/axios'

export interface SubworkspaceType {
    id?: number,
    created_at?: string,
    title: string,
    description: string,
    used_statements: number[],
    workspace_id: number
}

export interface WorkspaceType {
    id?: number,
    created_at?: string,
    title: string,
    description: string,
    subworkspaces?: number[]
}

type StateType = {
    workspaces: WorkspaceType[],
    currentWorkspace: WorkspaceType,
    lastId: number
}

const initialState: StateType = {
    workspaces: [],
    currentWorkspace: null,
    lastId: null
}

//Async thunks
export const loadNewWorkspaces = createAsyncThunk('workspaces/loadNewWorkspaces', async (arg, { getState, dispatch }) => {
    /*
        Load next array of elements startion from lastId up to 20 elements
    */
    const state = getState() as AppState
    let lastId = state.workspaces.lastId
    const url = 'workspace/get/list/' + (lastId == null ? '' : `?last_id=${lastId}`)
    
    let res = await axios.get(url)

    let workspaces: WorkspaceType[] = res.data
    workspaces = [...workspaces, ...state.workspaces.workspaces]
    
    lastId = Math.min(...workspaces.map(el => el.id))

    dispatch(setWorkspaces(workspaces))
    dispatch(setLastId(lastId))
})

export const deleteWorkspace = createAsyncThunk("workspaces/deleteWorkspace", async (id: number, { getState, dispatch }) => {
    const state = getState() as AppState
    const url = `workspace/delete/${id}`

    await axios.delete(url)

    if(state.workspaces.currentWorkspace && state.workspaces.currentWorkspace.id == id) {
        dispatch(setCurrentWorkspace(null))
    }

    dispatch(setWorkspaces(state.workspaces.workspaces.filter(w => w.id != id)))
})

export const saveWorkspace = createAsyncThunk("workspaces/deleteWorkspace", async (w: WorkspaceType, { getState, dispatch }) => {
    const state = getState() as AppState

    if('id' in w) {
        const url = 'workspace/save/'
        await axios.put(url, w)

        dispatch(setWorkspaces(state.workspaces.workspaces.map(ws => ws.id == w.id ? w : ws)))
    } else {
        const url = 'workspace/create/'
        const res = await axios.post(url, w)
        w = res.data

        dispatch(setWorkspaces([w, ...state.workspaces.workspaces]))
    }
})


// Reducers
const setWorkspacesReducer = (state: StateType, action) => {
    state.workspaces = [...action.payload]
}

const setCurrentWorkspaceReducer = (state: StateType, action) => {
    state.currentWorkspace = action.payload ? {...action.payload} : null
}

const setLastIdReducer = (state: StateType, action) => {
    state.lastId = action.payload
}


export const workspacesSlice = createSlice({
    name: 'workspaces',
    initialState,
    reducers: {
        setWorkspaces: setWorkspacesReducer,
        setCurrentWorkspace: setCurrentWorkspaceReducer,
        setLastId: setLastIdReducer,
    }
})


// Export actions
export const {
    setWorkspaces,
    setCurrentWorkspace,
    setLastId,
} = workspacesSlice.actions

export const getWorkspaces = (state: AppState) => state.workspaces.workspaces
export const getSelectedRecord = (state: AppState) => state.workspaces.currentWorkspace