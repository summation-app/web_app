<template>
  <section>
	<h2>Connect your App</h2>
		<v-text-field
			v-model="app_name"
			:counter="256"
			label="App Name"
			required>
		</v-text-field>
		<v-btn color="primary" @click="generate_gateway_keys()" :loading="pending_submit">Generate Keys</v-btn>
		<div v-if="show_instructions">
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
				<ol>
					<li>Install the node package by running this command from your terminal:
					<vue-code-highlight language="javascript">
					<pre>
					npm install --save summation_web_client
					</pre>
					</vue-code-highlight>
					</li>
					<li>Add this import to your JavaScript code:
					<vue-code-highlight language="javascript">
					<pre>
					import Summation from 'summation_web_client';
					</pre>
					</vue-code-highlight>
					</li>
					<li>Initialize the gateway:
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
					</li>
					<li>Get your data by running a query:
					<vue-code-highlight language="javascript">
					<pre>
					results = gw.query("SELECT * FROM table WHERE id=:id", {id: 4}, "prod"))
					</pre>
					</vue-code-highlight>
					<li>
				</ol>
			</v-tab-item>
			<v-tab-item key='ios'>
				<ol>
					<li>Install the library:
						<vue-code-highlight language="javascript">
					<pre>Cocoapods: pod 'Summation-iOS-Client'
						</pre>
						</vue-code-highlight>
					</li>
					<li>Import the library into your app:
						<vue-code-highlight language="">
							<pre>
							import Summation_iOS_Client
							</pre>
							</vue-code-highlight>
					</li>
					<li>Initialize the gateway:
						<vue-code-highlight language="javascript">
					<pre>
						let options = SummationOptions(gatewayUrl: gatewayUrl, token: token,
                                       gatewayToken: gateway_token, defaultDatabase: defaultDatabase)
        				summationClient.setOptions(options)
						</pre>
						</vue-code-highlight>
						</li>
						<li>
							Get your data by running a query:
        			<vue-code-highlight>
						<pre>
							results = summationClient.db(.query(sql: "SELECT * FROM queries WHERE id=:id", parameters: ["id": 1], databaseName: defaultDatabase))
							</pre>
							</vue-code-highlight>
							</li>
				</ol>
			</v-tab-item>
			<v-tab-item key='android'>
				<ol>
					<li>
						Install the library: 
						<vue-code-highlight language="javascript">
					<pre>
						Gradle: implementation("app.summation.android:android-client:1.0")
						</pre>
						</vue-code-highlight>
					</li>
					<li>
						Initialize the gateway:
						<vue-code-highlight language="javascript">
						<pre>val client = Client(
						gatewayUrl = "<your gateway url>",
						token = "<your token>",
						gatewayToken = "<your gateway token>",
						defaultDatabase = "<your database name>",
					)</pre></vue-code-highlight>
					</li>
					<li>
						Get your data by running a query:
					<vue-code-highlight language="javascript">
					<pre>
					val params = HashMap<String, Any>()
					params.put("id", 1)
					val response = client.query("SELECT * FROM queries WHERE id=:id", params)
					</pre>
					</vue-code-highlight>
					</li>
				</ol>
			</v-tab-item>
			</v-tabs-items>
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
		  selected_tab: 'web',
		  selected_panel: ['1'],
		  show_instructions: false
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
	  async generate_gateway_keys()
	  {
		
		this.pending_submit = true;

		var response = await axios.post(process.env.VUE_APP_API_PREFIX + '/generate_gateway_tokens_for_new_app',
		{
			'token': localStorage.getItem('token'),
			'app_name': this.app_name
		});
		this.dev_key = response.data.dev_key
		this.prod_key = response.data.prod_key
		
		this.pending_submit = false;
		this.show_instructions = true;
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
