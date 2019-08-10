const { io } = require('../server');

const { Usuarios } = require('../classes/usuarios');
const usuarios = new Usuarios(); // Instancia de usuarios inicializada

// Importar función crearMensaje
const { crearMensaje } = require('../utilidades/utilidades');

io.on('connection', (client) => {

    /*
        console.log('Usuario conectado');

        client.emit('enviarMensaje', {
            usuario: 'Administrador',
            mensaje: 'Bienvenido a esta aplicación'
        });
    */

    //console.log('Usuario conectado: ', usuario);

    // Configurar el listenner para saber quien es el usuario
    // Se recibe un función con información del usuario
    client.on('entrarChat', function(data, callback) {

        //console.log('data: ', data);

        // Validar si viene el nombre o no
        // Validar que el usuario tenga la sala también
        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                message: 'El nombre/sala es necesario'
            })
        }

        // Conectar a un usuario a una sala
        client.join(data.sala);

        // Como si viene el nombre se agrega a la clase
        // client contiene el id del usuario
        //let personas = usuarios.agregarPersona(client.id, data.nombre, data.sala); // Se regresan todos los usuarios conectados, en un arreglo

        // Modif. de línea previa para que solo se agregue la persona y no devolver el resultado a perosnas
        usuarios.agregarPersona(client.id, data.nombre, data.sala); // Se regresan todos los usuarios conectados, en un arreglo

        // Cominicar a los usuarios que una persona acaba de ingresar al chat
        // Evento para que todas las personas conectadas escuchen
        //client.broadcast.emit('listaPersona', usuarios.getPersonas());
        // Evento para que las personas conectadas a una sala escuchen
        client.broadcast.to(data.sala).emit('listaPersona', usuarios.getPersonasPorSala(data.sala));

        // Retornan en el callbak las personas que están conectadas al chat
        //callback(personas);

        // Retornan en el callbak las personas que están conectadas al chat de la misma sala
        callback(usuarios.getPersonasPorSala(data.sala));
    })

    // Que el servidor esté escuchando cuando algún usuario llama al 
    // método de crearMensaje
    // Recibe data
    client.on('crearMensaje', (data) => {

        //let mensaje = crearMensaje(data.nombre, data.mensaje);

        // Obteniendo el nombre a partir de client (que es el client que esta conectado) 
        // y ya no de los datos, por lo que no será necesario enviar el nombre al crearMensaje,
        // porque lo obtiene de client (var. persona)
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);

        //client.broadcast.emit('crearMensaje', mensaje);

        // Enviar mensaje a las personas contectadas a la misma sala
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

    })

    // Al recargar la página reconecta al usuario y vuelve a crear una instancia
    // del socket para el usuario por lo que se tiene que borrar el usuario
    // Cuando el cliente se desconecte, se borra su usuario, de otra forma se muestran
    // el usuario para cada vez que se recargue la página
    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona(client.id);

        // Cuando una persona se va del chat informamos a todos los usuarios
        // con un broadcast
        // Llamar evento crearMensaje con las propiedades de usuario que lo envía
        // y el mensaje del usuario que abandona el chat
        //client.broadcast.emit('crearMensaje', { usuario: 'Administrador', mensaje: `${ personaBorrada.nombre} abandonó el chat` });
        //client.broadcast.emit('crearMensaje', crearMensaje('Administrador', `${ personaBorrada.nombre } salió`));

        // Comunicar a los usuarios que una persona acaba de abandonar el chat
        // Evento para que todas las personas conectadas escuchen
        //client.broadcast.emit('listaPersona', usuarios.getPersonas());


        // Cuando una persona se va del chat informamos a los usuarios conectados a la misma sala
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${ personaBorrada.nombre } salió`));

        // Comunicar a los usuarios de la misma sala que una persona acaba de abandonar el chat
        client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSala(personaBorrada.sala));

    });

    // Mensajes privados
    // Escuchar cuando se estén emitiendo los mensajes privados
    // Lo que hace el servidor cuando alguien quiera enviar un mensaje privado a alguien
    // Acción del servidor de estar escuchando un mensaje privado
    // Recibe data que contiene el id de la persona que se necesita enviar
    client.on('mensajePrivado', (data) => {

        let persona = usuarios.getPersona(client.id);

        // Mandar un mensaje a todas las personas que están conectadas
        // Suponemos que el mensaje viene el data (Hacer la validación de que viene el mensaje)
        // Para enviarle un mensaje a un usuario en particular agregamos .to() al broadcast
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje))
    })
});