<template>
  <v-app cloak>
    <v-navigation-drawer
    permanent
    app
    v-if="!$route.meta.hideNavigation"
    :mini-variant.sync="mini"
    >
      <v-list-item>
        <v-btn
          icon
          @click.stop="mini = !mini"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>

      <v-divider></v-divider>

      <v-list
          dense
          nav
        >
          <v-list-item
            v-for="item in menu_items"
            :key="item.title"
            :to="item.link"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
    </v-navigation-drawer>
  <v-app-bar
    app
    dense
    v-if="!$route.meta.hideNavigation">
    <div class="flex-grow-1"></div>
    <!--<v-btn icon>
      <v-icon>mdi-magnify</v-icon>
    </v-btn>-->
    <v-btn icon>
      <v-icon @click="logout_from_app">mdi-export-variant</v-icon>
    </v-btn>
  </v-app-bar>

  <!-- Sizes your content based upon application components -->
  <v-content>

    <!-- Provides the application the proper gutter -->
    <v-container fluid>

      <!-- If using vue-router -->
      <router-view
        v-if="gw"
        :api_prefix="api_prefix"
        :websocket_prefix="websocket_prefix"
        :user="user"
        :token="token"
        :gw="gw"
        :subscription_plan="subscription_plan"
        :setup_completed="setup_completed"
        @navigation_drawer="toggle_navigation_drawer"
        @logged_in="initialize_gateway"
      >
      </router-view>
      <div v-else>
        <v-progress-circular
        id="loading_spinner"
        indeterminate
        size=64
        color="primary"
        >
        </v-progress-circular>
      </div>
    </v-container>
  </v-content>

  <v-footer app>
    <!-- -->
  </v-footer>
</v-app>
</template>

<script>
import {login, logout} from './auth.js';
var WebFont = require('webfontloader');
const axios = require('axios').default;
import router from './router.js';
if(process.env.VUE_APP_ENV=='cloud')
{
  const firebase = require('firebase/app');
  require('firebase/auth');
}

import Summation from 'summation_web_client';

//could also do:
//npm install --save material-design-icons-iconfont
//and import it in the main.js file
//import 'material-design-icons-iconfont/dist/material-design-icons.css'
WebFont.load({
  google: {
    families: ['Roboto', 'Material+Icons']
  }
})

export default {
  name: 'app',
  metaInfo: {
      // if no subcomponents specify a metaInfo.title, this title will be used
      title: 'Summation',
  },
  data: function () {
    return {
      user: null,
      token: null,
      gw: null,
      organizations: [],
      setup_completed: null,
      nav_drawer: null,
      selected_organization: null,
      mini: false,
      api_prefix: location.protocol + '//' + location.hostname + ':' + process.env.VUE_APP_API_PORT,
      subscription_plan: null,
      token_claims_loop: null,
      is_mobile: false,
      counter: 0,
      force_refresh: false,
      menu_items:
      [
        {
          'title': 'Databases', 'icon': 'mdi-database', 'link': '/databases'
        },
        {
          'title': 'APIs', 'icon': 'mdi-cloud-sync', 'link': '/apis'
        },
        {
          'title': 'Logs', 'icon': 'show_chart', 'link': '/analytics'
        },
        {
          'title': 'Security', 'icon': 'show_chart', 'link': '/security'
        },
        {
          'title': 'Settings', 'icon': 'settings', 'link': '/settings'
        },
        {
          'title': 'Help', 'icon': 'help', 'link': 'https://docs.summation.app/'
        }
      ],
    }
  },
  created()
  {
        let self = this;

        this.initialize_gateway();
        if(process.env.VUE_APP_ENV=='cloud')
        {
          self.firebase_token()
        }

        //leverage Axios interceptors to append the token to every request
        axios.interceptors.request.use(async config => {
          //https://github.com/axios/axios#request-config
          self.token = localStorage.getItem('token')
          config.headers.Authorization = 'Bearer ' + self.token
          return config
        }, (error) => {
          return Promise.reject(error)
        })
  },
  components: {
    //'navigation-sidebar': NavigationSidebar,
  },
  methods: {
    initialize_gateway()
    {
      let self = this;
      self.gw = new Summation({
        gateway_url: self.api_prefix,
        token: localStorage.getItem('token'),
        gateway_token: localStorage.getItem('gateway_token'),
        default_database: "summation"}
      );
    },
    toggle_navigation_drawer(hide)
    {
      this.show_sidebar = false;
    },
    async get_setup_completed()
    {
        try
        {
          var response = await axios.get(self.api_prefix + '/setup_completed',
          {
          'params': {'organization_id': self.selected_organization},
          });
          self.setup_completed = response.data;
          //set the localstorage to the setup_completed value
          localstorage.setItem('setup_completed', self.setup_completed);
        }
        catch (error)
        {
        }
    },
    set_nav_bar_size()
    {
      if (('ontouchstart' in document.documentElement && navigator.userAgent.match(/Mobi/))==false)
      {
        this.mini = false;
      }
      else
      {
        this.mini = true;
      }
    },
    logout_from_app()
    {
      if(process.env.VUE_APP_ENV=='cloud')
      {
        firebase.auth().signOut().then(function() 
        {
          // Sign-out successful.
          console.log('signed out');
        }, function(error) 
        {
          // An error happened.
        });
      }
      else
      {
        logout()
      }
      router.push("login")
    },
    firebase_token()
    {
        /*
        Shortly before the current ID token expires, the modern client SDKs transparently send the refresh token to this endpoint 
        to generate a fresh ID token with a new one hour expiry, ensuring your users stay logged in. All of this happens under the hood, 
        although each client SDK includes a method to be notified when a new ID token is generated
        BUT:
        On its own the Auth service will not proactively refresh (as this is an expensive operation and it may be unnecessary if there is no consumer of the new token). 
        Other firebase services (realtime db, firestore) need the persistent connection, so they need to continuously do so.
        */
        //triggered on sign-in, sign-out, and token refresh events
        //https://firebase.google.com/docs/reference/js/firebase.auth.Auth.html#on-idtoken-changed
        let self = this;
        firebase.auth().onIdTokenChanged(user =>
        {
            if (user)
            {
                self.user = user;
                self.user.getIdToken().then(function(token)
                {
                  console.log('onIdTokenChanged')
                  console.log(token);
                  self.token = token;
                });
                /*window.analytics.identify(self.user.uid,
                {
                  name: self.user.displayName,
                  email: self.user.email
                });*/

                if(self.organizations==null || self.organizations==[])
                {
                  self.wait_for_token_claims();//call it immediately
                  self.token_claims_loop = setInterval(self.wait_for_token_claims, 1000);
                }
                else
                {
                  //self.get_setup_completed();
                  //self.get_subscription_plan();
                }
            }
        });
    },
    wait_for_token_claims()
    {
      let self = this;
                
      //https://firebase.google.com/docs/reference/js/firebase.User.html#getidtokenresult
      if (self.counter > 0)
      {
        self.force_refresh = true;
      }
      console.log('in while loop with refresh: ' + self.force_refresh)

      self.user.getIdTokenResult(self.force_refresh)
      .then((idTokenResult) => {
        self.organizations = idTokenResult.claims.organizations;
        if (self.organizations!=null && self.organizations.length>0)
        {
          self.organization_id = self.organizations[0]
          if (self.token_claims_loop!=null)
          {
            clearInterval(self.token_claims_loop);//break out of loop
          }
          //self.get_setup_completed()
        }
          
        //self.get_subscription_plan();
      })
      .catch((error) => {
        console.log(error);
      });
      self.counter += 1;
    },
  },
  mounted: function()
  {
    this.set_nav_bar_size()
  },
  computed: 
  {
    websocket_prefix: function ()
    {
      var protocol='ws'
      if (location.protocol=='https')
        protocol = 'wss'
      return protocol + '://' + location.hostname + ':' + process.env.VUE_APP_API_PORT;
    }
  },
  watch: 
  {
    '$route' (to, from) 
    {
      let self = this;
      document.title = to.meta.title || 'Summation'
      setTimeout(self.set_nav_bar_size, 1500);
    },
  },

}
</script>

<style scoped>
[v-cloak] {display: none}
a:hover
{
  text-decoration: none;
}
.container, .container--fluid
{
	height: 100%;
}
</style>
