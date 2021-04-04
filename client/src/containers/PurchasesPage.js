import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Container from "react-bootstrap/Container";
import axios from "axios";
import "./container.css";
import Button from "react-bootstrap/esm/Button";
import { FaPlus } from "react-icons/fa";
import Axios from "axios";
import { confirmAlert } from "react-confirm-alert";
import EditPurchasesPage from "./EditPurchasesPage.js";
import "react-confirm-alert/src/react-confirm-alert.css";
import { store } from "react-notifications-component";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import TableData from "../components/Purchase/TableData";

const PurchasesPage = (props) => {
  const [purchases, setPurchases] = useState([]);
  const history = useHistory();
  useEffect(() => {
    if (props.auth.isAuthenticated) {
      const fetchPurchases = async () => {
        const responsePurchase = await axios.get("/api/purchases");

        setPurchases(responsePurchase.data);
      };

      fetchPurchases();
    } else {
      history.push("/login");
    }
  }, [props, history]);

  // Sort the purchases based on Invoice Date
  purchases.sort(
    (a, b) => new Date(a.dateOfInvoice) - new Date(b.dateOfInvoice)
  );

  // todo - admin only access
  const handlePurchasesEdit = (purchaseId) => {
    Axios.get(`/api/purchases/${purchaseId}`).then((res) => {
      history.push(`/purchases/${purchaseId}`);
      return <EditPurchasesPage purchaseId={purchaseId} />;
    });
  };

  // Todo - Admin Only Access
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
        <div>
          <Button
            style={{ marginBottom: 20, float: "right" }}
            onClick={() => history.push("/purchases/addnew")}
          >
            {" "}
            <FaPlus style={{ paddingBottom: 2 }} /> Add New Purchase
          </Button>
        </div>
        <TableData
          purchases={purchases}
          handleEdit={handlePurchasesEdit}
          handleDelete={handlePurchasesDelete}
        />
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
