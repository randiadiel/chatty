import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { gql, useMutation } from '@apollo/client'
import { getErrorMessage } from '../lib/form'
import Field from '../components/field'
import styles from "../styles/pages/auth/_index.module.scss";
import {Alert, Button, Card, Col, Container, Row, Spinner} from "react-bootstrap";

const SignUpMutation = gql`
  mutation SignUpMutation($email: String!, $password: String!) {
    signUp(input: { email: $email, password: $password }) {
      user {
        id
        email
      }
    }
  }
`

function SignUp() {
  const [signUp] = useMutation(SignUpMutation)
  const [errorMsg, setErrorMsg] = useState()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    const emailElement = event.currentTarget.elements.email
    const passwordElement = event.currentTarget.elements.password

    try {
      await signUp({
        variables: {
          email: emailElement.value,
          password: passwordElement.value,
        },
      })

      await router.push('/signin')
    } catch (error) {
      setErrorMsg(getErrorMessage(error))
      setIsSubmitting(false)
    }
  }

  return (
      <div className={styles.auth}>
        <Container>
          <Row className={styles.customRow}>
            <Col md={5}>
              <Card className={styles.customCard}>
                <Card.Body>
                  <h1>Sign Up</h1>
                  <form onSubmit={handleSubmit}>
                    {errorMsg && <Alert variant={"danger"}>{errorMsg}</Alert>}
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
