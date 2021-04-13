import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./container.css";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Axios from "axios";
import { FaArrowLeft, FaPlus, FaTrash } from "react-icons/fa";
import { store } from "react-notifications-component";
import { Helmet } from "react-helmet";
import "react-day-picker/lib/style.css";
import DayPicker from "react-day-picker";
import DatePicker from "react-date-picker";

const EditProductsPage = () => {
  const history = useHistory();
  const [product, setProduct] = useState({});
  const [transDate, setTransDateChange] = useState(new Date());
  useEffect(() => {
    const fetchProductInfo = async () => {
      Axios.get(`/api${history.location.pathname}`).then((res) => {
        setProduct(res.data);
      });
    };
    fetchProductInfo();
  }, [history.location.pathname]);
  const today = Date.now();
  const DOR = new Date(product.dateOfRecieve);
  const DOI = new Date(product.dateOfInvoice);

  const addTransactionRow = (e) => {
    const newTransaction = {
      invoiceNumber: "",
      quantity: null,
      dateOfTransaction: Date.now(),
      typeOfEntry: "",
    };
    const newTransactionArray = product.transactions;
    newTransactionArray.push(newTransaction);
    setProduct({
      ...product,
      transactions: newTransactionArray,
    });
  };

  const deleteTransactionRow = (index) => {
    const newTransactionArray = product.transactions;
    newTransactionArray.splice(index, 1);
    setProduct({
      ...product,
      transactions: newTransactionArray,
    });
  };

  const handleTransactionDateChange = (value, index) => {
    const transactionArray = product.transactions;
    const item = transactionArray[index];
    transactionArray[index] = {
      ...item,
      dateOfTransaction: value,
    };
    setTransDateChange({
      transDate: value,
    });
    setProduct({
      ...product,
      transactions: transactionArray,
    });
  };

  const handleTransactionChange = (event, index) => {
    event.preventDefault();
    const transactionArray = product.transactions;
    const item = transactionArray[index];
    const name = event.target.name;
    const value = event.target.value;
    transactionArray[index] = {
      ...item,
      [name]: value,
    };
    setProduct({
      ...product,
      transactions: transactionArray,
    });
  };

  const handleFormChange = (e, updatedAt) => {
    const name = e.target.name;
    const value = e.target.value;

    setProduct({
      ...product,
      [name]: value,
    });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    let totalQty = 0;
    product.transactions.forEach((item) => {
      if (item.typeOfEntry) {
        if (item.typeOfEntry === "purchase") {
          totalQty += Number(item.quantity);
        } else {
          totalQty -= Number(item.quantity);
        }
      } else {
        totalQty += 0;
      }
    });
    product.totalQuantity = totalQty;
    Axios.put(`/api/products/${product._id}`, { data: product })
      .then(() => {
        store.addNotification({
          title: "Product Updated",
          message: product.productUID + " has been successfully updated.",
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
        // <Notification itemID={product.productUID} type="success" error="" />;
        history.push("/products");
      })
      .catch((e) => {
        console.log(e);
        store.addNotification({
          title: "Product Not Added",
          message: `An error occured while adding ${product.productUID} to the inventory. Please check and try again. ${e}`,
          type: "danger",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 5000,
            onScreen: true,
          },
        });
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

        <Form
          onSubmit={handleFormSubmit}
          style={{
            marginTop: 20,
            padding: 20,
            borderRadius: 10,
            border: "1px solid gray",
          }}
        >
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Product UID</Form.Label>
              <Form.Control
                name="productUID"
                onChange={handleFormChange}
                type="text"
                value={product.productUID}
                placeholder="Enter product UID"
              />
            </Form.Group>

            <Form.Group as={Col} controlId="itemName">
              <Form.Label>Item Name</Form.Label>
              <Form.Control
                name="title"
                onChange={handleFormChange}
                type="text"
                value={product.title}
                placeholder="Enter Item Name"
              />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col} controlId="formGridCity">
              <Form.Label>Price</Form.Label>
              <Form.Control
                name="price"
                value={product.price}
                onChange={handleFormChange}
                placeholder="Enter the price of the item"
              />
            </Form.Group>

            <Form.Group controlId="formGridAddress1">
              <Form.Label>Vendor Name</Form.Label>
              <Form.Control
                name="vendorName"
                value={product.vendorName}
                onChange={handleFormChange}
                placeholder="E.g: Hikvision"
              />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group style={{ textAlign: "center" }} as={Col}>
              <Form.Label>Date of Recieve</Form.Label>
              <Form.Control
                name="dateOfRecieve"
                readOnly
                value={DOR ? DOR.toDateString() : today.toDateString()}
              />
              <DayPicker
                month={
                  isNaN(DOR)
                    ? new Date(2020, 11)
                    : new Date(DOR.getUTCFullYear(), DOR.getUTCMonth())
                }
                showOutsideDays
                selectedDays={DOR || today}
                onDayClick={(selectedDays) => {
                  const tempDate = new Date(selectedDays);
                  setProduct({
                    ...product,
                    dateOfRecieve: tempDate.toISOString(),
                  });
                }}
              />
            </Form.Group>

            <Form.Group style={{ textAlign: "center" }} as={Col}>
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
                  setProduct({
                    ...product,
                    dateOfInvoice: tempDate.toISOString(),
                  });
                }}
              />
            </Form.Group>
          </Form.Row>

          {product && product.transactions ? (
            product.transactions.map((transaction, index) => {
              return (
                <div
                  style={{
                    border: "1px solid grey",
                    padding: 10,
                    marginBottom: 20,
                    borderRadius: 10,
                  }}
                >
                  <Form.Row>
                    <Form.Group as={Col}>
                      <h3>Transaction {index + 1}</h3>
                    </Form.Group>
                    <Button
                      style={{
                        float: "right",
                        height: `calc(1.5em + .75rem + 2px)`,
                        marginBottom: 32,
                        marginRight: 10,
                      }}
                      onClick={addTransactionRow}
                    >
                      <FaPlus />
                    </Button>
                    <Button
                      variant="danger"
                      style={{
                        float: "right",
                        height: `calc(1.5em + .75rem + 2px)`,
                        marginBottom: 32,
                        display:
                          product.transactions.length > 1 ? "block" : "none",
                      }}
                      onClick={() => deleteTransactionRow(index)}
                    >
                      <FaTrash />
                    </Button>
                  </Form.Row>

                  <Form.Row>
                    <Form.Group as={Col}>
                      <Form.Label>Quantity</Form.Label>
                      <Form.Control
                        name="quantity"
                        value={transaction.quantity}
                        onChange={(e) => handleTransactionChange(e, index)}
                        type="number"
                        onScroll={() => {}}
                        placeholder="Enter Item Quantity"
                      />
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>Invoice Number</Form.Label>
                      <Form.Control
                        name="invoiceNumber"
                        value={transaction.invoiceNumber}
                        onChange={(e) => handleTransactionChange(e, index)}
                        placeholder="Enter the Invoice Number"
                      />
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group
                      as={Col}
                      style={{ textAlign: "center", margin: "0 auto" }}
                    >
                      <Form.Label>Date Of Transaction</Form.Label>
                      <div>
                        <DatePicker
                          onChange={(value) =>
                            handleTransactionDateChange(value, index)
                          }
                          value={
                            new Date(transaction.dateOfTransaction) || transDate
                          }
                        />
                      </div>
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>Type Of Entry</Form.Label>
                      <Form.Control
                        name="typeOfEntry"
                        value={transaction.typeOfEntry}
                        onChange={(e) => handleTransactionChange(e, index)}
                        placeholder="Enter the type of entry"
                      />
                    </Form.Group>
                  </Form.Row>
                </div>
              );
            })
          ) : (
            <h1>No Transactions</h1>
          )}

          <Button variant="primary" type="submit">
            Update
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default EditProductsPage;
