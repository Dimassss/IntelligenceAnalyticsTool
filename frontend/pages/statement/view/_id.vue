<template>
    <div>
        <nuxt-link to="/">Back</nuxt-link>
        <br/><br/><br/>
        <div v-if="statement != null">
            <input v-model="statement.name" placeholder="Title"/><br/>
            <p class="info">
                {{ statement.created_at }}<br/>
                Veracity is {{ statement.veracity }} 
                <input v-model="statement.veracity" type="range" min=0 max=100 step=1/><br/>
                ID: {{ statement.id }}
            </p>
            <div class="desc">
                <textarea v-model="statement.statement" rows="10" cols="70"></textarea>
            </div>

            <button @click="saveChanges">Save Changes</button> 
        </div>
        <div v-else>Statement ID:{{ $route.params.id }} is loading</div>
    </div>
</template>

<style lang="scss" scoped>
    .info {
        color: #aaaaaa;
        font-size: 14px;
    }

    .desc {
        font-size: 18px;
    }
</style>

<script>
export default {
    data(){
        return {
            statement: null
        }
    },
    computed: {},
    methods: {
        async saveChanges(){
            this.$store.dispatch('statements/saveStatement', this.statement)
        }
    },
    async asyncData({ params, store }){
        const id = +params.id
        await store.dispatch('statements/loadStatement', id)
        let statement = JSON.parse(JSON.stringify( store.getters["statements/getCurrentStatement"] ))
        
        return {
            statement
        }
    }
}
</script>