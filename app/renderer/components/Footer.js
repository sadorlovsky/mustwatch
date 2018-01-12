import React from 'react'
import { Motion, spring } from 'react-motion'

const Footer = ({ text }) => (
  <Motion
    defaultStyle={{ height: -30 }}
    style={{ height: spring(0) }}>
    {style => {
      console.log('STYLE', style)
      return (
        <div className='footer'>
          {text}
          <style jsx>{`
            .footer {
              position: fixed;
              bottom: ${style.height}px;
              left: 0;
              background: #282629;
              color: #fff;
              width: 100%;
              padding: 5px 15px;
            }
          `}</style>
        </div>
      )
    }}
  </Motion>
)

export default Footer
