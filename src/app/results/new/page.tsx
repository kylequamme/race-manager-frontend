'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField,Typography } from '@mui/material'


export default function NewResult() {

  const router = useRouter();
  const [eventData, setEventData] = useState(null)
  const [driverData, setDriverData] = useState(null)
  const [isLoading, setLoading] = useState(true)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const returnToResults = () => {
    setAnchorEl(null);
    router.push("/results");
  };

  const endpoint = "http://127.0.0.1:9091/result";
  const getEventsEndpoint = "http://127.0.0.1:9091/events";
  const getDriversEndpoint = "http://127.0.0.1:9091/drivers"

  useEffect(() => {
    fetch(getEventsEndpoint)
      .then((res) => res.json())
      .then((eventData) => {
        setEventData(eventData)
        console.log(eventData)
      })

    fetch(getDriversEndpoint)
      .then((res) => res.json())
      .then((driverData) => {
        setDriverData(driverData)
        console.log(driverData)
        setLoading(false)
      })
  }, [])

  const [formData, setFormData] = useState({
    driverId: 1,
    eventId: 1,
    heat1: 0,
    heat2: 0,
    feature: 0
  });

  const submitForm = async (e: any) => {
    e.preventDefault();

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
      
    });
    console.log("formData: " + JSON.stringify(formData));

    const data = await res.json();
    console.log(data);
    if(!data.error){
      returnToResults();
    }
  }

  const handleInputChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNumberInputChange = (e: any) => {
    var n = Math.round(e.target.value);
    setFormData({
      ...formData,
      [e.target.name]: n,
    });
  };

  if (!eventData || !driverData) return <Typography sx={{m: 2}} variant="h4">Loading...</Typography>

  return (
    <main>
      <Grid container item={true} xs={10} sm={4} sx={{m: 2}} >
      <Typography sx={{m: 2}} variant="h4">New Results</Typography>
        <form onSubmit={submitForm}>
          <FormControl sx={{m: 2}} fullWidth>
            <InputLabel id="event-select-label">Event</InputLabel>
            <Select
              labelId="event-select-label"
              id="eventId"
              name="eventId"
              value={formData.eventId}
              onChange={handleInputChange}
              label="Event"
            >
              {eventData.map((event, index) => {
                return (
                  <MenuItem key={event.id} value={event.id}>{event.name} - {event.division.name}</MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl sx={{m: 2}} fullWidth>
            <InputLabel id="driver-select-label">Driver</InputLabel>
            <Select
              labelId="driver-select-label"
              id="driverId"
              name="driverId"
              value={formData.driverId}
              onChange={handleInputChange}
              label="Driver"
            >
              {driverData.map((driver, index) => {
                return (
                  <MenuItem key={driver.id} value={driver.id}>{driver.firstName} {driver.lastName}</MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <TextField sx={{m: 2}} id="heat1" name="heat1" value={formData.heat1} onChange={handleNumberInputChange} type="number" InputProps={{ inputProps: { min: 0 } }} label="Heat 1" variant="outlined" fullWidth />
          <TextField sx={{m: 2}} id="heat2" name="heat2" value={formData.heat2} onChange={handleNumberInputChange} type="number" InputProps={{ inputProps: { min: 0 } }} label="Heat 2" variant="outlined" fullWidth />
          <TextField sx={{m: 2}} id="feature" name="feature" value={formData.feature} onChange={handleNumberInputChange} type="number" InputProps={{ inputProps: { min: 0 } }} label="Feature" variant="outlined" fullWidth />
        <Button sx={{m: 2}} type="submit" variant="contained" color="success">Save</Button>
        </form>
      </Grid>
    </main>
  )
}
