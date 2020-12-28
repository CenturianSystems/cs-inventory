import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import './container.css'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa'
import { store } from 'react-notifications-component';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { useEffect } from 'react'

const initialData = Object.freeze({
    title: "",
    quantity: 0,
    price: "4000",
    dateOfRecieve: Date.now(),
    dateOfInvoice: Date.now(),
    invoiceNumber: "",
    vendorName: ""
})

const AddProductsPage = (props) => {
    const [formData, setFormData] = useState(initialData)
    const today = Date.now();
    const history = useHistory()

    useEffect(() => {
        if (!props.auth.isAuthenticated) {
            history.push('/login')
        }
    }, [props, history])

    const handleFormChange = (e, updatedAt) => {
        const name = e.target.name;
        const value = e.target.value;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleFormSubmit = (event) => {
        event.preventDefault();
        Axios.post('/products', { data: formData })
        .then(() => {
            store.addNotification({
                title: "Product Added",
                message: formData.title + " added successfully to the inventory.",
                type: "success",
                insert: "top",
                container: "top-right",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                  duration: 5000,
                  onScreen: true
                }
            });
            history.push('/products')
        })
        .catch(e => {
            console.log(e)
        })
    }

    return (
        <div>
            <Container>
                <h1 className="pageTitle">
                    <Button style={{float: "left", marginTop: 10}} onClick={() => history.goBack()}>
                        <FaArrowLeft style={{paddingBottom: 2}} /> Back
                    </Button>
                    Add Product
                </h1>
                <Form onSubmit={handleFormSubmit} style={{
                    marginTop: 20,
                    padding: 20,
                    borderRadius: 10,
                    border: '1px solid gray'
                }}>
                    <Form.Row>
                        <Form.Group as={Col} controlId="itemName">
                            <Form.Label>Item Name</Form.Label>
                            <Form.Control name="title" onChange={handleFormChange} type="text" placeholder="Enter Item Name" />
                        </Form.Group>
                        
                        <Form.Group as={Col} controlId="formGridPassword">
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control name="quantity" onChange={handleFormChange} type="number" min="0" placeholder="Enter Item Quantity" />
                        </Form.Group>
                    </Form.Row>
                    
                    <Form.Group controlId="formGridAddress1">
                        <Form.Label>Vendor Name</Form.Label>
                        <Form.Control name="vendorName" onChange={handleFormChange} placeholder="E.g: Hikvision" />
                    </Form.Group>
                    
                    <Form.Group controlId="formGridAddress2">
                        <Form.Label>Invoice Number</Form.Label>
                        <Form.Control name="invoiceNumber" onChange={handleFormChange} placeholder="Enter the Invoice Number" />
                    </Form.Group>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridCity">
                            <Form.Label>Price</Form.Label>
                            <Form.Control name="price" onChange={handleFormChange} placeholder="Enter the price of the item"/>
                        </Form.Group>

                        {/* <Form.Group as={Col} controlId="formGridCity">
                            <Form.Label>GST</Form.Label>
                            <Form.Control name="price" onChange={handleFormChange} placeholder="Enter the GST percentage" type="number" min="0"/>
                        </Form.Group> */}

                        <Form.Group as={Col} controlId="formGridState">
                            <Form.Label>Date of Recieve</Form.Label>
                            <Form.Control name="dateOfRecieve" onChange={handleFormChange} type="date" min={today} />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridZip">
                            <Form.Label>Date of Invoice</Form.Label>
                            <Form.Control name="dateOfInvoice" onChange={handleFormChange} type="date" min={today} />
                        </Form.Group>
                    </Form.Row>

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </Container>
        </div>
    )
}

AddProductsPage.propTypes = {
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps)(AddProductsPage)
        