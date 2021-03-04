<template>
  <section>
    <h2 class='centered'>Analytics</h2>
    <v-progress-circular
    v-if="loading_analytics"
    id="loading_spinner"
    indeterminate
    size=64
    color="primary"
    >
    </v-progress-circular>

    <v-alert v-if="displaying_demo_dashboard" type="info">
      You're viewing a demo dashboard.  Once you have live data, this will switch over automatically.
    </v-alert>

    <v-btn-toggle
     class='centered'
          v-model="duration"
          borderless
          rounded
        >
      <v-btn value=7>
        <span class="hidden-sm-and-down">Week</span>
      </v-btn>

      <v-btn value=30>
        <span class="hidden-sm-and-down">Month</span>
      </v-btn>

      <v-btn value=365>
        <span class="hidden-sm-and-down">Year</span>
      </v-btn>
    </v-btn-toggle>

    <div id='logs'>
      <div v-for="log in log_history" :key="log.data">
        {{ log }}
      </div>
    </div>
  </section>
</template>

<script>
const axios = require('axios').default;
import Plotly from 'plotly.js-basic-dist-min'

export default {
    props: ['user','token','gw','websocket_prefix','api_prefix'],
    data() {
        return {
            loading_analytics: false,
            analytics_summary: {},
            duration: '7',
            log_history: [],
            demo_data: {},
            displaying_demo_dashboard: false,
        };
    },
    watch: 
    {
      
    },
    methods: 
    {
      async setup_webhooks()
      {
        let self = this;
        //normally tokens get refreshed before every API call through Axios interceptors
        //but here we have to do this separately.  Also, we don't update the token as that's a property
        //var token = await firebase.auth().currentUser.getIdToken()//will refresh if necessary, or return cached
        this.ws = new WebSocket(self.websocket_prefix + "/logs")//? + "auth=" + token + '&organization_id=' + this.selected_organization)
        console.log("Websocket Connection made")
        this.ws.onopen = event => this.get_all_data();
        this.ws.onclose = event => this.reconnect(event);
        this.ws.onmessage = event => this.receive_message(event.data);
      },
      async reconnect(event)
      {
        console.log("Websocket Connection lost, attempting auto-reconnect", event)
        this.ws = null
        this.log_history = []
        while(this.ws==null)
        {
          this.setup_webhooks()
          //wait 30 seconds betweeen tries
          const async_sleep = async () => {
            await sleep(30000)
          }
        }
      },
      /*send_message(content_type, text, uploaded_file_url)
      {
        console.log('in send message with text:' + text);
        this.pending_send = true
        var message_data = {"event": "send_message", "group_id": this.selected_group_id, "content_type": content_type, "message_text": text, "uploaded_file_url": uploaded_file_url}
        this.ws.send(JSON.stringify(message_data))
        this.pending_send = false
        this.sent_message += 1
      },*/
      receive_message(data)
      {
        console.log('in receive message with data:' + data);
        var parsed_data = JSON.parse(data);
        if (parsed_data.event=='logs')
        {
            this.log_history.push(parsed_data.data);
            //scroll to the bottom
            setTimeout(this.scroll_to_bottom, 500);
        }
        else if(parsed_data.event=='error')
        {
          this.error_message = parsed_data.text;
          this.display_error_message = true;
        }
      },
      scroll_to_bottom()
      {
        document.querySelector("#logs").scrollIntoView(false)
      },
    },
    components: {},
    mounted() 
    {
      let self = this;

      /*analytics.track('Page Visited', 
      {
        title: 'Analytics',
      });*/

      this.$nextTick(function () 
      {
        //self.get_analytics()
        self.setup_webhooks()
      });
    }
};
</script>

<style scoped>
#logs
{
  background-color: black;
  color: white;
}
.centered
{
  text-align: center;
  display: block;
  background-color: transparent;
}
#loading_spinner
{
  margin: 0 auto;
  display: inherit;
}
#summary_stats_description
{
  font-style: italic;
  text-align: center;
}
>>> .change_arrows
{
  height: 35px;
  width: 35px;
  vertical-align: middle;
}
>>> .stat_cards
{
  text-align: center;
}
#summary_stats
{
  text-align: center;
}
</style>
