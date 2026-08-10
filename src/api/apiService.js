import axiosInstance from "./axiosInstance";
// api service should be called by component service
const apiService = async (httpMethod,url,reqBody)=>{
    const reqConfig = { 
        method:httpMethod,
        url,
        data:reqBody}

   try{
     //api call : axiosInstance(config)
    const response = await axiosInstance(reqConfig)
        return response
   }catch(err){
        throw err
   }
}

export default apiService