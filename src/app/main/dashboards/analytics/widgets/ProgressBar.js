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
                LifeTime Usage {'>'} 100,000 mi
              </Typography>
              <Typography className="text-12 font-medium" color="text.secondary">
                Upper end of average vehicle lifespan
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
            Avg daily usage {'<'} 200 mi
          </Typography>
          <Typography className="text-12 font-medium" color="text.secondary">
            UCharged in 6hr by a level 2 charger
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
            Est annual fuel savings {'>'} $10,000 
          </Typography>
          <Typography className="text-12 font-medium" color="text.secondary">
            potential for significant COST reduction
          </Typography>
              
            </div>
         
          </div>

       
        </div>
      </div>
    </>
  )
}

export default ProgressBar