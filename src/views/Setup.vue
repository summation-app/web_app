<template>
    <section>

      <v-stepper v-model="current_step">
        <v-stepper-header>
          <v-stepper-step
            :complete="current_step > 1"
            step="1"
          >
            User Authentication
          </v-stepper-step>
          <v-divider></v-divider>

          <v-stepper-step
            :complete="current_step > 2"
            step="2"
          >Connect your Database or API</v-stepper-step>

          <v-stepper-step
            :complete="current_step > 3"
            step="3"
          >Test it Out</v-stepper-step>

          <v-divider></v-divider>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <user_auth :gw="gw" v-on:saved="current_step += 1"></user_auth>
          </v-stepper-content>

          <v-stepper-content step="2">
            <add_database :gw="gw" v-on:saved="current_step += 1"></add_database>
          </v-stepper-content>

          <v-stepper-content step="3">
            <client_setup :gw="gw"></client_setup>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </section>
</template>

<script>
import UserAuth from "@/components/UserAuth.vue"
import AddAPI from "@/components/AddAPI.vue";
import AddDatabase from "@/components/AddDatabase.vue";
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
        };
    },
    components: {
      'user_auth': UserAuth,
      'add_api': AddAPI,
      'add_database': AddDatabase,
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
    },
    created()
    {
      // `this` points to the vm instance
    }
};
</script>
