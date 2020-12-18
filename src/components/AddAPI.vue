<template>
  <section>
	<h2>Add a 3rd Party API</h2> 
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
			<v-col>
				<v-icon size=250 style="margin: 0 auto; width: 100%; color: #1976d2">mdi-alternate_email</v-icon>
			</v-col>
		</v-row>
		<v-btn color="primary" @click="add_api" :loading="pending_submit">Save</v-btn>
	</v-container>
  </section>
</template>

<script>
const axios = require('axios').default;

export default {
	props: ['user','token','gw','selected_organization','selected_website_id'],
	data() {
		return {
			pending_submit: false,
			method: null,
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
		var result = this.gw.chain.addNumber(10, 20).multiplyNumber(10).divideNumber(10);
		console.log(result)
	},
	watch: {
		
	},
	computed: {
		
	},
	methods: {
	  async add_api()
	  {
		this.pending_submit = true
		let self = this;

		var response = await axios.post(process.env.VUE_APP_API_PREFIX + '/add_api',
        {
		  'url': self.url,
		  //'body': this.body,
		  'header_key': self.header_key,
		  'production_key': self.production_key,
		  'development_key': self.development_key,
		  'authentication': {'auth_method': self.auth_method},
		  'bearer_token': self.bearer_token,
		  'basic_auth': self.basic_auth
        });
		console.log(response);
		this.pending_submit = false
		this.$emit('saved')
	  },
	},
	components: {
	  
	},
	async created() 
	{

	}
};
</script>
