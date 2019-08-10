// Ejemplo del formato de un usuario
//{
//    id: 'Alksdlfjgserfjk-asdkj',
//    nombre: 'Fernando',
//    sala: 'Video Juegos'
//}

// La clase Usuarios se encarga de todos los usuarios conectados

class Usuarios {

    constructor() {
        // Inicializar un arreglo de personas contectadas al chat
        this.personas = [];
    }

    // Permite agregar una persona al chat
    // Recibe id que regresa el socket Y
    // nombre de la persona
    // sala a la que se ha unido
    agregarPersona(id, nombre, sala) {
        // datos que se necesitan grabar como parte de una persona
        let persona = { id, nombre, sala };

        // Agregar la persona al arreglo de personas que se maneja  
        this.personas.push(persona);

        // Obtener todas las personas que se encuentran en un chat
        return this.personas;
    }

    // Obtener una persona por el id (el cual es único)
    // Al usar filter recibiendo por cada iteración una persona y una
    // función y regresa una condición para evaluar (si id = persona.id)
    // Si lo encuentra extrae un único registro [0]
    getPersona(id) {
        /*
        let persona = this.personas.filter( persona => {
            return persona.id === id
        })[0];
        */
        // persona se puede representar en una sola línea:
        let persona = this.personas.filter(persona => persona.id === id)[0];

        // Si no se encuentra ninguna persona que coincida con el id,
        // persona será undefined o null
        return persona;
    }

    // Obtener todas las personas
    getPersonas() {
        // Regresar todas las personas que tenga el chat
        return this.personas;
    }

    getPersonasPorSala(sala) {
        // Regresar todas las personas conectadas a la misma sala
        /*
        let personasEnSala = this.personas.filter(persona => {
            return persona.sala === sala;
        });
        */
        // La instrucción previa en unsa sola línea:
        let personasEnSala = this.personas.filter(persona => persona.sala === sala);

        return personasEnSala;

    }

    // Eliminar una persona del arreglo de personas (por que se fué, se desconectó,
    // o cualquier otra razón por la que la persona abandona el chat)
    borrarPersona(id) {

        // Guardar pista (referencia) del usuario (id) que abandonó el chat
        let personaBorrada = this.getPersona(id);

        // Buscar el id en el arreglo de personas y se reemplasa el arreglo personas 
        // con arreglo personas menos el id borrado
        /*
        this.personas = this.personas.filter(persona => {
            return persona.id != id
        })
        */
        // this.personas Se puede representar en unsa sola línea:
        this.personas = this.personas.filter(persona => persona.id != id)

        // Cuando se borre una persona, siempre se va a tener la referencia
        // Regresar la persona borrada
        return personaBorrada;

    }
}



module.exports = {
    Usuarios
}