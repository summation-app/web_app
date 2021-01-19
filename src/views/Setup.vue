<template>
    <section>

      <v-stepper v-model="current_step">
        <v-stepper-header>
          <v-stepper-step
            :complete="current_step > 1"
            step="1"
          >
            Connect an API or Database
          </v-stepper-step>
          <v-divider></v-divider>

          <v-stepper-step
            :complete="current_step > 2"
            step="2"
          >User Authentication</v-stepper-step>

          <v-stepper-step
            :complete="current_step > 3"
            step="3"
          >Test it Out</v-stepper-step>

          <v-divider></v-divider>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <add_api_or_database :gw="gw" v-on:saved="current_step += 1"></add_api_or_database>
          </v-stepper-content>

          <v-stepper-content step="2">
            <user_auth :gw="gw" v-on:saved="saved_user_auth"></user_auth>            
          </v-stepper-content>

          <v-stepper-content step="3">
            <client_setup :gw="gw" v-on:saved="save_auth_with_app_id"></client_setup>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </section>
</template>

<script>
import UserAuth from "@/components/UserAuth.vue"
import AddAPIOrDatabase from "@/components/AddAPIOrDatabase.vue";
import ClientSetup from "@/components/ClientSetup.vue";
const axios = require('axios').default;

export default {
    props: ['user','token','subscription_plan','gw','api_prefix'],
    data() {
        return {
          current_step: 1,
          is_mobile: false,
          website_address: null,
          invite_link: "",
          api_key: null,
          loading: false,
          saved: false,
          auth_values: null
        };
    },
    components: {
      'user_auth': UserAuth,
      'add_api_or_database': AddAPIOrDatabase,
      'client_setup': ClientSetup,
    },
    mounted: function() 
    {
      var step = this.$route.params.step;
      if(step!=null)
      {
        if(step == 1 || step ==2 || step == 3)
        this.current_step = parseInt(this.$route.params.step);
      }

      this.is_mobile = ('ontouchstart' in document.documentElement && navigator.userAgent.match(/Mobi/));
    },
    computed: {
      
    },
    methods: {
      async setup()
      {
        try
        {
          let self = this;
          self.current_step = 3;
          self.loading = true;
          var response = await axios.post(self.api_prefix + '/setup',
          {
            'organization_id': self.selected_organization,
            'api_key': self.api_key,
          },
          );
          console.log(response);
          self.loading = false;
          self.saved = true;
          localStorage.setItem('setup_completed', 'true');
        }
        catch (error)
        {
          console.error(error);
        }
      },
      saved_user_auth(token, values)
      {
        let self = this;
        this.current_step += 1
        self.token = token
        self.auth_values = values
      },
      async save_auth_with_app_id(app_id)
      {
        var response = await axios.post(self.api_prefix + '/auth_method',
				{
          'values': self.auth_values,
          'app_id': app_id
				})
      }
    },
    created()
    {
      // `this` points to the vm instance
    }
};
</script>
