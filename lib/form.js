export function getErrorMessage(error) {
  if (error.graphQLErrors) {
    return getBadInputError(error).message
  }
  return error.message
}

export function getBadInputError(error) {
  for (const graphQLError of error.graphQLErrors) {
    if (
        graphQLError.extensions &&
        graphQLError.extensions.code === 'BAD_USER_INPUT'
    ) {
      return graphQLError
    }
  }
}
