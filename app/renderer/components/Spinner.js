import React from 'react'
import { PulseLoader } from 'halogenium'

const Spinner = () => (
  <div className='container'>
    <PulseLoader color='#F553BF' size='16px' margin='4px' />

    <style jsx global>{`
      body {
        background: #282629;
        margin: 0;
        padding: 0;
      }
    `}</style>
    <style jsx>{`
      .container {
        width: 100%;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    `}</style>
  </div>
)

export default Spinner
