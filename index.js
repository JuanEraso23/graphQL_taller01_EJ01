const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

// Datos en memoria
const estudiantes = [
  { id: "1", nombre: "Sofia", edad: 15 },
  { id: "2", nombre: "Juan", edad: 16 },
  { id: "3", nombre: "Ana", edad: 20 }
];

// Esquema
const schema = buildSchema(`
  type Estudiante {
    id: ID!
    nombre: String!
    edad: Int!
    esMayor: Boolean!
  }

  type Query {
    hola: String!
    estudiantes: [Estudiante!]!
    estudiantePorId(id: ID!): Estudiante
  }
`);

// Resolvers
const root = {
  hola: () => {
    const ahora = new Date();
    return `¡Hola! Son las ${ahora.getHours()}:${ahora.getMinutes()}:${ahora.getSeconds()} del ${ahora.getDate()}/${ahora.getMonth() + 1}/${ahora.getFullYear()}`;
  },
  
  estudiantes: () => {
    return estudiantes.map(e => ({
      ...e,
      esMayor: e.edad >= 18
    }));
  },
  
  estudiantePorId: ({ id }) => {
    const estudiante = estudiantes.find(e => e.id === id);
    if (!estudiante) return null;
    return {
      ...estudiante,
      esMayor: estudiante.edad >= 18
    };
  }
};

// App con GraphiQL habilitado
const app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,  // ¡Esto habilita la interfaz visual!
}));

app.listen(4000, () => {
  console.log('✅ Servidor corriendo en http://localhost:4000/graphql');
  console.log('📝 Abre esa URL para usar GraphiQL');
});