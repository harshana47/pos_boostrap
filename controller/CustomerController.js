import {customer_array} from "../db/database.js";
import CustomerModel from "../models/customerModel.js";

const loadCustomerTable = () => {
    $("#customer_table_body").empty();
    customer_array.forEach((customer) => {
        let data = `<tr>
                        <td>${customer.id}</td>
                        <td>${customer.name}</td>
                        <td>${customer.address}</td>
                        <td>${customer.contact}</td>
                        <td>
                            <button class="btn btn-danger btn-sm delete-customer" data-id="${customer.id}">Delete</button>
                        </td>
                    </tr>`;
        $("#customer_table_body").append(data);
    });
};

$("#customer_add_button").on("click", function () {
    let name = $("#cName").val();
    let address = $("#cAddress").val();
    let contact = $("#cContact").val();

    if (!name) {
        alert("Please enter customer name.");
    }else if (!address) {
        alert("Please enter customer address.");
    }else if (!contact) {
        alert("Please enter customer contact.");
    }else if (!validatePhone(contact)) {
        alert("Please enter a valid Sri Lankan mobile number.");
    }else {

        // let customer = {
        //     id: customer_array.length + 1,
        //     name: name,
        //     address: address,
        //     contact: contact
        // };
        let customer = new CustomerModel(
            customer_array.length+1,
            name,
            address,
            contact
        );
        Swal.fire({
            title: "Do you want to save the changes?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Save",
            denyButtonText: `Don't save`
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                Swal.fire("Saved!", "", "success");
                customer_array.push(customer);
                loadCustomerTable();
                // Clear fields
                cleanCustomerForm()
            } else if (result.isDenied) {
                Swal.fire("Customer not saved", "", "info");
            }
        });
    }
});

// Delete customer functionality
$(document).on("click", ".delete-customer", function () {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger"
        },
        buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            swalWithBootstrapButtons.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
            });
            customer_array.splice(selected_customer_index, 1);
            loadCustomerTable();
            cleanCustomerForm()
        } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
        ) {
            swalWithBootstrapButtons.fire({
                title: "Cancelled",
                text: "Your imaginary file is safe :)",
                icon: "error"
            });
        }
    });

});

// const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//
const validatePhone = (contact) => {
    const sriLankanMobileRegex = /^(?:\+94|0)?7[0-9]{8}$/;
    return sriLankanMobileRegex.test(contact)
}

// Customer Search
$("#customerSearchButton").on("click", function () {
    let searchTerm = $("#customerSearchInput").val().toLowerCase().trim();
    let foundCustomers = customer_array.filter(customer =>
        customer.id.toString() === searchTerm ||
        customer.name.toLowerCase().includes(searchTerm) ||
        customer.contact.includes(searchTerm)
    );

    // Clear the table body and display found customers
    $("#customer_table_body").empty();
    if (foundCustomers.length > 0) {
        foundCustomers.forEach(customer => {
            let data = `<tr>
                            <td>${customer.id}</td>
                            <td>${customer.name}</td>
                            <td>${customer.address}</td>
                            <td>${customer.contact}</td>
                            <td>
                                <button class="btn btn-danger btn-sm delete-customer" data-id="${customer.id}">Delete</button>
                            </td>
                        </tr>`;
            $("#customer_table_body").append(data);
        });
    } else {
        $("#customer_table_body").append('<tr><td colspan="5">No customers found.</td></tr>');
    }

    // Clear the input field after search
    $("#customerSearchInput").val('');
});

// View All Customers
$("#viewAllCustomers").on("click", function () {
    loadCustomerTable();
});

let selected_customer_index = null;

$('#customer_table_body').on("click", "tr", function () {
    let index = $(this).index();
    let customer = customer_array[index];
    console.log(`Customer ID: ${customer.id}, Name: ${customer.name},Address: ${customer.address}, Contact: ${customer.contact}`);

    selected_customer_index = $(this).index();

    let id = customer.id;
    let name = customer.name;
    let address = customer.address;
    let contact = customer.contact;

    $('#cId').val(id);
    $('#cName').val(name);
    $('#cAddress').val(address);
    $('#cContact').val(contact);
})

//update customer
$("#customer_update_btn").on("click", function () {
    let index = selected_customer_index;

    let name = $("#cName").val();
    let address = $("#cAddress").val();
    let contact = $("#cContact").val();

    if (!name || !address || !contact) {
        alert("Please enter valid customer details.");
        return;
    }
    if (!name) {
        alert("Please enter customer name.");
    }else if (!address) {
        alert("Please enter customer address.");
    }else if (!contact) {
        alert("Please enter customer contact.");
    }else if (!validatePhone(contact)) {
        alert("Please enter a valid Sri Lankan mobile number.");
    }else {
        // let customer = {
        //     id: customer_array[index].id,
        //     name: name,
        //     address: address,
        //     contact: contact
        // };
        let customer = new CustomerModel(
            customer_array[index].id,
            name,
            address,
            contact
        );
        Swal.fire({
            title: "Are you sure?",
            text: "Do you really want to update!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, update it!"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Updated!",
                    text: "Your file has been updated.",
                    icon: "success"
                });
                customer_array[index] = customer;
                loadCustomerTable();
                // Clear fields
                cleanCustomerForm()
            }
        });
    }
});

const cleanCustomerForm = () => {
    $("#cName").val("");
    $("#cAddress").val("");
    $("#cContact").val("");
}