'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation'
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField,Typography } from '@mui/material'


export default function NewDriver() {

  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const returnToDrivers = () => {
    setAnchorEl(null);
    router.push("/drivers");
  };

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    carNumber: '',
    divisionId: 1
  });

  const endpoint = "http://127.0.0.1:9091/driver"

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
      returnToDrivers();
    }
  }

  const handleInputChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <main>
      <Grid container item={true} xs={10} sm={4} sx={{m: 2}} >
      <Typography sx={{m: 2}} variant="h4">New Driver</Typography>
        <form onSubmit={submitForm}>
          <TextField sx={{m: 2}} id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} type="text" label="First Name" variant="outlined" fullWidth />
          <TextField sx={{m: 2}} id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} type="text" label="Last Name" variant="outlined" fullWidth/>
          <TextField sx={{m: 2}} id="carNumber" name="carNumber" value={formData.carNumber} onChange={handleInputChange} type="text" InputProps={{ inputProps: { min: 0 } }} label="Car #" variant="outlined" fullWidth/>
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
        <Button sx={{m: 2}} type="submit" variant="contained" color="success">Save</Button>
        </form>
      </Grid>
    </main>
  )
}
