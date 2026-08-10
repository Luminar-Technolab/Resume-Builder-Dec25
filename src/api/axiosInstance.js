import axios from 'axios'

const axiosInstance = axios.create({
    baseURL:"https://ai-resume-builder-server-dec25.onrender.com",
    // baseURL:"http://localhost:3000",
    timeout:5000
})

// response interceptors : Handling Global/Common Errors
axiosInstance.interceptors.response.use(
    (response)=>{
    console.log("response Recieved!!!");
    return response    
    },
    (error)=>{
        if(error.response){
            const status = error.response.status
            if(status==401){
                console.log("Unauthorised Access - Redirect to Login!!");
            }else if(status==404){
                console.log("API Not Found!!");
            }else if (status==500){
                console.log("Server Error!!!");                
            }else if(error.request){
                console.log("No Response from server..");     
            }else{
                console.log("Error : "+error.message);                
            }
            return Promise.reject(error);
        }
    }
)


export default axiosInstance