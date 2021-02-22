import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { gql, useMutation } from '@apollo/client'
import { getErrorMessage } from '../lib/form'
import Field from '../components/field'
import styles from "../styles/pages/auth/_index.module.scss";
import {Button, Card, Col, Container, Row} from "react-bootstrap";

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
  const router = useRouter()

  async function handleSubmit(event) {
    event.preventDefault()
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
    }
  }

  return (
      <div className={styles.auth}>
        <Container>
          <Row className={styles.customRow}>
            <Col md={6}>
              <Card className={styles.customCard}>
                <Card.Body>
                  <h1>Sign Up</h1>
                  <form onSubmit={handleSubmit}>
                    {errorMsg && <p>{errorMsg}</p>}
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
                    <Button variant={"primary"} type="submit" className={"mt-3"}>Sign Up</Button>
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
