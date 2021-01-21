<template>
	<iframe src="" frameborder="0" style="overflow:hidden;height:100%;width:100%" height="100%" width="100%"></iframe>
</template>

<script>
export default {
	mounted: function() 
    {
        if(process.env.VUE_APP_ENV=='cloud')
		{
			window.analytics.page('Help');
		}
	}
}
</script>

<style scoped>

</style>
