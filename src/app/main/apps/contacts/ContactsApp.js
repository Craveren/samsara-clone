import FusePageSimple from '@fuse/core/FusePageSimple';
import withReducer from 'app/store/withReducer';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useDeepCompareEffect } from '@fuse/hooks';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import ContactsSidebarContent from './ContactsSidebarContent';
import ContactsHeader from './ContactsHeader';
import ContactsList from './ContactsList';
import reducer from './store';
import { getTags } from './store/tagsSlice';
import { getCountries } from './store/countriesSlice';
import { getContacts } from './store/contactsSlice';
import { Button, Grid, Typography } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import MapGoogle from './MapGoogle';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
  },
}));

function ContactsApp(props) {
  const dispatch = useDispatch();
  const pageLayout = useRef(null);
  const routeParams = useParams();
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  useDeepCompareEffect(() => {
    dispatch(getContacts());
    dispatch(getCountries());
    dispatch(getTags());
  }, [dispatch]);

  useEffect(() => {
    setRightSidebarOpen(Boolean(routeParams.id));
  }, [routeParams]);

  return (
   <>
   <div className="p-24 sm:p-32 w-full border-b-1">
      <div className="flex flex-col items-center sm:items-start">
        <Grid container>
        <Grid item md={4}>
        <Typography  variant="h5" sx={{fontWeight:"800"}} >
          216
        </Typography>
        <Typography color="text.secondary" sx={{mb:"0.5rem"}}>
          2020 FORD TRANSIT <span style={{color:"green"}} > 35 MPH</span> {'50 LIMIT'}
        </Typography>
        <hr/>
        <Button variant='outlined' sx={{my:"2rem",width:"90%",fontWeight:"800"}}>Live Server</Button>
        <Typography sx={{fontWeight:"800",marginY:"0.3rem"}} >
         <ArrowDropDownIcon/> En Route
        </Typography>
        <img src='assets/images/dashCam.jpg' style={{borderRadius:"0.5rem"}}/>
        <Typography sx={{fontWeight:"800",marginY:"0.3rem",my:"2rem"}} >
         <ArrowLeftIcon/> Sensor
        </Typography>
        <Typography sx={{fontWeight:"800",marginY:"0.3rem"}} >
         <ArrowDropDownIcon/> Assets Stats
        </Typography>
        <Typography color="text.secondary" sx={{my:"0.2rem",marginX:"0.3rem"}} >VIN</Typography>
        <Typography sx={{fontWeight:"800",my:"0.4rem"}} >
         <ArrowDropDownIcon/> Diagnostics
        </Typography>
        <div className='parent-div' style={{padding:"0.8rem"}}>
        <div className='child-div-1' style={{display:"flex",justifyContent:"space-between",marginTop:"0.2rem"}}>
        <Typography color="text.secondary" >Engine State</Typography>
        <Typography color="text.secondary" >Running</Typography>
        </div>
        <div className='child-div-1' style={{display:"flex",justifyContent:"space-between",marginTop:"0.2rem"}}>
        <Typography color="text.secondary" >Engine Check Light</Typography>
        <Typography color="text.secondary" >off</Typography>
        </div>
        <div className='child-div-1' style={{display:"flex",justifyContent:"space-between",marginTop:"0.2rem"}}>
        <Typography color="text.secondary" >Odometer</Typography>
        <Typography color="text.secondary" >19,251 mi</Typography>
        </div>
        </div>
        </Grid>
        <Grid item md={8}>
        <MapGoogle />
        </Grid>
        </Grid>
    </div>
    </div>
   </>
  );
}

export default withReducer('contactsApp', reducer)(ContactsApp);
