import { gql } from '@apollo/client'

export const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    createdAt: Int!
    firstName: String!
    lastName: String!
    hashtag: String!
  }
  
  type Chat {
    id: ID!
    from: String!
    to: String!
    message: String!
  }

  input SignUpInput {
    email: String!,
    password: String!,
    firstName: String!,
    lastName: String!
  }

  input SignInInput {
    email: String!
    password: String!
  }

  type SignUpPayload {
    user: User!
  }

  type SignInPayload {
    user: User!
  }

  type Query {
    user(id: ID!): User!
    users: [User]!
    viewer: User
  }

  type Mutation {
    signUp(input: SignUpInput!): SignUpPayload!
    signIn(input: SignInInput!): SignInPayload!
    signOut: Boolean!
  }
  
  type Subscription {
    newMessage: Chat
  }
`
