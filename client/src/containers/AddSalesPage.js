import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./container.css";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Axios from "axios";
import { FaArrowLeft, FaPlus, FaTrash } from "react-icons/fa";
import axios from "axios";
import { store } from "react-notifications-component";
import Select from "react-select";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import "react-day-picker/lib/style.css";
import DayPicker from "react-day-picker";

const AddSalesPage = (props) => {
  const initialData = Object.freeze({
    saleItems: [
      {
        productId: "",
        productName: "",
        quantity: 0,
        salesPrice: 0,
        typeOfEntry: "sale",
      },
    ],
    dateOfSale: Date.now(),
    dateOfInvoice: Date.now(),
    invoiceNumber: "",
    customerName: "",
    customerContact: "",
    paymentRecieved: false,
  });
  const [formData, setFormData] = useState(initialData);
  const [products, setProducts] = useState([]);
  const [tempQtyData, setTempQtyData] = useState([]);
  const today = Date.now();
  const history = useHistory();
  useEffect(() => {
    if (props.auth.isAuthenticated) {
      const fetchProducts = async () => {
        const response = await axios.get("/api/products");
        setProducts(response.data);
      };

      fetchProducts();
    } else {
      history.push("/login");
    }
  }, [props, history]);

  const handleFormChange = (e, updatedAt) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    // formData.totalBill = formData.salesPrice * formData.quantity;
    let existingProducts = [];
    formData.saleItems.forEach((item, index) => {
      existingProducts = products.filter(
        (prdt) => prdt.productUID === item.productId
      );
      existingProducts.map((product) => {
        if (product.productUID === item.productId) {
          product.transactions.push({
            invoiceNumber: formData.invoiceNumber,
            quantity: Number(formData.saleItems[index].quantity),
            dateOfTransaction: formData.dateOfInvoice,
            typeOfEntry: "sale",
          });
        }
        return null;
      });
    });

    Axios.post("/api/sales", { data: formData })
      .then(() => {
        store.addNotification({
          title: "Sale Added",
          message:
            formData.invoiceNumber + " added successfully to the inventory.",
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
        history.push("/sales");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  let dropDownOptions = [];
  const availableProducts = products.filter((item) => item.totalQuantity >= 1);
  dropDownOptions = availableProducts.map((item) => {
    return {
      productId: item.productUID,
      avalQty: item.totalQuantity,
      value: item.title,
      label: item.title,
    };
  });

  const addSaleRow = (e) => {
    const newSaleItem = {
      productId: "",
      productName: "",
      quantity: 0,
      salesPrice: 0,
      typeOfEntry: "sale",
    };
    const newItemsArray = formData.saleItems;
    newItemsArray.push(newSaleItem);
    setFormData({
      ...formData,
      saleItems: newItemsArray,
    });
  };

  const deleteSaleRow = (index) => {
    const newItemsArray = formData.saleItems;
    newItemsArray.splice(index, 1);
    setFormData({
      ...formData,
      saleItems: newItemsArray,
    });
  };

  const handleSaleItemChange = (event, index) => {
    event.preventDefault();
    const itemsArray = formData.saleItems;
    const item = itemsArray[index];
    const name = event.target.name;
    const value = event.target.value;
    itemsArray[index] = {
      ...item,
      [name]: value,
    };
    setFormData({
      ...formData,
      saleItems: itemsArray,
    });
  };

  const handleSelectChange = (e, index) => {
    const value = e && e.value ? e.value : "";
    const itemsArray = formData.saleItems;
    const item = itemsArray[index];
    itemsArray[index] = {
      ...item,
      productName: value,
      productId: e ? e.productId : "",
    };
    setFormData({
      ...formData,
      saleItems: itemsArray,
    });

    let qtyData = [...tempQtyData];
    if (value && e && e.avalQty) {
      qtyData.push({
        name: value,
        qty: e ? e.avalQty : "",
      });
    } else {
      qtyData.pop();
    }

    setTempQtyData(qtyData);
  };

  // Todo - Will be added in future
  //   const validInput = () => {
  //     const {
  //       productName,
  //       quantity,
  //       customerContact,
  //       customerName,
  //       salesPrice,
  //       dateOfInvoice,
  //       dateOfSale,
  //     } = formData;

  //     if (
  //       productName &&
  //       quantity > 0 &&
  //       customerContact &&
  //       customerName &&
  //       salesPrice > 0 &&
  //       dateOfInvoice &&
  //       dateOfSale
  //     ) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   };

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
          Add Sale
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
          {formData && formData.saleItems ? (
            formData.saleItems.map((product, index) => {
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
                      <h3>New Sale Item</h3>
                    </Form.Group>
                    <Button
                      style={{
                        float: "right",
                        height: `calc(1.5em + .75rem + 2px)`,
                        marginBottom: 32,
                        marginRight: 10,
                      }}
                      onClick={addSaleRow}
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
                          formData.saleItems.length > 1 ? "block" : "none",
                      }}
                      onClick={() => deleteSaleRow(index)}
                    >
                      <FaTrash />
                    </Button>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col}>
                      <Form.Label>Product ID</Form.Label>
                      <Form.Control
                        name="productId"
                        readOnly
                        value={formData.saleItems[index].productId}
                        type="text"
                        placeholder="Enter Product UID"
                      />
                    </Form.Group>

                    <Form.Group as={Col}>
                      <Form.Label>Product Name</Form.Label>
                      <Select
                        onChange={(e) => handleSelectChange(e, index)}
                        isClearable="true"
                        placeholder="Choose a product from Inventory..."
                        options={dropDownOptions}
                      />
                    </Form.Group>
                  </Form.Row>

                  <Form.Row>
                    <Form.Group as={Col}>
                      <Form.Label>Quantity</Form.Label>
                      <Form.Control
                        name="quantity"
                        onChange={(e) => handleSaleItemChange(e, index)}
                        value={
                          products.filter(
                            (item) => item.title === formData.productName
                          ).totalQuantity
                        }
                        type="number"
                        min="0"
                        max={tempQtyData[index]}
                        placeholder={
                          tempQtyData.length > 0 &&
                          tempQtyData[index] &&
                          tempQtyData[index].qty > 0
                            ? `${tempQtyData[index].qty} Items Available`
                            : "Enter Item Quantity"
                        }
                      />
                    </Form.Group>

                    <Form.Group as={Col}>
                      <Form.Label>Product Price</Form.Label>
                      <Form.Control
                        name="salesPrice"
                        onChange={(e) => handleSaleItemChange(e, index)}
                        type="text"
                        placeholder="Enter Product Price"
                      />
                    </Form.Group>
                  </Form.Row>
                </div>
              );
            })
          ) : (
            <h1>No Products in Inventory</h1>
          )}

          <Form.Row>
            <Form.Group as={Col} controlId="formGridAddress1">
              <Form.Label>Customer Name</Form.Label>
              <Form.Control
                // readOnly={formData.quantity ? false : true}
                name="customerName"
                onChange={handleFormChange}
                placeholder="E.g: Mayank Khanna"
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridAddress1">
              <Form.Label>Customer Contact</Form.Label>
              <Form.Control
                readOnly={formData.customerName ? false : true}
                name="customerContact"
                onChange={handleFormChange}
                placeholder="Mobile Number: 9876543210"
              />
            </Form.Group>
          </Form.Row>

          <Form.Group controlId="formGridAddress2">
            <Form.Label>Invoice Number</Form.Label>
            <Form.Control
              readOnly={formData.customerContact ? false : true}
              name="invoiceNumber"
              onChange={handleFormChange}
              placeholder="Enter the Invoice Number"
            />
          </Form.Group>
          <Form.Row>
            <Form.Group as={Col} controlId="formGridCity">
              <Form.Label>Price</Form.Label>
              <Form.Control
                readOnly={formData.invoiceNumber ? false : true}
                name="totalBill"
                onChange={handleFormChange}
                placeholder="Enter the price of the item"
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>Date of Sale</Form.Label>
              <Form.Control
                name="dateOfSale"
                readOnly
                value={
                  formData.dateOfSale
                    ? new Date(formData.dateOfSale).toDateString()
                    : today.toDateString()
                }
              />
              <DayPicker
                month={
                  isNaN(new Date(formData.dateOfSale))
                    ? new Date(2020, 11)
                    : new Date(
                        new Date(formData.dateOfSale).getUTCFullYear(),
                        new Date(formData.dateOfSale).getUTCMonth()
                      )
                }
                showOutsideDays
                selectedDays={new Date(formData.dateOfSale) || today}
                onDayClick={(selectedDays) => {
                  const tempDate = new Date(selectedDays);
                  setFormData({
                    ...formData,
                    dateOfSale: tempDate.toISOString(),
                  });
                }}
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridZip">
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

          <Button
            // style={{ display: validInput(formData) ? "block" : "none" }}
            variant="primary"
            type="submit"
          >
            Submit
          </Button>
        </Form>
      </Container>
    </div>
  );
};

AddSalesPage.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(AddSalesPage);
