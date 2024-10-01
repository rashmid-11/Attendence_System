import React, { useState, useEffect, Fragment } from "react";
import { Button, Grid, Box, MenuItem, styled, TextField, Autocomplete } from "@mui/material";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { Breadcrumb, SimpleCard } from "app/components";

const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" }
  }
}));

// Suggestions for Degree and Semester
const degreeSuggestions = ["BSc", "BTech"];
const semesterSuggestions = ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5"];

// Student information fields
const studentInitialState = {
  rollNo: '',
  prnNo: '',
  phase: '',
  degree: '',
  semester: '',
  attendanceId: '',
  firstName: '',
  middleName: '',
  lastName: '',
  contact: '',
  email: ''
};

// Parent information fields
const parentInitialState = {
  relation: '',
  contactNo: '',
  email: '',
  whatsappNo: '',
  address: ''
};

// Step labels
const steps = ["Student Information", "Parent Information"];

function CreateStudent() {
  const [activeStep, setActiveStep] = useState(0);
  const [studentInfo, setStudentInfo] = useState(studentInitialState);
  const [parentInfo, setParentInfo] = useState(parentInitialState);

  useEffect(() => {
    ValidatorForm.addValidationRule("isNameValid", (value) => value.length > 3);
    return () => ValidatorForm.removeValidationRule("isNameValid");
  }, []);

  const handleNext = () => {
    if (activeStep < steps.length - 1) setActiveStep((prev) => prev + 1);
    else handleSubmit();
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    const finalData = { ...studentInfo, ...parentInfo };
    console.log("Submitting:", finalData);

    try {
      const response = await fetch('http://localhost:3005/api/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });
      const data = await response.json();
      console.log(data);

      if (response.ok) {
        setStudentInfo(studentInitialState);
        setParentInfo(parentInitialState);
        setActiveStep(0);
      } else {
        console.error("Submission failed:", data);
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  const handleStudentChange = (event) => {
    setStudentInfo({ ...studentInfo, [event.target.name]: event.target.value });
  };

  const handleParentChange = (event) => {
    setParentInfo({ ...parentInfo, [event.target.name]: event.target.value });
  };

  const renderStudentForm = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <TextValidator
          label="Roll No"
          name="rollNo"
          value={studentInfo.rollNo}
          onChange={handleStudentChange}
          validators={["required"]}
          errorMessages={["This field is required"]}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextValidator
          label="PRN No"
          name="prnNo"
          value={studentInfo.prnNo}
          onChange={handleStudentChange}
          validators={["required"]}
          errorMessages={["This field is required"]}
          fullWidth
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Autocomplete
          options={["Phase 1", "Phase 2"]}
          getOptionLabel={(option) => option}
          value={studentInfo.phase}
          onChange={(_, newValue) => setStudentInfo({ ...studentInfo, phase: newValue })}
          renderInput={(params) => (
            <TextField {...params} label="Phase" variant="outlined" fullWidth />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Autocomplete
          options={degreeSuggestions}
          getOptionLabel={(option) => option}
          value={studentInfo.degree}
          onChange={(_, newValue) => setStudentInfo({ ...studentInfo, degree: newValue })}
          renderInput={(params) => (
            <TextField {...params} label="Degree" variant="outlined" fullWidth />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Autocomplete
          options={semesterSuggestions}
          getOptionLabel={(option) => option}
          value={studentInfo.semester}
          onChange={(_, newValue) => setStudentInfo({ ...studentInfo, semester: newValue })}
          renderInput={(params) => (
            <TextField {...params} label="Semester" variant="outlined" fullWidth />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextValidator
          label="Attendance ID"
          name="attendanceId"
          value={studentInfo.attendanceId}
          onChange={handleStudentChange}
          validators={["required"]}
          errorMessages={["This field is required"]}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextValidator
          label="First Name"
          name="firstName"
          value={studentInfo.firstName}
          onChange={handleStudentChange}
          validators={["required"]}
          errorMessages={["This field is required"]}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextValidator
          label="Middle Name"
          name="middleName"
          value={studentInfo.middleName}
          onChange={handleStudentChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextValidator
          label="Last Name"
          name="lastName"
          value={studentInfo.lastName}
          onChange={handleStudentChange}
          validators={["required"]}
          errorMessages={["This field is required"]}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextValidator
          label="Contact"
          name="contact"
          value={studentInfo.contact}
          onChange={handleStudentChange}
          validators={["required"]}
          errorMessages={["This field is required"]}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextValidator
          label="Email"
          name="email"
          value={studentInfo.email}
          onChange={handleStudentChange}
          validators={["required", "isEmail"]}
          errorMessages={["This field is required", "Invalid email"]}
          fullWidth
        />
      </Grid>
    </Grid>
  );

  const renderParentForm = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <Autocomplete
          options={["Father", "Mother"]}
          getOptionLabel={(option) => option}
          value={parentInfo.relation}
          onChange={(_, newValue) => setParentInfo({ ...parentInfo, relation: newValue })}
          renderInput={(params) => (
            <TextField {...params} label="Relation" variant="outlined" fullWidth />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextValidator
          label="Contact No"
          name="contactNo"
          value={parentInfo.contactNo}
          onChange={handleParentChange}
          validators={["required"]}
          errorMessages={["This field is required"]}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextValidator
          label="Email"
          name="email"
          value={parentInfo.email}
          onChange={handleParentChange}
          validators={["required", "isEmail"]}
          errorMessages={["This field is required", "Invalid email"]}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextValidator
          label="WhatsApp No"
          name="whatsappNo"
          value={parentInfo.whatsappNo}
          onChange={handleParentChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextValidator
          label="Address"
          name="address"
          value={parentInfo.address}
          onChange={handleParentChange}
          fullWidth
        />
      </Grid>
    </Grid>
  );

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: "Create Student" }]} />
      </Box>
      <SimpleCard title="Create New Student">
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <ValidatorForm onSubmit={handleNext} onError={() => null}>
          {activeStep === 0 ? renderStudentForm() : renderParentForm()}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
            {activeStep > 0 && <Button onClick={handleBack}>Back</Button>}
            <Button type="submit" color="primary" variant="contained">
              {activeStep === steps.length - 1 ? "Submit" : "Next"}
            </Button>
          </Box>
        </ValidatorForm>
      </SimpleCard>
    </Container>
  );
}

export default CreateStudent;
