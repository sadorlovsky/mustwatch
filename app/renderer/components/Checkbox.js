import React from 'react'

const Checkbox = ({ checked, onChange }) => (
  <label className='container'>
    <input type='checkbox' checked={checked} onChange={onChange} />
    <span className='checkmark' />

    <style jsx>{`
      .container {
        display: block;
        position: relative;
        padding-left: 35px;
        margin-bottom: 12px;
        cursor: pointer;
        font-size: 22px;
        user-select: none;
      }

      .container > input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
      }

      .checkmark {
        position: absolute;
        top: 0;
        left: 0;
        height: 15px;
        width: 15px;
        background-color: #eee;
        border-radius: 3px;
      }

      .container:hover > input ~ .checkmark {
        background-color: #ccc;
      }

      .container > input:checked ~ .checkmark {
        background-color: #F553BF;
      }

      .checkmark:after {
        content: "";
        position: absolute;
        display: none;
      }

      .container > input:checked ~ .checkmark:after {
        display: block;
      }

      .container > .checkmark:after {
        left: 5px;
        top: 1px;
        width: 3px;
        height: 8px;
        border: solid white;
        border-width: 0 3px 3px 0;
        transform: rotate(45deg);
      }
    `}</style>
  </label>
)

export default Checkbox
