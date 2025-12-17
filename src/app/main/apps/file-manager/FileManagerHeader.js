import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useSelector } from 'react-redux';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { selectFiles, selectFolders, selectPath } from './store/itemsSlice';

function FileManagerHeader(props) {
  const folders = useSelector(selectFolders);
  const files = useSelector(selectFiles);
  const path = useSelector(selectPath);

  return (
    <div className="p-24 sm:p-32 w-full flex flex-col sm:flex-row space-y-8 sm:space-y-0 items-center justify-between">
    <Typography  variant="h5" sx={{fontWeight:"800"}} >
    Site Report 
  </Typography>

    </div>
  );
}

export default FileManagerHeader;
