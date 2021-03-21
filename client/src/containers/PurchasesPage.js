import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import axios from "axios";
import "./container.css";
import Button from "react-bootstrap/esm/Button";
import { FaPlus, FaEdit, FaTrashAlt } from "react-icons/fa";
import Axios from "axios";
import { confirmAlert } from "react-confirm-alert";
import EditPurchasesPage from "./EditPurchasesPage.js";
import "react-confirm-alert/src/react-confirm-alert.css";
import { store } from "react-notifications-component";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";

const PurchasesPage = (props) => {
  const [purchases, setPurchases] = useState([]);
  // const [products, setProducts] = useState([])
  const history = useHistory();
  useEffect(() => {
    if (props.auth.isAuthenticated) {
      const fetchPurchases = async () => {
        const responsePurchase = await axios.get("/api/purchases");

        setPurchases(responsePurchase.data);
      };

      // const fetchProducts = async () => {
      //     const responseProducts = await axios.get('/api/products')

      //     setProducts(responseProducts.data)
      // }

      fetchPurchases();
      // fetchProducts();
    } else {
      history.push("/login");
    }
  }, [props, history]);

  let sumPrice = 0;

  const handlePurchasesEdit = (purchaseId) => {
    Axios.get(`/api/purchases/${purchaseId}`).then((res) => {
      history.push(`/purchases/${purchaseId}`);
      return <EditPurchasesPage purchaseId={purchaseId} />;
    });
  };

  // Delete a Purchase - ADMIN Only
  const handlePurchasesDelete = (purchaseId) => {
    const [delPurchase] = purchases.filter(
      (purchase) => purchase._id === purchaseId
    );
    confirmAlert({
      title: `Delete ${delPurchase.invoiceNumber}`,
      message:
        "Are you sure you want to delete this ? This action is irreversable.",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            Axios.delete(`/api/purchases/${delPurchase._id}`)
              .then(() => {
                store.addNotification({
                  title: "Purchase Deleted",
                  message:
                    delPurchase.invoiceNumber +
                    " has been successfully deleted.",
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
                const newPurchases = purchases.filter(
                  (item) => item._id !== delPurchase._id
                );
                setPurchases(newPurchases);
              })
              .catch((e) => {
                console.log(e);
              });
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  return (
    <div>
      <Container>
        <h1 className="pageTitle">Purchases Page</h1>
        <Button
          style={{ marginBottom: 20, float: "right" }}
          onClick={() => history.push("/purchases/addnew")}
        >
          {" "}
          <FaPlus style={{ paddingBottom: 2 }} /> Add New Purchase
        </Button>
        <Table striped responsive bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Invoice Number</th>
              {/* <th>Date Of Purchase</th> */}
              <th>Date Of Invoice</th>
              <th>Vendor Name</th>
              <th>Total Amount</th>
              <th colSpan="2" style={{ textAlign: "center" }}>
                Edit
              </th>
            </tr>
          </thead>
          <tbody>
            {purchases && purchases.length > 0 ? (
              purchases.map((item, index) => {
                sumPrice += Number(item.totalBill);
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.invoiceNumber}</td>
                    {/* <td>{new Date(item.dateOfPurchase).toDateString()}</td> */}
                    <td>
                      {moment(new Date(item.dateOfInvoice)).format(
                        "DD/MM/YYYY"
                      )}
                    </td>
                    <td>{item.customerName}</td>
                    <td>{item.totalBill}</td>
                    <td>
                      <FaEdit
                        color="green"
                        cursor="pointer"
                        onClick={() => handlePurchasesEdit(item._id)}
                      />
                    </td>
                    <td>
                      <FaTrashAlt
                        color="red"
                        cursor="pointer"
                        onClick={() => handlePurchasesDelete(item._id)}
                      />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No Data Found
                </td>
              </tr>
            )}
            {purchases && purchases.length > 0 ? (
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                {/* <td></td> */}
                <td>{sumPrice}</td>
                <td colSpan="2"></td>
              </tr>
            ) : (
              <tr></tr>
            )}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

PurchasesPage.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PurchasesPage);
