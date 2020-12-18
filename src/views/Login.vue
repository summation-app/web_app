<template>
    <section>
        <h2>Summation Login</h2>
        <v-form>
            <v-text-field
                v-model="password"
                :append-icon="show_icon ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show_icon ? 'text' : 'password'"
                label="Admin Password"
                hint="which you entered when starting the Docker container"
                @click:append="show1 = !show1"
            ></v-text-field>
            <v-btn color="primary" @click="handleSubmit" :loading="loading">Login</v-btn>
            <img v-show="loading" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
        </v-form>
    </section>
</template>

<script>
import router from '../router.js';
import {login, logout} from '../auth.js';

export default {
    data: function () 
    {
        return {
            username: 'admin',
            password: '',
            loading: false,
            returnUrl: '',
            show_icon: false,
            error: ''
        }
    },
    components: {
    },
    mounted() 
    {
        this.$emit('navigation_drawer', true);

        // reset login status
        logout();
        // get return url from route parameters or default to '/'
        this.returnUrl = this.$route.query.returnUrl || '/';
    },
    methods: {
        handleSubmit() 
        {
            this.loading = true;
            login(this.username, this.password)
                .then(
                    user => {
                        this.$emit('logged_in', true)
                        router.push(this.returnUrl)
                    },
                    error => {
                        this.error = error;
                        this.loading = false;
                    }
                );
        }
    }
};
</script>

<style scoped>
</style>