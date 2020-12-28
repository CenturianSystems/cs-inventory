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

const EditPurchasesPage = () => {
    const history = useHistory()
    const [purchase, setPurchase] = useState({})
    useEffect(() => {
        const fetchPurchaseInfo = async () => {
            Axios.get(`/api${history.location.pathname}`)
            .then(res => {
                setPurchase(res.data)
            })
        }
        fetchPurchaseInfo();
    }, [history.location.pathname])
    const today = Date.now();
    const DOS = new Date(purchase.dateOfPurchase)
    const DOI = new Date(purchase.dateOfInvoice)
    
    // Breaking Date for show during edit
    const dateDOI = DOI.getDate()
    const monthDOI = DOI.getMonth()
    const yearDOI = DOI.getFullYear()

    const dateDOS = DOS.getDate()
    const monthDOS = DOS.getMonth()
    const yearDOS = DOS.getFullYear() 

    const handleFormChange = (e, updatedAt) => {
        const name = e.target.name;
        const value = e.target.value;
        setPurchase({
            ...purchase,
            [name]: value
        })
    }

    const handleFormSubmit = (event) => {
        event.preventDefault();
        Axios.put(`/api/purchases/${purchase._id}`, { data: purchase })
        .then(() => {
            store.addNotification({
                title: "Purchase Updated",
                message: purchase.title + " has been successfully updated.",
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
                    Edit Purchase
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
                            <Form.Control name="title" onChange={handleFormChange} type="text" value={purchase.productName} placeholder="Enter Item Name" />
                        </Form.Group>
                        
                        <Form.Group as={Col} controlId="formGridPassword">
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control name="quantity" value={purchase.quantity} onChange={handleFormChange} type="number" min="0" placeholder="Enter Product Quantity" />
                        </Form.Group>
                    </Form.Row>
                    
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridAddress1">
                            <Form.Label>Customer Name</Form.Label>
                            <Form.Control name="customerName" value={purchase.customerName} onChange={handleFormChange} placeholder="E.g: Mayank Khanna" />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridAddress1">
                            <Form.Label>Customer Contact</Form.Label>
                            <Form.Control name="customerContact" value={purchase.customerContact} onChange={handleFormChange} placeholder="Mobile Number: 9876543210" />
                        </Form.Group>
                    </Form.Row>
                    
                    <Form.Group controlId="formGridAddress2">
                        <Form.Label>Invoice Number</Form.Label>
                        <Form.Control name="invoiceNumber" value={purchase.invoiceNumber} onChange={handleFormChange} placeholder="Enter the Invoice Number" />
                    </Form.Group>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridCity">
                            <Form.Label>Price</Form.Label>
                            <Form.Control name="purchasesPrice" value={purchase.purchasesPrice} onChange={handleFormChange} placeholder="Enter the price of the item"/>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridState">
                            <Form.Label>Date of Purchase</Form.Label>
                            <Form.Control name="dateOfPurchase" value={`${yearDOS}-${monthDOS}-${dateDOS}`} onChange={handleFormChange} type="date" min={today} />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridZip">
                            <Form.Label>Date of Invoice</Form.Label>
                            <Form.Control name="dateOfInvoice" value={`${yearDOI}-${monthDOI}-${dateDOI}`} onChange={handleFormChange} type="date" min={today} />
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

export default EditPurchasesPage
        