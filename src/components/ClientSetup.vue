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
			<v-tabs
			v-model="selected_tab"
			grow
			>
			<v-tab key='web'>
				Web (Javascript)
			</v-tab>
			</v-tabs>
			<v-tabs-items v-model="selected_tab">
			<v-tab-item key='web'>
				<iframe src='https://docs.summation.app/web-client-api/initialization' style='width: 100%'></iframe>
			</v-tab-item>
			</v-tabs-items>
		</div>
  </section>
</template>

<script>
const axios = require('axios').default;

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

	},
	async created() 
	{
		
	}
};
</script>
