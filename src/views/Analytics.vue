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

    <v-container fluid id='cards_revenue' v-if="show_revenue_stats">
      <v-row justify="center">
        <v-col class="stat_cards"><h3>{{ revenue_stats.revenue }}</h3><br/><h5>Revenue</h5></v-col>
        <v-col class="stat_cards"><h3>{{ revenue_stats.checkouts }}</h3><br/><h5>Orders</h5></v-col>
        <v-col class="stat_cards"><h3>{{ attributable_revenue_percent }}%</h3><br/><h5>of Revenue from OnePress Fast Checkout</h5></v-col>
      </v-row>
    </v-container>

    <v-container fluid id='cards_signin' v-if="show_signin_stats">
      <v-row justify="center">
        <v-col class="stat_cards"><h3>{{ analytics_summary.subscribers }}</h3><br/><h5>Signins to Fast Checkout</h5></v-col>
        <v-col class="stat_cards"><h3>{{ analytics_summary.impressions }}</h3><br/><h5>'Add to Cart' Events</h5></v-col>
        <v-col class="stat_cards"><h3>{{ conversion_rate_formatted }}%</h3><br/><h5>Conversion Rate</h5></v-col>
      </v-row>
      <v-row justify="center">
        <v-col id='summary_stats_description' style='text-align: center'></v-col>
      </v-row>
    </v-container>
    <div id='subscribers_chart' ref='subscribers_chart'>
    </div>
    <div id='funnel_chart'>
    </div>
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
    props: ['user','token','gw','websocket_prefix'],
    data() {
        return {
            loading_analytics: false,
            analytics_summary: {},
            duration: '7',
            log_history: [],
            api_prefix: process.env.VUE_APP_API_PREFIX,
            demo_data: {
              summary_stats: {"impressions":6400,"subscribers":130,"conversion_rate":2.03125},
              protocol_stats: {"Google One Tap":{"2020-08-06":10,"2020-08-04":13,"2020-08-03":79},"Manual Email":{"2020-08-06":3,"2020-08-05":21,"2020-08-04":4}},
              revenue_stats: {'revenue': 21639, 'checkouts': 927, 'currency': 'USD', 'onepress_checkouts': 23, 'onepress_total': 2157}
            },
            displaying_demo_dashboard: false,
            conversion_rate_formatted: null,
            attributable_revenue_percent: 0,
            show_signin_stats: true,
            show_revenue_stats: false
        };
    },
    watch: 
    {
      analytics_summary: function (val) 
      {
        this.conversion_rate_formatted = val.conversion_rate.toFixed(1)
      },
      revenue_stats: function(val)
      {
        if(this.revenue > 0)
        {
          this.attributable_revenue_percent = 100*(val.onepress_total/val.revenue).toFixed(1)
        }
      }
    },
    methods: 
    {
      async get_analytics()
      {
        try
        {
          let self = this;
          self.loading_analytics = true;
          var response = await axios.get(self.api_prefix + '/analytics',
          {
            params:
            {
              'organization_id': self.selected_organization,
              'duration': parseInt(self.duration),
            }
          });
          self.loading_analytics = false;
          if(response.data.no_data==true)
          {
            self.setup_demo_dashboard()
          }
          else
          {
            self.analytics_summary = response.data.summary_stats;
            self.protocol_stats = response.data.protocol_stats;
            self.revenue_stats = response.data.revenue_stats;
            self.create_charts(response.data)
            if(self.revenue_stats.revenue > 0)
            {
              this.show_revenue_stats = true;
              this.show_signin_stats = false;
            }
          }
        }
        catch (error)
        {
          console.error(error);
        }
      },
      setup_demo_dashboard()
      {
        let self = this;
        self.displaying_demo_dashboard = true;
        self.analytics_summary = self.demo_data.summary_stats;
        self.protocol_stats = self.demo_data.protocol_stats;
        self.create_charts(self.demo_data)
      },
      create_charts(data)
      {
        //subscribers
        var traces = [];

        for (const [key, value] of Object.entries(data.protocol_stats)) 
        {
          var chart_data = 
          {
            x: Object.keys(value), //['2013-10-04 22:23:00', '2013-11-04 22:23:00', '2013-12-04 22:23:00'],
            y: Object.values(value), //[1, 3, 6],
            type: 'scatter',
            name: key,
            mode: 'lines',
          };
          traces.push(chart_data);
        }

        var layout = {
          title: 'Customers Signed in to fast checkout via OnePress',
          showlegend: true,
          autorange: true,
          xaxis: 
          {
            'tickformat': '%b %e'
          }
        };

        console.log(traces);

        Plotly.newPlot(this.$refs['subscribers_chart'], traces, layout, {displayModeBar: false});
      },
      percent_change_html: function(data)
      {
        if(data > 0)
        {
          return "<img src='" + require(`@/assets/arrow_up.svg`) + "' class='change_arrows'/> " + data + "%"
        }
        else if(data < 0)
        {
          return "<img src='" + require(`@/assets/arrow_down.svg`) + "' class='change_arrows'/> " + data + "%"
        }
        else if(data == 0)
        {
          return "- " + data + "%"
        }
        else
        {
          //null
          return ""
        }
      },
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
