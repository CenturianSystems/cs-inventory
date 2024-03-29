import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./container.css";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import { store } from "react-notifications-component";
import { Helmet } from "react-helmet";
import "react-day-picker/lib/style.css";
// import { FaPlus, FaTrash } from 'react-icons/fa'
import DayPicker from "react-day-picker";

const EditPurchasesPage = () => {
  const history = useHistory();
  const [purchase, setPurchase] = useState({});
  useEffect(() => {
    const fetchPurchaseInfo = async () => {
      Axios.get(`/api${history.location.pathname}`).then((res) => {
        setPurchase(res.data);
      });
    };
    fetchPurchaseInfo();
  }, [history.location.pathname]);
  // const newPurchaseItems = purchase && purchase.productItems ? purchase.productItems : []
  // console.log(newPurchaseItems)

  const today = Date.now();
  const DOP = new Date(purchase.dateOfPurchase);
  const DOI = new Date(purchase.dateOfInvoice);

  const handleFormChange = (e, updatedAt) => {
    const name = e.target.name;
    const value = e.target.value;
    setPurchase({
      ...purchase,
      [name]: value,
    });
  };

  // Todo - Will be added in future

  // const addPurchaseRow = (e) => {
  //     const newProductItem = {
  //         productId: "",
  //         productName: "",
  //         quantity: 0,
  //         price: 0,
  //         newItem: true
  //     };
  //     const newItemsArray = purchase.productItems
  //     newItemsArray.push(newProductItem)
  //     setPurchase({
  //         ...purchase,
  //         productItems: newItemsArray
  //     })
  // }

  // const deletePurchaseRow = (index) => {
  //     const newItemsArray = purchase.productItems
  //     newItemsArray.splice(index, 1)
  //     setPurchase({
  //         ...purchase,
  //         productItems: newItemsArray
  //     })
  // }

  const handleProductItemChange = (event, index) => {
    event.preventDefault();
    const itemsArray = purchase.productItems;
    const item = itemsArray[index];
    const name = event.target.name;
    const value = event.target.value;
    itemsArray[index] = {
      ...item,
      [name]: value,
    };
    setPurchase({
      ...purchase,
      productItems: itemsArray,
    });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    Axios.put(`/api/purchases/${purchase._id}`, { data: purchase })
      .then(() => {
        store.addNotification({
          title: "Purchase Updated",
          message: purchase.invoiceNumber + " has been successfully updated.",
          type: "success",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 5000,
            onScreen: true,
          },
        });
        history.push("/purchases");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div>
      <Container>
        <h1 className="pageTitle">
          <Button
            style={{ float: "left", marginTop: 10 }}
            onClick={() => history.goBack()}
          >
            <FaArrowLeft style={{ paddingBottom: 2 }} /> Back
          </Button>
          Edit Purchase
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

        <Form
          onSubmit={handleFormSubmit}
          style={{
            marginTop: 20,
            padding: 20,
            borderRadius: 10,
            border: "1px solid gray",
          }}
        >
          {purchase.productItems ? (
            purchase.productItems.map((product, index) => {
              return (
                <div
                  style={{
                    border: "1px solid grey",
                    padding: 10,
                    marginBottom: 20,
                    borderRadius: 10,
                  }}
                  id="purchaseItem"
                >
                  <Form.Row>
                    <Form.Group as={Col}>
                      <h3>Product {index + 1}</h3>
                    </Form.Group>
                    {/* <Button style={{float: 'right', height: `calc(1.5em + .75rem + 2px)`, marginBottom: 32, marginRight: 10}} onClick={addPurchaseRow}>
                                            <FaPlus />
                                        </Button>
                                        <Button variant="danger" style={{float: 'right', height: `calc(1.5em + .75rem + 2px)`, marginBottom: 32, display: purchase.productItems.length > 1 && product.newItem ? 'block' : 'none'}} onClick={() => deletePurchaseRow(index)}>
                                            <FaTrash />
                                        </Button> */}
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col}>
                      <Form.Label>Product ID</Form.Label>
                      <Form.Control
                        readOnly
                        name="productId"
                        onChange={(e) => handleProductItemChange(e, index)}
                        type="text"
                        value={product.productId}
                        placeholder="Enter Product Name"
                      />
                    </Form.Group>

                    <Form.Group as={Col}>
                      <Form.Label>Product Name</Form.Label>
                      <Form.Control
                        readOnly
                        name="productName"
                        onChange={(e) => handleProductItemChange(e, index)}
                        type="text"
                        value={product.productName}
                        placeholder="Enter Item Name"
                      />
                    </Form.Group>
                  </Form.Row>

                  <Form.Row>
                    <Form.Group as={Col}>
                      <Form.Label>Quantity</Form.Label>
                      <Form.Control
                        readOnly
                        name="quantity"
                        value={product.quantity}
                        onChange={(e) => handleProductItemChange(e, index)}
                        type="number"
                        min="0"
                        placeholder="Enter Product Quantity"
                      />
                    </Form.Group>

                    <Form.Group as={Col}>
                      <Form.Label>Product Price</Form.Label>
                      <Form.Control
                        readOnly
                        name="price"
                        value={product.price}
                        onChange={(e) => handleProductItemChange(e, index)}
                        type="text"
                        placeholder="Enter Product Name"
                      />
                    </Form.Group>
                  </Form.Row>
                </div>
              );
            })
          ) : (
            <h1>No Product Found</h1>
          )}

          <Form.Row>
            <Form.Group as={Col} controlId="formGridAddress1">
              <Form.Label>Customer Name</Form.Label>
              <Form.Control
                name="customerName"
                value={purchase.customerName}
                onChange={handleFormChange}
                placeholder="E.g: Mayank Khanna"
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridAddress1">
              <Form.Label>Customer Contact</Form.Label>
              <Form.Control
                name="customerContact"
                value={purchase.customerContact}
                onChange={handleFormChange}
                placeholder="Mobile Number: 9876543210"
              />
            </Form.Group>
          </Form.Row>

          <Form.Group controlId="formGridAddress2">
            <Form.Label>Invoice Number</Form.Label>
            <Form.Control
              name="invoiceNumber"
              value={purchase.invoiceNumber}
              onChange={handleFormChange}
              placeholder="Enter the Invoice Number"
            />
          </Form.Group>
          <Form.Row>
            <Form.Group as={Col} controlId="formGridCity">
              <Form.Label>Price</Form.Label>
              <Form.Control
                name="purchasesPrice"
                value={purchase.purchasesPrice}
                onChange={handleFormChange}
                placeholder="Enter the price of the item"
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>Date of Purchase</Form.Label>
              <Form.Control
                name="dateOfPurchase"
                readOnly
                value={DOP ? DOP.toDateString() : today.toDateString()}
              />
              <DayPicker
                month={
                  isNaN(DOP)
                    ? new Date(2020, 11)
                    : new Date(DOP.getUTCFullYear(), DOI.getUTCMonth())
                }
                showOutsideDays
                selectedDays={DOP || today}
                onDayClick={(selectedDays) => {
                  const tempDate = new Date(selectedDays);
                  setPurchase({
                    ...purchase,
                    dateOfPurchase: tempDate.toISOString(),
                  });
                }}
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridZip">
              <Form.Label>Date of Invoice</Form.Label>
              <Form.Control
                name="dateOfInvoice"
                readOnly
                value={DOI ? DOI.toDateString() : today.toDateString()}
              />
              <DayPicker
                month={
                  isNaN(DOI)
                    ? new Date(2020, 11)
                    : new Date(DOI.getUTCFullYear(), DOI.getUTCMonth())
                }
                showOutsideDays
                selectedDays={DOI || today}
                onDayClick={(selectedDays) => {
                  const tempDate = new Date(selectedDays);
                  setPurchase({
                    ...purchase,
                    dateOfInvoice: tempDate.toISOString(),
                  });
                }}
              />
            </Form.Group>
          </Form.Row>

          <Button variant="primary" type="submit">
            Update
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default EditPurchasesPage;
