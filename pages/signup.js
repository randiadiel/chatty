import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { gql, useMutation } from '@apollo/client'
import {getBadInputError, getErrorMessage} from '../lib/form'
import Field from '../components/field'
import styles from "../styles/pages/auth/_index.module.scss";
import {Alert, Button, Card, Col, Container, Row, Spinner} from "react-bootstrap";

const SignUpMutation = gql`
  mutation SignUpMutation($email: String!, $password: String!, $firstName: String!, $lastName: String!) {
    signUp(input: { email: $email, password: $password, firstName: $firstName, lastName: $lastName }) {
      user {
        id
        email
        firstName
        lastName
      }
    }
  }
`

function SignUp() {
  const [signUp] = useMutation(SignUpMutation)
  const [errorMsg, setErrorMsg] = useState()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [inputErrors, setInputErrors] = useState()
  const router = useRouter()

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    const emailElement = event.currentTarget.elements.email
    const passwordElement = event.currentTarget.elements.password
    const firstName = event.currentTarget.elements.firstName
    const lastName = event.currentTarget.elements.lastName
    const confirmPassword = event.currentTarget.elements.confirmPassword

    if (passwordElement.value !== confirmPassword.value) {
      setErrorMsg("Password you enter is not the same")
      setIsSubmitting(false)
    }
    else {
      try {
        await signUp({
          variables: {
            email: emailElement.value,
            password: passwordElement.value,
            firstName: firstName.value,
            lastName: lastName.value,
          },
        })

        await router.push('/signin')
      } catch (error) {
        setErrorMsg(getErrorMessage(error))
        setInputErrors(getBadInputError(error).extensions.validationErrors)
        setIsSubmitting(false)
      }
    }
  }

  return (
      <div className={styles.auth}>
        <Container>
          <Row className={styles.customRow}>
            <Col lg={6} xl={5}>
              <Card className={styles.customCard}>
                <Card.Body>
                  <h1>Sign Up</h1>
                  <form onSubmit={handleSubmit}>
                    {(errorMsg) && <Alert variant={"danger"}><small>{errorMsg}</small> {(inputErrors) &&
                    <ul className={styles.errorList}>
                      {inputErrors.map((error) => {
                        return <li key={error.context.key}><small>{error.message}</small></li>
                      })}
                    </ul>}</Alert>}
                    <Row>
                      <Col md={6}>
                        <Field
                            name="firstName"
                            type="text"
                            label="First Name"
                            required
                        />
                      </Col>
                      <Col md={6}>
                        <Field
                            name="lastName"
                            type="text"
                            label="Last Name"
                            required
                        />
                      </Col>
                    </Row>
                    <Field
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        label="Email"
                    />
                    <Field
                        name="password"
                        type="password"
                        autoComplete="password"
                        required
                        label="Password"
                    />
                    <Field
                        name="confirmPassword"
                        type="password"
                        autoComplete="confirm-password"
                        required
                        label="Confirm Password"
                    />
                    <Button variant={"primary"} type="submit" className={"mt-3"}>
                      Sign Up {isSubmitting && <Spinner as={"span"} size={"sm"} role={"status"} animation={"border"}/>}
                    </Button>
                  </form>
                </Card.Body>
                <Card.Footer>
                  {'Already have an account? '}
                  <Link href="/signin">
                    <a>Sign in.</a>
                  </Link>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
  )
}

export default SignUp
