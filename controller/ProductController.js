import {item_array} from "../db/database.js";
import ProductModel from "../models/itemModel.js";

const updateTable = () => {
    $("#item_table_body").empty();
    item_array.forEach((item) => {
        let data = `<tr>
                        <td>${item.id}</td>
                        <td>${item.product}</td>
                        <td>${item.price}</td>
                        <td>${item.quantity}</td>
                        <td>
                            <button class="btn btn-danger btn-sm delete-item" data-id="${item.id}">Delete</button>
                        </td>
                    </tr>`;
        $("#item_table_body").append(data);
    });
};

$("#item_add_button").on("click", function () {
    let product = $("#product").val();
    let price = parseFloat($("#pPrice").val());
    let quantity = parseInt($("#pQuantity").val());

    if (!product || isNaN(price) || isNaN(quantity) || quantity <= 0) {
        alert("Please enter valid product details.");
        return;
    }

    // let item = {
    //     id: item_array.length + 1,
    //     product: product,
    //     price: price,
    //     quantity: quantity
    // };

    let item = new ProductModel(
        item_array.length + 1,
        product,
        price,
        quantity
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
            item_array.push(item);
            updateTable();
            // Clear fields
            cleanProductForm()
        } else if (result.isDenied) {
            Swal.fire("Changes are not saved", "", "info");
        }
    });
});

// Delete item functionality
$(document).on("click", ".delete-item", function () {
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
            // Filter out the item to be deleted
            item_array.splice(selected_item_index, 1);
            updateTable();
            cleanProductForm();

            swalWithBootstrapButtons.fire({
                title: "Deleted!",
                text: "Your item has been deleted.",
                icon: "success"
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire({
                title: "Cancelled",
                text: "Your item is safe :)",
                icon: "error"
            });
        }
    });
});


// Item Search
$("#itemSearchButton").on("click", function () {
    let searchTerm = $("#itemSearchInput").val().toLowerCase().trim();
    let foundItems = item_array.filter(item =>
        item.id.toString() === searchTerm ||
        item.product.toLowerCase().includes(searchTerm)
    );

    // Clear the table body and display found items
    $("#item_table_body").empty();
    if (foundItems.length > 0) {
        foundItems.forEach(item => {
            let data = `<tr>
                            <td>${item.id}</td>
                            <td>${item.product}</td>
                            <td>${item.price}</td>
                            <td>${item.quantity}</td>
                            <td>
                                <button class="btn btn-danger btn-sm delete-item" data-id="${item.id}">Delete</button>
                            </td>
                        </tr>`;
            $("#item_table_body").append(data);
        });
    } else {
        $("#item_table_body").append('<tr><td colspan="5">No items found.</td></tr>');
    }

    // Clear the input field after search
    $("#itemSearchInput").val('');
});

// View All Items
$("#viewAllItems").on("click", function () {
    updateTable();
});

let selected_item_index = null;

// Log customer row data on click by index
$('#item_table_body').on("click", "tr", function () {
    let index = $(this).index();
    let item = item_array[index];
    console.log(`Item ID: ${item.id}, product: ${item.product}, Quantity: ${item.quantity},Price: ${item.price}`);

    selected_item_index = $(this).index();

    let product = item.product;
    let quantity = item.quantity;
    let price = item.price;

    $('#product').val(product);
    $('#pPrice').val(price);
    $('#pQuantity').val(quantity);

});
//update item
$("#item_update_btn").on("click", function () {
    let index = selected_item_index;

    let product = $("#product").val();
    let quantity = $("#pQuantity").val();
    let price = $("#pPrice").val();

    if (!product || !quantity || !price) {
        alert("Please enter valid Product details.");
        return;
    }

    // let item = {
    //     id: item_array[index].id,
    //     product: product,
    //     price: price,
    //     quantity: quantity
    // };

    let item = new ProductModel(
        item_array[index].id,
        product,
        price,
        quantity
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
                text: "Your file has been Updated.",
                icon: "success"
            });
        }
        item_array[index] = item;
        updateTable();
        // Clear fields
        cleanProductForm()
    });

});
const cleanProductForm = () => {
    $("#product").val("");
    $("#pQuantity").val("");
    $("#pPrice").val("");
}