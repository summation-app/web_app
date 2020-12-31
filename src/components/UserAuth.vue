<template>
  <section>
	<h2>How do you Authenticate Users?</h2> 
	<v-container>
		<v-row v-if="selected_auth_method==null">
			<v-col>
				<v-card
					class="mx-auto"
					max-width="344"
					outlined
				>
				<v-card-title>JSON Web Tokens (JWT)</v-card-title>
				<v-card-text>Including Firebase, Auth0, Cognito, & Okta</v-card-text>
				<v-card-actions>
					<v-btn
						outlined
						rounded
						text
						@click="selected_auth_method='jwt'"
					>
						Select
					</v-btn>
					</v-card-actions>
				</v-card>
			</v-col>
			<v-col>
				<v-card
					class="mx-auto"
					max-width="344"
					outlined
				>
				<v-card-title>Sessions</v-card-title>
				<v-card-text></v-card-text>
				<v-card-actions>
					<v-btn
						outlined
						rounded
						text
						@click="selected_auth_method='session'"
					>
						Select
					</v-btn>
					</v-card-actions>
				</v-card>
			</v-col>
			<v-col>
				<v-card
					class="mx-auto"
					max-width="344"
					outlined
				>
				<v-card-title>Not Sure?</v-card-title>
				<v-card-text></v-card-text>
				<v-card-actions>
					<v-btn
						outlined
						rounded
						text
						@click="selected_auth_method='not_sure'"
					>
						Click Here
					</v-btn>
					</v-card-actions>
				</v-card>
			</v-col>
		</v-row>
		<v-row v-if="selected_auth_method=='jwt'">
			<v-col>
				<v-card
					class="mx-auto"
					max-width="344"
					outlined
				>
				<v-card-title>Generic JWT</v-card-title>
				<v-card-text></v-card-text>
				<v-card-actions>
					<v-btn
						outlined
						rounded
						text
						@click="selected_jwt_method='generic'"
					>
						Select
					</v-btn>
					</v-card-actions>
				</v-card>
			</v-col>
			<v-col>
				<v-card
					class="mx-auto"
					max-width="344"
					outlined
				>
				<v-card-title>Firebase</v-card-title>
				<v-card-text></v-card-text>
				<v-card-actions>
					<v-btn
						outlined
						rounded
						text
						@click="selected_jwt_method='firebase'"
					>
						Select
					</v-btn>
					</v-card-actions>
				</v-card>
			</v-col>
			<v-col>
				<v-card
					class="mx-auto"
					max-width="344"
					outlined
				>
				<v-card-title>AWS Cognito</v-card-title>
				<v-card-text></v-card-text>
				<v-card-actions>
					<v-btn
						outlined
						rounded
						text
						@click="selected_jwt_method='cognito'"
					>
						Select
					</v-btn>
					</v-card-actions>
				</v-card>
			</v-col>
		</v-row>
		<v-row v-if="selected_auth_method=='jwt'">
			<v-col>
				<v-card
					class="mx-auto"
					max-width="344"
					outlined
				>
				<v-card-title>Auth0</v-card-title>
				<v-card-text></v-card-text>
				<v-card-actions>
					<v-btn
						outlined
						rounded
						text
						@click="selected_jwt_method='auth0'"
					>
						Click Here
					</v-btn>
					</v-card-actions>
				</v-card>
			</v-col>
			<v-col>
				<v-card
					class="mx-auto"
					max-width="344"
					outlined
				>
				<v-card-title>Okta</v-card-title>
				<v-card-text></v-card-text>
				<v-card-actions>
					<v-btn
						outlined
						rounded
						text
						@click="selected_jwt_method='okta'"
					>
						Click Here
					</v-btn>
					</v-card-actions>
				</v-card>
			</v-col>
		</v-row>
		<v-row v-if="selected_jwt_method=='firebase'">
			You're all set!
		</v-row>
		<v-row v-if="selected_jwt_method=='cognito'">
			<v-text-field
			v-model="jwt_parameters.region"
			:counter="256"
			label="Region"
			required>
			</v-text-field>
			<v-text-field
			v-model="jwt_parameters.user_pool_id"
			:counter="256"
			label="User Pool ID"
			required>
			</v-text-field>
			<v-text-field
			v-model="jwt_parameters.client_id"
			:counter="256"
			label="Client ID"
			required>
			</v-text-field>
		</v-row>
		<v-row v-if="selected_jwt_method=='auth0'">
			<v-text-field
			v-model="jwt_parameters.domain"
			:counter="256"
			label="Domain"
			required>
			</v-text-field>
			<v-text-field
			v-model="jwt_parameters.client_id"
			:counter="256"
			label="Client ID"
			required>
			</v-text-field>
		</v-row>
		<v-row v-if="selected_jwt_method=='okta'">
			<v-text-field
			v-model="jwt_parameters.domain"
			:counter="256"
			label="Domain"
			required>
			</v-text-field>
			<v-text-field
			v-model="jwt_parameters.client_id"
			:counter="256"
			label="Client ID"
			required>
			</v-text-field>
		</v-row>
		<!--<v-expansion-panels v-model="selected_panel">
			<v-expansion-panel key='role_search_path'>
				<v-expansion-panel-header>
					(Optional) Roles
				</v-expansion-panel-header>
				<v-expansion-panel-content>
					<v-textarea
					name="role_search_path"
					label="Role Search Path"
					v-model="role_search_path"
					hint="Path to the user role in the JSON web token, such as claims['role'], etc.  Any valid Python expression from the claims dictionary.'"
					></v-textarea>			
				</v-expansion-panel-content>
			</v-expansion-panel>
        </v-expansion-panels>-->
		<br/>
		<v-btn color="primary" @click="save_auth_method" :loading="pending_submit">Save</v-btn>
	</v-container>
  </section>
</template>

<script>

export default {
	props: ['user','token','gw'],
	data() {
		return {
			pending_submit: false,
			selected_auth_method: null,
			selected_jwt_method: null,
			role_search_path: null,
			jwt_parameters: {},
			selected_panel: null,
			record_id: null
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
	  async get_auth_method()
	  {
		try
		{
			this.pending_submit = true
			let self = this;
			var response = await axios.get(self.api_prefix + '/auth_method',
			{
				'token': self.token
			})
			if(response.data!=null)
			{
				this.selected_auth_method = response.data.selected_auth_method;
				this.selected_jwt_method = response.data.selected_jwt_method;
				this.jwt_parameters = response.data.jwt_parameters;
				this.role_search_path = response.data.role_search_path;
			}
			this.pending_submit = false
		}
		catch (error)
		{
		  console.error(error);
		}
	  },
	  async save_auth_method()
	  {
		try
		{
			this.pending_submit = true
			let self = this;
			var all_values = {'selected_auth_method': this.selected_auth_method, 'selected_jwt_method': this.selected_jwt_method, 'jwt_parameters': this.jwt_parameters, 'role_search_path': this.role_search_path}
			var response = await axios.post(self.api_prefix + '/auth_method',
			{
				'token': self.token,
				'values': all_values
			})
			if(response.data!=null)
			{

			}
			this.pending_submit = false
			this.$emit('saved')
		}
		catch (error)
		{
		  console.error(error);
		}
	  },
	},
	components: {
	  
	},
	async created() 
	{
		await this.get_auth_method();
	}
};
</script>
