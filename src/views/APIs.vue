<template>
  <section>
    <router-link to="/add/api"><v-btn id='add_button' color='success'>Add an API</v-btn></router-link>
	  <br/><br/>
    <data_table :headers="headers" :rows="rows" :table_loading="table_loading"></data_table>
  </section>
</template>

<script>
const axios = require('axios').default;
import DataTable from "@/components/DataTable.vue";

export default {
	props: ['user','token','gw'],
	data() {
		return {
          pending_submit: false,
          table_loading: false,
          url: null,
          port: 0,
          username: null,
          password: null,
          name: null,
          database_name: null,
          api_prefix: process.env.VUE_APP_API_PREFIX,
          schema: null,
          rows: [],
          headers: []
		};
    },
    components: {
      'data_table': DataTable,
    },
	mounted: function() 
    {
      
    },
	watch: {
		
	},
	computed: {
		
	},
	methods: {
      async get_APIs()
      {
        let self = this
        this.pending_submit = true
        this.table_loading = true
        var response = await axios.post(self.api_prefix + '/apis',
        {
          'token': self.token
        })
        if(response.data!=null && response.data.length>0)
        {
          this.rows = response.data;

          for (const [key, value] of Object.entries(response[0])) 
          {
            this.headers.push({'text': key, 'value': key})
          }
        }
        this.table_loading = false
      }
	},
	async created() 
	{
    await this.get_APIs()
	}
};
</script>

<style scoped>
#add_button
{
	float: right;
	margin: 10px;
}
</style>
