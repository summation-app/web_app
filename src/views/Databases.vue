<template>
	<section>
		<router-link to="/add/database"><v-btn id='add_button' color='success'>Add Database</v-btn></router-link>
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
		  api_prefix: process.env.VUE_APP_API_PREFIX,
          name: null,
          database_name: null,
		  schema: null,
		  rows: [],
		  headers: []
		};
	},
	mounted: function() 
    {
      
    },
	watch: {
		
	},
	computed: {
		
	},
	components: {
      'data_table': DataTable,
    },
	methods: {
      async get_databases()
      {
        this.pending_submit = true
		this.table_loading = true
        var response = await axios.post(self.api_prefix + '/databases',
        {
          'token': self.token
        })
        if(response.data!=null)
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
		await this.get_databases()
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
