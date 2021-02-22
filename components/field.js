import {Form} from 'react-bootstrap'

export default function Field({name, label, type, autoComplete, required, small = ""}) {
    return (
        <Form.Group controlId={[name, 'label'].join('-')}>
            <Form.Label>{label} {required ? <span title="Required">*</span> : undefined}</Form.Label>
            <Form.Control type={type} placeholder={`Enter your ${label}`} autoComplete={autoComplete} name={name}
                          required={required}/>
            <Form.Text className="text-muted">
                {small}
            </Form.Text>
        </Form.Group>
    )
}
