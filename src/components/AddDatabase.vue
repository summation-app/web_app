<template>
  <section>
	<h2>Connect to a Database</h2>
    <v-alert
      v-if="show_alert"
      :type="alert_type"
    >
      {{ alert_text }}
      <a v-if="alert_type=='error'" href="https://docs.summation.app/quick-start/adding-a-database">Get Help</a>
    </v-alert>
    <v-select v-model="database_type" :items="database_types" label="Database Type"></v-select>
    <v-text-field
      v-model="url"
      label="URL"
      required
      outlined
    ></v-text-field>
    <v-text-field
      v-model="port"
      label="Port"
      type="number"
      required
      outlined
    ></v-text-field>
    <v-text-field
      v-model="username"
      label="Username"
      required
      outlined
    ></v-text-field>
    <v-text-field
      v-model="password"
      label="Password"
      required
      outlined
    ></v-text-field>
    <v-text-field
      v-model="database_name"
      label="Database Name"
      required
      outlined
    ></v-text-field>
    <v-text-field
      v-model="name"
      label="a name for this connection"
      outlined
    ></v-text-field>
    <br/>
    <v-switch
			v-if="existing_apps"
			v-model="enable_data_source_for_all_existing_apps"
			label="Enable this database for all your existing apps in Summation"
    ></v-switch>
    <br/>
    <v-btn color="primary" @click="save_database" :loading="pending_submit">Save</v-btn>
    <br/>
    <br/>

  </section>
</template>

<script>
const axios = require('axios').default;

export default {
	props: ['user','token','gw','item'],
	data() {
		return {
          api_prefix: process.env.VUE_APP_API_PREFIX,
          pending_submit: false,
          show_alert: false,
          alert_type: 'success',
          alert_text: null,
          database_type: null,
          database_types: [
            {'text': 'MySQL', 'value': 'mysql'},
            {'text': 'PostgreSQL', 'value': 'postgresql'},
            {'text': 'Oracle', 'value': 'oracle'},
            {'text': 'SQL Server', 'value': 'sql_server'},
            {'text': 'SQLite', 'value': 'sqlite'},
            {'text': 'MariaDB', 'value': 'mariadb'},
            {'text': 'CockroachDB', 'value': 'cockroachdb'},
            {'text': 'Redshift', 'value': 'redshift'},
            {'text': 'Vertica', 'value': 'vertica'},
            {'text': 'BigQuery', 'value': 'bigquery'},
            {'text': 'Snowflake', 'value': 'snowflake'},
            {'text': 'DB/2', 'value': 'db2'},
            {'text': 'TimescaleDB', 'value': 'timescaledb'},
            {'text': 'SAP HANA', 'value': 'sap_hana'}],
          url: null,
          port: 0,
          username: null,
          password: null,
          name: null,
          database_name: null,
          schema: null,
          enable_data_source_for_all_existing_apps: true,
          existing_apps: false
		};
	},
	mounted: function() 
	{
		this.get_apps()
	},
	watch: {
    item: function(val)
    {
      if(val!=null)
      {
        this.copy_item_values()
      }
    }
	},
	computed: {
		
	},
	methods: {
    	async get_apps()
      {
        var response = await axios.get(this.api_prefix + '/apps')
        if(response.data!=null && response.data.length> 0)
        {
          this.existing_apps = true;
        }
      },
      copy_item_values()
      {
        //we're editing an existing connection
        this.database_type = this.item.engine
        this.url = this.item.url
        this.port = this.item.port
        this.username = this.item.username
        this.password = this.item.password
        this.database_name = this.item.database_name
        this.schema = this.item.schema
        this.name = this.item.name
      },
      async save_database()
      {
        this.pending_submit = true
        let self = this;

        var params = {
          'engine': this.database_type,
          'url': this.url,
          'port': this.port,
          'username': this.username,
          'password': this.password,
          'database_name': this.database_name,
          'schema': this.schema,
          'name': this.name,
          'enable_data_source_for_all_existing_apps': self.enable_data_source_for_all_existing_apps,
        };

        if(this.item==null)
        {
          //saving a new database
          var response = await axios.post(process.env.VUE_APP_API_PREFIX + '/save_database', params);
        }
        else
        {
          //editing an existing database
          params.id = self.item.id;
          var response = await axios.patch(process.env.VUE_APP_API_PREFIX + '/save_database', params);
        }
        console.log(response);
        if(response.data!=null)
        {
          if(response.data.status==true)
          {
            self.alert_text = "We were able to connect to your database!"
            self.alert_type = 'success'
            self.show_alert = true;
          }
          else
          {
            self.alert_text = "We were unable to connect to your database - please check your credentials or click here for help."
            self.alert_type = 'error'
            self.show_alert = true;
          }
        }
        this.pending_submit = false
        this.$emit('saved')
      }
	},
	async created() 
	{
    if(this.item!=null)
    {
      this.copy_item_values()
    }
	}
};
</script>
