import React from 'react'
import withReducer from 'app/store/withReducer';
import reducer from '../project/store';

function moreDetials() {
  return (
    <div>moreDetials</div>
  )
}

export default withReducer('moreDetials', reducer)(moreDetials);