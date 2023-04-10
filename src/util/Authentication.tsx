// Temporary login to configure registration

import axios from "axios"

const login = (email: string, pass: string, set: any) => {
    axios.post(process.env.REACT_APP_DOMAIN + '/users/login',
        {
            email: email,
            password: pass
        }).then((response) => {
            console.log('logged in  ')
            set(response.data)
            axios.defaults.headers.common = {
                'x-authorization': response.data.token
            }
        })
}


export { login }