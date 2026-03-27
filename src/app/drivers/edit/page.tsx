'use client'

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField,Typography } from '@mui/material'

const endpoint = "http://127.0.0.1:9091/driver";
const getDivisionsEndpoint = "http://127.0.0.1:9091/divisions";

export default function EditDriver() {

  const router = useRouter();
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [driverData, setDriverData] = useState(null)
  const [divisionData, setDivisionData] = useState(null)
  const [isLoading, setLoading] = useState(true)
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

  useEffect(() => {
    const fetchDriver = async () => {
      const records = await fetch(`${endpoint}/${id}`)
        .then((res) => res.json())
        .then((driverData) => {
          setDriverData(driverData)
          setFormData(driverData)
          console.log(driverData)
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
    fetchDriver()
    fetchDivisions()
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
      returnToDrivers();
    }
  }

  const handleInputChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!driverData || !divisionData) return <Typography sx={{m: 2}} variant="h4">Loading...</Typography>

  return (
    <main>
      <Grid container item={true} xs={10} sm={4} sx={{m: 2}} >
      <Typography sx={{m: 2}} variant="h4">Edit Driver</Typography>
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
              {divisionData.map((division, index) => {
                return (
                  <MenuItem key={division.id} value={division.id}>{division.name}</MenuItem>
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
