<template>
    <div>
        <h1 v-for="item in strings" :key="item">
            This is string "{{ item }}"
        </h1>
    </div>
</template>


<script>
export default {
    data() {
        return {
            strings: Array.from("sdfasdf").map((el,i) => "str-" + i)
        }
    }
}
</script>