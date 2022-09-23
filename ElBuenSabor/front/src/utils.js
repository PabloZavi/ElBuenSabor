
//Esto permite ver si desde el backend nos llega un mensaje de error ({message: "mensaje"})
//Si no, muestra el mensaje de error por defecto
//Esto por ejemplo se aplica en "ProductScreen" en el catch del useEffect
export const getError = (error) => {
  return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
};
