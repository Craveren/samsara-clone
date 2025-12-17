// Hidden component replacement for Material-UI v5
// @mui/material/Hidden was removed in v5, use this instead
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

/**
 * Hidden component - replacement for @mui/material/Hidden
 * Usage: <Hidden lgUp>content</Hidden> or <Hidden lgDown>content</Hidden>
 * 
 * Note: In Material-UI v5, Hidden was removed. This component provides
 * the same functionality using useMediaQuery hook.
 */
export default function Hidden({ children, lgUp, lgDown, mdUp, mdDown, smUp, smDown, xsUp, xsDown, only, ...props }) {
  const theme = useTheme();
  
  // Determine breakpoint - props can be boolean or just present
  let shouldHide = false;
  
  // Handle 'only' prop (e.g., only="lg")
  if (only) {
    const breakpoint = typeof only === 'string' ? only : only[0];
    const isUp = useMediaQuery(theme.breakpoints.up(breakpoint));
    const isDown = useMediaQuery(theme.breakpoints.down(breakpoint));
    shouldHide = !(isUp && isDown);
  } else if (lgUp !== undefined && lgUp !== false) {
    // lgUp can be true or just present
    shouldHide = useMediaQuery(theme.breakpoints.up('lg'));
  } else if (lgDown !== undefined && lgDown !== false) {
    shouldHide = useMediaQuery(theme.breakpoints.down('lg'));
  } else if (mdUp !== undefined && mdUp !== false) {
    shouldHide = useMediaQuery(theme.breakpoints.up('md'));
  } else if (mdDown !== undefined && mdDown !== false) {
    shouldHide = useMediaQuery(theme.breakpoints.down('md'));
  } else if (smUp !== undefined && smUp !== false) {
    shouldHide = useMediaQuery(theme.breakpoints.up('sm'));
  } else if (smDown !== undefined && smDown !== false) {
    shouldHide = useMediaQuery(theme.breakpoints.down('sm'));
  } else if (xsUp !== undefined && xsUp !== false) {
    shouldHide = useMediaQuery(theme.breakpoints.up('xs'));
  } else if (xsDown !== undefined && xsDown !== false) {
    shouldHide = useMediaQuery(theme.breakpoints.down('xs'));
  }
  
  if (shouldHide) {
    return null;
  }
  
  return <Box {...props}>{children}</Box>;
}

