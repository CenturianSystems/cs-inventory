import React from "react";
import Table from "react-bootstrap/Table";
import "../containers/container.css";
import { FaEdit, FaTrashAlt, FaFileAlt } from "react-icons/fa";
import "react-confirm-alert/src/react-confirm-alert.css";
import moment from "moment";

function ProductDataTable(props) {
  let {
    products,
    isAuthenticated,
    sumQty,
    sumPrice,
    handleTransactionDisplay,
    handleProductEdit,
    handleProductDelete,
  } = props;
  return (
    <Table striped responsive bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Product UID</th>
          <th>Quantity</th>
          <th>
            Date Of Recieve <br />
            (DD/MM/YYYY)
          </th>
          <th>Total Amount</th>
          <th>History</th>
          {isAuthenticated ? (
            <th colSpan="2" style={{ textAlign: "center" }}>
              Edit
            </th>
          ) : (
            <></>
          )}
        </tr>
      </thead>
      <tbody>
        {products && products.length > 0 ? (
          products.map((item, index) => {
            sumQty += item.totalQuantity;
            sumPrice += item.price * item.totalQuantity;
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.productUID}</td>
                <td>{item.totalQuantity}</td>
                <td>
                  {moment(new Date(item.dateOfRecieve)).format("DD/MM/YYYY")}
                </td>
                <td>{(item.price * item.totalQuantity).toFixed(2)}</td>
                <td style={{ textAlign: "center" }}>
                  <FaFileAlt
                    cursor="pointer"
                    onClick={() => handleTransactionDisplay(item._id)}
                  />
                </td>
                {isAuthenticated ? (
                  <>
                    <td>
                      <FaEdit
                        color="green"
                        cursor="pointer"
                        onClick={() => handleProductEdit(item._id)}
                      />
                    </td>
                    <td>
                      <FaTrashAlt
                        color="red"
                        cursor="pointer"
                        onClick={() => handleProductDelete(item._id)}
                      />
                    </td>
                  </>
                ) : (
                  <></>
                )}
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan="8" style={{ textAlign: "center" }}>
              No Data Found
            </td>
          </tr>
        )}
        {products && products.length > 0 ? (
          <tr>
            <td></td>
            <td></td>
            <td>{sumQty}</td>
            <td></td>
            <td>{sumPrice.toFixed(2)}</td>
            {isAuthenticated ? <td colSpan="3"></td> : <></>}
          </tr>
        ) : (
          <tr></tr>
        )}
      </tbody>
    </Table>
  );
}

export default ProductDataTable;
