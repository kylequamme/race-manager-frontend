'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Button, ButtonGroup, Grid, Typography } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  {
    field: 'carNumber',
    headerName: 'Car #',
    width: 200,
    editable: false,
  },
  {
    field: 'lastName',
    headerName: 'Last Name',
    width: 200,
    editable: false,
    sortingOrder: ['asc', 'desc', null],
  },
  {
    field: 'firstName',
    headerName: 'First Name',
    width: 200,
    editable: false,
    sortingOrder: ['asc', 'desc', null],
  },
  {
    field: 'division',
    headerName: 'Division',
    width: 200,
    editable: false,
    valueGetter: (params) => params.row?.division.name 
  },
];

export default function Drivers() {

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

  const endpoint = "http://127.0.0.1:9091/drivers"
 
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
          <Typography sx={{m: 1}} variant="h4">Drivers</Typography>
        </Grid>
        <Grid item xs={8} />
        <Grid item xs={2} container justifyContent="flex-end">
          <ButtonGroup sx={{m: 1}} variant="contained" aria-label="outlined button group">
            <Button color="success" onClick={()=> handleNavButtonClick("/drivers/new")}>New</Button>
            <Button disabled={editButtonDisabled} onClick={()=> handleNavButtonClick(`/drivers/edit?id=${selectedRowIndex}`)}>Edit</Button>
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
            sortModel: [{ field: 'lastName', sort: 'asc'}, { field: 'firstName', sort: 'asc'}]
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
