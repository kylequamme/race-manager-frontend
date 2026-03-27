'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

export default function NewEvent() {

  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const returnToEvents = () => {
    setAnchorEl(null);
    router.push("/");
  };

  const [formData, setFormData] = useState({
    date: dayjs().unix(),
    name: '',
    track: '',
    divisionId: 1,
    modId: 1
  });

  const endpoint = "http://127.0.0.1:9091/event"

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
      returnToEvents();
    }
  }

  const handleInputChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const setFormDate = (value: any) => {
    value = dayjs(value).format('YYYY/MM/DD HH:mm');
    var unixDate = dayjs(value).valueOf() / 1000;
    setFormData({
      ...formData,
      date : unixDate,
    });
  }

  return (
    <main>
      <Grid container item={true} xs={10} sm={4} sx={{m: 2}}>
        <Typography sx={{m: 2}} variant="h4">New Event</Typography>
        <form onSubmit={submitForm}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker sx={{m: 2}} defaultValue={dayjs()} onChange={(newDate) => setFormDate(newDate)} label="Event date and time" />
          </LocalizationProvider>
          <TextField sx={{m: 2}} id="name" name="name" value={formData.name} onChange={handleInputChange} type="text" label="Event Name" variant="outlined" fullWidth />
          <TextField sx={{m: 2}} id="track" name="track" value={formData.track} onChange={handleInputChange} type="text" label="Track" variant="outlined" fullWidth/>
          <FormControl sx={{m: 2}} fullWidth>
            <InputLabel id="division-select-label">Division</InputLabel>
            <Select
              labelId="division-select-label"
              id="divisionId"
              name="divisionId"
              value={formData.divisionId}
              onChange={handleInputChange}
              label="Division"
            >
              <MenuItem value={1}>Sportsman</MenuItem>
              <MenuItem value={2}>Late Model</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{m: 2}} fullWidth>
            <InputLabel id="mod-select-label">Mod</InputLabel>
            <Select
              labelId="mod-select-label"
              id="modId"
              name="modId"
              value={formData.modId}
              onChange={handleInputChange}
              label="Mod"
            >
              <MenuItem value={1}>aero88_cts</MenuItem>
              <MenuItem value={2}>lmpv2</MenuItem>
            </Select>
          </FormControl>
          <Button sx={{m: 2}} type="submit" variant="contained" color="success">Save</Button>
        </form>
      </Grid>
    </main>
  )
}
