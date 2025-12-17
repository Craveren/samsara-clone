import Input from '@mui/material/Input';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Box } from '@mui/system';
import {
  selectFilteredContacts,
  selectSearchText,
  setContactsSearchText,
} from './store/contactsSlice';
import { Grid } from '@mui/material';

function ContactsHeader(props) {
  const dispatch = useDispatch();
  const searchText = useSelector(selectSearchText);
  const filteredData = useSelector(selectFilteredContacts);

  return (
    <div className="p-24 sm:p-32 w-full border-b-1">
      <div className="flex flex-col items-center sm:items-start">
        <Grid container>
        <Grid item md={4}>
        <Typography color="text.secondary" variant="h5">
          216
        </Typography>
        <Typography color="text.secondary" >
          2020 FORD TRANSIT <span>35 MPH</span> {'50 LIMIT'}
        </Typography>
        </Grid>
        <Grid item md={8}>
        
        </Grid>
        </Grid>
    </div>
    </div>
  );
}

export default ContactsHeader;
