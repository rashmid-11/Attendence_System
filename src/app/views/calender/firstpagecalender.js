
import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import {
  Button,
  styled,
  Grid
} from "@mui/material";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import 'jquery-ui/ui/widgets/datepicker';
import 'jquery-ui/themes/base/all.css';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import './fcalender.css';
import 'react-datepicker/dist/react-datepicker.css';

import axios from 'axios';

import { Autocomplete } from "@mui/material";
import { createFilterOptions } from "@mui/material/Autocomplete";

const TextField = styled(TextValidator)(() => ({
    width: "100%",
    marginBottom: "16px",
  }));

const AutoComplete = styled(Autocomplete)(() => ({ width: 300, marginBottom: "16px" }));



function FirstpageCalender() {
  const [ename, setEname] = useState('');
  const [stime, setSdate] = useState(null);
  const [edate, setEdate] = useState(null);
  const [etime, setEtime] = useState(null);
  const [edesc, setEdesc] = useState('');
  const [ecolor, setEcolor] = useState('fc-bg-default');
  const [etype, setEtype] = useState('operation'); // Added event type state
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClose = () => setIsModalOpen(false);

  const suggestions = [
    { label: "fc-bg-default" },
    { label: "fc-bg-blue" },
    { label: "fc-bg-lightgreen" },
    { label: "fc-bg-pinkred" },
    { label: "fc-bg-deepskyblue" },
  ];
  
  const eventTypeOptions = [
    { label: "Lectures" },
    { label: "Practical" },
    { label: "Workshop" },
    { label: "Training" },
  ];
  
  const filter = createFilterOptions();

  const [activeType, setActiveType] = useState('');
  const [state, setState] = useState({
    ename: "",
    edate: new Date(),
    etime: new Date(),
    edesc: "",
    ecolor: "fc-bg-default",
    etype: "operation",
  });

 
  const handleChange = (event) => {
    event.persist();
    setState({ ...state, [event.target.name]: event.target.value });
  };

  

  

  const [events, setEvents] = useState([
    {
      title: 'Barber',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      start: '2023-05-05',
      end: '2023-05-05',
      className: 'fc-bg-default',
      icon: 'circle',
    },
    {
      title: 'Flight Paris',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      start: '2023-08-08T14:00:00',
      end: '2023-08-08T20:00:00',
      className: 'fc-bg-deepskyblue',
      icon: 'cog',
      allDay: false,
    },
  ]);

  useEffect(() => {
    $(document).ready(function () {
      $('.datetimepicker').datepicker({
        timepicker: true,
        language: 'en',
        range: true,
        multipleDates: true,
        multipleDatesSeparator: ' - ',
      });

      $('#add-event').submit(function (event) {
        event.preventDefault();
        const formData = $(this).serializeArray();

        const newEvent = {
          title: formData.find((item) => item.name === 'ename')?.value || '',
          description: formData.find((item) => item.name === 'edesc')?.value || '',
          start: formData.find((item) => item.name === 'edate')?.value || '',
          className: formData.find((item) => item.name === 'ecolor')?.value || 'fc-bg-default',
          icon: '',
        };

        setEvents([...events, newEvent]);

        $(this)[0].reset();
        $('#modal-view-event-add').modal('hide');
      });
    });
  }, [events]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const url = activeType
          ? `http://localhost:3005/doctor/events/filter?type=${activeType}`
          : 'http://localhost:3005/doctor/events';

        const response = await axios.get(url);
        const updatedEvents = response.data.map((event) => ({
          ...event,
          type: event.className.split('-')[1], // Assuming className is like 'fc-bg-default'
        }));
        setEvents(updatedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, [activeType]);

  useEffect(() => {
    window.jQuery = $;
    window.$ = $;
    require('bootstrap');
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formattedDate = edate.toLocaleDateString('en-CA');
      const formattedTime = etime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      await axios.post('http://localhost:3005/doctor/save-event', {
        ename,
        edate: formattedDate,
        etime: formattedTime,
        edesc,
        ecolor,
        etype,
      });
      console.log('Event saved successfully!');
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleDateChange = (date) => {
    setEdate(date);
   
  };

  const renderEventContent = (eventInfo) => (
    <>
      {eventInfo.event.extendedProps.icon && (
        <i className={`fa fa-${eventInfo.event.extendedProps.icon}`}></i>
      )}
      <div style={{ color: 'black', fontSize: '12px' }}>
        <div>{eventInfo.event.title}</div>
      </div>
    </>
  );

  const eventRender = (eventInfo) => {
    const tooltip = `
      <div className="fc-tooltip" style="color: black;">
        <span>${eventInfo.event.title}</span>
        <span>${eventInfo.event.extendedProps.time}</span>
        <span>${eventInfo.event.extendedProps.description}</span>
      </div>
    `;

    $(eventInfo.el).tooltip({
      title: tooltip,
      html: true,
    });

    switch (eventInfo.event.extendedProps.type) {
      case 'operation':
        $(eventInfo.el).css('background-color', '#dc3545');
        break;
      case 'meeting':
        $(eventInfo.el).css('background-color', '#28a745');
        break;
      case 'workshop':
        $(eventInfo.el).css('background-color', '#ffc107');
        break;
      case 'training':
        $(eventInfo.el).css('background-color', '#17a2b8');
        break;
      default:
        $(eventInfo.el).css('background-color', '#007bff');
        break;
    }
  };

  const filterEvents = (type) => {
    setActiveType(type);
  };

  return (
    <div className='container'>
      <div className="row">
        <div className="col-md-3">
          <div className="card" style={{ backgroundColor: 'white' }}>
            <h4 style={{ textAlign: 'center', marginTop: '10px' }}>Timetable</h4>
            <div className="card-body">
              <div className="btn-group-vertical event-buttons d-flex justify-content-center">
                <button
                  type="button"
                  className={`btn ${activeType === 'operation' ? 'btn-danger' : 'btn-outline-danger'}`}
                  onClick={() => filterEvents('operation')}
                >
                  Lectures
                </button>
                <button
                  type="button"
                  className={`btn ${activeType === 'meeting' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => filterEvents('meeting')}
                >
                  Practical
                </button>
                <button
                  type="button"
                  className={`btn ${activeType === 'workshop' ? 'btn-warning' : 'btn-outline-warning'}`}
                  onClick={() => filterEvents('workshop')}
                >
                  Workshop
                </button>
                <button
                  type="button"
                  className={`btn ${activeType === 'training' ? 'btn-info' : 'btn-outline-info'}`}
                  onClick={() => filterEvents('training')}
                >
                  Training
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-9">
          <div className="card" style={{ backgroundColor: 'white' }}>
            <div className="card-body">
            <button
  type="button"
  className="btn btn-primary mb-3"
  onClick={() => setIsModalOpen(true)}
>
  Add Event
</button>
 {/* Play Button Outside Calendar */}
 {/* <button
        className="play-button"
        style={{ marginBottom: '20px' }}
        onClick={handlePlayButtonClick}
      >
        <i className={`fa fa-${isExpanded ? 'pause' : 'play'}`}></i> Expand Rows
      </button> */}
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                eventContent={renderEventContent}
                eventRender={eventRender}
                editable={true}
                headerToolbar={{
                  left: 'title',
                  center: 'dayGridMonth,timeGridWeek,timeGridDay',
                  right: 'today prev,next',
                }}
                eventClick={(info) => {
                  $('.event-icon').html(`<i class='fa fa-${info.event.extendedProps.icon}'></i>`);
                  $('.event-title').html(info.event.title);
                  $('.event-body').html(info.event.extendedProps.description);
                  $('.event-time').html(info.event.extendedProps.time);
                  $('#modal-view-event').modal('show');
                }}
              />
            </div>
          </div>
        </div>

        {/* Modal for adding a new event */}
        {isModalOpen && (
  <div className="modal modal-top fade show" style={{ display: 'block' }}>
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-body">
          <h6>Add Event Detail</h6>
          <ValidatorForm id="add-event" onSubmit={handleSubmit}>
            <div className="modal-body">
              {/* Event Name Field */}
              <TextField
                type="text"
                name="ename"
                label="Event Name"
                value={ename}
                onChange={handleChange}
                validators={["required"]}
                errorMessages={["this field is required"]}
                fullWidth
              />

              {/* Event Date Field */}
              <TextField
                type="date"
                name="edate"
                value={edate}
                onChange={handleChange}
                validators={["required"]}
                errorMessages={["this field is required"]}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
              />

              {/* Start Time and End Time in a single row */}
              <Grid container spacing={2}>
                <Grid item lg={6} md={6} sm={6} xs={12}>
                  <TextField
                    type="time"
                    name="stime"
                    label="Start Time"
                    value={stime}
                    onChange={handleChange}
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                    fullWidth
                  />
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={12}>
                  <TextField
                    type="time"
                    name="etime"
                    label="End Time"
                    value={etime}
                    onChange={handleChange}
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                    fullWidth
                  />
                </Grid>
              </Grid>

              {/* Event Description */}
              <TextField
                name="edesc"
                label="Event Description"
                multiline
                rows={4}
                value={edesc}
                onChange={handleChange}
                fullWidth
              />

              {/* Event Color Selection */}
              <AutoComplete
                options={suggestions}
                value={ecolor}
                onChange={(_, newValue) => {
                  setEcolor(newValue);
                }}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField {...params} label="Event Color" variant="outlined" fullWidth />
                )}
              />

              {/* Event Type Selection */}
              <AutoComplete
                options={eventTypeOptions}
                value={etype}
                onChange={(_, newValue) => {
                  setEtype(newValue);
                }}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField {...params} label="Event Type" variant="outlined" fullWidth />
                )}
              />
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <Button color="primary" variant="contained" type="submit">
                Save
              </Button>
              <Button color="secondary" variant="contained" onClick={handleClose}>
                Close
              </Button>
            </div>
          </ValidatorForm>
        </div>
      </div>
    </div>
  </div>
)}


      </div>
    </div>
  );
}

export default FirstpageCalender;
