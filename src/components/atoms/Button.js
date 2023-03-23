import * as chakra from '@chakra-ui/react';
import PropTypes from 'prop-types';

const Button = ({ label, type, onPress, isLoading }) => {

  if(type === 'second') {
    return (
      <chakra.Button
        colorScheme='teal'
        variant='outline'
        width='100%'
        borderColor={'#2F4ECC'}
        color={'#2F4ECC'}
        _hover={{ bg: '#fff' }}
        isLoading={isLoading}
        onClick={onPress}
      >
        {label}
      </chakra.Button>
    );
  } else {
    return (
      <chakra.Button colorScheme='teal' variant='solid' width='100%' backgroundColor={'#2F4ECC'} isLoading={isLoading} _hover={{ bg: '#5064B2' }} onClick={onPress}>
        {label}
      </chakra.Button>
    );
  }

  
}

Button.propTypes = {
  label: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired
};

Button.defaultProps = {
  label: 'Label',
  type: 'Primary',
  onPress: () => {},
  isLoading: false
};
export default Button;