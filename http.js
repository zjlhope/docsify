import axios from 'axios'

axios.defaults.headers['Content-Type'] = 'application/json'
axios.defaults.xsrfCookieName = "csrfToken"
axios.defaults.xsrfHeaderName = "x-csrf-token"
axios.defaults.withCredentials = true     //需配合cors

//文件上传
axios.prototype.upload = function (url, data, config) {
    config = Object.assign({}, { headers: { "Content-Type": "multipart/form-data" } }, config)
    const params = new FormData()
    for (let key in data) {
        params.append(key, data[key])
    }
    return this.post(url, params, config)
}


let app = null;

const requestConfig = {
    request: config => {
        return config
    },
    error: error => {
        //Message.error(error)
    }
}
const responseConfig = {
    response: response => response.data,
    error: error => {
        const code = error.response.status
        const data = error.response.data || {}
        if (code == 401) {
            app.emitDirection=true
            location.href = "login.html"
        }
        else {
            let msg = '';
            if (data.message)
                msg = error.response.data.message;
            else
                msg = error.message;


            if (data.stack) {
                app.Vue.prototype.$Message.message("", {
                    duration: 0,
                    closable: true,
                    render: h => h("div",
                        {
                            style: {
                                textAlign: "left",
                                maxHeight: "300px",
                                overflow: "auto"
                            }
                        },
                        [h("pre", data.stack)])
                })
            }
            else {
                app.Vue.prototype.$Notice.error({ title: msg, duration: 5000 });
            }
            return Promise.reject(error)
        }
    }
}

const curl = axios.create()
const clients = [curl]
clients.forEach(httpClient => {
    httpClient.interceptors.request.use(
        requestConfig.config,
        requestConfig.error
    )
    httpClient.interceptors.response.use(
        responseConfig.response,
        responseConfig.error
    )
    let rawGet = httpClient.get
    httpClient.get = function (url, data) {
        if (data) return rawGet(url, { params: data })
        else return rawGet(url)
    }
})

function setApp(_app) {
    app = _app;
}
export default { curl, setApp }

