const axios = require('axios').default;

export async function login(username, password) 
{
    //basic auth, ideally over HTTPS

    var response = await axios.get(location.protocol + '//' + location.hostname + ':' + process.env.VUE_APP_API_PORT + '/login',
    {
        auth: {
            username: username,
            password: password
        }
    }).then(response => 
    { 
        console.log(response)
        var user = {};
        user.authdata = window.btoa(username + ':' + password);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('gateway_token', response.data.gateway_token);
        localStorage.setItem('token', response.data.token);
    }).catch(error => 
    {
        console.log(error.response);
        logout();
        location.reload(true);
    });
}

export function logout() 
{
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    localStorage.removeItem('gateway_token');
    localStorage.removeItem('token');
}