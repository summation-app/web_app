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
    </v-tabs-items>
  </section>
</template>

<script>
const axios = require('axios').default;
import DataTable from "@/components/DataTable.vue";

export default {
  props: ['user', 'token','gw','api_prefix'],
  data: function () {
  return {
    selected_tab: null,
    selected_app: null,
    selected_role: null,
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
    }
  },
  components: {
    'data_table': DataTable,
  },
  created: function()
  {
    
  },
  mounted: function()
  {
    let self = this
    //window.analytics.page('Settings')
    var tab = this.$route.params.tab;
    if(tab!=null)
    {
      if(tab=="access_controls")
      {
        this.selected_tab = 0;
      }
      else if(tab=="integrations")
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
    async save_integrations()
    {

    },
    async get_logging()
    {
      let self = this
      var response = await this.gw.read("Settings", {'key': 'logging_config', 'organization_id': 0}, "summation")
      if (response!=null)
      {
        self.logging_credentials = response.value
      }

      var response = await this.gw.read("Settings", {'key': 'logging_vendor', 'organization_id': 0}, "summation")
      if (response!=null)
      {
        self.logging_vendor = response.value
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
    }
  }
}
</script>

<style scoped>
</style>
