import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table'
import axios from 'axios'
import './container.css'
import Button from 'react-bootstrap/esm/Button';
import { FaPlus, FaEdit } from 'react-icons/fa'
import Axios from 'axios';
// import { confirmAlert } from 'react-confirm-alert';
import EditPurchasesPage from './EditPurchasesPage.js'
import 'react-confirm-alert/src/react-confirm-alert.css';
// import { store } from 'react-notifications-component'
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

const PurchasesPage = (props) => {
    const [purchases, setPurchases] = useState([])
    const history = useHistory()
    useEffect(() => {
        if (props.auth.isAuthenticated) {
            const fetchPurchases = async () => {
                const response = await axios.get('/purchases')
    
                setPurchases(response.data)
            }
    
            fetchPurchases();   
        } else {
            history.push('/login')
        }
    }, [props, history])

    let sumQty = 0
    let sumPrice = 0;

    const handlePurchasesEdit = (purchaseId) => {
        Axios.get(`/purchases/${purchaseId}`)
        .then(res => {
            history.push(`/purchases/${purchaseId}`)
            return <EditPurchasesPage purchaseId={purchaseId} />
        })
    }

    // Not including this feature
    // const handlePurchasesDelete = (purchaseId) => {
    //     const [delPurchase] = purchases.filter(purchase => purchase._id === purchaseId)
    //     console.log(delPurchase)
    //     confirmAlert({
    //         title: `Delete ${delPurchase.productName}`,
    //         message: 'Are you sure you want to delete this ? This action is irreversable.',
    //         buttons: [
    //           {
    //             label: 'Yes',
    //             onClick: () => {
    //                 Axios.delete(`/purchases/${delPurchase._id}`)
    //                 .then(() => {
    //                     store.addNotification({
    //                         title: "Purchase Deleted",
    //                         message: delPurchase.productName + " has been successfully deleted.",
    //                         type: "success",
    //                         insert: "top",
    //                         container: "top-right",
    //                         animationIn: ["animate__animated", "animate__fadeIn"],
    //                         animationOut: ["animate__animated", "animate__fadeOut"],
    //                         dismiss: {
    //                           duration: 5000,
    //                           onScreen: true
    //                         }
    //                     });
    //                     const newPurchases = purchases.filter(item => item._id !== delPurchase._id)
    //                     setPurchases(newPurchases)
    //                 })
    //                 .catch(e => {
    //                     console.log(e)
    //                 })
    //             }
    //           },
    //           {
    //             label: 'No',
    //             onClick: () => {}
    //           }
    //         ]
    //     });
    // }

    return (
        <div>
            <Container>
                <h1 className="pageTitle">Purchases Page</h1>
                <Button style={{marginBottom: 20, float: "right"}} onClick={() => history.push('/purchases/addnew')}> <FaPlus style={{paddingBottom: 2}} /> Add New Purchase</Button>
                <Table striped responsive bordered hover>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Item Name</th>
                        <th>Quantity</th>
                        <th>Price Per Item</th>
                        <th>Customer Name</th>
                        <th>Total Amount</th>
                        <th colSpan="2" style={{textAlign: "center"}}>Edit</th>
                    </tr>
                    </thead>
                    <tbody>
                        {
                            purchases && purchases.length > 0
                            ? purchases.map((item, index) => {
                                sumQty += item.quantity
                                sumPrice += Number(item.totalBill)
                                return (
                                    <tr key={index}>
                                        <td>{index+1}</td> 
                                        <td>{item.productName}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.purchasesPrice}</td>
                                        <td>{item.customerName}</td>
                                        <td>{item.totalBill}</td>
                                        <td>
                                            <FaEdit color="green" cursor="pointer" onClick={() => handlePurchasesEdit(item._id)} />
                                        </td>
                                        {/* <td>
                                            <FaTrashAlt color="red" cursor="pointer" onClick={() => handlePurchasesDelete(item._id)} />
                                        </td> */}
                                    </tr>
                                )
                            }) : <tr><td colSpan="7" style={{textAlign: "center"}}>No Data Found</td></tr>
                        }
                        {
                            purchases && purchases.length > 0
                            ? <tr>
                                <td></td>
                                <td></td>
                                <td>{sumQty}</td>
                                <td></td>
                                <td></td>
                                <td>{sumPrice}</td>
                                <td colSpan="2"></td>
                            </tr>
                            : <tr></tr>
                        }
                    </tbody>
                </Table>
            </Container>
        </div>
    )
}

PurchasesPage.propTypes = {
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps)(PurchasesPage)
