const ValidateSession = (status) => {
  try {
    if(status == 500) {
      window.location.href = '/'
    }
  } catch(error){
    console.log(error);
  }
}

export { ValidateSession }