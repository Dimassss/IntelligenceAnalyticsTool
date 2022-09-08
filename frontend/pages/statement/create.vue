<template>
    <div>
        <form @submit.prevent="submitForm">
            <label for="name">Name</label>
            <input v-model="st.name" name="name"/>
            <br/><br/>
            <label for="statement">Statement</label>
            <textarea v-model="st.statement"></textarea>
            <br/><br/>
            <label for="veracity">Veracity: {{ st.veracity }}</label>
            <input v-model="st.veracity" type="range" min=0 max=100 step=1/>
            <br/><br/>
            <button>Create Statement</button>
        </form>
    </div>
</template>


<script>
export default {
    data(){
        return {
            st: {
                name: "",
                statement: "",
                veracity: 0
            }
        }
    },
    methods: {
        async submitForm(){
            await this.$store.dispatch("statements/createStatement", this.st)

            let createdSt = this.$store.getters["statements/getCurrentStatement"]

            this.$router.push({
                name: `statement-view-id`,
                params: {
                    id: createdSt.id
                }
            })
        }
    }
}
</script>