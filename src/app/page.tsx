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
    valueFormatter: date => 
     new Date(date?.value*1000).toLocaleString()
  },
  {
    field: 'name',
    headerName: 'Event Name',
    width: 300,
    editable: false,
  },
  {
    field: 'track',
    headerName: 'Track',
    width: 300,
    editable: false,
  },
  {
    field: 'division',
    headerName: 'Division',
    width: 200,
    editable: false,
    valueGetter: (params) => params.row?.division.name 
  },
  {
    field: 'mod',
    headerName: 'Mod',
    width: 200,
    editable: false,
    valueGetter: (params) => params.row?.mod.name 
  }
];

export default function Home() {

  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleNavButtonClick = (path: string) => {
    setAnchorEl(null);
    router.push(path)
  };
  const [data, setData] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [selectedRow, setSelectedRow] = useState([]);
  const [editButtonDisabled, setEditButtonDisabled] = useState(true)
  const [selectedRowIndex, setSelectedRowIndex] = useState(0)

  const endpoint = "http://127.0.0.1:9091/events"
 
  useEffect(() => {
    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
      })
  }, [])

  return (
    <main>
      <Grid container alignItems="center">
        <Grid item xs={2} >
          <Typography sx={{m: 1}} variant="h4">Events</Typography>
        </Grid>
        <Grid item xs={8} />
        <Grid item xs={2} container justifyContent="flex-end">
          <ButtonGroup sx={{m: 1}} variant="contained" aria-label="outlined button group">
            <Button color="success" onClick={()=> handleNavButtonClick("/events/new")}>New</Button>
            <Button disabled={editButtonDisabled} onClick={()=> handleNavButtonClick(`/events/edit?id=${selectedRowIndex}`)}>Edit</Button>
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
