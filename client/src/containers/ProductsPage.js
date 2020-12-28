import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table'
import axios from 'axios'
import './container.css'
import Button from 'react-bootstrap/esm/Button';
import { FaPlus, FaEdit, FaTrashAlt } from 'react-icons/fa'
import Axios from 'axios';
import EditProductsPage from './EditProductsPage';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { store } from 'react-notifications-component'
import PropTypes from 'prop-types';
import { connect } from 'react-redux'


const ProductsPage = (props) => {
    const [products, setProducts] = useState([])
    useEffect(() => {
        const fetchProducts = async () => {
            const response = await axios.get('/api/products')

            setProducts(response.data)
        }

        fetchProducts();
    }, [])

    const history = useHistory()
    let sumQty = 0
    let sumPrice = 0;

    const handleProductEdit = (productId) => {
        Axios.get(`/api/products/${productId}`)
        .then(res => {
            history.push(`/products/${productId}`)
            return <EditProductsPage productId={productId} />
        })
    }

    const handleProductDelete = (productId) => {
        const [pdct] = products.filter(item => item._id === productId)
        confirmAlert({
            title: `Delete ${pdct.title}`,
            message: 'Are you sure you want to delete this ? This action is irreversable.',
            buttons: [
              {
                label: 'Yes',
                onClick: () => {
                    Axios.delete(`/api/products/${pdct._id}`)
                    .then(() => {
                        store.addNotification({
                            title: "Product Deleted",
                            message: pdct.title + " has been successfully deleted.",
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
                        const newProducts = products.filter(item => item._id !== pdct._id)
                        setProducts(newProducts)
                    })
                    .catch(e => {
                        console.log(e)
                    })
                }
              },
              {
                label: 'No',
                onClick: () => {}
              }
            ]
        });
    }

    console.log(products, 'llll')

    return (
        <div>
            <Container>
                <h1 className="pageTitle">Products Page</h1>
                {
                    props.auth.isAuthenticated 
                    ? <Button style={{marginBottom: 20, float: "right"}} onClick={() => history.push('/products/addnew')}> <FaPlus style={{paddingBottom: 2}} /> Add Products</Button>
                    : <></>
                }
                
                <Table striped responsive bordered hover>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Item Name</th>
                        <th>Quantity</th>
                        <th>Price Per Item</th>
                        <th>Total Amount</th>
                        {
                            props.auth.isAuthenticated 
                            ? <th colSpan="2" style={{textAlign: "center"}}>Edit</th>
                            : <></>
                        }
                    </tr>
                    </thead>
                    <tbody>
                        {
                            products && products.length > 0
                            ? products.map((item, index) => {
                                sumQty += item.quantity
                                sumPrice += (item.price * item.quantity)
                                return (
                                    <tr key={index}>
                                        <td>{index+1}</td> 
                                        <td>{item.title}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.price}</td>
                                        <td>{item.price * item.quantity}</td>
                                        {
                                            props.auth.isAuthenticated
                                            ? <>
                                                <td>
                                                    <FaEdit color="green" cursor="pointer" onClick={() => handleProductEdit(item._id)} />
                                                </td>
                                                <td>
                                                    <FaTrashAlt color="red" cursor="pointer" onClick={() => handleProductDelete(item._id)} />
                                                </td>
                                            </>
                                            : <></>
                                        }
                                    </tr>
                                )
                            }) : <tr><td colSpan="6" style={{textAlign: "center"}}>No Data Found</td></tr>
                        }
                        {
                            products && products.length > 0
                            ? <tr>
                                <td></td>
                                <td></td>
                                <td>{sumQty}</td>
                                <td></td>
                                <td>{sumPrice}</td>
                                {
                                    props.auth.isAuthenticated
                                    ? <td colSpan="2"></td>
                                    : <></>
                                }
                            </tr>
                            : <tr></tr>
                        }
                    </tbody>
                </Table>
            </Container>
        </div>
    )
}

ProductsPage.propTypes = {
    auth: PropTypes.object.isRequired
};
  
const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(ProductsPage)
