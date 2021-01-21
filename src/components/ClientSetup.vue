<template>
  <section>
	<h2>Connect your App</h2>
		<v-text-field
			v-model="app_name"
			:counter="256"
			label="App Name"
			required>
		</v-text-field>
		<v-switch
			v-model="enable_all_data_sources_for_app"
			label="Enable all existing APIs/databases for this app"
		></v-switch>
		<br/>
		<v-btn color="primary" @click="generate_gateway_keys()" :loading="pending_submit">Generate Client Tokens</v-btn>
		<br/>
		<br/>
		<div v-if="show_instructions">
			<v-text-field v-model="dev_key" readonly label="Development Key"></v-text-field>
			<v-text-field v-model="prod_key" readonly label="Production Key"></v-text-field>
			<br/>
			<div>Please select a language to see the setup instructions:</div>
			<v-tabs
			v-model="selected_tab"
			grow
			>
			<v-tab key='web'>
				Web (Javascript)
			</v-tab>
			<v-tab key='ios'>
				iOS (Swift)
			</v-tab>
			<v-tab key='android'>
				Android (Kotlin)
			</v-tab>
			</v-tabs>
			<v-tabs-items v-model="selected_tab">
			<v-tab-item key='web'>
				1.  Install the node package by running this command from your terminal:
				<vue-code-highlight language="javascript">
					<pre>npm install --save summation_web_client</pre>
				</vue-code-highlight>
				<br/>
				<br/>
				2.  Add this import to your JavaScript code:
				<vue-code-highlight language="javascript">
					<pre>import Summation from 'summation_web_client';</pre>
				</vue-code-highlight>
				<br/>
				<br/>
				3.  Initialize the gateway:
				<vue-code-highlight language="javascript">
<pre>
const gw = new Summation({
gateway_url: YOUR_GATEWAY_URL,
token: USER_TOKEN,
gateway_token: GATEWAY_TOKEN,
default_database: "YOUR_DATABASE_NAME"
});
</pre>
				</vue-code-highlight>
				<br/>
				<br/>
				4.  Get your data by running a query:
				<vue-code-highlight language="javascript">
					<pre>results = gw.query("SELECT * FROM table WHERE id=:id", {id: 4}, "prod"))</pre>
				</vue-code-highlight>
			</v-tab-item>
			<v-tab-item key='ios'>
				1.  Install the library:
				<vue-code-highlight language="javascript">
					<pre>Cocoapods: pod 'Summation-iOS-Client'</pre>
				</vue-code-highlight>
				<br/>
				<br/>
				2.  Import the library into your app:
				<vue-code-highlight language="">
					<pre>import Summation_iOS_Client</pre>
				</vue-code-highlight>
				<br/>
				<br/>				
				3.  Initialize the gateway:
				<vue-code-highlight language="javascript">
<pre>
let options = SummationOptions(gatewayUrl: gatewayUrl, token: token, gatewayToken: gateway_token, defaultDatabase: defaultDatabase)
summationClient.setOptions(options)
</pre>
				</vue-code-highlight>
				<br/>
				<br/>
				4.  Get your data by running a query:
				<vue-code-highlight>
					<pre>results = summationClient.db(.query(sql: "SELECT * FROM queries WHERE id=:id", parameters: ["id": 1], databaseName: defaultDatabase))</pre>
				</vue-code-highlight>
			</v-tab-item>
			<v-tab-item key='android'>
				1.  Install the library: 
				<vue-code-highlight language="javascript">
					<pre>Gradle: implementation("app.summation.android:android-client:1.0")</pre>
						</vue-code-highlight>
				<br/>
				<br/>
				2.  Initialize the gateway:
				<vue-code-highlight language="javascript">
<pre>
val client = Client(
	gatewayUrl = "your gateway url",
	token = "your token",
	gatewayToken = "your gateway token",
	defaultDatabase = "your database name",
)
</pre>
				</vue-code-highlight>
				<br/>
				<br/>
				3.  Get your data by running a query:
				<vue-code-highlight language="javascript">
					<pre>val response = client.query("SELECT * FROM queries WHERE id=:id", params)//params are a HashMap you pass in</pre>
				</vue-code-highlight>
			</v-tab-item>
			</v-tabs-items>
			<br/>
			<br/>
			<v-alert
            dense
            type="warning"
			outlined
          	>
          	Need help?  See the <a href='https://docs.summation.app'>full documentation</a>, or ask for help on the <a href='https://discord.gg/mkp6jxu9r2'>chat group</a>.
          </v-alert>
		</div>
  </section>
</template>

<script>
const axios = require('axios').default;
import { component as VueCodeHighlight } from 'vue-code-highlight';

export default {
	props: ['user','token','gw'],
	data() {
		return {
		  valid: false,
		  pending_submit: false,
		  app_name: null,
		  selected_tab: 0,
		  selected_panel: ['1'],
		  enable_all_data_sources_for_app: true,
		  dev_key: null,
		  prod_key: null,
		  show_instructions: false
		};
	},
	mounted: function() 
	{
	  	if(process.env.VUE_APP_ENV=='cloud')
		{
			window.analytics.page('Client Setup');
		}
	},
	watch: {

	},
	computed: {
	},
	methods: {
	  async generate_gateway_keys()
	  {
		
		this.pending_submit = true;

		var response = await axios.post(process.env.VUE_APP_API_PREFIX + '/generate_gateway_tokens_for_new_app',
		{
			'token': localStorage.getItem('token'),
			'app_name': this.app_name,
			'enable_all_data_sources_for_app': this.enable_all_data_sources_for_app
		});
		this.dev_key = response.data.dev_key
		this.prod_key = response.data.prod_key
		this.app_id = response.data.app_id
		
		this.pending_submit = false;
		this.show_instructions = true;

		this.$emit('saved', this.app_id)
	  }
	},
	components: {
		VueCodeHighlight,
	},
	async created() 
	{
		
	}
};
</script>
