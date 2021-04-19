import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import {
  useTable,
  usePagination,
  useAsyncDebounce,
  useGlobalFilter,
} from "react-table";
import moment from "moment";
import { matchSorter } from "match-sorter";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const Styles = styled.div`
  padding: 1rem;

  .pagination {
    padding: 0.5rem;
  }
`;

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <Form
      style={{ marginBottom: 20 }}
      onSubmit={(e) => {
        e.preventDefault();
      }}
      inline
    >
      <Form.Label>Search</Form.Label>
      <Form.Control
        type="text"
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
        style={{
          border: "1px solid grey",
          fontSize: "1.1rem",
          marginLeft: 10,
        }}
      ></Form.Control>
    </Form>
  );
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}

function TableEl({ columns, data, handleEdit, handleDelete }) {
  const filterTypes = React.useMemo(
    () => ({
      fuzzyText: fuzzyTextFilterFn,
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { pageIndex, pageSize, globalFilter },
  } = useTable(
    {
      columns,
      filterTypes,
      data,
      initialState: { pageIndex: 0 },
    },
    useGlobalFilter,
    usePagination
  );

  return (
    <Styles>
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      <div className="tableWrap">
        <Table striped responsive bordered hover {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps({
                      className: column.collapse ? "collapse" : "",
                    })}
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td
                        {...cell.getCellProps({
                          className: cell.column.collapse ? "collapse" : "",
                        })}
                      >
                        {cell.column.Header === "Edit" ? (
                          <FaEdit
                            color="green"
                            cursor="pointer"
                            onClick={() => handleEdit(cell.row.original._id)}
                          />
                        ) : cell.column.Header === "Delete" ? (
                          <FaTrashAlt
                            color="red"
                            cursor="pointer"
                            onClick={() => handleDelete(cell.row.original._id)}
                          />
                        ) : cell.column.id === "dateOfInvoice" ? (
                          moment(new Date(cell.value)).format("DD/MM/YY")
                        ) : cell.column.id === "paymentRecieved" ? (
                          cell.value ? (
                            <span
                              style={{ fontWeight: "bold", color: "green" }}
                            >
                              Recieved
                            </span>
                          ) : (
                            <span style={{ fontWeight: "bold", color: "red" }}>
                              Pending
                            </span>
                          )
                        ) : (
                          cell.render("Cell")
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
      <div style={{ marginBottom: 20, fontSize: "small" }}>
        <div style={{ textAlign: "center" }}>
          <Form.Label>
            Page{" : "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>
          </Form.Label>
        </div>
        <span>
          <Form.Label>Go to page: </Form.Label>
          <Form.Control
            size="sm"
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{
              width: "50px",
              display: "inline-block",
              marginLeft: 10,
              textAlign: "center",
            }}
          />
        </span>
        <span style={{ float: "right" }}>
          <Form.Label>Items Per Page:</Form.Label>
          <Form.Control
            size="sm"
            as="select"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
            style={{
              width: "max-content",
              display: "inline-block",
              marginLeft: 10,
              textAlign: "center",
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </Form.Control>
        </span>
      </div>
      <div style={{ textAlign: "center" }}>
        <Button
          variant={!canPreviousPage ? "secondary" : "primary"}
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
          style={{ paddingLeft: 10, marginRight: 10 }}
        >
          {"<<"}
        </Button>
        <Button
          variant={!canPreviousPage ? "secondary" : "primary"}
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
          style={{ paddingLeft: 10, marginRight: 10 }}
        >
          {"<"}
        </Button>
        <Button
          variant={!canNextPage ? "secondary" : "primary"}
          onClick={() => nextPage()}
          disabled={!canNextPage}
          style={{ paddingLeft: 10, marginRight: 10 }}
        >
          {">"}
        </Button>
        <Button
          variant={!canNextPage ? "secondary" : "primary"}
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
          style={{ paddingLeft: 10, marginRight: 10 }}
        >
          {">>"}
        </Button>
      </div>
    </Styles>
  );
}

export const DemTable = (props) => {
  // consol/e.log(props.sales);
  const columns = React.useMemo(
    () => [
      {
        Header: "Vendor Info",
        columns: [
          {
            Header: "Invoice Number",
            accessor: "invoiceNumber",
          },
          {
            Header: "Vendor Name",
            accessor: "customerName",
          },
        ],
      },
      {
        Header: "Purchase Info",
        columns: [
          {
            Header: "Date",
            accessor: "dateOfInvoice",
          },
          {
            Header: "Payment",
            accessor: "paymentRecieved",
          },
          {
            Header: "Total Amount",
            accessor: "totalBill",
          },
        ],
      },
      {
        Header: "Edit Purchase",
        columns: [
          {
            Header: "Edit",
          },
          {
            Header: "Delete",
          },
        ],
      },
    ],
    []
  );

  const [loading, setLoading] = React.useState(false);
  const [pageCount, setPageCount] = React.useState(0);

  const [data, setData] = useState([]);
  const fetchIdRef = React.useRef(0);
  const { sales } = props;
  useEffect(() => {
    setData(sales);
  }, [sales]);

  const fetchData = ({ pageSize, pageIndex }) => {
    const fetchId = ++fetchIdRef.current;
    setLoading(true);
    setTimeout(() => {
      if (fetchId === fetchIdRef.current) {
        const startRow = pageSize * pageIndex;
        const endRow = startRow + pageSize;
        setData(data.slice(startRow, endRow));
        setPageCount(Math.ceil(data.length / pageSize));
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div>
      <TableEl
        columns={columns}
        data={data}
        fetchData={fetchData}
        loading={loading}
        pageCount={pageCount}
        handleEdit={props.handleEdit}
        handleDelete={props.handleDelete}
      />
    </div>
  );
};

export default DemTable;
