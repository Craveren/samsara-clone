import FuseSvgIcon from '@fuse/core/FuseSvgIcon/FuseSvgIcon'
import { LinearProgress, Typography } from '@mui/material'
import React from 'react'

function ProgressBar() {
  return (
    <>
    <div className=" space-y-32">
        <div className="flex flex-col">
          <div className="flex items-center space-x-16">
            <div className="flex items-center justify-center w-56 h-56 rounded bg-red-100 text-red-800 dark:bg-red-600 dark:text-red-50">
              <FuseSvgIcon className="text-current">heroicons-outline:credit-card</FuseSvgIcon>
            </div>
            <div className="flex-auto leading-none">
              <Typography className="text-13 font-medium" color="text.secondary">
                Max Daily Range {'>'} 300 mi
              </Typography>
              <Typography className="text-12 font-medium" color="text.secondary">
                Charged in 6hrs by a lvel 2 charger
              </Typography>
             
            </div>
            
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center space-x-16">
            <div className="flex items-center justify-center w-56 h-56 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-600 dark:text-indigo-50">
              <FuseSvgIcon className="text-current">heroicons-outline:cash</FuseSvgIcon>
            </div>
            <div className="flex-auto leading-none">
            <Typography className="text-13 font-medium" color="text.secondary">
            Avg Fuel Efficency {'<'} 25 MPG
          </Typography>
          <Typography className="text-12 font-medium" color="text.secondary">
            Potential for significant efficency gains
          </Typography>
              
            </div>
           
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center space-x-16">
            <div className="flex items-center justify-center w-56 h-56 rounded bg-teal-100 text-teal-800 dark:bg-teal-600 dark:text-teal-50">
              <FuseSvgIcon className="text-current">heroicons-outline:light-bulb</FuseSvgIcon>
            </div>
            <div className="flex-auto leading-none">
            <Typography className="text-13 font-medium" color="text.secondary">
            Est Emmision Saved {'>'} 200 lb 
          </Typography>
          <Typography className="text-12 font-medium" color="text.secondary">
            potential for significant sustainiblity impact
          </Typography>
              
            </div>
         
          </div>

       
        </div>
      </div>
    </>
  )
}

export default ProgressBar