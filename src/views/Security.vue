<template>
	<section>
		<v-alert
			type="info"
			outlined
    	>
      		To add an approved database query/API request, issue the query/request from a client with your development gateway token.  It will automatically be added to this list.
    	</v-alert>
		<v-tabs
		v-model="selected_tab"
		grow
		>
      <v-tab key='database_queries'>
        Approved Database Queries
      </v-tab>
      <v-tab key='api_requests'>
        Approved API Requests
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="selected_tab">
		<v-tab-item key='database_queries'>
			<h2></h2>
			<data_table :headers="approved_queries_headers" :rows="approved_queries_rows" :table_loading="table_loading" @enable_changed="enable_changed"></data_table>
		</v-tab-item>
		<v-tab-item key='api_requests'>
			<h2></h2>
			<data_table :headers="approved_requests_headers" :rows="approved_requests_rows" :table_loading="table_loading" @enable_changed="enable_changed"></data_table>
		</v-tab-item>
	</v-tabs-items>
	
	</section>
</template>

<script>
const axios = require('axios').default;
import DataTable from "@/components/DataTable.vue";

export default {
	props: ['user','token','gw','api_prefix'],
	data() {
		return {
		  pending_submit: false,
		  table_loading: false,
		  selected_tab: null,
		  //api_prefix: process.env.VUE_APP_API_PREFIX,
		  approved_queries_rows: [],
		  approved_requests_rows: [],
		  approved_queries_headers: [],
		  approved_requests_headers: [],
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
      async get_approved_queries_requests()
      {
        this.pending_submit = true
		this.table_loading = true
		let self = this
        var response = await axios.get(self.api_prefix + '/approved_queries_requests')
        if(response.data!=null)
        {
		  this.approved_requests_rows = response.data.requests;
		  this.approved_queries_rows = response.data.queries;

		  if(response.data.requests.length > 0)
		  {
			for (const [key, value] of Object.entries(response.data.requests[0])) 
			{
				this.approved_requests_headers.push({'text': key, 'value': key})
			}
		  }
		  if(response.data.queries.length > 0)
		  {
			for (const [key, value] of Object.entries(response.data.queries[0]))
			{
				this.approved_queries_headers.push({'text': key, 'value': key})
			}
		  }
        }
		this.table_loading = false
	  },
	  async enable_changed(item)
      {
		//only enabling/disabling
		let self = this;
		var selected_row_index = -1;
		var iterable = null;
		if(item.type=='api_request')
		{
			iterable = this.approved_requests_rows
		}
		else
		{
			iterable = this.approved_queries_rows
		}
		iterable.forEach(function (value, i) 
		{
    		if(value.id==item.id)
			{
				selected_row_index = i
			}
		});
		if(selected_row_index!=-1)
		{
			iterable[selected_row_index].loading = true;
		}

        var params = {
		  'id': item.id,
		  'record_type': item.type,
		  'enabled': item.enabled
        };

        var response = await axios.post(process.env.VUE_APP_API_PREFIX + '/approved_queries_requests', params);
        console.log(response);
        if(response.data!=null && response.data==true)
        {
          
		}
		if(selected_row_index!=-1)
		{
			iterable[selected_row_index].loading = false;
		}
      },
	  delete_item(item)
	  {
		console.log('delete item:' + item)
		this.item_to_delete = item
	  },
	  close_delete()
	  {
		this.show_delete_dialog = false;
	  },
	  async delete_item_confirm()
	  {
		let self = this
		var response = await axios.delete(self.api_prefix + '/approved_queries_requests',
		{
			data:
			{
			'id': self.item_to_delete.id,
			'type': self.item_to_delete.type
			}
		})
        if(response.data!=null && response.data.length>0)
        {
			//refresh the list
			await self.get_approved_queries_requests()
		}
	  }
	},
	async created() 
	{
		await this.get_approved_queries_requests()
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
