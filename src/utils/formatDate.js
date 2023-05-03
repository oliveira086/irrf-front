import moment from "moment";

const formatDate = (date) => {
  let data = new Date(date);
  let mes = data.getMonth() + 1;
  let dia = moment(date).format('DD');
  let ano = moment(date).format('YYYY');

  switch(mes) {
    case 1:
      return { day: dia, month: 'Janeiro', year: ano }
      break
    case 2:
      return { day: dia, month: 'Fevereiro', year: ano};
      break
    case 3:
      return { day: dia, month: 'Março', year: ano};
      break
    case 4:
      return { day: dia, month: 'Abril', year: ano};
      break
    case 5:
      return { day: dia, month: 'Maio', year: ano};
      break
    case 6:
      return { day: dia, month: 'Junho', year: ano};
      break
    case 7:
      return { day: dia, month: 'Julho', year: ano};
      break
    case 8:
      return { day: dia, month: 'Agosto', year: ano};
      break
    case 9:
      return { day: dia, month: 'Setembro', year: ano};
      break
    case 10:
      return { day: dia, month: 'Outubro', year: ano};
      break
    case 11:
      return { day: dia, month: 'Novembro', year: ano};
      break
    case 12:
      return { day: dia, month: 'Dezembro', year: ano};
      break
  }
}

export default formatDate;