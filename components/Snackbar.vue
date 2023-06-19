<template>
    <v-snackbar v-model="show" :color="color" bottom center>
        <div class="d-flex align-center">
            <span class="mr-auto">{{ message }}</span>
            <v-btn icon @click="hideSnackbar">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </div>
    </v-snackbar>
</template>
  
<script>
export default {
    data() {
        return {
            show: false
        };
    },
    computed: {
        message() {
            return this.$store.state.snackbar.message;
        },
        color() {
            return this.$store.state.snackbar.color;
        }
    },
    watch: {
        '$store.state.snackbar.show'(newValue) {
            if (newValue) {
                this.show = true;
                setTimeout(() => {
                    this.$store.dispatch('snackbar/hideSnackbar');
                }, 3000); // Adjust the delay as needed
            } else {
                this.show = false;
            }
        }
    },
    methods: {
        hideSnackbar() {
            this.$store.dispatch('snackbar/hideSnackbar');
        }
    }
};
</script>
  
<style scoped>
.v-snack__content {
    font-size: 14px;
    /* Adjust the font size as needed */
}
</style>
  