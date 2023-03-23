import PropTypes from 'prop-types';


import MaskedInput from 'react-text-mask'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'


const MoneyInput = ({ label, placeholder, value, onChange, ref }) => { 

  const defaultMaskOptions = {
    prefix: 'R$',
    suffix: '',
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: '.',
    allowDecimal: true,
    decimalSymbol: ',',
    decimalLimit: 2, // how many digits allowed after the decimal
    integerLimit: 8, // limit length of integer numbers
    allowNegative: false,
    allowLeadingZeroes: false,
  }
  const currencyMask = createNumberMask({...defaultMaskOptions});

  return (
    <div className='flex flex-col'>
      <span className='mb-2 font-semibold'>{label}</span>
      <MaskedInput id="input-mask"
        className='border rounded min-h-[40px] pl-4'
        mask={currencyMask}
        placeholder={placeholder}
        value={value}
        ref={ref}
        onChange={onChange}
      />
    </div>
  )

}

MoneyInput.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
};

MoneyInput.defaultProps = {
  label: 'Label',
  placeholder: '',
  onChange: () => {}
};

export default MoneyInput;