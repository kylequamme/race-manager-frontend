'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Button, ButtonGroup, Grid, Typography } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  {
    field: 'eventName',
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
    field: 'points',
    headerName: 'Points',
    width: 200,
    editable: false,
    valueGetter: (params) => params.row?.points
  }
];

export default function Points() {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [data, setData] = useState([])
  const [isLoading, setLoading] = useState(true)

  const endpoint = "http://127.0.0.1:9091/points"

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
          <Typography sx={{m: 1}} variant="h4">Points</Typography>
        </Grid>
        <Grid item xs={10} />
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
            sortModel: [{ field: 'eventName', sort: 'asc'}]
          }
        }}
        pageSizeOptions={[5, 10, 15, 20]}
      />
    </main>
  )
}
