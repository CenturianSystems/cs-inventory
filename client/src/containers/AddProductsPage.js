import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./container.css";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Axios from "axios";
import { FaArrowLeft, FaPlus, FaTrash } from "react-icons/fa";
import { store } from "react-notifications-component";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import "react-day-picker/lib/style.css";
import DayPicker from "react-day-picker";
import DatePicker from "react-date-picker";

const initialData = Object.freeze({
  title: "",
  productUID: "",
  price: null,
  dateOfRecieve: Date.now(),
  dateOfInvoice: Date.now(),
  transactions: [
    {
      invoiceNumber: "",
      quantity: null,
      dateOfTransaction: Date.now(),
      typeOfEntry: "",
    },
  ],
  vendorName: "",
});

const AddProductsPage = (props) => {
  const [formData, setFormData] = useState(initialData);
  const [transDate, setTransDateChange] = useState(new Date());
  const today = Date.now();
  const history = useHistory();

  useEffect(() => {
    if (!props.auth.isAuthenticated) {
      history.push("/login");
    }
  }, [props, history]);

  const addTransactionRow = (e) => {
    const newTransaction = {
      invoiceNumber: "",
      quantity: null,
      dateOfTransaction: Date.now(),
      typeOfEntry: "",
    };
    const newTransactionArray = formData.transactions;
    newTransactionArray.push(newTransaction);
    setFormData({
      ...formData,
      transactions: newTransactionArray,
    });
  };

  const deleteTransactionRow = (index) => {
    const newTransactionArray = formData.transactions;
    newTransactionArray.splice(index, 1);
    setFormData({
      ...formData,
      transactions: newTransactionArray,
    });
  };

  const handleTransactionChange = (event, index) => {
    event.preventDefault();
    const transactionArray = formData.transactions;
    const item = transactionArray[index];
    const name = event.target.name;
    const value = event.target.value;
    transactionArray[index] = {
      ...item,
      [name]: value,
    };
    setFormData({
      ...formData,
      transactions: transactionArray,
    });
  };

  const handleFormChange = (e, updatedAt) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTransactionDateChange = (value, index) => {
    const transactionArray = formData.transactions;
    const item = transactionArray[index];
    transactionArray[index] = {
      ...item,
      dateOfTransaction: value,
    };
    setTransDateChange({
      transDate: value,
    });
    setFormData({
      ...formData,
      transactions: transactionArray,
    });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    let totalQty = 0;
    formData.transactions.forEach((item) => {
      totalQty += Number(item.quantity);
      item.dateOfTransaction = formData.dateOfInvoice;
    });
    formData.totalQuantity = totalQty;
    Axios.post("/api/products", { data: formData })
      .then(() => {
        store.addNotification({
          title: "Product Added",
          message:
            formData.productUID + " added successfully to the inventory.",
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
        history.push("/products");
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
          Add Product
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
                placeholder="Enter product UID"
              />
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Item Name</Form.Label>
              <Form.Control
                name="title"
                onChange={handleFormChange}
                type="text"
                placeholder="Enter Item Name"
              />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col} controlId="formGridCity">
              <Form.Label>Price</Form.Label>
              <Form.Control
                name="price"
                onChange={handleFormChange}
                type="number"
                min="0"
                placeholder="Enter the price of the item"
              />
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Vendor Name</Form.Label>
              <Form.Control
                name="vendorName"
                onChange={handleFormChange}
                placeholder="E.g: Hikvision"
              />
            </Form.Group>

            {/* <Form.Group as={Col} controlId="formGridCity">
                            <Form.Label>GST</Form.Label>
                            <Form.Control name="price" onChange={handleFormChange} placeholder="Enter the GST percentage" type="number" min="0"/>
                        </Form.Group> */}
          </Form.Row>

          <Form.Row>
            <Form.Group style={{ textAlign: "center" }} as={Col}>
              <Form.Label>Date of Recieve</Form.Label>
              <Form.Control
                name="dateOfRecieve"
                readOnly
                value={
                  formData.dateOfRecieve
                    ? new Date(formData.dateOfRecieve).toDateString()
                    : today.toDateString()
                }
              />
              <DayPicker
                month={
                  isNaN(new Date(formData.dateOfRecieve))
                    ? new Date(2020, 11)
                    : new Date(
                        new Date(formData.dateOfRecieve).getUTCFullYear(),
                        new Date(formData.dateOfRecieve).getUTCMonth()
                      )
                }
                showOutsideDays
                selectedDays={new Date(formData.dateOfRecieve) || today}
                onDayClick={(selectedDays) => {
                  const tempDate = new Date(selectedDays);
                  setFormData({
                    ...formData,
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
                value={
                  formData.dateOfInvoice
                    ? new Date(formData.dateOfInvoice).toDateString()
                    : today.toDateString()
                }
              />
              <DayPicker
                month={
                  isNaN(new Date(formData.dateOfInvoice))
                    ? new Date(2020, 11)
                    : new Date(
                        new Date(formData.dateOfInvoice).getUTCFullYear(),
                        new Date(formData.dateOfInvoice).getUTCMonth()
                      )
                }
                showOutsideDays
                selectedDays={new Date(formData.dateOfInvoice) || today}
                onDayClick={(selectedDays) => {
                  const tempDate = new Date(selectedDays);
                  setFormData({
                    ...formData,
                    dateOfInvoice: tempDate.toISOString(),
                  });
                }}
              />
            </Form.Group>
          </Form.Row>

          {formData && formData.transactions ? (
            formData.transactions.map((transaction, index) => {
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
                      <h3>New Transaction</h3>
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
                          formData.transactions.length > 1 ? "block" : "none",
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
                        onChange={(e) => handleTransactionChange(e, index)}
                        type="number"
                        onScroll={() => {}}
                        min="0"
                        placeholder="Enter Item Quantity"
                      />
                    </Form.Group>

                    <Form.Group as={Col}>
                      <Form.Label>Invoice Number</Form.Label>
                      <Form.Control
                        name="invoiceNumber"
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
            Submit
          </Button>
        </Form>
      </Container>
    </div>
  );
};

AddProductsPage.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(AddProductsPage);
