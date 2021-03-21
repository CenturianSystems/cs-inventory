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
import EditSalesPage from "./EditSalesPage.js";
import "react-confirm-alert/src/react-confirm-alert.css";
import { store } from "react-notifications-component";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";

const SalesPage = (props) => {
  const [sales, setSales] = useState([]);
  const history = useHistory();
  useEffect(() => {
    if (props.auth.isAuthenticated) {
      const fetchSales = async () => {
        const response = await axios.get("/api/sales");

        setSales(response.data);
      };

      fetchSales();
    } else {
      history.push("/login");
    }
  }, [props, history]);

  // let sumQty = 0;
  let sumPrice = 0;

  const handleSalesEdit = (saleId) => {
    Axios.get(`/api/sales/${saleId}`).then((res) => {
      history.push(`/sales/${saleId}`);
      return <EditSalesPage saleId={saleId} />;
    });
  };

  // Delete a sale
  const handleSalesDelete = (saleId) => {
    const [delSale] = sales.filter((sale) => sale._id === saleId);
    confirmAlert({
      title: `Delete ${delSale.productName}`,
      message:
        "Are you sure you want to delete this ? This action is irreversable.",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            Axios.delete(`/api/sales/${delSale._id}`)
              .then(() => {
                store.addNotification({
                  title: "Sale Deleted",
                  message:
                    delSale.productName + " has been successfully deleted.",
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
                const newSales = sales.filter(
                  (item) => item._id !== delSale._id
                );
                setSales(newSales);
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
        <h1 className="pageTitle">Sales Page</h1>
        <Button
          style={{ marginBottom: 20, float: "right" }}
          onClick={() => history.push("/sales/addnew")}
        >
          {" "}
          <FaPlus style={{ paddingBottom: 2 }} /> Add New Sale
        </Button>
        <Table striped responsive bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Invoice Number</th>
              <th>Date Of Invoice</th>
              <th>Customer Name</th>
              <th>Payment Recieved</th>
              <th>Total Amount</th>
              <th colSpan="2" style={{ textAlign: "center" }}>
                Edit
              </th>
            </tr>
          </thead>
          <tbody>
            {sales && sales.length > 0 ? (
              sales.map((item, index) => {
                sumPrice += Number(item.totalBill);
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.invoiceNumber}</td>
                    <td>
                      {moment(new Date(item.dateOfInvoice)).format(
                        "DD/MM/YYYY"
                      )}
                    </td>
                    <td>{item.customerName}</td>
                    <td>{item.paymentRecieved ? "Yes" : "No"}</td>
                    <td>{item.totalBill}</td>
                    <td>
                      <FaEdit
                        color="green"
                        cursor="pointer"
                        onClick={() => handleSalesEdit(item._id)}
                      />
                    </td>
                    <td>
                      <FaTrashAlt
                        color="red"
                        cursor="pointer"
                        onClick={() => handleSalesDelete(item._id)}
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
            {sales && sales.length > 0 ? (
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
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

SalesPage.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(SalesPage);
