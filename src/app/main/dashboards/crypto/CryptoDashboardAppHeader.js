import Typography from '@mui/material/Typography';


function CryptoDashboardAppHeader(props) {


  return (
    <>
    <div className="flex w-full container">
    <div className="flex flex-col sm:flex-col flex-auto sm:items-left min-w-0 p-24 md:p-32 pb-10 md:pb-10 mb-10">
      <div className="flex flex-col flex-auto">
        <Typography className="text-3xl font-semibold tracking-tight leading-8 pb-12">
          Maintenece Status
        </Typography>
       
      </div>
      
     
    </div>
   
  </div>
    </>
  );
}

export default CryptoDashboardAppHeader;
