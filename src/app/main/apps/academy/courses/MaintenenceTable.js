import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { memo } from "react";
import { useSelector } from "react-redux";
import Button from "@mui/material/Button";
import format from "date-fns/format";
import clsx from "clsx";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
// import { selectTable } from '../store/widgetsSlice';

function RecentTransactionsWidget(props) {
  //   const widgets = useSelector(selectTable);
  //   console.warn("Recent Transactions",widgets.recentTransactions);
  //   const { columns, rows } = widgets?.recentTransactions;

  const columns = ["Title", "Intervals", "Configure Assets", "Actions"];

  const rows = [
    {
      Title: "Oil Change",
      Intervals: "Every 10,000 mi",
      "Configure Assets": "3",
    },
    {
      Title: "Brakes",
      Brakes: "Every 180 days",
      "Configure Assets": "3",
    },
    {
      Title: "Oil Change",
      Intervals: "Every 10,000 mi",
      "Configure Assets": "3",
    },
    {
      Title: "Oil Change",
      Intervals: "Every 10,000 mi",
      "Configure Assets": "3",
    },
    {
      Title: "Oil Change",
      Intervals: "Every 10,000 mi",
      "Configure Assets": "3",
    },
    {
      Title: "Oil Change",
      Intervals: "Every 10,000 mi",
      "Configure Assets": "3",
    },
    {
      Title: "Oil Change",
      Intervals: "Every 10,000 mi",
      "Configure Assets": "3",
    },
    {
      Title: "Oil Change",
      Intervals: "Every 10,000 mi",
      "Configure Assets": "3",
    },
  ];

  return (
    <Paper className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden">
      <Typography className="text-2xl font-semibold  pt-12 px-12">
        Fault History
      </Typography>
      <div className="table-responsive mt-24">
        <Table className="simple w-full min-w-full">
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell key={index}>
                  {index === 4 ? <Typography
                    color="text.secondary"
                    className="font-semibold text-12 whitespace-nowrap"
                  >
                    {column}
                  </Typography> : <Typography
                    color="text.secondary"
                    className="font-semibold text-12 whitespace-nowrap text-center"
                  >
                    {column}
                  </Typography>}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                {Object.entries(row).map(([key, value]) => {
                  switch (key) {
                    case "FirstSeen": {
                      return (
                        <TableCell key={key} component="th" scope="row">
                          <Typography className="">
                            {format(new Date(value), "MMM dd, y")}
                          </Typography>
                        </TableCell>
                      );
                    }
                    case "LastSeen": {
                      return (
                        <TableCell key={key} component="th" scope="row">
                          <Typography className="">
                            {format(new Date(value), "MMM dd, y")}
                          </Typography>
                        </TableCell>
                      );
                    }

                    case "name": {
                      return (
                        <TableCell key={key} component="th" scope="row">
                          <Typography className="" color="text.secondary">
                            {value}
                          </Typography>
                        </TableCell>
                      );
                    }
                    case "status": {
                      return (
                        <TableCell key={key} component="th" scope="row">
                          <Typography
                            className={clsx(
                              "inline-flex items-center font-bold text-10 px-10 py-2 rounded-full tracking-wide uppercase",
                              value === "pending" &&
                                "bg-red-100 text-red-800 dark:bg-red-600 dark:text-red-50",
                              value === "completed" &&
                                "bg-green-50 text-green-800 dark:bg-green-600 dark:text-green-50"
                            )}
                          >
                            {value}
                          </Typography>
                        </TableCell>
                      );
                    }
                    default: {
                      return (
                        <TableCell key={key} component="th" scope="row">
                          <Typography className="text-center">{value}</Typography>
                        </TableCell>
                      );
                    }
                  }
                })}
                <TableCell component="th" scope="row">
                  <div className="flex items-end mt-24 sm:mt-0 sm:mx-8 space-x-12 justify-center">
                    <Button
                      className="whitespace-nowrap"
                      variant="contained"
                      color="primary"
                      startIcon={
                        <FuseSvgIcon size={20}>
                          heroicons-solid:mail
                        </FuseSvgIcon>
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      className="whitespace-nowrap"
                      variant="contained"
                      color="secondary"
                      startIcon={
                        <FuseSvgIcon size={20}>heroicons-solid:cog</FuseSvgIcon>
                      }
                    >
                      Remove
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Paper>
  );
}

export default memo(RecentTransactionsWidget);
