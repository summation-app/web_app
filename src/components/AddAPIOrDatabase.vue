<template>
  <section>
	<h2>Connect to an API or Database</h2>
    <v-alert
      v-if="show_alert"
      :type="alert_type"
    >
      {{ alert_text }}
      <a v-if="alert_type=='error'" href="https://docs.summation.app/quick-start/adding-a-database">Get Help</a>
    </v-alert>
    <v-container v-if="add==null">
      <v-row>
        <v-col>
          <v-card
            class="mx-auto"
            max-width="344"
            outlined
          >
          <v-img
            src="@/assets/images/api.png"
            height="200px"
            class="rounded_card"
          ></v-img>
          <v-card-title>Connect to an API</v-card-title>
          <v-card-text></v-card-text>
          <v-card-actions>
            <v-btn
              outlined
              rounded
              text
              @click="add='api'"
            >
              Select
            </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col>
          <v-card
            class="mx-auto"
            max-width="344"
            outlined
          >
          <v-img
            src="@/assets/images/database.png"
            height="200px"
            class="rounded_card"
          ></v-img>
          <v-card-title>Connect to a Database</v-card-title>
          <v-card-text></v-card-text>
          <v-card-actions>
            <v-btn
              outlined
              rounded
              text
              @click="add='database'"
            >
              Select
            </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-container v-else-if="add=='api'">
      <add_api v-on:saved="saved"></add_api>
    </v-container>
    <v-container v-else-if="add=='database'">
      <add_database v-on:saved="saved"></add_database>
    </v-container>
    <br/>
    <!--<v-btn color="primary" @click="save_database" :loading="pending_submit">Save</v-btn>-->
    <br/>
    <br/>

  </section>
</template>

<script>
const axios = require('axios').default;
import AddAPI from "@/components/AddAPI.vue";
import AddDatabase from "@/components/AddDatabase.vue";
import UserAuth from "@/components/UserAuth.vue";

export default {
	props: ['user','token','gw','item'],
	data() {
		return {
          pending_submit: false,
          show_alert: false,
          alert_type: 'success',
          alert_text: null,
          add: null,
		};
	},
	mounted: function() 
  {
    
  },
  components: {
    'add_api': AddAPI,
    'add_database': AddDatabase,
  },
	watch: {
    
	},
	computed: {
		
	},
	methods: {
      saved()
      {
        this.emit('saved')
      },
	},
	async created() 
	{

	}
};
</script>

<style scoped>
.rounded_card
{
  border-radius: 10%;
}
</style>
