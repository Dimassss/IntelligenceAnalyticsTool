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
        return state.current_statement
    }
}

export const mutations = {
    appendNewStatements(state, stArr){
        state.statements = [...state.statements, ...stArr]
        let lastId = Math.min(...(stArr.map(el => el.id)))
        
        if (lastId != Infinity)
            state.lastId = lastId

        return state
    },
    setCurrentStatement(state, st){
        state.currentStatement = st
    },
    setLastId(state, id){
        state.lastId = id
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
    }
}