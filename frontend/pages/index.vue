<template>
    <c-flex m=1 align="stretch" flexWrap="wrap">
        
        <c-flex align="center" justify="center" minW="200px" p=2>
            <nuxt-link to="statement/create" v-chakra>
                <c-button variant-color="green">Create</c-button>
            </nuxt-link>
        </c-flex>
        
        <c-box v-for="item in list" :key="item.id" border-width="1px" rounded="md" m=1 p=2 minW="250px" maxW="400px" flexGrow=1 boxShadow="1px 1px #eee">
            <NuxtLink :to="`statement/view/${item.id}`">
            <c-heading size='md'>
                {{ item.name }}
            </c-heading>
            <c-progress :value="item.veracity" size='sm'/>
            <c-flex color="grey" fontSize="xs">
                {{ timeToString(item.created_at) }}
            </c-flex>
            <c-text>{{ cutStatementText(item.statement) }} </c-text>
            </NuxtLink>
        </c-box>

        <c-flex align="center" justify="center" minW="200px" p=2>
            <c-button variant-color="green" @click="loadNewStatements">
                Load New Statements
            </c-button>
        </c-flex>
    </c-flex>
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
import dayjs from 'dayjs'

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
        },
        timeToString(time){
            const t = dayjs(time)
            const n = dayjs()

            if(n.diff(t, 'minute') < 2) {
                return 'moment ago'
            } else if(n.diff(t, 'hour') < 1) {
                return `${n.diff(t, 'minute')} minutes ago`
            } else if(n.diff(t, 'day') < 1) {
                const hourDiff = n.diff(t, 'hour')
                return `${hourDiff} hour${hourDiff == 1 ? '' : 's'} ago`
            } else {
                return t.format('D MMM YYYY')
            }
        },
        cutStatementText(st){
            if(st.length < 150){
                return st
            } else {
                return st.substring(0, 130) + '...'
            }
        }
    },
    async asyncData({ store }){
        if(store.getters['statements/getAllStatements'].length < 11)
            await store.dispatch('statements/loadNewStatements')
    }
}
</script>