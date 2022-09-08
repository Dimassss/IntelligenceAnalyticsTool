const cloneObj = obj => JSON.parse(JSON.stringify(obj))

export const state = () => ({
    statements: [],
    currentStatement: null,
    lastId: null
})

export const getters = {
    getAllStatements(state){
        return state.statements
    },
    getCurrentStatement(state){
        return state.currentStatement
    }
}

export const mutations = {
    appendNewStatements(state, stArr){
        state.statements = [...state.statements, ...stArr]
        let lastId = Math.min(...(stArr.map(el => el.id)))
        
        if (lastId != Infinity)
            state.lastId = lastId
    },
    prependNewStatement(state, st){
        const clonedSt = cloneObj(st)

        if(!st || st.id == undefined) {
            throw "Statement which you add has not id. You must add only that statements which are in the database"
        }

        state.statements = [clonedSt, ...state.statements]
    },
    setCurrentStatement(state, st){
        const clonedSt = cloneObj(st)
        state.currentStatement = clonedSt
    },
    setLastId(state, id){
        state.lastId = id
    },
    updateStatement(state, st){
        const clonedSt = cloneObj(st)
        const ids = state.statements.map(el => el.id)
        const index = ids.indexOf(cloneSt.id);

        if(index > -1){
            state.statements = state.statements.map(el => (el.id == clonedSt.id ? clonedSt : el))
        } else {
            state.statements = [...state.statements, clonedSt]
        }
    }
}

export const actions = {
    async loadNewStatements({ commit, state }){
        const lastId = state.lastId
        const url = 'statements/get/list/' + (lastId == null ? '' : `?last_id=${lastId}`)
        
        let stArr = await this.$axios.$get(url)
        const ids = state.statements.map(el => el.id)
        stArr = stArr.filter(el => ids.indexOf(el.id) == -1)

        commit('appendNewStatements', stArr)
    },
    async loadStatement({ state, commit}, id){
        let st = state.statements.find(el => el.id == id);

        if(!st){
            st = await this.$axios.$get(`/statements/get/${id}/`);
        }
        
        if(st) commit('setCurrentStatement', st)
        else throw `Statement with id ${id} not found`
    },
    async createStatement({ commit }, newSt){
        let st = await this.$axios.$post('/statements/create/', newSt)
        
        commit('setCurrentStatement', st)
        commit('prependNewStatement', st)
    },
    async saveStatement({ commit }, st){
        await this.$axios.$put('/statements/save/', st)

        commit('setCurrentStatement', st)
    }
}