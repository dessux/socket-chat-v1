// Recibir el nombre de la persona
// Recibir el mensaje
// Devuelve el nombre del usuario, el mensaje y la fecha
const crearMensaje = (nombre, mensaje) => {

    return {
        nombre,
        mensaje,
        fecha: new Date().getTime()
    };

}

module.exports = {
    crearMensaje
}