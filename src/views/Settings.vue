<template>
  <section>
    <v-tabs
      v-model="selected_tab"
      grow
    >
      <!--<v-tab key='access_controls'>
        Access Controls
      </v-tab>-->
      <v-tab key='integrations'>
        Integrations
      </v-tab>
      <v-tab key='apps'>
        Apps
      </v-tab>
      <!--<v-tab key='subscription_plan'>
        Subscription Plan
      </v-tab>-->
    </v-tabs>

    <v-tabs-items v-model="selected_tab">

      <!--<v-tab-item key='access_controls'>
        <h2>Role-Based Access Controls</h2>

        <v-select v-model="selected_app" :items="apps" item-text="name" item-value="id" label="Select an App"></v-select>
        <v-select v-if="display_roles" v-model="selected_role" :items="roles" label="Select a Role"></v-select>
        <v-expansion-panels v-model="selected_panel">
					<v-expansion-panel key='databases'>
						<v-expansion-panel-header>
							Databases
						</v-expansion-panel-header>
						<v-expansion-panel-content>
              <data_table :headers="database_headers" :table_headers="table_headers" :rows="database_rows" :table_loading="database_table_loading" :show_expand="true"></data_table>
						</v-expansion-panel-content>
					</v-expansion-panel>
          <v-expansion-panel key='apis'>
						<v-expansion-panel-header>
							APIs
						</v-expansion-panel-header>
						<v-expansion-panel-content>
              <data_table :headers="api_headers" :rows="api_rows" :table_loading="api_table_loading"></data_table>
						</v-expansion-panel-content>
					</v-expansion-panel>
        </v-expansion-panels>
        <br/>
        <v-btn type='submit' :loading="access_controls_savings" color='success' @click='save_access_controls'>Save</v-btn>
      </v-tab-item>-->
      <v-tab-item key='integrations'>
        <h2>Integrations & Automation</h2>
          <h3>Logs</h3>
          Send logs to your cloud/centralized logging platform:

          <v-select v-model="logging_vendor" :items="logging_vendors" label="Select your Logging Platform"></v-select>
          <div v-if="logging_vendor=='aws_cloudwatch'">
            Please enter your connection details below, and ensure that the log group exists in AWS.
            <br/>
            <v-container>
              <v-text-field
              v-model="logging_credentials.aws_cloudwatch.aws_access_key_id"
              label="AWS access key ID"
              required
              outlined
              ></v-text-field>
              <v-text-field
              v-model="logging_credentials.aws_cloudwatch.aws_secret_access_key"
              label="AWS secret access key"
              required
              outlined
              ></v-text-field>
              <v-text-field
              v-model="logging_credentials.aws_cloudwatch.log_group"
              label="Cloudwatch log group"
              required
              outlined
              ></v-text-field>
              <v-text-field
              v-model="logging_credentials.aws_cloudwatch.region"
              label="AWS region"
              outlined
              ></v-text-field>
            </v-container>
          </div>
          <div v-if="logging_vendor=='gcp_stackdriver'">
            Please enter your connection details below.
            <br/>
            <v-container>
              <v-text-field
              v-model="logging_credentials.gcp_stackdriver.project_id"
              label="Project ID"
              required
              outlined
              ></v-text-field>
              <v-textarea
              v-model="logging_credentials.gcp_stackdriver.credentials_json"
              label="JSON Credentials (Service Account)"
              value=""
              hint=""
            ></v-textarea>
            </v-container>
          </div>
          <div v-if="logging_vendor=='azure_monitor_logs'">
            Please enter your connection details below, and ensure that the log group exists in AWS.
            <br/>
            <v-container>
              <v-text-field
              v-model="logging_credentials.azure_monitor_logs.resource_id"
              label="Resource ID"
              required
              outlined
              ></v-text-field>
              <v-text-field
              v-model="logging_credentials.azure_monitor_logs.customer_id"
              label="Customer ID"
              required
              outlined
              ></v-text-field>
              <v-text-field
              v-model="logging_credentials.azure_monitor_logs.host"
              label="Host"
              required
              outlined
              ></v-text-field>
              <v-text-field
              v-model="logging_credentials.azure_monitor_logs.api_key"
              label="API key"
              required
              outlined
              ></v-text-field>
            </v-container>
          </div>
          <div v-if="logging_vendor=='splunk'">
            Please enter your connection details below, and ensure that the log group exists in AWS.
            <br/>
            <v-container>
              <v-text-field
              v-model="logging_credentials.splunk.url"
              label="URL"
              required
              outlined
              ></v-text-field>
              <v-text-field
              v-model="logging_credentials.splunk.api_key"
              label="API key"
              required
              outlined
              ></v-text-field>
            </v-container>
          </div>
          <div v-if="logging_vendor=='elasticsearch'">
            Please enter your connection details below, and ensure that the log group exists in AWS.
            <br/>
            <v-container>
              <v-text-field
              v-model="logging_credentials.elasticsearch.url"
              label="URL"
              required
              outlined
              ></v-text-field>
              <v-text-field
              v-model="logging_credentials.elasticsearch.username"
              label="username"
              required
              outlined
              ></v-text-field>
              <v-text-field
              v-model="logging_credentials.elasticsearch.password"
              label="password"
              required
              outlined
              ></v-text-field>
            </v-container>
          </div>
          <div v-if="logging_vendor=='datadog'">
            Please enter your connection details below, and ensure that the log group exists in AWS.
            <br/>
            <v-container>
              <v-text-field
              v-model="logging_credentials.datadog.api_key"
              label="API key"
              required
              outlined
              ></v-text-field>
            </v-container>
          </div>
          <div v-if="logging_vendor=='new_relic'">
            Please enter your connection details below, and ensure that the log group exists in AWS.
            <br/>
            <v-container>
              <v-text-field
              v-model="logging_credentials.new_relic.insert_key"
              label="Insert Key"
              required
              outlined
              ></v-text-field>
              <v-text-field
              v-model="logging_credentials.new_relic.license_key"
              label="License Key"
              required
              outlined
              ></v-text-field>
            </v-container>
          </div>
          <div v-if="logging_vendor=='kafka'">
            Please enter your connection details below, and ensure that the log group exists in AWS.
            <br/>
            <v-container>
              <v-text-field
              v-model="logging_credentials.kafka.url"
              label="Endpoint URL"
              required
              outlined
              ></v-text-field>
            </v-container>
          </div>
          <div v-if="logging_vendor=='http'">
            Please enter your connection details below, and ensure that the log group exists in AWS.
            <br/>
            <v-container>
              <v-text-field
              v-model="logging_credentials.http.url"
              label="URL"
              required
              outlined
              ></v-text-field>
            </v-container>
          </div>
        <v-btn type='submit' :loading="logging_loading" color='success' @click='save_logging'>Save</v-btn>
      </v-tab-item>
      <v-tab-item key='apps'>
        <h2>Apps</h2>
        <router-link to="/setup/2"><v-btn id='add_button' color='success'>Create New App</v-btn></router-link>
        <data_table :headers="apps_headers" :rows="apps_rows" :table_loading="table_loading" @enable_changed="enable_changed" @edit_item="edit_item" @delete_item="delete_item"></data_table>
        <v-dialog
          v-model="show_edit_dialog"
          max-width="500px"
        >
          <v-card>
            <v-card-title>
              <span class="headline">Edit Item</span>
            </v-card-title>

            <v-text-field
            v-model="edited_item.name"
            label="App name"
            required
            outlined
            ></v-text-field>

            <v-select
              v-model="edited_item.enabled_databases"
              :items="all_databases"
              label="Approved Databases this App can Access"
              multiple
              hint=""
              persistent-hint
            ></v-select>
            <v-select
              v-model="edited_item.enabled_apis"
              :items="all_apis"
              label="Approved APIs this App can Access"
              multiple
              hint=""
              persistent-hint
            ></v-select>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="close_item_editor"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                :loading="save_app_loading"
                @click="save_app"
              >
                Save
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
        <v-dialog v-model="show_gateway_tokens_dialog" max-width="500px">
          <v-card>
            <v-card-title class="headline">Gateway Tokens</v-card-title>
            <v-textarea
              name="development_token"
              label="Development Gateway Token"
              v-model="shown_gateway_token.gateway_token_development"
              readonly>
              </v-textarea>
              <br/>
              <v-textarea
              name="development_token"
              label="Production Gateway Token"
              v-model="shown_gateway_token.gateway_token_production"
              readonly>
              </v-textarea>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close_show_gateway_tokens">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-tab-item>
    </v-tabs-items>
  </section>
</template>

<script>
const axios = require('axios').default;
import DataTable from "@/components/DataTable.vue";

export default {
  props: ['user', 'token','gw'],
  data: function () {
  return {
    selected_tab: null,
    selected_app: null,
    selected_role: null,
    apps_headers: [],
    apps_rows: [],
    all_databases: [],
    all_apis: [],
    api_prefix: process.env.VUE_APP_API_PREFIX,
    logging_loading: false,
    logging_credentials: {
      'aws_cloudwatch': {
        'aws_secret_access_key': null, 
        'aws_access_key_id': null, 
        'log_group': null, 
        'region': 'us-west-2'
      }, 
      'gcp_stackdriver': {
        'project_id': null, 
        'credentials_json': null
      },
      'azure_monitor_logs': {
        'resource_id': null,
        'host': null,
        'api_key': null,
        'customer_id': null
      },
      'splunk': {
        'url': null,
        'api_key': null
      },
      'elasticsearch': {
        'url': null,
        'username': null,
        'password': null
      },
      'datadog': {
        'api_key': null
      },
      'new_relic': {
        'insert_key': null,
        'license_key': null
      },
      'kafka': {
        'url': null
      },
      'http': {
        'url': null
      }
    },
    logging_vendor: null,
    logging_vendors: [{'text': 'AWS CloudWatch', 'value': 'aws_cloudwatch'}, {'text': 'GCP StackDriver', 'value': 'gcp_stackdriver'}, {'text': 'Azure Monitor Logs', 'value': 'azure_monitor_logs'}, {'text': 'DataDog Logs', 'value': 'datadog'}, {'text': 'Splunk HEC', 'value': 'splunk'}, {'text': 'NewRelic Logs', 'value': 'new_relic'}, {'text': 'Elasticsearch', 'value': 'elasticsearch'}, {'text': 'Kafka', 'value': 'kafka'}, {'text': 'HTTP Webhook', 'value': 'http'}],
    apps: [],
    all_roles: [],
    database_rows: null,
    api_headers: [{'text': 'GET', 'value': 'get_permission'}, {'text': 'POST', 'value': 'post_permission'}, {'text': 'DELETE', 'value': 'delete_permission'}, {'text': 'PATCH', 'value': 'patch_permission'}],
    database_headers: [{'text': 'Database Name', 'value': 'database_name'}, {'text': 'Create', 'value': 'create_permission'}, {'text': 'Read', 'value': 'read_permission'}, {'text': 'Delete', 'value': 'delete_permission'}, {'text': 'Update', 'value': 'update_permission'}, {'text': '', 'value': 'data-table-expand' }],
    table_headers: [{'text': 'Table Name', 'value': 'table_name'}, {'text': 'Create', 'value': 'create_permission'}, {'text': 'Read', 'value': 'read_permission'}, {'text': 'Delete', 'value': 'delete_permission'}, {'text': 'Update', 'value': 'update_permission'}],
    api_rows: null,
    database_table_loading: false,
    api_table_loading: false,
    selected_panel: 'databases',
    show_alert: false,
    integrations_loading: false,
    access_controls_saving: false,
    all_apis: [],
    all_databases: [],
    show_edit_dialog: false,
		show_delete_dialog: false,
		item_to_delete: null,
    edited_item: {},
    save_app_loading: false,
    show_gateway_tokens_dialog: false,
    shown_gateway_token: {},
    }
  },
  components: {
    'data_table': DataTable,
  },
  mounted: function()
  {
    let self = this
    //window.analytics.page('Settings')
    var tab = this.$route.params.tab;
    if(tab!=null)
    {
      if(tab=="integrations")
      {
        this.selected_tab = 0;
      }
      else if(tab=="apps")
      {
        this.selected_tab = 1;
      }
    }
    this.get_logging()
  },
  computed: {
  },
  watch: {
  },
  methods: {
    async get_apps()
    {
      this.pending_submit = true
      this.table_loading = true
      this.apps_headers = []
      let self = this
      var response = await axios.get(self.api_prefix + '/apps')
      if(response.data!=null)
      {
        this.apps_rows = response.data;

        if(response.data.length > 0)
        {
          for (const [key, value] of Object.entries(response.data[0])) 
          {
            this.apps_headers.push({'text': key, 'value': key})
          }
          this.apps_headers.push({ text: 'Actions', value: 'actions', sortable: false });
        }
      }
		  this.table_loading = false
    },
    async save_app()
    {
      this.save_app_loading = true;
      let self = this;
      var response = await axios.post(this.api_prefix + '/apps',
      {
        'id': self.edited_item.id,
        'update_record': true,
        'name': self.edited_item.name,
        'enabled_databases': self.edited_item.enabled_databases,
        'enabled_apis': self.edited_item.enabled_apis
      });
      this.save_app_loading = false;
      if(response.data!=null && response.data==true)
      {
        this.close_item_editor()
      }
      await this.get_apps()
    },
    close_item_editor()
	  {
		this.show_edit_dialog = false
	  },
	  async edit_item(item)
	  {
      console.log('edit item:' + item)
      this.edited_item = item

      //get list of all databases & APIs
      var response = await axios.get(self.api_prefix + '/all_databases_apis')
      if(response.data!=null)
      {
        this.all_databases = response.data.databases;
        this.all_apis = response.data.apis;
      }

      this.show_edit_dialog = true
    },
    display_gateway_tokens(item)
	  {
      this.shown_gateway_token = item
      this.show_gateway_tokens_dialog = true;
    },
    close_show_gateway_tokens()
	  {
		  this.show_gateway_tokens_dialog = false
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
      var response = await axios.delete(self.api_prefix + '/apps',
      { 
        data: 
        {
          'id': self.item_to_delete.id
        }
      });
      if(response.data!=null && response.data.status==true)
      {
        //refresh the list
        await self.get_apps()
      }
      this.show_delete_dialog = false;
    },
    async save_integrations()
    {

    },
    async get_logging()
    {
      let self = this

      var response = await axios.post(self.api_prefix + '/logging',
      {
        'token': self.token
      })
      if(response.data!=null)
      {
        self.logging_credentials = response.data.logging_credentials;
        self.logging_vendor = response.data.logging_vendor;
      }
    },
    async save_logging()
    {
      this.logging_loading = true;
      let self = this;
      var response = await axios.post(this.api_prefix + '/save_logging',
      {
        'token': localStorage.getItem('token'),
        'destination': self.logging_vendor,
        'logging_config': self.logging_credentials
      });
      this.access_controls_saving = false;
    },
    async enable_changed(item)
      {
        //only enabling/disabling
        let self = this;
        var selected_row_index = -1;
        
        this.apps_rows.forEach(function (value, i) 
        {
            if(value.id==item.id)
          {
            selected_row_index = i
          }
        });
        if(selected_row_index!=-1)
        {
          this.$set(this.apps_rows[selected_row_index], 'loading', true)
        }

        var params = {
          'id': item.id,
          'enabled': item.enabled
        };

        var response = await axios.post(process.env.VUE_APP_API_PREFIX + '/apps', params);
        console.log(response);
        if(response.data!=null && response.data==true)
        {
          
        }
        if(selected_row_index!=-1)
        {
          this.$set(this.apps_rows[selected_row_index], 'loading', false)
        }
      },
  },
  async created() 
	{
		await this.get_apps()
	}
}
</script>

<style scoped>
#add_button
{
	float: right;
	margin: 10px;
}
</style>