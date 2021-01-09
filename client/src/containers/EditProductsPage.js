import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import './container.css'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa'
import { store } from 'react-notifications-component';
import { Helmet } from 'react-helmet';
import 'react-day-picker/lib/style.css';
import DayPicker from 'react-day-picker'

const EditProductsPage = () => {
    const history = useHistory()
    const [product, setProduct] = useState({})
    useEffect(() => {
        const fetchProductInfo = async () => {
            Axios.get(`/api${history.location.pathname}`)
            .then(res => {
                setProduct(res.data)
            })
        }
        fetchProductInfo();
    }, [history.location.pathname])
    const today = Date.now()
    const DOR = new Date(product.dateOfRecieve)
    const DOI = new Date(product.dateOfInvoice)
    const handleFormChange = (e, updatedAt) => {
        const name = e.target.name;
        const value = e.target.value;

        setProduct({
            ...product,
            [name]: value
        })
    }

    const handleFormSubmit = (event) => {
        event.preventDefault();
        Axios.put(`/api/products/${product._id}`, { data: product })
        .then(() => {
            store.addNotification({
                title: "Product Updated",
                message: product.title + " has been successfully updated.",
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
                    Edit Product
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
                            <Form.Label>Item Name</Form.Label>
                            <Form.Control name="title" onChange={handleFormChange} type="text" value={product.title} placeholder="Enter Item Name" />
                        </Form.Group>
                        
                        <Form.Group as={Col} controlId="formGridPassword">
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control name="quantity" onChange={handleFormChange} type="number" value={product.quantity} min="0" placeholder="Enter Item Quantity" />
                        </Form.Group>
                    </Form.Row>
                    
                    <Form.Group controlId="formGridAddress1">
                        <Form.Label>Vendor Name</Form.Label>
                        <Form.Control name="vendorName" value={product.vendorName} onChange={handleFormChange}   placeholder="E.g: Hikvision" />
                    </Form.Group>
                    
                    <Form.Group controlId="formGridAddress2">
                        <Form.Label>Invoice Number</Form.Label>
                        <Form.Control name="invoiceNumber" value={product.invoiceNumber} onChange={handleFormChange} placeholder="Enter the Invoice Number" />
                    </Form.Group>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridCity">
                            <Form.Label>Price</Form.Label>
                            <Form.Control name="price" value={product.price} onChange={handleFormChange} placeholder="Enter the price of the item"/>
                        </Form.Group>

                        <Form.Group style={{textAlign: 'center'}} as={Col}>
                            <Form.Label>Date of Recieve</Form.Label>
                            <Form.Control name="dateOfRecieve" readOnly value={DOR ? DOR.toDateString() : today.toDateString()} />
                            <DayPicker
                                month={isNaN(DOR) ? new Date(2020, 11) : new Date(DOR.getUTCFullYear(), DOR.getUTCMonth())}
                                showOutsideDays
                                selectedDays={DOR || today}
                                onDayClick={
                                    (selectedDays) => {
                                        const tempDate = new Date(selectedDays)
                                        setProduct({
                                            ...product,
                                            dateOfRecieve: tempDate.toISOString()
                                        })
                                    }
                                }
                             />
                        </Form.Group>

                        <Form.Group style={{textAlign: 'center'}} as={Col}>
                            <Form.Label>Date of Invoice</Form.Label>
                            <Form.Control name="dateOfInvoice" readOnly value={DOI ? DOI.toDateString() : today.toDateString()} />
                            <DayPicker
                                month={ isNaN(DOI) ? new Date(2020, 11)  : new Date(DOI.getUTCFullYear(), DOI.getUTCMonth())}
                                showOutsideDays
                                selectedDays={DOI || today}
                                onDayClick={
                                    (selectedDays) => {
                                        const tempDate = new Date(selectedDays)
                                        setProduct({
                                            ...product,
                                            dateOfInvoice: tempDate.toISOString()
                                        })
                                    }
                                }
                             />
                        </Form.Group>
                    </Form.Row>

                    <Button variant="primary" type="submit">
                        Update
                    </Button>
                </Form>
            </Container>
        </div>
    )
}

export default EditProductsPage
        