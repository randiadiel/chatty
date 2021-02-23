import {useState} from 'react'
import {useRouter} from 'next/router'
import Link from 'next/link'
import {gql} from '@apollo/client'
import {useMutation, useApolloClient} from '@apollo/client'
import {Row, Button, Card, Container, Col, Alert, Spinner} from "react-bootstrap";
import {getErrorMessage} from '../lib/form'
import Field from '../components/field'
import styles from '../styles/pages/auth/_index.module.scss'

const SignInMutation = gql`
  mutation SignInMutation($email: String!, $password: String!) {
    signIn(input: { email: $email, password: $password }) {
      user {
        id
        email
      }
    }
  }
`

function SignIn() {
    const client = useApolloClient()
    const [signIn] = useMutation(SignInMutation)
    const [errorMsg, setErrorMsg] = useState()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    async function handleSubmit(event) {
        event.preventDefault()
        setIsSubmitting(true)

        const emailElement = event.currentTarget.elements.email
        const passwordElement = event.currentTarget.elements.password

        try {
            await client.resetStore()
            const {data} = await signIn({
                variables: {
                    email: emailElement.value,
                    password: passwordElement.value,
                },
            })
            if (data.signIn.user) {
                await router.push('/')
            }
        } catch (error) {
            setErrorMsg(getErrorMessage(error))
            setIsSubmitting(false)
        }
    }

    return (
        <div className={styles.auth}>
            <Container>
                <Row className={styles.customRow}>
                    <Col lg={6} xl={5}>
                        <Card className={styles.customCard}>
                            <Card.Body>
                                <h1>Sign In</h1>
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
                                    <Button variant={"primary"} type="submit" className={"mt-3"} disabled={isSubmitting}>
                                        Sign in {isSubmitting && <Spinner as={"span"} size={"sm"} role={"status"} animation={"border"}/>}
                                    </Button>
                                </form>
                            </Card.Body>
                            <Card.Footer>
                                {'Do not have an account yet? '}
                                <Link href="/signup">
                                    <a>Sign up.</a>
                                </Link>
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default SignIn
