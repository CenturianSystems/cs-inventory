import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import './container.css'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa'
import axios from 'axios'
import { store } from 'react-notifications-component';
import Select from 'react-select'
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

const initialData = Object.freeze({
    productName: "",
    quantity: 0,
    salesPrice: 4000,
    dateOfSale: Date.now(),
    dateOfInvoice: Date.now(),
    invoiceNumber: "",
    customerName: "",
    customerContact: "",
})

const AddSalesPage = (props) => {
    const [formData, setFormData] = useState(initialData)
    const [products, setProducts] = useState([])
    const today = Date.now();
    const history = useHistory()
    useEffect(() => {
        if (props.auth.isAuthenticated) {
            const fetchProducts = async () => {
                const response = await axios.get('/api/products')
    
                setProducts(response.data)
            }
    
            fetchProducts();
        } else {
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
        formData.totalBill = formData.salesPrice * formData.quantity
        Axios.post('/api/sales', { data: formData })
        .then(() => {
            store.addNotification({
                title: "Sale Added",
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
            history.push('/sales')
        })
        .catch(e => {
            console.log(e)
        })
    }

    let dropDownOptions = [];
    const availableProducts = products.filter(item => item.quantity >= 1)
    dropDownOptions = availableProducts.map(item => {
        return {
            value: item.title,
            label: item.title,
        }
    })

    const handleSelectChange = (e) => {
        const value = e && e.value ? e.value : "";
        setFormData({
            ...formData,
            productName: value
        })
    }

    return (
        <div>
            <Container>
                <h1 className="pageTitle">
                    <Button style={{float: "left", marginTop: 10}} onClick={() => history.goBack()}>
                        <FaArrowLeft style={{paddingBottom: 2}} /> Back
                    </Button>
                    Add Sale
                </h1>
                <Form onSubmit={handleFormSubmit} style={{
                    marginTop: 20,
                    padding: 20,
                    borderRadius: 10,
                    border: '1px solid gray'
                }}>
                    <Form.Row>
                        <Form.Group as={Col} controlId="itemName">
                            <Form.Label>Product Name</Form.Label>
                            <Select onChange={handleSelectChange} isClearable="true" placeholder="Choose a product from Inventory..." options={dropDownOptions} />
                        </Form.Group>
                        
                        <Form.Group as={Col} controlId="formGridPassword">
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control name="quantity" onChange={handleFormChange} value={products.filter(item => item.title === formData.productName).quantity} type="number" min="0" placeholder="Enter Product Quantity" />
                        </Form.Group>
                    </Form.Row>
                    
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridAddress1">
                            <Form.Label>Customer Name</Form.Label>
                            <Form.Control name="customerName" onChange={handleFormChange} placeholder="E.g: Mayank Khanna" />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridAddress1">
                            <Form.Label>Customer Contact</Form.Label>
                            <Form.Control name="customerContact" onChange={handleFormChange} placeholder="Mobile Number: 9876543210" />
                        </Form.Group>
                    </Form.Row>
                    
                    <Form.Group controlId="formGridAddress2">
                        <Form.Label>Invoice Number</Form.Label>
                        <Form.Control name="invoiceNumber" onChange={handleFormChange} placeholder="Enter the Invoice Number" />
                    </Form.Group>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridCity">
                            <Form.Label>Price</Form.Label>
                            <Form.Control name="salesPrice" onChange={handleFormChange} placeholder="Enter the price of the item"/>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridState">
                            <Form.Label>Date of Sale</Form.Label>
                            <Form.Control name="dateOfSale" onChange={handleFormChange} type="date" min={today} />
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

AddSalesPage.propTypes = {
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps)(AddSalesPage)
        