import {useMemo} from 'react'
import {ApolloClient, InMemoryCache, split} from '@apollo/client'
import {getMainDefinition} from "@apollo/client/utilities";
import merge from 'deepmerge'

let apolloClient
const SUBSCRIPTION_URI = "ws://localhost:3000/subsription"

function createIsomorphLink() {
  if (typeof window === 'undefined') {
    const { SchemaLink } = require('@apollo/client/link/schema')
    const { schema } = require('./schema')
    return new SchemaLink({ schema })
  } else {
    const { WebSocketLink } = require('@apollo/client/link/ws')
    const { HttpLink } = require('@apollo/client/link/http')

    const httpLink = new HttpLink({
      uri: '/api/graphql',
      credentials: 'same-origin',
    })

    const webSocketLink = new WebSocketLink({
      uri: SUBSCRIPTION_URI,
      options: {
        reconnect: true
      },
    })

    return split(({query}) => {
          const definition = getMainDefinition(query);
          return (
              definition.kind === 'OperationDefinition' &&
              definition.operation === 'subscription'
          );
        },
        webSocketLink,
        httpLink
    )
  }
}

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: createIsomorphLink(),
    cache: new InMemoryCache(),
  })
}

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient()

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // get hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract()

    // Merge the existing cache into data passed from getStaticProps/getServerSideProps
    const data = merge(initialState, existingCache)

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data)
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}

export function useApollo(initialState) {
  const store = useMemo(() => initializeApollo(initialState), [initialState])
  return store
}
