<template>
    <v-dialog v-model="showDialog" persistent max-width="500px">
        <v-card>
            <v-card-title class="headline">{{ title }}</v-card-title>
            <v-card-text>
                <span>{{ message }}</span>
            </v-card-text>
            <v-card-actions>
                <v-btn color="primary" text @click="cancel">Cancel</v-btn>
                <v-btn color="error" text @click="confirm">Confirm</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
  
<script>
export default {
    props: {
        showDialog: {
            type: Boolean,
            default: false,
        },
        title: {
            type: String,
            default: 'Confirmation',
        },
        message: {
            type: String,
            default: 'Are you sure?',
        },
    },
    methods: {
        cancel() {
            this.$emit('cancel');
        },
        confirm() {
            this.$emit('confirm');
        },
    },
};
</script>
  
<style scoped>
/* Add your styles here */
</style>