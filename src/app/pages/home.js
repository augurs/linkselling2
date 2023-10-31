import React from 'react'

const Home = () => {
  // let nipData = JSON.parse(localStorage.getItem("nipData"))
  return (
    <div className="inner-body" id = "content" >
      <h1 className='text-center mt-2'>Home</h1>

      {/* {nipData &&
        <div className='border border-1 w-50 mx-auto mt-5 text-center p-4'>
          <h2>Company Data</h2>
          <div>Company Name : {nipData?.company_name}</div>
          <div>Email : {nipData?.email}</div>
          <div>District : {nipData?.district}</div>
          <div>City : {nipData?.city}</div>
          <div>Postal Code : {nipData?.postal_code}</div>
          <div>Community : {nipData?.community}</div>
          <div>Property Number : {nipData?.property_number} </div>
          <div>Province : {nipData?.province}</div>
          <div>Street : {nipData?.street}</div>
        </div>} */}
    </div>
  )
}

export default Home