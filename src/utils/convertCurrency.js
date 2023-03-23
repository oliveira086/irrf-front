function convertCurrency (value) {

  let indexCifra = value.toString().indexOf('R$');

  if(indexCifra > -1) {
    if(typeof value == 'string') {
      const removeString = value.substring(2, value.length);
      const removeDot = removeString.replace(/\./g,'');
      const replaceComma = removeDot.replace(',', '.');

      return parseFloat(replaceComma).toFixed(2);
    }
  } else {
    const removeDot = value.toString().replace(/\./g,'');
    const replaceComma = removeDot.replace(',', '.');
      
    return parseFloat(replaceComma).toFixed(2);
  }
  
}

export default convertCurrency;