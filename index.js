const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')

const persons = [
  {
    name: 'Arto Hellas',
    phone: '040-123456',
    address: {
      street: 'Tapiolantie 1',
      city: 'Espoo'
    },
    id: '3d594650-3436-11e9-bc57-8b80ba54c431'
  },
  {
    name: 'Matti Luukkainen',
    phone: '040-432134',
    address: {
      street: 'Malminkaari 10',
      city: 'Helsinki'
    },
    id: '3d594651-3436-11e9-bc57-8b80ba54c431'
  },
  {
    name: 'Venla Lahtinen',
    address: {
      street: 'Tallinnankatu 1',
      city: 'Helsinki'
    },
    id: '3d594652-3436-11e9-bc57-8b80ba54c431'
  }
]

const typeDefs = `
  enum YesNo {
    YES
    NO
  }

  type Address {
    street: String!
    city: String!
  }

  type Person {
    name: String!
    phone: String
    address: Address!
    id: ID!
  }

  type Query {
    personCount: Int!
    allPersons(phone: YesNo): [Person!]!
    findPerson(name: String!): Person
  }`


const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: (root, args) => {
      if (!args.phone) {
        return persons
      }
      const byPhone = (person) =>
        args.phone === 'YES' ? person.phone : !person.phone
      return persons.filter(byPhone)
    },
    findPerson: (root, args) => persons.find(p => p.name === args.name)
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})