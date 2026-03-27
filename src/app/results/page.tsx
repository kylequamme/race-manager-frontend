'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Button, ButtonGroup, Grid, Typography } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  {
    field: 'date',
    headerName: 'Date & Time',
    type: 'Date',
    width: 200,
    editable: false,
    valueGetter: (params) => params.row?.event.date,
    valueFormatter: date => new Date(date?.value*1000).toLocaleString()
  },
  {
    field: 'name',
    headerName: 'Event Name',
    width: 400,
    editable: false,
    valueGetter: (params) => params.row?.event.name + ' - ' + params.row?.event.division.name
  },
  {
    field: 'driver',
    headerName: 'Driver',
    width: 200,
    editable: false,
    valueGetter: (params) => params.row?.driver.firstName + " " + params.row?.driver.lastName + " - " + params.row?.driver.carNumber
  },
  {
    field: 'heat1',
    headerName: 'Heat 1',
    width: 120,
    editable: false,
  },
  {
    field: 'heat2',
    headerName: 'Heat 2',
    width: 120,
    editable: false,
  },
  {
    field: 'heatsCombined',
    headerName: 'Combined Heat Finishes',
    width: 200,
    editable: false,
    valueGetter: (params) => params.row?.heat1 + params.row?.heat2
  },
  {
    field: 'feature',
    headerName: 'Feature',
    width: 200,
    editable: false,
  }
];

export default function Results() {

  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [data, setData] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [selectedRow, setSelectedRow] = useState([]);
  const [editButtonDisabled, setEditButtonDisabled] = useState(true)
  const [selectedRowIndex, setSelectedRowIndex] = useState(0)
  
  const handleNavButtonClick = (path: string) => {
    setAnchorEl(null);
    router.push(path)
  };

  const endpoint = "http://127.0.0.1:9091/results"
 
  useEffect(() => {
    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
      })
  }, [])

  if (!data) return <Typography sx={{m: 2}} variant="h4">Loading...</Typography>

  return (
    <main>
      <Grid container alignItems="center">
        <Grid item xs={2} >
          <Typography sx={{m: 1}} variant="h4">Results</Typography>
        </Grid>
        <Grid item xs={8} />
        <Grid item xs={2} container justifyContent="flex-end">
          <ButtonGroup sx={{m: 1}} variant="contained" aria-label="outlined button group">
            <Button color="success" onClick={()=> handleNavButtonClick("/results/new")}>New</Button>
            <Button disabled={editButtonDisabled} onClick={()=> handleNavButtonClick(`/results/edit?id=${selectedRowIndex}`)}>Edit</Button>
          </ButtonGroup>
        </Grid>
      </Grid>
      <DataGrid
        rows={data}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
          sorting: {
            sortModel: [{ field: 'date', sort: 'asc'}]
          }
        }}
        pageSizeOptions={[5, 10, 15, 20]}
        onRowSelectionModelChange={(id) => {
          const selectedID = new Set(id)
          setSelectedRowIndex(Number(id[0]))
          setEditButtonDisabled(false)
          console.log(id);
        }}
      />
    </main>
  )
}
