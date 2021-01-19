<template>
  <section>
    <v-text-field
    v-model="search"
    append-icon="mdi-magnify"
    label="Search"
    single-line
    hide-details
    ></v-text-field>
    <v-data-table
    :headers="headers"
    :items="rows"
    :items-per-page="10"
    :loading="table_loading"
    :search="search"
    :show-expand="show_expand"
    class="elevation-1"
    >
    <template v-slot:item.create_permission="{ item }">
      <v-simple-checkbox
        v-model="item.create_permission"
      ></v-simple-checkbox>
    </template>
    <template v-slot:item.read_permission="{ item }">
      <v-simple-checkbox
        v-model="item.read_permission"
      ></v-simple-checkbox>
    </template>
    <template v-slot:item.update_permission="{ item }">
      <v-simple-checkbox
        v-model="item.update_permission"
      ></v-simple-checkbox>
    </template>
    <template v-slot:item.delete_permission="{ item }">
      <v-simple-checkbox
        v-model="item.delete_permission"
      ></v-simple-checkbox>
    </template>
    <template v-slot:expanded-item="{ headers, item: child_item }">
      <td :colspan="headers.length">
      <v-data-table
      :headers="table_headers"
      :items="child_item.table_data"
      :items-per-page="10"
      class="elevation-1"
      >
          <template v-slot:item.create_permission="{ item }">
            <v-simple-checkbox
              v-model="item.create_permission"
            ></v-simple-checkbox>
          </template>
          <template v-slot:item.read_permission="{ item }">
            <v-simple-checkbox
              v-model="item.read_permission"
            ></v-simple-checkbox>
          </template>
          <template v-slot:item.update_permission="{ item }">
            <v-simple-checkbox
              v-model="item.update_permission"
            ></v-simple-checkbox>
          </template>
          <template v-slot:item.delete_permission="{ item }">
            <v-simple-checkbox
              v-model="item.delete_permission"
            ></v-simple-checkbox>
          </template>
      </v-data-table>
      </td>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="$emit('edit_item', item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="$emit('delete_item', item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:item.enabled="{ item }">
      <v-switch
      v-model="item.enabled"
      @change="$emit('enable_changed', item)"
      :loading="item.loading"
      ></v-switch>
    </template>
    <template v-slot:item.gateway_token_production="{ item }">
      <span @click="$emit('display_gateway_tokens', item)">Click to Show</span>
    </template>
    <template v-slot:item.gateway_token_development="{ item }">
      <span @click="$emit('display_gateway_tokens', item)">Click to Show</span>
    </template>
    </v-data-table>
  </section>
</template>

<script>
export default {
	props: ['user','token','headers','rows','table_loading','show_expand','table_headers','show_toggle'],
	data() {
		return {
          pending_submit: false,
          url: null,
          port: 0,
          username: null,
          password: null,
          name: null,
          database_name: null,
          schema: null,
          search: '',
		};
	},
	mounted: function() 
    {
      
    },
	watch: {
		
	},
  computed: {
  
  },
	methods: {
      
	},
	created: function()
	{

	}
};
</script>
