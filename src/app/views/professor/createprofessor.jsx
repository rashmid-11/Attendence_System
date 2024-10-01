import React, { useState, useEffect, Fragment } from 'react';
import { Breadcrumb, SimpleCard } from "app/components";
import { Button, Grid, Icon, styled, Box, Autocomplete } from "@mui/material";
import { ValidatorForm } from "react-material-ui-form-validator";
import { useParams, useNavigate } from 'react-router-dom';
import { TextValidator } from "react-material-ui-form-validator";

const AutoComplete = styled(Autocomplete)(() => ({ width: "100%" }));

const suggestions = [
  { label: "BE" },
  { label: "MBA" },
  { label: "BCS" },
];

const namePrefixes = [
  { label: "Mr" },
  { label: "Miss" },
  { label: "Mrs" }
];

const educationOptions = [
  { label: "Bachelor's" },
  { label: "Master's" },
  { label: "PhD" },
  { label: "Diploma" }
];

const TextField = styled(TextValidator)(() => ({
  width: "100%",
  marginBottom: "16px"
}));

// STYLED COMPONENTS
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" }
  }
}));
const CreateProfessor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState({
    empId: '',
    attendanceId: '',
    namePrefix: null,
    firstName: '',
    middleName: '',
    lastName: '',
    birthDate: '',
    joiningDate: new Date().toISOString().split('T')[0],
    contact: '',
    email: '',
    department: '',
    education: ''
  });

  useEffect(() => {
    if (id) {
      const fetchProfessor = async () => {
        try {
          const response = await fetch(`http://localhost:3005/api/professor/${id}`);
          const professor = await response.json();

          setState({
            empId: professor.EmpId || '',
            attendanceId: professor.AttendanceId || '',
            namePrefix: professor.NamePrefix || null,
            firstName: professor.FirstName || '',
            middleName: professor.MiddleName || '',
            lastName: professor.LastName || '',
            birthDate: professor.Dob ? professor.Dob.split('T')[0] : '',
            joiningDate: professor.JoiningDate ? professor.JoiningDate.split('T')[0] : '',
            contact: professor.Contact || '',
            email: professor.Email || '',
            department: professor.Department || '',
            education: professor.Education || ''
          });
        } catch (error) {
          console.error("Error fetching professor:", error);
        }
      };
      fetchProfessor();
    }

    ValidatorForm.addValidationRule("isNameValid", (value) => value.length > 3);
    return () => ValidatorForm.removeValidationRule("isNameValid");
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const url = id
        ? `http://localhost:3005/api/professor/${id}`
        : 'http://localhost:3005/api/professor';
      const method = id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
      });

      if (response.ok) {
        console.log("Form submitted successfully");
        navigate('/professors');
      } else {
        console.error("Error submitting form");
      }
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState({ ...state, [name]: value });
  };

  const handleAutocompleteChange = (event, value, name) => {
    setState({ ...state, [name]: value });
  };

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: "Professor List", path: "/professors" }, { name: id ? "Edit Professor" : "Create Professor" }]} />
      </Box>

      <SimpleCard title={id ? "Update Professor" : "Create New Professor"}>
        <ValidatorForm onSubmit={handleSubmit}>
          <Grid container spacing={6}>
          <Grid item lg={6} md={6} sm={12} xs={12}>
  <TextField
    label="Employee ID"
    onChange={handleChange}
    type="text"
    name="empId"
    value={state.empId || ''}
    variant="outlined"
    fullWidth
    required
  />

  <Grid container spacing={2}>
    <Grid item lg={6} md={4} sm={12} xs={12}>
      <AutoComplete
        options={namePrefixes}
        getOptionLabel={(option) => option.label}
        onChange={(event, newValue) => handleAutocompleteChange(event, newValue, 'namePrefix')}
        renderInput={(params) => <TextField {...params} label="Name Prefix" variant="outlined" fullWidth />}
      />
    </Grid>
    <Grid item lg={6} md={4} sm={12} xs={12}>
      <TextField
        label="First Name"
        onChange={handleChange}
        type="text"
        name="firstName"
        value={state.firstName || ''}
        validators={["required"]}
        errorMessages={["This field is required"]}
        variant="outlined"
        fullWidth
      />
    </Grid>
   
  </Grid>

  
  <TextField
    type="date"
    name="birthDate"
    label="Birth Date"
    value={state.birthDate}
    onChange={handleChange}
    validators={["required"]}
    errorMessages={["This field is required"]}
    InputLabelProps={{
      shrink: true,
    }}
  />
   <TextField
    label="Contact"
    onChange={handleChange}
    type="text"
    name="contact"
    value={state.contact || ''}
    variant="outlined"
    fullWidth
  />
   <AutoComplete
    options={suggestions}
    getOptionLabel={(option) => option.label}
    onChange={(event, newValue) => handleAutocompleteChange(event, newValue, 'department')}
    renderInput={(params) => <TextField {...params} label="Department" variant="outlined" fullWidth />}
  />
</Grid>

<Grid item lg={6} md={6} sm={12} xs={12} >
<TextField
    label="Attendance ID"
    onChange={handleChange}
    type="text"
    name="attendanceId"
    value={state.attendanceId || ''}
    variant="outlined"
    fullWidth
    required
  />
  <Grid container spacing={2}>
    
    <Grid item lg={6} md={4} sm={12} xs={12}>
      <TextField
        label="Middle Name"
        onChange={handleChange}
        type="text"
        name="middleName"
        value={state.middleName || ''}
        variant="outlined"
        fullWidth
      />
    </Grid>
    <Grid item lg={6} md={4} sm={12} xs={12}>
      <TextField
        label="Last Name"
        onChange={handleChange}
        type="text"
        name="lastName"
        value={state.lastName || ''}
        validators={["required"]}
        errorMessages={["This field is required"]}
        variant="outlined"
        fullWidth
      />
    </Grid>
  </Grid>


  <TextField
    label="Joining Date"
    onChange={handleChange}
    type="date"
    name="joiningDate"
    value={state.joiningDate || ''}
    variant="outlined"
    fullWidth
  />
 
  <TextField
    label="Email"
    onChange={handleChange}
    type="email"
    name="email"
    value={state.email || ''}
    validators={["required", "isEmail"]}
    errorMessages={["This field is required", "Email is not valid"]}
    variant="outlined"
    fullWidth
  />
 
    <TextField
        label="Education/Experience"
        onChange={handleChange}
        type="text"
        name="education"
        value={state.education || ''}
        validators={["required"]}
        errorMessages={["This field is required"]}
        variant="outlined"
        fullWidth
      />
  
</Grid>

          </Grid>

          <Button color="primary" variant="contained" type="submit">
            <Icon>send</Icon>
            <span style={{ paddingLeft: "10px" }}>{id ? "Update" : "Submit"}</span>
          </Button>
          <Button color="secondary" variant="contained" onClick={() => navigate('/professors')} style={{ marginLeft: '10px' }}>
            Cancel
          </Button>
        </ValidatorForm>
      </SimpleCard>
    </Container>
  );
};

export default CreateProfessor;
