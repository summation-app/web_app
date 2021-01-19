<template>
  <section>
	<h2>Add a 3rd Party API</h2>
	<v-alert
      v-if="show_alert"
      :type="alert_type"
    >
      {{ alert_text }}
    </v-alert>
	<v-container>
		<v-row>
			<h3>Add an API from our Library</h3>
			<br/>
			<v-container class='scrollable'>
				<v-row>
					<v-col
					v-for="api in api_library"
					:key="api.name"
					class="d-flex child-flex"
					cols="4"
					>
						<v-img
						:src="get_image_url(api.logo)"
						height="100px"
						width="200px"
						class="logo"
						contain
						@click="add_library_api(api.name)"
						>
						</v-img>
					</v-col>
				</v-row>
			</v-container>
		</v-row>
		<v-row v-if="adding_library_api">
			Please enter your {{ library_api_name }} credentials below:
			<v-container>
				<v-row>
					<v-text-field
					v-model="production_key"
					label="Production Key"
					required
					outlined
					></v-text-field>
				</v-row>
				<v-row>
					<v-text-field
					v-model="development_key"
					label="Development Key (Optional)"
					outlined
					></v-text-field>
				</v-row>
			</v-container>
		</v-row>
		<v-row>
			<h3>Or add a custom API</h3>
			<v-container>
				<v-row>
					<v-col>
						<v-text-field
						v-if="show_url"
						v-model="url"
						label="URL prefix (like https://api.stripe.com)"
						required
						outlined
						></v-text-field>
						<v-select v-model="auth_method" :items="auth_methods" label="Authentication Method"></v-select>
						<div v-if="auth_method=='API Key in Headers'">
							Enter your headers below, and summation will include the correct (development/production) key into the API request when it is proxied.
							See examples <a href='https://docs.summation.app/quick-start/adding-an-api#keys'>here</a>.
							<br/>
							<v-container>
								<v-text-field
								v-model="header_key"
								label="Header Key"
								required
								outlined
								></v-text-field>
								<v-text-field
								v-model="production_key"
								label="Production Key"
								required
								outlined
								></v-text-field>
								<v-text-field
								v-if="show_development_api_key"
								v-model="development_key"
								label="Development Key (Optional)"
								outlined
								></v-text-field>
							</v-container>
						</div>
						<div v-if="auth_method=='API Key in URL parameters'">
							Replace your actual API key with the text '_KEY_' in the URL above, and summation will include the correct (development/production) key into the API request when it is proxied.
							See examples <a href='https://docs.summation.app/quick-start/adding-an-api#keys'>here</a>.
						</div>
						<div v-if="auth_method=='Basic Auth'">
							Enter your username and password below, replacing the reference to your API key with the text '_KEY_', and summation will include the correct (development/production) key into the API request when it is proxied.
							See examples <a href='https://docs.summation.app/quick-start/adding-an-api#basic-auth'>here</a>.
							<br/>
							<v-text-field
							v-if="show_basic_auth_username"
							v-model="basic_auth.username"
							label="basic_auth_username_title"
							required
							outlined
							></v-text-field>
							<v-text-field
							v-if="show_basic_auth_password_production"
							v-model="basic_auth.password_production"
							label="basic_auth_password_title"
							outlined
							></v-text-field>
							<v-text-field
							v-if="show_basic_auth_password_development"
							v-model="basic_auth.password_development"
							label="Password (Development - Optional)"
							outlined
							></v-text-field>
						</div>
						<div v-if="auth_method=='Bearer Token'">
							Enter your bearer token below, and summation will include the correct (development/production) key into the API request when it is proxied.
							See examples <a href='https://docs.summation.app/quick-start/adding-an-api#bearer-tokens'>here</a>.
							<br/>
							<v-text-field
							v-model="bearer_token.production"
							label="Bearer Token (Production)"
							required
							outlined
							></v-text-field>
							<v-text-field
							v-if="show_development_api_key"
							v-model="bearer_token.development"
							label="Bearer Token (Development - Optional)"
							outlined
							></v-text-field>
						</div>
					</v-col>
				</v-row>
			</v-container>
		</v-row>
		<v-switch
			v-if="existing_apps"
			v-model="enable_data_source_for_all_existing_apps"
			label="Enable this API for all your existing apps in Summation"
      	></v-switch>
		<v-btn color="primary" @click="save_api" :loading="pending_submit">Save</v-btn>
	</v-container>
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
			adding_library_api: false,
			library_api_name: null,
			method: null,
			api_library: [
				{'name': 'stripe', 'logo': "stripe.png"},
				{'name': 'twilio', 'logo': "twilio.png"},
				{'name': 'mailchimp', 'logo': "mailchimp.png"},
				{'name': 'shopify', 'logo': "shopify.png"},
				{'name': 'airtable', 'logo': "airtable.png"},
				{'name': 'zendesk', 'logo': "zendesk.png"},
				{'name': 'sendgrid', 'logo': "sendgrid.png"},
				{'name': 'easypost', 'logo': "easypost.png"},
			],
			api_library_auth_methods: {
				'stripe': {'method': 'Basic Auth', 'url': 'https://api.stripe.com', 'require_username': true, 'require_password': false, 'username_title': 'API key', 'prompt_for_development_token': true},
				'twilio': {'method': 'Basic Auth', 'url': 'https://api.twilio.com', 'require_username': true, 'require_password': true, 'username_title': 'Account SID', 'password_title': 'Auth Token'},
				'mailchimp': {'method': 'Basic Auth', 'url': 'https://DC.api.mailchimp.com', 'require_username': false, 'require_password': true, 'password_title': 'API key', 'prompt_for_url': true},
				'shopify': {'method': 'API Key in Headers', 'url': 'https://STORE_NAME.myshopify.com', 'header_key': 'X-Shopify-Access-Token', 'prompt_for_url': true},
				'airtable': {'method': 'Bearer Token', 'url': 'https://api.airtable.com'},
				'zendesk': {'method': 'Basic Auth', 'url': 'https://SUBDOMAIN.zendesk.com/api', 'require_username': true, 'require_password': true, 'username_title': 'email address', 'prompt_for_development_token': false, 'append_to_username': '/token'},
				'sendgrid': {'method': 'Bearer Token', 'url': 'https://api.sendgrid.com'},
				'easypost': {'method': 'Basic Auth', 'url': 'https://api.easypost.com', 'require_username': true, 'require_password': false, 'username_title': 'API key', 'prompt_for_development_token': true},
			},
			methods: ['GET','POST','DELETE','PUT','PATCH'],
			auth_method: null,
			auth_methods: ['API Key in Headers','API Key in URL parameters','Basic Auth','Bearer Token'],
			url: null,
			production_key: null,
			development_key: null,
			show_url: true,
			show_development_api_key: false,
			show_basic_auth_username: true,
			show_basic_auth_password_production: true,
			show_basic_auth_password_development: false,
			enable_data_source_for_all_existing_apps: true,
			existing_apps: false,
			basic_auth_username_title: 'Username',
			basic_auth_password_title: 'Password',
			bearer_token: {'production': null, 'development': null},
			basic_auth: {'username': null, 'password_production': null, 'password_development': null},
			body: null,
			header_key: null,
			append_to_basic_auth_username: '',
			header_remove_index: null,
			show_alert: false,
			alert_type: 'success',
			alert_text: null,
		};
	},
	mounted: function() 
	{
		this.get_apps()
	},
	watch: {
		item: function(val)
		{
			if(item!=null)
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
	  add_library_api(name)
	  {
		var api_auth = this.api_library_auth_methods[name]
		if(api_auth!=null)
		{
			this.library_api_name = name;
			this.adding_library_api = true;
			this.auth_method = api_auth.method;
			this.show_url = false;
			if(this.auth_method=='Basic Auth')
			{
				this.show_basic_auth_username = false;
				this.show_basic_auth_password_production = false;
				this.show_basic_auth_password_development = false;
				if(api_auth.require_username==true)
				{
					this.show_basic_auth_username = true;
					if(api_auth.username_title!=undefined)
					{
						this.basic_auth_username_title = api_auth.username_title
					}
				}
				if(api_auth.require_password==true)
				{
					this.show_basic_auth_password_production = true;
					if(api_auth.password_title!=undefined)
					{
						this.basic_auth_password_title = api_auth.password_title
					}
				}
				if(api_auth.prompt_for_development_token==true)
				{
					this.show_basic_auth_password_development = true;
				}
			}
			else if(this.auth_method=='API Key in Headers')
			{
				this.header_key = api_auth.header_key;
				if(api_auth.prompt_for_development_token==true)
				{
					this.show_development_api_key = true;
				}
			}
			else if(this.auth_method=='Bearer Token')
			{
				if(api_auth.prompt_for_development_token==true)
				{
					this.show_development_api_key = true;
				}
			}
			this.url = api_auth.url;
			if (api_auth.prompt_for_url==true)
			{
				this.show_url = true
			}
			if(api_auth.append_to_username)
			{
				this.append_to_basic_auth_username = api_auth.data.append_to_username
			}
		}
	  },
	  get_image_url(pic)
	  {
		return require('../assets/images/' + pic)
	  },
	  copy_item_values()
      {
        //we're editing an existing connection
        this.method = this.item.method
        this.auth_method = this.item.auth_method
        this.url = this.item.url
        this.production_key = this.item.production_key
		this.development_key = this.item.development_key
      },
	  async save_api()
	  {
		this.pending_submit = true
		let self = this;

		if(self.append_to_basic_auth_username!='')
		{
			self.basic_auth.username = self.basic_auth.username + self.append_to_basic_auth_username
		}

		var params = {
		  'url': self.url,
		  //'body': this.body,
		  'header_key': self.header_key,
		  'production_key': self.production_key,
		  'development_key': self.development_key,
		  'authentication': {'auth_method': self.auth_method},
		  'bearer_token': self.bearer_token,
		  'basic_auth': self.basic_auth,
		  'method': self.method,
		  'enable_data_source_for_all_existing_apps': self.enable_data_source_for_all_existing_apps,
        };

		if(this.item==null)
        {
          //saving a new API
          var response = await axios.post(process.env.VUE_APP_API_PREFIX + '/save_api', params);
        }
        else
        {
          //editing an existing API
          params.id = self.item.id;
          var response = await axios.patch(process.env.VUE_APP_API_PREFIX + '/save_api', params);
        }
		
		console.log(response);
		this.pending_submit = false
		this.$emit('saved')

		if(response.data.status==true)
		{
			self.alert_text = "Your API was saved succesfully."
			self.alert_type = 'success'
			self.show_alert = true;
		}
		else
		{
			self.alert_text = "We were unable to add your API - please check the error logs, or reach out for help."
			self.alert_type = 'error'
			self.show_alert = true;
		}
	  },
	},
	components: {
	  
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

<style scoped>
.logo
{
	border-radius: 5%;
	cursor: pointer;
}
.scrollable
{
	height: 200px;
	overflow-y: scroll;
}
</style>