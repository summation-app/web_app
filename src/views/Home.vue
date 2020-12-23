<template>
    <v-progress-circular
    id="loading_spinner"
    indeterminate
    size=64
    color="primary"
    >
    </v-progress-circular>
</template>

<script>

export default {
  props: ['user', 'token','gw','api_prefix'],
  data: function () 
  {
    return {}
  },
  created()
  {
    
  },
  methods:
  {
    fast_redirect()
    {
      //new logic: just rely on localstorage, even though may result in false + and an existing customer seeing setup if they sign-in on different device
      //trade-off worth it for fast redirect for new users

      //when we first signup, it may take 1-2 seconds for the server to update & refresh the organizations in firebase and ~6 seconds to redirect to /setup
      //which is too long
      
      //OLD logic:
      //we use localstorage as a backstop
      //if selected_organization==null && localstorage==null, means new signup -> go to setup
      //else if both!=null -> do query
      //else if selected_organization!=null -> do query
      //else if localstorage!=null -> use localstorage value
        
      var local_setup_completed = localStorage.getItem('setup_completed');
      
      if(local_setup_completed!=null)
      {
        if(local_setup_completed=='false')
        {
          //redirect to setup
          this.$router.push('/setup/1')
        }
        else if (local_setup_completed=='true')
        {
          this.$router.push('/analytics')
        }
      }
      else
      {
        //new user or device, redirect to setup
        this.$router.push('/setup/1')
      }
    },
  },
  watch: 
  {
    'gw': function(val) 
    {
      if(val!=null)
      {
        fast_redirect()
      }
    }
  },
}
</script>

<style scoped>
#loading_spinner
{
    margin: 0 auto;
    display: block;
}
</style>