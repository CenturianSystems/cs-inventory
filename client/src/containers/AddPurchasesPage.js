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
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet';
import 'react-day-picker/lib/style.css';
import DayPicker from 'react-day-picker'

const initialData = Object.freeze({
    productName: "",
    quantity: 0,
    purchasesPrice: 4000,
    dateOfPurchase: Date.now(),
    dateOfInvoice: Date.now(),
    invoiceNumber: "",
    customerName: "",
    customerContact: "",
})

const AddPurchasesPage = (props) => {
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
        formData.totalBill =  10000 //formData.purchasesPrice * formData.quantity
        console.log(formData, "DATA")
        Axios.post('/api/purchases', { data: formData })
        .then(() => {
            store.addNotification({
                title: "Purchase Added",
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
            history.push('/purchases')
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
                    Add Purchase
                </h1>

                <Helmet>
                   <style>{`
                       .DayPicker {
                            margin-top: 20px;
                            border: 1px solid gray;
                            border-radius: 10px;
                       }
                   `}</style>
                </Helmet>

                <Form onSubmit={handleFormSubmit} style={{
                    marginTop: 20,
                    padding: 20,
                    borderRadius: 10,
                    border: '1px solid gray'
                }}>
                    <Form.Row>
                        <Form.Group as={Col} controlId="itemName">
                            <Form.Label>Product Name</Form.Label>
                            <Form.Control name="productName" onChange={handleFormChange} type="text" placeholder="Enter Product Name" />
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
                            <Form.Control name="purchasesPrice" onChange={handleFormChange} placeholder="Enter the price of the item"/>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridState">
                            <Form.Label>Date of Purchase</Form.Label>
                            <Form.Control name="dateOfPurchase" readOnly value={formData.dateOfPurchase ? new Date(formData.dateOfPurchase).toDateString() : today.toDateString()} />
                            <DayPicker
                                month={ isNaN(new Date(formData.dateOfPurchase)) ? new Date(2020, 11)  : new Date(new Date(formData.dateOfPurchase).getUTCFullYear(), new Date(formData.dateOfPurchase).getUTCMonth())}
                                showOutsideDays
                                selectedDays={new Date(formData.dateOfPurchase) || today}
                                onDayClick={
                                    (selectedDays) => {
                                        const tempDate = new Date(selectedDays)
                                        setFormData({
                                            ...formData,
                                            dateOfPurchase: tempDate.toISOString()
                                        })
                                    }
                                }
                             />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridZip">
                            <Form.Label>Date of Invoice</Form.Label>
                            <Form.Control name="dateOfInvoice" readOnly value={formData.dateOfInvoice ? new Date(formData.dateOfInvoice).toDateString() : today.toDateString()} />
                            <DayPicker
                                month={ isNaN(new Date(formData.dateOfInvoice)) ? new Date(2020, 11)  : new Date(new Date(formData.dateOfInvoice).getUTCFullYear(), new Date(formData.dateOfInvoice).getUTCMonth())}
                                showOutsideDays
                                selectedDays={new Date(formData.dateOfInvoice) || today}
                                onDayClick={
                                    (selectedDays) => {
                                        const tempDate = new Date(selectedDays)
                                        setFormData({
                                            ...formData,
                                            dateOfInvoice: tempDate.toISOString()
                                        })
                                    }
                                }
                             />
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

AddPurchasesPage.propTypes = {
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps)(AddPurchasesPage)
        