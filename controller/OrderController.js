import {customer_array, history_array, item_array, order_array} from "../db/database.js";
import OrderModel from "../models/orderModel.js";

let dailyIncome = 0;
let customerCount = 0;

const loadOrderTable = () => {
    $("#cashier_tbody").empty();

    order_array.forEach((order) => {
        let item = item_array.find(i => i.id === order.item_id);

        if (item) {
            let data = `<tr>
                            <td>${order.id}</td>
                            <td>${item.product}</td>
                            <td>${order.quantity}</td>
                            <td>${order.total_price.toFixed(2)}</td>
                            <td>
                                <button class="btn btn-danger btn-sm delete-order" data-id="${order.id}">Delete</button>
                            </td>
                        </tr>`;
            $("#cashier_tbody").append(data);
        }
    });
};

const loadHistoryTable = () => {
    $("#history_tbody").empty();
    history_array.forEach((order) => {
        let item = item_array.find(i => i.id === order.item_id);
        let customer = customer_array.find(c => c.id === order.customer_id);
        if (item && customer) {
            let data = `<tr>
                            <td>${order.id}</td>
                            <td>${customer.name}</td>
                            <td>${new Date().toISOString().slice(0, 10)}</td>
                            <td>${item.product}</td>
                            <td>${order.quantity}</td>
                            <td>${order.total_price.toFixed(2)}</td>
                        </tr>`;
            $("#history_tbody").append(data);
        }
    });
};

// customer search and order
$("#oCustomer").on("keypress", function (e) {
    if (e.which === 13) {
        let customer_contact = $(this).val();

        // Find the customer by contact
        let customer = customer_array.find(c => c.contact === customer_contact);
        if (customer) {
            // If customer is found, populate the customer name input
            $("#oCustomerName").val(customer.name);
        } else {
            alert("Customer not found.");
            $("#oCustomerName").val('');
        }
    }
});

let selected_order_index = null;

// log order row data on click by index
$('#cashier_tbody').on("click", "tr", function () {
    let index = $(this).index();
    let order = order_array[index];
    console.log(`Order ID: ${order.id}, Customer: ${order.customer_id}, Product: ${order.item_id}, Quantity: ${order.quantity}, Price: ${order.total_price}`);

    selected_order_index = $(this).index();

    let customer = order.customer_id;
    let product = order.item_id;
    let quantity = order.quantity;
    let price = order.total_price;

    $('#oCustomerId').val(customer);
    $('#oProductId').val(product);
    $('#oQuantity').val(quantity);
    $('#oPrice').val(price);

});

// delete order functionality
$(document).on("click", ".delete-order", function () {
    let orderId = $(this).data("id");
    order_array.splice(selected_order_index, 1);
    loadOrderTable();
});

// customer Search for History
$("#customerSearchButtonHistory").on("click", function () {
    let searchTerm = $("#customerSearchInputHistory").val().toLowerCase().trim();

    // clear the history table body
    $("#history_tbody").empty();

    // find all orders related to the searched customer
    let foundOrders = order_array.filter(order => {
        let customer = customer_array.find(c => c.id === order.customer_id);
        return customer && customer.name.toLowerCase().includes(searchTerm);
    });

    // populate the history table with found orders
    if (foundOrders.length > 0) {
        foundOrders.forEach(order => {
            let item = item_array.find(i => i.id === order.item_id);
            let customer = customer_array.find(c => c.id === order.customer_id);
            if (item && customer) {
                let data = `<tr>
                                <td>${order.id}</td>
                                <td>${customer.name}</td>
                                <td>${new Date().toISOString().slice(0, 10)}</td>
                                <td>${item.product}</td>
                                <td>${order.quantity}</td>
                                <td>${order.total_price.toFixed(2)}</td>
                            </tr>`;
                $("#history_tbody").append(data);
            }
        });
    } else {
        $("#history_tbody").append('<tr><td colspan="6">No orders found for this customer.</td></tr>');
    }

    // clear the input field after search
    $("#customerSearchInput").val('');
});

$("#viewAllOrders").on("click", function (e) {
    loadHistoryTable();
})

$("#order_add_button").on("click", function () {
    let customer_contact = $("#oCustomer").val();
    let item_id = parseInt($("#oProduct").val());
    let quantity = parseInt($("#oQuantity").val());

    // validate inputs
    if (!customer_contact || isNaN(item_id) || isNaN(quantity) || quantity <= 0) {
        alert("Please enter valid order details.");
        return;
    }

    // find the customer by contact
    let customer = customer_array.find(c => c.contact === customer_contact);
    if (!customer) {
        alert("Customer not found.");
        return;
    }

    let customer_id = customer.id;

    // find the item
    let item = item_array.find(i => i.id === item_id);
    if (!item) {
        alert("Item not found.");
        return;
    }

    let total_price = item.price * quantity;

    // let order = {
    //     id: order_array.length + 1,
    //     customer_id: customer_id,
    //     item_id: item_id,
    //     quantity: quantity,
    //     total_price: total_price
    // };
    let order = new OrderModel(
        order_array.length + 1,
        customer_id,
        item_id,
        quantity,
        total_price
    )

    order_array.push(order);
    history_array.push(order);
    dailyIncome += total_price;
    loadOrderTable();
    loadHistoryTable(); // Update the history table
    updateIncomeDisplay();

    // Reset individual fields
    $("#oProduct").val('');
    $("#oQuantity").val('');
});


// update income and customer count display
const updateIncomeDisplay = () => {
    $("#income").text(`$${dailyIncome.toFixed(2)}`);
    $("#customerCount").text(`${customerCount}`);
};

// Show invoice
$("#show_invoice_btn").on("click", function () {
    Swal.fire({
        title: "Do you want to save the changes?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Save",
        denyButtonText: `Don't save`
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire("Saved!", "", "success");
            const currentDate = new Date();
            const date = currentDate.toLocaleDateString();
            const time = currentDate.toLocaleTimeString();

            const itemCount = document.querySelectorAll('#cashier_tbody tr').length;
            const customerName = document.getElementById('oCustomerName').value || "Not specified";
            const subtotal = calculateSubtotal();

            $("#cashier_tbody").empty();

            order_array = [];
            order_array.clear;

            document.querySelector('#invoice h6:nth-of-type(1)').textContent = `Date: ${date}`;
            document.querySelector('#invoice h6:nth-of-type(2)').textContent = `Time: ${time}`;
            document.querySelector('#invoice h6:nth-of-type(3)').textContent = `Item Count: ${itemCount}`;
            document.querySelector('#invoice h6:nth-of-type(4)').textContent = `Customer: ${customerName}`;
            document.querySelector('#invoice h6:nth-of-type(5)').textContent = `Sub Total: $${subtotal.toFixed(2)}`;
            document.querySelector('#invoice h6:nth-of-type(6)').textContent = `Daily Income: $${dailyIncome.toFixed(2)}`;
            document.querySelector('#invoice h6:nth-of-type(7)').textContent = `Customer Count: ${customerCount}`;

            document.getElementById('invoice').classList.remove('hidden');
            order_array = [];
            order_array.clear;
        } else if (result.isDenied) {
            Swal.fire("Changes are not saved", "", "info");
        }
    });
});

// Done button functionality
$("#done").on("click", function () {
    document.querySelector('#invoice h6:nth-of-type(1)').textContent = '';
    document.querySelector('#invoice h6:nth-of-type(2)').textContent = '';
    document.querySelector('#invoice h6:nth-of-type(3)').textContent = '';
    document.querySelector('#invoice h6:nth-of-type(4)').textContent = '';
    document.querySelector('#invoice h6:nth-of-type(5)').textContent = '';
    document.querySelector('#invoice h6:nth-of-type(6)').textContent = '';
    document.querySelector('#invoice h6:nth-of-type(7)').textContent = '';

    // Hide the invoice display
    document.getElementById('invoice').classList.add('hidden');
});


function calculateSubtotal() {
    let subtotal = 0;
    const rows = document.querySelectorAll('#cashier_tbody tr');
    rows.forEach(row => {
        const price = parseFloat(row.cells[3].textContent);
        const quantity = parseInt(row.cells[2].textContent);
        subtotal += price ;
    });
    return subtotal;
}

// Log customer row data on click
$('#cashier_tbody').on('click' , 'tr', function (e) {
    let index = $(this).index();
    let order = order_array[index];
    console.log(`Order ID: ${order.id}, Product: ${order.product}, Quantity: ${order.quantity}, Price: ${order.total_price}`);
})