import React, { useEffect, useRef, useState } from 'react'
import { FaFileDownload } from "react-icons/fa";
import { Link, useParams } from 'react-router-dom';
import { IoMdRefresh } from "react-icons/io";
import { FaBackward } from "react-icons/fa";
import Preview from '../components/Preview';
import Edit from '../components/Edit';
import { downloadResumeAPI, getResumeAPI } from '../services/allResumeApiService';
import html2canvas from 'html2canvas'
import jspdf from 'jspdf'

function ViewResume() {
 const {id} = useParams()
 const [resumeData,setResumeData] = useState({})
 const previewRef = useRef()

//  console.log(resumeData);

 useEffect(()=>{
  getResumeDetails()
 },[])

 const getResumeDetails = async()=>{
  if(id){
    const result = await getResumeAPI(id)
    // console.log(result);
    setResumeData(result.data)
  }
 }

//  const formData = new FormData();
    // formData.append("file", blob);
    // formData.append("upload_preset", "YOUR_UPLOAD_PRESET");

    // const res = await fetch(
    //   "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
    //   {
    //     method: "POST",
    //     body: formData,
    //   }
    // );

    // const data = await res.json();
    // console.log("Cloudinary URL:", data.secure_url);

//  const downloadResume = async ()=>{
//   const previewTag = previewRef.current
//   const canvas = await html2canvas(previewTag)
//   //to generate short img url
//   canvas.toBlob(blob=>{
//     const shortUrl = URL.createObjectURL(blob)
//     generatePDF(shortUrl)
//   }) 
//  }

const downloadResume = async ()=>{
  const previewTag = previewRef.current
  const canvas = await html2canvas(previewTag)
  //to generate short img url
  canvas.toBlob(async(blob)=>{
    const formData = new FormData();

    formData.append("file", blob);
    formData.append("upload_preset", "my_preset");
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dkieulw0f/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    const shortUrl = data.secure_url
    console.log(shortUrl);
    
    //  console.log("Cloudinary URL:", data.secure_url);
    generatePDF(shortUrl)
  }) 
 }

 const generatePDF = async (resumeImg)=>{
  const today = new Date()
  const timeStamp = `${today.toLocaleDateString()}, ${today.toLocaleTimeString()}`
  const pdf = new jspdf()
  const imgWidth = pdf.internal.pageSize.getWidth()
  const imgHeight = pdf.internal.pageSize.getHeight()
  pdf.addImage(resumeImg,"PNG",0,0,imgWidth,imgHeight)
  const downloadDetails = {
    timeStamp,resumeId:id,resumeImg,jobRole:resumeData.job
  }
  const result = await downloadResumeAPI(downloadDetails)
  console.log(result);
  
  if(result.status == 201){
    pdf.save(`${resumeData?.fullName}-resume.pdf`)  
  }
 }

  return (
    <div className='container'>
      <div className="row my-3">
        <div className="col-lg-2"></div>
        <div className="col-lg-8">
          {/* icon set */}
          <div className="d-flex justify-content-center align-items-center ">
            {/* download */}
            <button onClick={downloadResume} className="btn  fs-3 me-2" style={{color:'#455b6b'}}> <FaFileDownload/> </button>
            {/* edit */}
            <Edit resumeData={resumeData} setResumeData={setResumeData}/>
            {/* history */}
            <Link to={'/downloads'} className="btn  fs-2 me-2" style={{color:'#14151a'}}> <IoMdRefresh/> </Link>
            {/* back */}
            <Link to={'/form'} className="btn fs-2 me-2" style={{color:'#4c4541'}}> <FaBackward/> </Link>
          </div>
          <div ref={previewRef} className=' p-5'> <Preview resumeData={resumeData}/> </div>
        </div>
        <div className="col-lg-2"></div>
      </div>
    </div>
  )
}

export default ViewResume