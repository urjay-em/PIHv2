import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Add, Edit, Delete } from "@mui/icons-material";
import EmployeeService from "../../../../features/employee_service.js";
import { tokens } from "../../../../../src/theme.js";
import Header from "../../Header";
import Form from "../../pages/form/Form.jsx";
import $ from "jquery";
import "datatables.net";
import "datatables.net-dt/css/dataTables.dataTables.css";

const Employees = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({});
  const tableRef = useRef(null);

  // Fetch employees when the component mounts
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Fetch employee data
  const fetchEmployees = () => {
    setLoading(true);
    EmployeeService.getAllEmployees()
      .then((response) => {
        setEmployees(response.data);
        setLoading(false);
        initializeDataTable(response.data);
      })
      .catch((error) => {
        setError("Failed to load employee data");
        setLoading(false);
      });
  };

  // Initialize DataTable
  const initializeDataTable = (data) => {
    if ($.fn.dataTable.isDataTable(tableRef.current)) {
      $(tableRef.current).DataTable().clear().rows.add(data).draw(); // Refresh data
    } else {
      $(tableRef.current).DataTable({
        data: data,
        columns: [
          { data: "id", title: "ID" },
          { data: "first_name", title: "First Name" },
          { data: "middle_name", title: "Middle Name" },
          { data: "last_name", title: "Last Name" },
          { data: "age", title: "Age" },
          { data: "gender", title: "Gender" },
          { data: "contact_no", title: "Contact Number" },
          { data: "email_address", title: "Email" },
          { data: "address", title: "Address" },
          { data: "account_types", title: "Account Type" },
          { data: "hire_date", title: "Hire Date" },
          { data: "salary", title: "Salary (₱)" },
          {
            data: null,
            title: "Actions",
            render: (data) => {
              return `
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
              `;
            },
          },
        ],
        pageLength: 10,
        initComplete: function () {
          this.api()
            .columns()
            .every(function () {
              const column = this;
              const footer = column.footer();
              if (footer) {
                const input = document.createElement("input");
                input.placeholder = footer.textContent || "Search";
                input.style.width = "100%";
                input.style.boxSizing = "border-box";
                input.addEventListener("keyup", () => {
                  if (column.search() !== input.value) {
                    column.search(input.value).draw();
                  }
                });
                footer.replaceChildren(input);
              }
            });
        },
      });

      // Attach click events for edit and delete
      $(tableRef.current).on("click", ".edit-btn", function () {
        const rowData = $(tableRef.current).DataTable().row($(this).closest("tr")).data();
        handleEditEmployee(rowData);
      });

      $(tableRef.current).on("click", ".delete-btn", function () {
        const rowData = $(tableRef.current).DataTable().row($(this).closest("tr")).data();
        handleDeleteEmployee(rowData.userid);
      });
    }
  };

  // Add employee
  const handleAddEmployee = () => {
    setFormData({});
    setSelectedEmployee(null);
    setOpenDialog(true);
  };

  // Edit employee
  const handleEditEmployee = (employee) => {
    setFormData(employee);
    setSelectedEmployee(employee);
    setOpenDialog(true);
  };

  // Delete employee
  const handleDeleteEmployee = (employeeId) => {
    EmployeeService.deleteEmployee(employeeId)
      .then(() => {
        fetchEmployees();
      })
      .catch((error) => {
        console.error("Failed to delete employee:", error);
      });
  };

  const handleSaveEmployee = (data) => {
    if (selectedEmployee) {
      // Update existing employee
      EmployeeService.updateEmployee(selectedEmployee.userid, data)
        .then(() => {
          fetchEmployees(); // Refresh the employee list
          setOpenDialog(false); // Close the dialog
        })
        .catch((error) => {
          console.error("Failed to update employee:", error);
        });
    } else {
      // Create new employee
      EmployeeService.createEmployee(data)
        .then(() => {
          fetchEmployees(); // Refresh the employee list
          setOpenDialog(false); // Close the dialog
        })
        .catch((error) => {
          console.error("Failed to create employee:", error);
        });
    }
  };

  return (
    <Box m="20px">
      <Header title="EMPLOYEES" subtitle="List of Employees in the Database" />
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddEmployee}
        >
          Add Employee
        </Button>
      </Box>

      <Box>
        <table ref={tableRef} className="display" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Middle Name</th>
              <th>Last Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Contact Number</th>
              <th>Email</th>
              <th>Address</th>
              <th>Account Type</th>
              <th>Hire Date</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tfoot>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Middle Name</th>
              <th>Last Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Contact Number</th>
              <th>Email</th>
              <th>Address</th>
              <th>Account Type</th>
              <th>Hire Date</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </tfoot>
        </table>
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{selectedEmployee ? "Edit Employee" : "Add New Employee"}</DialogTitle>
        <DialogContent>
          <Form
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSaveEmployee}
            existingEmployee={selectedEmployee}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Employees;
