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

const EditProductsPage = () => {
    const history = useHistory()
    const [product, setProduct] = useState({})
    useEffect(() => {
        const fetchProductInfo = async () => {
            Axios.get(history.location.pathname)
            .then(res => {
                setProduct(res.data)
            })
        }
        fetchProductInfo();
    }, [history.location.pathname])
    const today = Date.now();
    const DOR = new Date(product.dateOfRecieve)
    const DOI = new Date(product.dateOfInvoice)
    
    // Breaking Date for show during edit
    const dateDOI = DOI.getDate()
    const monthDOI = DOI.getMonth()
    const yearDOI = DOI.getFullYear()

    const dateDOR = DOR.getDate()
    const monthDOR = DOR.getMonth()
    const yearDOR = DOR.getFullYear()

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
        Axios.put(`/products/${product._id}`, { data: product })
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

                        <Form.Group as={Col} controlId="formGridState">
                            <Form.Label>Date of Recieve</Form.Label>
                            <Form.Control name="dateOfRecieve" value={`${yearDOR}-${monthDOR}-${dateDOR}`} onChange={handleFormChange} type="date" min={today} />
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

export default EditProductsPage
        