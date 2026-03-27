'use client'

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField,Typography } from '@mui/material'
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';


const endpoint = "http://127.0.0.1:9091/event";
const getDivisionsEndpoint = "http://127.0.0.1:9091/events";
const getModsEndpoint = "http://127.0.0.1:9091/mods"

export default function EditEvents() {

  const router = useRouter();
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [eventData, setEventData] = useState(null)
  const [divisionData, setDivisionData] = useState(null)
  const [modData, setModData] = useState(null)
  const [isLoading, setLoading] = useState(true)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const returnToEvents = () => {
    setAnchorEl(null);
    router.push("/");
  };

  const [formData, setFormData] = useState({
    id: 0,
    date: dayjs().unix(),
    name: "",
    track: "",
    divisionId: 0,
    modId: 0
  });

  useEffect(() => {
    const fetchEvent = async () => {
      const records = await fetch(`${endpoint}/${id}`)
        .then((res) => res.json())
        .then((eventData) => {
          setEventData(eventData)
          setFormData(eventData)
          console.log(eventData)
        })
    }
    const fetchDivisions = async () => {
      const events = await fetch(getDivisionsEndpoint)
        .then((res) => res.json())
        .then((divisionData) => {
          setDivisionData(divisionData)
          console.log(divisionData)
        })
    }
    const fetchMods = async () => {
      const drivers = await fetch(getModsEndpoint)
        .then((res) => res.json())
        .then((modData) => {
          setModData(modData)
          console.log(modData)
          setLoading(false)
        })
    }
    fetchEvent()
    fetchDivisions()
    fetchMods()
  }, [])

  const submitForm = async (e: any) => {
    e.preventDefault();

    const res = await fetch(`${endpoint}/${id}`, {
      method: "PUT",
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

  if (!eventData || !divisionData || !modData) return <Typography sx={{m: 2}} variant="h4">Loading...</Typography>

  return (
    <main>
      <Grid container item={true} xs={10} sm={4} sx={{m: 2}}>
        <Typography sx={{m: 2}} variant="h4">Edit Event</Typography>
        <form onSubmit={submitForm}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker sx={{m: 2}} value={dayjs.unix(formData.date)} onChange={(newDate) => setFormDate(newDate)} label="Event date and time" />
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
              {divisionData.map((division, index) => {
                return (
                  <MenuItem key={division.id} value={division.id}>{division.name}</MenuItem>
                );
              })}
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
              {modData.map((mod, index) => {
                return (
                  <MenuItem key={mod.id} value={mod.id}>{mod.name}</MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <Button sx={{m: 2}} type="submit" variant="contained" color="success">Save</Button>
        </form>
      </Grid>
    </main>
  )
}
