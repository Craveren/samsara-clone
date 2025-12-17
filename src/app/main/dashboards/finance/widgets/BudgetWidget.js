import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import LinearProgress from '@mui/material/LinearProgress';
import IconButton from '@mui/material/IconButton';
import { selectWidgets } from '../store/widgetsSlice';

function BudgetWidget(props) {
  const widgets = useSelector(selectWidgets);
  const { expenses, expensesLimit, savings, savingsGoal, bills, billsLimit } = widgets?.budget;

  function calcProgressVal(val, limit) {
    const percentage = (val * 100) / limit;

    return percentage > 100 ? 100 : percentage;
  }

  return (
    <Paper className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <Typography className="mr-16 text-lg font-medium tracking-tight leading-6 truncate">
            Summary
          </Typography>
          
        </div>
        <div className="-mt-8">
          <IconButton aria-label="more" size="large">
            <FuseSvgIcon>heroicons-outline:dots-vertical</FuseSvgIcon>
          </IconButton>
        </div>
      </div>


      <div className="my-32 space-y-32">
        <div className="flex flex-col">
          <div className="flex items-center space-x-16">
            <div className="flex items-center justify-center w-56 h-56 rounded bg-red-100 text-red-800 dark:bg-red-600 dark:text-red-50">
              <FuseSvgIcon className="text-current">heroicons-outline:credit-card</FuseSvgIcon>
            </div>
            <div className="flex-auto leading-none">
              <Typography className="text-12 font-medium" color="text.secondary">
                Cruise Control
              </Typography>
              <Typography className="font-medium text-20">
                61
              </Typography>
              <LinearProgress
                variant="determinate"
                className="mt-4"
                color="warning"
                value={calcProgressVal(expenses, expensesLimit)}
              />
            </div>
            <div className="flex items-end justify-end min-w-72 mt-auto ml-24">
              <div className="text-lg leading-none">2.6%</div>
              <FuseSvgIcon size={16} className="text-green-600">
                heroicons-solid:arrow-narrow-down
              </FuseSvgIcon>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center space-x-16">
            <div className="flex items-center justify-center w-56 h-56 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-600 dark:text-indigo-50">
              <FuseSvgIcon className="text-current">heroicons-outline:cash</FuseSvgIcon>
            </div>
            <div className="flex-auto leading-none">
              <Typography className="text-12 font-medium" color="text.secondary">
                Green Band
              </Typography>
              <Typography className="font-medium text-20">
                69
              </Typography>
              <LinearProgress
              variant="determinate"
              className="mt-4"
              color="warning"
              value={calcProgressVal(expenses, expensesLimit)}
            />
          </div>
          <div className="flex items-end justify-end min-w-72 mt-auto ml-24">
            <div className="text-lg leading-none">2.6%</div>
            <FuseSvgIcon size={16} className="text-green-600">
              heroicons-solid:arrow-narrow-down
            </FuseSvgIcon>
          </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center space-x-16">
            <div className="flex items-center justify-center w-56 h-56 rounded bg-teal-100 text-teal-800 dark:bg-teal-600 dark:text-teal-50">
              <FuseSvgIcon className="text-current">heroicons-outline:light-bulb</FuseSvgIcon>
            </div>
            <div className="flex-auto leading-none">
              <Typography className="text-12 font-medium" color="text.secondary">
                Anticipation
              </Typography>
              <Typography className="font-medium text-20">
                99
              </Typography>
              <LinearProgress
                variant="determinate"
                className="mt-4"
                color="secondary"
                value={calcProgressVal(bills, billsLimit)}
              />
            </div>
            <div className="flex items-end justify-end min-w-72 mt-auto">
              <div className="text-lg leading-none">105.7%</div>
              <FuseSvgIcon size={16} className="text-red-600 ml-4">
                heroicons-solid:arrow-narrow-up
              </FuseSvgIcon>
            </div>
          </div>

          
        </div>
        <div className="flex flex-col">
          <div className="flex items-center space-x-16">
          <div className="flex items-center justify-center w-56 h-56 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-600 dark:text-indigo-50">
          <FuseSvgIcon className="text-current">heroicons-outline:cash</FuseSvgIcon>
        </div>
            <div className="flex-auto leading-none">
              <Typography className="text-12 font-medium" color="text.secondary">
                Coasting 
              </Typography>
              <Typography className="font-medium text-20">
                96
              </Typography>
              <LinearProgress
                variant="determinate"
                className="mt-4"
                color="secondary"
                value={calcProgressVal(bills, billsLimit)}
              />
            </div>
            <div className="flex items-end justify-end min-w-72 mt-auto">
              <div className="text-lg leading-none">105.7%</div>
              <FuseSvgIcon size={16} className="text-red-600 ml-4">
                heroicons-solid:arrow-narrow-up
              </FuseSvgIcon>
            </div>
          </div>

          
        </div>
        <div className="flex flex-col">
          <div className="flex items-center space-x-16">
            <div className="flex items-center justify-center w-56 h-56 rounded bg-teal-100 text-teal-800 dark:bg-teal-600 dark:text-teal-50">
              <FuseSvgIcon className="text-current">heroicons-outline:light-bulb</FuseSvgIcon>
            </div>
            <div className="flex-auto leading-none">
              <Typography className="text-12 font-medium" color="text.secondary">
                High Torque 
              </Typography>
              <Typography className="font-medium text-20">
                88
              </Typography>
              <LinearProgress
                variant="determinate"
                className="mt-4"
                color="secondary"
                value={calcProgressVal(bills, billsLimit)}
              />
            </div>
            <div className="flex items-end justify-end min-w-72 mt-auto">
              <div className="text-lg leading-none">105.7%</div>
              <FuseSvgIcon size={16} className="text-red-600 ml-4">
                heroicons-solid:arrow-narrow-up
              </FuseSvgIcon>
            </div>
          </div>

          
        </div>
        <div className="flex flex-col">
          <div className="flex items-center space-x-16">
          <div className="flex items-center justify-center w-56 h-56 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-600 dark:text-indigo-50">
          <FuseSvgIcon className="text-current">heroicons-outline:cash</FuseSvgIcon>
        </div>
            <div className="flex-auto leading-none">
              <Typography className="text-12 font-medium" color="text.secondary">
                Ideling 
              </Typography>
              <Typography className="font-medium text-20">
                10
              </Typography>
              <LinearProgress
                variant="determinate"
                className="mt-4"
                color="secondary"
                value={calcProgressVal(savings, savingsGoal)}
              />
            </div>
            <div className="flex items-end justify-end min-w-72 mt-auto">
              <div className="text-lg leading-none">105.7%</div>
              <FuseSvgIcon size={16} className="text-red-600 ml-4">
                heroicons-solid:arrow-narrow-up
              </FuseSvgIcon>
            </div>
          </div>

          
        </div>
        <div className="flex flex-col">
          <div className="flex items-center space-x-16">
          <div className="flex items-center justify-center w-56 h-56 rounded bg-red-100 text-red-800 dark:bg-red-600 dark:text-red-50">
          <FuseSvgIcon className="text-current">heroicons-outline:credit-card</FuseSvgIcon>
        </div>
            <div className="flex-auto leading-none">
              <Typography className="text-12 font-medium" color="text.secondary">
                Time Over Speed 
              </Typography>
              <Typography className="font-medium text-20">
                95
              </Typography>
              <LinearProgress
                variant="determinate"
                className="mt-4"
                color="secondary"
                value={calcProgressVal(bills, billsLimit)}
              />
            </div>
            <div className="flex items-end justify-end min-w-72 mt-auto">
              <div className="text-lg leading-none">105.7%</div>
              <FuseSvgIcon size={16} className="text-red-600 ml-4">
                heroicons-solid:arrow-narrow-up
              </FuseSvgIcon>
            </div>
          </div>

          
        </div>
      </div>

      <div className="">
        <Button variant="outlined">Download Summary</Button>
      </div>
    </Paper>
  );
}

export default memo(BudgetWidget);
