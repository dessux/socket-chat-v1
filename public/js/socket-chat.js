// Se trabaja toda la información del chat

var socket = io();

var params = new URLSearchParams(window.location.search);

// Validar si no viene el nombre y sala
if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html'; // Redirecciona a donde la persona se va a registrar 
    throw new Error('El nombre y sala son necesarios');
}

// Construir el nombre a partir de params.nombre
// Construir la sala a partir de params.sala
var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
};

socket.on('connect', function() {
    console.log('Conectado al servidor');

    // Disparar evento personalizado que le diga al chat (al backend) quien soy yo (el usuario)
    //socket.emit('entrarChat', { usuario: 'Fernando' });
    // Si el servidor acepta al usuario (porque el usuario se conecta), se tiene que hacer un callback
    // y regresa una respuesta con todos los usuario conectados
    socket.emit('entrarChat', usuario, function(resp) {
        console.log('Usuarios conectados: ', resp);
    });

});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
// Enviar un mensaje a todo el grupo
//socket.emit('crearMensaje', {
//    usuario: 'Fernando',
//    mensaje: 'Hola Mundo'
//}, function(resp) {
//    console.log('respuesta server: ', resp);
//});

// Escuchar información
socket.on('crearMensaje', function(mensaje) {

    console.log('Servidor:', mensaje);

});

// Escuchar cambios de usuarios
// cuando un usuario entra o sale del chat
socket.on('listaPersona', function(personas) {

    console.log('personas:', personas);

});

// Mensajes privados
// Acción del cliente de estar escuchando un mensaje privado
socket.on('mensajePrivado', function(mensaje) {
    console.log('Mensaje privado: ', mensaje);
})