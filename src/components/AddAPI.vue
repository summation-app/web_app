<template>
  <section>
	<h2>Add a 3rd Party API</h2> 
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
							v-model="basic_auth.username"
							label="Username"
							required
							outlined
							></v-text-field>
							<v-text-field
							v-model="basic_auth.password_production"
							label="Password (Production)"
							outlined
							></v-text-field>
							<v-text-field
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
							v-model="bearer_token.development"
							label="Bearer Token (Development - Optional)"
							outlined
							></v-text-field>
						</div>
					</v-col>
				</v-row>
			</v-container>
		</v-row>
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
			pending_submit: false,
			adding_library_api: false,
			library_api_name: null,
			method: null,
			api_library: [
				{'name': 'stripe', 'logo': "stripe.png"},
				{'name': 'twilio', 'logo': "twilio.png"},
				{'name': 'mailchimp', 'logo': "mailchimp.png"},
				{'name': 'shopify', 'logo': "shopify.png"},
				{'name': 'youtube', 'logo': "youtube.png"},
				{'name': 'google_sheets', 'logo': "google_sheets.png"},
				{'name': 'airtable', 'logo': "airtable.png"},
				{'name': 'slack', 'logo': "slack.png"},
			],
			api_library_auth_methods: {
				'stripe': 'API Key in Headers',
				'twilio': null,
				'mailchimp': null,
				'shopify': null,
				'youtube': null,
				'google_sheets': null,
				'airtable': null,
				'slack': null
			},
			methods: ['GET','POST','DELETE','PUT','PATCH'],
			auth_method: null,
			auth_methods: ['API Key in Headers','API Key in URL parameters','Basic Auth','Bearer Token'],
			url: null,
			production_key: null,
			development_key: null,
			bearer_token: {'production': null, 'development': null},
			basic_auth: {'username': null, 'password_production': null, 'password_development': null},
			body: null,
			header_key: null,
			header_remove_index: null
		};
	},
	mounted: function() 
	{
		
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
	  add_library_api(name)
	  {
		  console.log(name)
		var api_auth_method = this.api_library_auth_methods[name]
		if(api_auth_method!=null)
		{
			this.library_api_name = name;
			this.adding_library_api = true;
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

		var params = {
		  'url': self.url,
		  //'body': this.body,
		  'header_key': self.header_key,
		  'production_key': self.production_key,
		  'development_key': self.development_key,
		  'authentication': {'auth_method': self.auth_method},
		  'bearer_token': self.bearer_token,
		  'basic_auth': self.basic_auth,
		  'method': self.method
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