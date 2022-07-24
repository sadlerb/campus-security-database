import http from 'k6/http';

export const options = {
    insecureSkipTLSVerify:true,
    noConnectionReuse:false,
    vus:1,
    duration:"10s"

}

export default () =>{
    http.get('http://localhost:8080/users')
}