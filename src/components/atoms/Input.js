import React from 'react';
import * as chakra from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { FiKey } from 'react-icons/fi';

const Input = ({ label, placeholder, isError, value, onChange, type, ref, icon, ...props  }) => {
  const [show, setShow] = React.useState(false)
  const handleClick = () => setShow(!show)

  switch(type) {
    case 'password':
      return (
        <div>
          <span className='mb-2 font-semibold'>{label}</span>
          <chakra.InputGroup>
            <chakra.Input
              isInvalid={isError}
              pr='4.5rem'
              type={show ? 'text' : 'password'}
              placeholder={placeholder}
              value={value}
              ref={ref}
              onChange={onChange}
              props
            />
            <chakra.InputRightElement width='4.5rem'>
              <chakra.Button variant='ghost' h='1.75rem' size='sm' onClick={handleClick}>
                {show ?  <BsEyeSlash size={20} /> : <BsEye size={20}/>}
              </chakra.Button>
            </chakra.InputRightElement>
          </chakra.InputGroup>
        </div>
      );
    case 'icon':
      return (
        <div>
          <chakra.InputGroup>
            <chakra.InputLeftElement
              pointerEvents='none'
              children={icon}
            />
            <chakra.Input placeholder={placeholder} ref={ref} value={value} isInvalid={isError} onChange={onChange} props />
          </chakra.InputGroup>
        </div>
      );
    default:
      return (
        <div className='flex flex-col'>
          <span className='mb-2 font-semibold'>{label}</span>
          <chakra.Input placeholder={placeholder} ref={ref} size='md' value={value} isInvalid={isError} onChange={onChange} props />
        </div>
      )
  }
}

Input.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  isInvalid: PropTypes.bool.isRequired
};

Input.defaultProps = {
  label: 'Label',
  placeholder: '',
  type: 'Primary',
  onChange: () => {},
  isInvalid: false
};

export default Input;