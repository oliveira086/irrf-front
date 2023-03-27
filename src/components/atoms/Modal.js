import * as chakra from '@chakra-ui/react';
import PropTypes from 'prop-types';

const Modal = ({ title, isOpen, modalOpenAndClose, children, isCentered, size = 'md' }) => {
  return (
    <>
      <chakra.Modal closeOnOverlayClick={false} size={size} isOpen={isOpen} onClose={modalOpenAndClose} isCentered={isCentered}>
        <chakra.ModalOverlay />
        <chakra.ModalContent maxH={size === 'xl' ? '760px': '400px'} maxW={size === 'xl' ? "1050px": '600px'}>
          <chakra.ModalHeader>{title}</chakra.ModalHeader>
          <chakra.ModalCloseButton />
          <chakra.ModalBody className='w-auto'>
            {children}
          </chakra.ModalBody>
        </chakra.ModalContent>
      </chakra.Modal>
    </>
  );
}

export default Modal