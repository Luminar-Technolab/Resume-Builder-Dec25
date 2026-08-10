import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { IoArrowBackSharp } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { deleteDownloadResumeAPI, getDownloadResumeAPI } from '../services/allResumeApiService';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function Downloads() {

  const [allDownloads,setAllDownloads] = useState([])

  // console.log(allDownloads);

  // const labels = ["React", "Angular", "Vue", "Node.js"];
  // const values = [30, 25, 15, 30];
  const [labels,setLabels] = useState([])
   const [values,setValues] = useState([])
  const colorPalette = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
];

const backgroundColor = labels.map(
  (_, index) => colorPalette[index % colorPalette.length]
);

const data = {
  labels,
  datasets: [
    {
      data: values,
      backgroundColor,
    },
  ],
};

const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };
  
  useEffect(()=>{
    getAllDownloads()
  },[])

  const getAllDownloads = async ()=>{
    const result = await getDownloadResumeAPI()
    if(result.status==200){
      setAllDownloads(result.data)
      const output = {}
      result.data.forEach(item=>{
        const job = item.jobRole
        const curCount = 1
        if(job in output){
          output[job] += 1
        }else{
          output[job]=1
        }
      })
      const allJobs = Object.keys(output)
      const count = Object.values(output)
      setLabels(allJobs);
      setValues(count);
      
      
    }
  }

  const removeDownload = async (id)=>{
    await deleteDownloadResumeAPI(id)
    getAllDownloads()
  }

  return (
    <div className='container'>
      <div className='d-flex my-5 justify-content-between align-items-center'>
        <h1>Downloaded Resume History</h1>
        <Link to={'/form'}> <IoArrowBackSharp/> Back</Link>
      </div>
      <div className="d-flex justify-content-center align-items-center my-5 ">
       <div className='w-25'> <Pie data={data} options={options} /></div>
      </div>
      <div className="row mb-5">
       {
        allDownloads.length>0 ?
          allDownloads?.map(resume=>(
             <div key={resume?.id} className="col-lg-4 mb-3">
              <div style={{height:'300px'}} className="shadow p-3 rounded">
                <div className='d-flex justify-content-between align-items-center'>
                  <h6>Review at : {resume?.timeStamp}</h6>
                  <button onClick={()=>removeDownload(resume?.id)} className="btn fs-5 text-danger"> <MdDelete/> </button>
                </div>
                <div className="mt-3 text-center">
                 <Link to={`/resume/${resume?.resumeId}/view`}> <img height={'200px'} width={'200px'} src={resume?.resumeImg} alt="downloded cv image" /></Link>
                </div>
              </div>
            </div>
          ))
        :
        <div className='text-center fw-bolder my-5'>No Resumes are downloaded yet!!!....</div>
       }
      </div>
    </div>
  )
}

export default Downloads