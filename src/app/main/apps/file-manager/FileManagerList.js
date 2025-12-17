import { useSelector } from 'react-redux';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import { lighten } from '@mui/material/styles';
import { selectFiles, selectFolders } from './store/itemsSlice';
import FolderItem from './FolderItem';
import FileItem from './FileItem';
import { Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import MapGoogle from './MapGoogle';
import format from 'date-fns/format';
import clsx from 'clsx';
// import { format } from 'core-js/core/date';
// import { GoogleMap, LeadScript } from '@react-google-maps/api';

function FileManagerList() {
  const folders = useSelector(selectFolders);
  const files = useSelector(selectFiles);

  const columns= [
    "Assets",
    "Driver",
    "Arrival",
    "Departure",
    "Time On Site",
    "GPS Distance Traveled",
    "Engine Hours"
  ];

 const rows=[
    {
      
      "Assets": "92160",
      "Driver": "shaheryar",
      "Arrival": "4 july 2002 4:00 PM",
      "Departure": "4 july 2002 4:00 PM",
      "Time On Site":"33m 12s",
      "GPS Distance Traveled": "0.3 mi",
      "Engine Hours":"27m"
    },
    
    {
      
      "Assets": "92160",
      "Driver": "shaheryar",
      "Arrival": "4 july 2002 4:00 PM",
      "Departure": "4 july 2002 4:00 PM",
      "Time On Site":"33m 12s",
      "GPS Distance Traveled": "0.3 mi",
      "Engine Hours":"27m"
    },
    
    {
      
      "Assets": "92160",
      "Driver": "shaheryar",
      "Arrival": "4 july 2002 4:00 PM",
      "Departure": "4 july 2002 4:00 PM",
      "Time On Site":"33m 12s",
      "GPS Distance Traveled": "0.3 mi",
      "Engine Hours":"27m"
    },
    
    {
      
      "Assets": "92160",
      "Driver": "shaheryar",
      "Arrival": "4 july 2002 4:00 PM",
      "Departure": "4 july 2002 4:00 PM",
      "Time On Site":"33m 12s",
      "GPS Distance Traveled": "0.3 mi",
      "Engine Hours":"27m"
    },
    
    {
      
      "Assets": "92160",
      "Driver": "shaheryar",
      "Arrival": "4 july 2002 4:00 PM",
      "Departure": "4 july 2002 4:00 PM",
      "Time On Site":"33m 12s",
      "GPS Distance Traveled": "0.3 mi",
      "Engine Hours":"27m"
    },
    
    {
      
      "Assets": "92160",
      "Driver": "shaheryar",
      "Arrival": "4 july 2002 4:00 PM",
      "Departure": "4 july 2002 4:00 PM",
      "Time On Site":"33m 12s",
      "GPS Distance Traveled": "0.3 mi",
      "Engine Hours":"27m"
    },
    
    {
      
      "Assets": "92160",
      "Driver": "shaheryar",
      "Arrival": "4 july 2002 4:00 PM",
      "Departure": "4 july 2002 4:00 PM",
      "Time On Site":"33m 12s",
      "GPS Distance Traveled": "0.3 mi",
      "Engine Hours":"27m"
    },
    
   
   
  ]

  return (
    <div className="p-32">
    <Grid container >
    <Grid item md={4} >
    <Typography  variant="h5" sx={{fontWeight:"800"}} >
        Summary
        </Typography>
        <Typography color="text.secondary" sx={{mb:"1rem"}}>
         Jan 18,2023 12:00 AM - Jan 20,2023 11:59 PM
        </Typography>
        <Typography  variant="h6" sx={{fontWeight:"700"}} >
        Assets
        </Typography>
        <Typography variant="h6" color="text.secondary"  sx={{mb:"1rem",fontWeight:"600"}}>
        14
        </Typography>
        <Typography  variant="h6" sx={{fontWeight:"700"}} >
        Visits
        </Typography>
        <Typography variant="h6" color="text.secondary"  sx={{mb:"1rem",fontWeight:"600"}}>
        29
        </Typography>
        <Typography  variant="h6" sx={{fontWeight:"700"}} >
        Average time per visit
        </Typography>
        <Typography variant="h6" color="text.secondary"  sx={{mb:"1rem",fontWeight:"600"}}>
        14hr 4m
        </Typography>
    </Grid>
    <Grid item md={8}  >
    <MapGoogle />
    </Grid>
    <hr/>
    <Paper className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden">
    <Typography className="text-2xl font-semibold  pt-12 px-12" >
    Visits
  </Typography>
      <div className="table-responsive mt-24">
        <Table className="simple w-full min-w-full">
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell key={index}>
                  <Typography
                    color="text.secondary"
                    className="font-semibold text-12 whitespace-nowrap"
                  >
                    {column}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                {Object.entries(row).map(([key, value]) => {
                  switch (key) {
                 
                    case 'Assets': {
                      return (
                        <TableCell key={key} component="th" scope="row">
                          <Typography className="">
                            {value}
                          </Typography>
                        </TableCell>
                      );
                    }
                    case 'Driver': {
                        return (
                          <TableCell key={key} component="th" scope="row">
                            <Typography className="">
                              {value}
                            </Typography>
                          </TableCell>
                        );
                      }
                   
                    case 'Arrival': {
                      return (
                        <TableCell key={key} component="th" scope="row">
                          <Typography className="" color="text.secondary">
                            {value} 
                          </Typography>
                        </TableCell>
                      );
                    }
                    case 'Departure': {
                      return (
                        <TableCell key={key} component="th" scope="row">
                          <Typography className="" color="text.secondary">
                            {value} 
                          </Typography>
                        </TableCell>
                      );
                    }
                    case 'Time On Site': {
                      return (
                        <TableCell key={key} component="th" scope="row">
                          <Typography className="" color="text.secondary">
                            {value} 
                          </Typography>
                        </TableCell>
                      );
                    }
                    case 'GPS Distance Traveled': {
                      return (
                        <TableCell key={key} component="th" scope="row">
                          <Typography className="" color="text.secondary">
                            {value} 
                          </Typography>
                        </TableCell>
                      );
                    }
                    case 'Engine Hours': {
                      return (
                        <TableCell key={key} component="th" scope="row">
                          <Typography className="" color="text.secondary">
                            {value} 
                          </Typography>
                        </TableCell>
                      );
                    }
                   
                    default: {
                      return (
                        <TableCell key={key} component="th" scope="row">
                          <Typography className="">{value}</Typography>
                        </TableCell>
                      );
                    }
                  }
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Paper>

    </Grid>
    </div>
  );
}

export default FileManagerList;
