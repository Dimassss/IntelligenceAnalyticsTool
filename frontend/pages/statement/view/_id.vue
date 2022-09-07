<template>
    <div>
        <nuxt-link to="/">Back</nuxt-link>
        <div v-if="st != null">
            <h1>{{ st.name }}</h1>
            <p class="info">
                {{ st.created_at }}<br/>
                Veracity is {{ st.veracity }}<br/>
                ID: {{ st.id }}
            </p>
            <p>{{ st.statement }}</p>
        </div>
        <div v-else>Statement is loading {{ st ? st.id : 'lol' }}</div>
    </div>
</template>

<style lang="scss" scoped>
    .info {
        color: #aaaaaa;
        font-size: 8px;
    }
</style>

<script>
import { mapGetters } from 'vuex'
export default {
    data(){
        return {}
    },
    computed: {
        ...mapGetters({
            st: 'statements/getCurrentStatement'
        })
    },
    async fetch({ params, store}){
        const id = +params.id

        await store.dispatch('statements/loadStatement', id)
    }
}
</script>