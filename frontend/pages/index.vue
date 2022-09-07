<template>
    <div>
        <table>
            <tr>
                <th>ID</th>
                <th>Created At</th>
                <th>Name</th>
                <th>Statement</th>
                <th>Veracity</th>
            </tr>
            <tr v-for="item in list" :key="item.id">
                <td><NuxtLink :to="`statement/view/${item.id}`">{{ item.id }}</NuxtLink></td>
                <td>{{ item.created_at }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.statement }}</td>
                <td>{{ item.veracity }}</td>
            </tr>
        </table>
        <button @click="loadNewStatements">Load New Statements</button>
    </div>
</template>

<style lang="scss" scoped>
    table {
        border: 1px solid black;
        border-collapse: collapse;

        th, td {
            border: 1px solid black;
            padding: 3px
        }
    }
</style>


<script>
import { mapGetters } from 'vuex';

export default {
    data() {
        return {}
    },
    computed: {
        ...mapGetters({'list': 'statements/getAllStatements'})
    },
    methods: {
        async loadNewStatements(){
            await this.$store.dispatch('statements/loadNewStatements')
        }
    },
    async fetch({ store }){
        if(store.getters['statements/getAllStatements'].length < 11)
            await store.dispatch('statements/loadNewStatements')
    },
    fetchOnServer: false
}
</script>