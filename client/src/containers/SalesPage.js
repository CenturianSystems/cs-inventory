import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Container from "react-bootstrap/Container";
import axios from "axios";
import "./container.css";
import Button from "react-bootstrap/esm/Button";
import { FaPlus } from "react-icons/fa";
import Axios from "axios";
import { confirmAlert } from "react-confirm-alert";
import EditSalesPage from "./EditSalesPage.js";
import "react-confirm-alert/src/react-confirm-alert.css";
import { store } from "react-notifications-component";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import TableData from "../components/Sales/TableData";

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

  // Sort the sales based on Invoice Date
  sales.sort((a, b) => new Date(a.dateOfInvoice) - new Date(b.dateOfInvoice));

  // Todo - Admin only access
  // Edit a sale
  const handleSalesEdit = (saleId) => {
    Axios.get(`/api/sales/${saleId}`).then((res) => {
      history.push(`/sales/${saleId}`);
      return <EditSalesPage saleId={saleId} />;
    });
  };

  // Todo - Admin only Access
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
        <TableData
          sales={sales}
          handleEdit={handleSalesEdit}
          handleDelete={handleSalesDelete}
        />
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
