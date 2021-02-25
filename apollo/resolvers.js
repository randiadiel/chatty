import { AuthenticationError, UserInputError } from 'apollo-server-micro'
import {createUser, findUser, getAllUser, validatePassword} from '../lib/user'
import { setLoginSession, getLoginSession } from '../lib/auth'
import { removeTokenCookie } from '../lib/auth-cookies'
import Joi from 'joi'

export const resolvers = {
  Query: {
    async viewer(_parent, _args, context, _info) {
      try {
        const session = await getLoginSession(context.req)

        if (session) {
          return findUser({ email: session.email })
        }
      } catch (error) {
        throw new AuthenticationError(
          'Authentication token is invalid, please log in'
        )
      }
    },
    async users(_parent, _args, context, _info) {
      try {
        return getAllUser()
      }
      catch (e) {
        throw new Error(e)
      }
    }
  },
  Mutation: {
    async signUp(_parent, args, _context, _info) {
      const validationSchema = Joi.object({
        email: Joi.string().email().max(255).required(),
        firstName: Joi.string().alphanum().max(255).pattern(new RegExp("^[0-9a-zA-Z]*$")).required(),
        lastName: Joi.string().alphanum().max(255).pattern(new RegExp("^[0-9a-zA-Z]*$")).required(),
        password: Joi.string().min(8).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
      });
      const {value, error} = validationSchema.validate(args.input)
      if (error) {
        throw new UserInputError("Error signing you up, please check your input again!", {validationErrors: error.details})
      }
      const user = await createUser(args.input)
      return { user }
    },
    async signIn(_parent, args, context, _info) {
      const user = await findUser({ email: args.input.email })

      if (user && (await validatePassword(user, args.input.password))) {
        const session = {
          id: user.id,
          email: user.email,
        }

        await setLoginSession(context.res, session)

        return { user }
      }

      throw new UserInputError('Invalid email and password combination')
    },
    async signOut(_parent, _args, context, _info) {
      removeTokenCookie(context.res)
      return true
    },
  },
}
