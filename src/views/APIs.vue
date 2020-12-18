<template>
  <section>
    <router-link to="/add/api"><v-btn id='add_button' color='success'>Add an API</v-btn></router-link>
	  <br/><br/>
    <data_table :headers="headers" :rows="rows" :table_loading="table_loading"></data_table>
  </section>
</template>

<script>
import DataTable from "@/components/DataTable.vue";

export default {
	props: ['user','token','gw','api_prefix'],
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
        this.pending_submit = true
        var response = await this.gw.query('SELECT * FROM "APIs"')
        this.table_loading = true
        if (response!=null && response.length>0)
        {
          this.rows = response;

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
