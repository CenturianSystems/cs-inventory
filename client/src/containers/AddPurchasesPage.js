import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import './container.css'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Axios from 'axios';
import { FaArrowLeft, FaPlus, FaTrash } from 'react-icons/fa'
import axios from 'axios'
import { store } from 'react-notifications-component';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet';
import 'react-day-picker/lib/style.css';
import DayPicker from 'react-day-picker'

const initialData = Object.freeze({
    productItems: [
        {
            productId: "",
            productName: "",
            quantity: 0,
            price: 0
        }
    ],
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

    const addPurchaseRow = (e) => {
        const newProductItem = {
            productId: "",
            productName: "",
            quantity: 0,
            price: 0,
        };
        const newItemsArray = formData.productItems
        newItemsArray.push(newProductItem)
        setFormData({
            ...formData,
            productItems: newItemsArray
        })
    }

    const deletePurchaseRow = (index) => {
        const newItemsArray = formData.productItems
        newItemsArray.splice(index, 1)
        setFormData({
            ...formData,
            productItems: newItemsArray
        })
    }

    const handleProductItemChange = (event, index) => {
        event.preventDefault();
        const itemsArray = formData.productItems;
        const item = itemsArray[index];
        const name = event.target.name;
        const value = event.target.value;
        itemsArray[index] = {
            ...item,
            [name]: value
        };
        setFormData({
            ...formData,
            productItems: itemsArray 
        })
    }

    const handleFormSubmit = (event) => {
        event.preventDefault();
        formData.totalBill = formData.purchasesPrice
        let existingProducts = [];
        formData.productItems.forEach((item, index) => {
            existingProducts = products.filter(prdt => prdt.productUID === item.productId)
            console.log(existingProducts, 'Existing Products')

            existingProducts.map(product => {
                if (product.productUID === item.productId) {
                    console.log(product, Number(product.totalQuantity))
                    product.transactions.push({
                        invoiceNumber: formData.invoiceNumber,
                        quantity: Number(formData.productItems[index].quantity),
                        dateOfTransaction: formData.dateOfInvoice
                    })
                    console.log(item, formData.productItems[index].quantity, product)
                }
                return null;
            })
        })

        console.log(formData, 'FORMDATA')
        Axios.post('/api/purchases', { data: formData })
        .then(() => {
            store.addNotification({
                title: "Purchase Added",
                message: formData.invoiceNumber + " added successfully to the inventory.",
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
                    {
                        formData && formData.productItems 
                        ? formData.productItems.map(
                            (product, index) => {
                                return (
                                    <div style={{border: '1px solid grey', padding: 10, marginBottom: 20, borderRadius: 10}} id="purchaseItem">
                                        <Form.Row>
                                            <Form.Group as={Col}>
                                                <h3>New Product</h3>
                                            </Form.Group>
                                            <Button style={{float: 'right', height: `calc(1.5em + .75rem + 2px)`, marginBottom: 32, marginRight: 10}} onClick={addPurchaseRow}>
                                                <FaPlus />
                                            </Button>
                                            <Button variant="danger" style={{float: 'right', height: `calc(1.5em + .75rem + 2px)`, marginBottom: 32, display: formData.productItems.length > 1 ? 'block' : 'none'}} onClick={() => { console.log(product, index); deletePurchaseRow(index)}}>
                                                <FaTrash />
                                            </Button>
                                        </Form.Row>
                                        <Form.Row>
                                            <Form.Group as={Col}>
                                                <Form.Label>Product ID</Form.Label>
                                                <Form.Control name="productId" onChange={(e) => handleProductItemChange(e, index)} type="text" placeholder="Enter Product UID" />
                                            </Form.Group>

                                            <Form.Group as={Col}>
                                                <Form.Label>Product Name</Form.Label>
                                                <Form.Control name="productName" onChange={(e) => handleProductItemChange(e, index)} type="text" placeholder="Enter Product Name" />
                                            </Form.Group>
                                        </Form.Row>
                                        
                                        <Form.Row>
                                            <Form.Group as={Col}>
                                                <Form.Label>Quantity</Form.Label>
                                                <Form.Control name="quantity" onChange={(e) => handleProductItemChange(e, index)} value={products.filter(item => item.title === formData.productName).quantity} type="number" min="0" placeholder="Enter Product Quantity" />
                                            </Form.Group>

                                            <Form.Group as={Col}>
                                                <Form.Label>Product Price</Form.Label>
                                                <Form.Control name="price" onChange={(e) => handleProductItemChange(e, index)} type="text" placeholder="Enter Product Name" />
                                            </Form.Group>
                                        </Form.Row>
                                    </div>
                                )
                            }
                        )
                        : <h1>No Products</h1>
                    }
                    <div style={{border: '1px solid grey', padding: 10, marginBottom: 20, borderRadius: 10}} className="placeholder-component" id="purchaseItem-demo">
                        <Form.Row>
                            <Form.Group as={Col}>
                                <h3>New Product</h3>
                            </Form.Group>
                            <Button style={{float: 'right', height: `calc(1.5em + .75rem + 2px)`, marginBottom: 32}} onClick={addPurchaseRow}>
                                <FaPlus />
                            </Button>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>Product ID</Form.Label>
                                <Form.Control name="productId" onChange={handleFormChange} type="text" placeholder="Enter Product UID" />
                            </Form.Group>

                            <Form.Group as={Col}>
                                <Form.Label>Product Name</Form.Label>
                                <Form.Control name="productName" onChange={handleFormChange} type="text" placeholder="Enter Product Name" />
                            </Form.Group>
                        </Form.Row>
                        
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>Quantity</Form.Label>
                                <Form.Control name="quantity" onChange={handleFormChange} value={products.filter(item => item.title === formData.productName).quantity} type="number" min="0" placeholder="Enter Product Quantity" />
                            </Form.Group>

                            <Form.Group as={Col}>
                                <Form.Label>Product Price</Form.Label>
                                <Form.Control name="price" onChange={handleFormChange} type="text" placeholder="Enter Product Name" />
                            </Form.Group>
                        </Form.Row>
                    </div>
                    <div id="demo"></div>
                    
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
        