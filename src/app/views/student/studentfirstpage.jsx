
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb, SimpleCard } from "app/components";
import {
  Box, Button, Table, styled, TableRow, TableBody, TableCell, TableHead, TablePagination, IconButton, Icon
} from "@mui/material";
import { Card, Grid, Tooltip } from '@mui/material';
import { Group, ThumbUp, ThumbDown, ArrowRightAlt } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles'; // Import the useTheme hook
import { Small } from "app/components/Typography";
// STYLED COMPONENT
const StyledTable = styled(Table)(() => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } }
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } }
  }
}));

const StyledCard = styled(Card)(({ theme, borderColor }) => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "24px !important",
  background: theme.palette.background.paper,
  border: `1px solid ${borderColor}`, // Add border with dynamic color
  borderRadius: "8px", // Optional: Add border radius for aesthetics
  [theme.breakpoints.down("sm")]: { padding: "16px !important" }
}));

const cardList = [
  { name: "Students", amount: 1150, Icon: Group },
  { name: "Active", amount: 1140, Icon: ThumbUp },
  { name: "Inactive", amount: 10, Icon: ThumbDown },
];

const borderColors = {
  Students: (theme) => theme.palette.primary.main, // Primary color for Professors
  Active: (theme) => theme.palette.success.main, // Success color for Active
  Inactive: (theme) => theme.palette.error.main // Error color for Inactive
};
const ContentBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  "& small": { color: theme.palette.text.secondary },
  "& .icon": { opacity: 0.6, fontSize: "44px", color: theme.palette.primary.main }
}));

const Heading = styled("h6")(({ theme }) => ({
  margin: 0,
  marginTop: "4px",
  fontSize: "14px",
  fontWeight: "500",
  color: theme.palette.primary.main
}));

function StudentFirstpage() {
  const navigate = useNavigate();
  const [students, setstudents] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchstudents = async () => {
      try {
        const response = await fetch('http://localhost:3005/api/getstudents'); // Update with your API URL
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setstudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchstudents();
  }, []);

  const handleCreateClick = () => {
    navigate('/student/createstudent');
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  
  const theme = useTheme(); // Use the useTheme hook to get the theme
  

  return (
    <Box margin="30px">
      <Box className="breadcrumb" mb={3}>
        <Breadcrumb routeSegments={[{ name: "Material", path: "/material" }, { name: "Student" }]} />
      </Box>

      {/* Create Student Button with Icon */}
      <Box display="flex" justifyContent="flex-start" alignItems="center" mb={2}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Icon>add</Icon>}
          onClick={handleCreateClick}
        >
          Create Student
        </Button>
      </Box>
      <Grid container spacing={3} sx={{ mb: "24px" }}>
      {cardList.map(({ amount, Icon, name }) => (
        <Grid item xs={12} md={4} key={name}>
          <StyledCard elevation={6} borderColor={borderColors[name](theme)}>
            <ContentBox>
              <Icon className="icon" />
              <Box ml="12px">
                <Small>{name}</Small>
                <Heading>{amount}</Heading>
              </Box>
            </ContentBox>

            <Tooltip title="View Details" placement="top">
              <IconButton>
                <ArrowRightAlt />
              </IconButton>
            </Tooltip>
          </StyledCard>
        </Grid>
      ))}
    </Grid>
      {/* Table to display professor details with pagination */}
      <SimpleCard title="Student List">
        <StyledTable>
          <TableHead>
            <TableRow>
              <TableCell align="left">First Name</TableCell>
              <TableCell align="left">Middle Name</TableCell>
              <TableCell align="left">Last Name</TableCell>
           
              <TableCell align="left">Email</TableCell>
              <TableCell align="left">Phone</TableCell>
            
            
              <TableCell align="left">Age</TableCell>
              <TableCell align="left">Join Date</TableCell>
             
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((professor, index) => (
                <TableRow key={index}>
                  <TableCell align="left">{professor.FirstName}</TableCell>
                  <TableCell align="left">{professor.MiddleName}</TableCell>
                  <TableCell align="left">{professor.LastName}</TableCell>
                 
                  <TableCell align="left">{professor.Email}</TableCell>
                  <TableCell align="left">{professor.Phone}</TableCell>
          
                  <TableCell align="left">{professor.Age}</TableCell>
                  <TableCell align="left">{formatDate(professor.JoinDate)}</TableCell> 
                
                  <TableCell align="center">
                    <IconButton color="primary">
                      <Icon>edit</Icon>
                    </IconButton>
                    <IconButton color="secondary">
                      <Icon>delete</Icon>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </StyledTable>

        {/* Pagination */}
        <TablePagination
          sx={{ px: 2 }}
          component="div"
          page={page}
          rowsPerPage={rowsPerPage}
          count={students.length}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
          nextIconButtonProps={{ "aria-label": "Next Page" }}
          backIconButtonProps={{ "aria-label": "Previous Page" }}
        />
      </SimpleCard>
    </Box>
  );
}

export default StudentFirstpage;
