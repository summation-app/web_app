<template>
	<section>
		<router-link to="/add/database"><v-btn id='add_button' color='success'>Add Database</v-btn></router-link>
		<br/><br/>
		<data_table :headers="headers" :rows="rows" :table_loading="table_loading" @edit_item="edit_item" @delete_item="delete_item"></data_table>
		<v-dialog
          v-model="show_edit_dialog"
          max-width="500px"
        >
          <v-card>
            <v-card-title>
              <span class="headline">Edit Item</span>
            </v-card-title>

            <database_form :item="edited_item" @saved="get_databases"></database_form>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="close_item_editor"
              >
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="show_delete_dialog" max-width="500px">
          <v-card>
            <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close_delete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="delete_item_confirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
	</section>
</template>

<script>
const axios = require('axios').default;
import DataTable from "@/components/DataTable.vue";
import AddDatabase from "@/components/AddDatabase.vue";

export default {
	props: ['user','token','gw'],
	data() {
		return {
		  pending_submit: false,
		  table_loading: false,
		  api_prefix: process.env.VUE_APP_API_PREFIX,
		  rows: [],
		  headers: [],
		  show_edit_dialog: false,
		  show_delete_dialog: false,
		  item_to_delete: null,
		  edited_item: {},
		};
	},
	mounted: function() 
    {
		if(process.env.VUE_APP_ENV=='cloud')
		{
			window.analytics.page('Databases');
		}
    },
	watch: {
		
	},
	computed: {
		
	},
	components: {
	  'data_table': DataTable,
	  'database_form': AddDatabase,
    },
	methods: {
      async get_databases()
      {
        this.pending_submit = true
		this.table_loading = true
		let self = this
		self.rows = []
		self.headers = []
        var response = await axios.post(self.api_prefix + '/databases',
        {
          'token': self.token
        })
        if(response.data!=null && response.data.length>0)
        {
          this.rows = response.data;

          for (const [key, value] of Object.entries(response.data[0])) 
          {
            this.headers.push({'text': key, 'value': key})
		  }
		  this.headers.push({ text: 'Actions', value: 'actions', sortable: false });
        }
		this.table_loading = false
	  },
	  close_item_editor()
	  {
		this.show_edit_dialog = false
	  },
	  edit_item(item)
	  {
		console.log('edit item:' + item)
		this.edited_item = item
		this.show_edit_dialog = true
	  },
	  delete_item(item)
	  {
		console.log('delete item:' + item)
		this.item_to_delete = item
		this.show_delete_dialog = true
	  },
	  close_delete()
	  {
		this.show_delete_dialog = false;
	  },
	  async delete_item_confirm()
	  {
		let self = this
		var response = await axios.delete(self.api_prefix + '/save_database',
		{ 
			data: 
			{
          		'id': self.item_to_delete.id
			}
		});
        if(response.data!=null && response.data.status==true)
        {
			//refresh the list
			await self.get_databases()
		}
		this.show_delete_dialog = false;
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
