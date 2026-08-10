import React, { useState } from 'react'
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { TextField } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import jobTypes from '../assets/jobRole.json';
import skillJSON from '../assets/jobSkills.json';
import summaryJSON from '../assets/summaries.json';
import { addResumeAPI } from '../services/allResumeApiService';
import { useNavigate } from 'react-router-dom';


const steps = ['Basic Informations', 'Contact Details', 'Educational Details','Review & Submit'];


function UserInputs({resumeData,setResumeData}) {
  const navigate = useNavigate()
  const [activeStep, setActiveStep] = React.useState(0);
  // console.log(resumeData);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const generateAI = ()=>{
    setResumeData({...resumeData,
      skills:skillJSON[resumeData.job],
      summary:summaryJSON[resumeData.job]
    })
    handleNext()
  }

  const renderStepContent = (stepCount)=>{
    switch(stepCount){
        case 0 : return (
            <div>
                <h3>Personal Details</h3>
                <div className="p-3 row">
                    <TextField value={resumeData.fullName} onChange={e=>setResumeData({...resumeData,fullName:e.target.value})} id="standard-basic-name" label="Full Name" variant="standard" />
                    <TextField value={resumeData.location} onChange={e=>setResumeData({...resumeData,location:e.target.value})} id="standard-basic-loc" label="Location" variant="standard" />
                    <FormControl variant="standard" >
                        <InputLabel id="demo-simple-select-standard-label">Choose Job Title</InputLabel>
                        <Select onChange={e=>setResumeData({...resumeData,job:e.target.value})}  defaultValue={''} labelId="demo-simple-select-standard-label" id="demo-simple-select-standard"
                        label="Job" >
                            {
                              jobTypes.jobRoles.map(role=>(
                                  <MenuItem key={role} value={role}>{role}</MenuItem>
                              ))
                              
                            }
                        </Select>
                    </FormControl>
                </div>
            </div>
        )
        case 1 : return (
            <div>
                <h3>Contact Details</h3>
                <div className="p-3 row">
                    <TextField value={resumeData.email} onChange={e=>setResumeData({...resumeData,email:e.target.value})} id="standard-basic-email" label="Email" variant="standard" />
                    <TextField value={resumeData.phone} onChange={e=>setResumeData({...resumeData,phone:e.target.value})} id="standard-basic-phone" label="Contact Number" variant="standard" />
                    <TextField value={resumeData.linkedin} onChange={e=>setResumeData({...resumeData,linkedin:e.target.value})} id="standard-basic-LinkedIn" label="LinkedIn Link" variant="standard" />
                    <TextField value={resumeData.github} onChange={e=>setResumeData({...resumeData,github:e.target.value})} id="standard-basic-GitHub" label="Github Link" variant="standard" />
                </div>
            </div>
        )
        case 2 : return (
            <div>
                <h3>Educational Details</h3>
                <div className="p-3 row">
                    <TextField value={resumeData.degree} onChange={e=>setResumeData({...resumeData,degree:e.target.value})} id="standard-basic-degree" label="Bachelor’s Degree" variant="standard" />
                    <TextField value={resumeData.university} onChange={e=>setResumeData({...resumeData,university:e.target.value})} id="standard-basic-college" label="University/College Name" variant="standard" />
                    <TextField value={resumeData.passOut} onChange={e=>setResumeData({...resumeData,passOut:e.target.value})} id="standard-basic-year" label="Year of Graduation" variant="standard" />
                </div>
            </div>
        )
        case 3 : return (
            <div>
                <p>Our AI will generate Skills & Summary according to your job role. Click the <b>Generate AI Skill & Summary</b> button to Proceed.</p>
            </div>
        )
        default : return null
    }
  }

  const handleAddResume = async ()=>{
    const {fullName,location,job,email,phone,linkedin,github,degree,university,passOut,skills,summary} = resumeData
    if(fullName && location && job && email && phone && linkedin && github && degree && university && passOut && skills.length>0 && summary){
      //api call
      const response = await addResumeAPI(resumeData)
      // console.log(response);
      if(response.status==201){
        alert("Resume added successfully!!!")
        const resumeId = response.data.id
        // navigate to view Resume
        navigate(`/resume/${resumeId}/view`)
      }
    }else{
      alert("Please fill the form completely!!")
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed 
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleAddResume}>FINISH</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
          {/* render form according to activeStep count */}
          <Box>
            {
                renderStepContent(activeStep)
            }
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {
                activeStep === steps.length - 1 ?
                <Button onClick={generateAI}>Generate AI Skills & Summary  </Button>
            :
                <Button onClick={handleNext}>Next</Button>
            }
          </Box>
        </React.Fragment>
      )}

     
    </Box>
  );
}

export default UserInputs