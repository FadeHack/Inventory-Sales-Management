document.addEventListener('DOMContentLoaded', () => {
    const inventoryTable = document.getElementById('inventoryTable').getElementsByTagName('tbody')[0];
    const billTable = document.getElementById('billTable').getElementsByTagName('tbody')[0];
    const inventoryForm = document.getElementById('inventory-form');
    const billForm = document.getElementById('bill-form');
    const apiUrl = 'http://localhost:5000/api';

    let inventoryItems = [];

    function showAlert(message, type = 'success') {
        const alertBox = document.getElementById('alertBox');
        const alertMessage = document.getElementById('alertMessage');

        alertMessage.textContent = message;
        alertBox.classList.remove('alert-success', 'alert-danger');
        alertBox.classList.add(`alert-${type}`);
        alertBox.style.display = 'block';

        setTimeout(() => {
            alertBox.style.display = 'none';
        }, 3000);
    }

    // Fetch Inventory and populate tables and select options
    const fetchInventory = async () => {
        try {
            const response = await fetch(`${apiUrl}/inventory`);

            if (!response.ok) {
                throw new Error(`Error fetching inventory: ${response.status} ${response.statusText}`);
            }

            inventoryItems = await response.json();
            populateInventoryTable();
            populateSelectOptions();
        } catch (error) {
            console.error("Error fetching inventory:", error);
            showAlert(error.message, 'danger');
        }
    };

    // Populate inventory table
    const populateInventoryTable = () => {
        inventoryTable.innerHTML = '';
        inventoryItems.forEach((item, index) => {
            const row = inventoryTable.insertRow();
            row.insertCell(0).textContent = index + 1;
            row.insertCell(1).textContent = item.name;
            row.insertCell(2).textContent = item.quantity;
            row.insertCell(3).textContent = item.price;
        });
    };

    // Populate select options for bill items
    const populateSelectOptions = () => {
        const billItemsSelects = document.querySelectorAll('.bill-item-select');
        billItemsSelects.forEach(select => {
            select.innerHTML = '<option disabled selected value="">Select an item...</option>';
            inventoryItems.forEach(item => {
                const option = document.createElement('option');
                option.value = item._id;
                option.textContent = `${item.name} (Price: ${item.price})`;
                select.appendChild(option);
            });
        });
    };

    const populateSelectOptionsForSelect = (selectElement) => {
        selectElement.innerHTML = '<option disabled selected value="">Select an item...</option>';
        inventoryItems.forEach(item => {
            const option = document.createElement('option');
            option.value = item._id;
            option.textContent = `${item.name} (Price: ${item.price})`;
            selectElement.appendChild(option);
        });
    };

    // Fetch Bills and populate bill table
    const fetchBills = async () => {
        try {
            const response = await fetch(`${apiUrl}/bills`);

            if (!response.ok) {
                throw new Error(`Error fetching bills: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            billTable.innerHTML = '';
            data.forEach((bill, index) => {
                const row = billTable.insertRow();
                row.insertCell(0).textContent = index + 1;
                row.insertCell(1).textContent = bill.items.map(item => `${item.item.name} x ${item.quantity}`).join(', ');
                row.insertCell(2).textContent = bill.totalAmount;
                row.insertCell(3).textContent = new Date(bill.createdAt).toLocaleDateString();
            });
        } catch (error) {
            console.error("Error fetching bills:", error);
            showAlert(error.message, 'danger');
        }
    };

    document.getElementById('add-item-btn').addEventListener('click', () => {
        const container = document.getElementById('bill-items-container');
        const newItem = document.createElement('div');
        newItem.classList.add('form-group', 'bill-item', 'd-flex', 'align-items-start', 'mt-3');
        newItem.innerHTML = `
            <div class="me-3 mr-3">
                <select class="form-control bill-item-select" required>
                    <!-- Inventory items will be populated here -->
                </select>
            </div>
            <div class="me-3 mr-3">
                <input type="number" class="form-control bill-item-quantity" placeholder="Enter quantity" required>
            </div>
            <button type="button" class="btn btn-danger remove-item-btn align-center"><i class="fas fa-trash"></i> Remove Item</button>
        `;
        container.appendChild(newItem);

        const newSelect = newItem.querySelector('.bill-item-select');
        populateSelectOptionsForSelect(newSelect);
    });

    // Event delegation for dynamically added remove buttons
    document.getElementById('bill-items-container').addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-item-btn')) {
            event.target.parentElement.remove();
        }
    });

    // Handle form submissions
    inventoryForm.addEventListener('submit', async (event) => {
        event.preventDefault();
    
        // Get data from form fields (similar to bills section)
        const itemName = document.getElementById('itemName').value;
        const itemQuantity = parseInt(document.getElementById('itemQuantity').value, 10);
        const itemPrice = parseFloat(document.getElementById('itemPrice').value);
    
        const data = {
            name: itemName,
            quantity: itemQuantity,
            price: itemPrice
        };
    
        console.log(data); // Check the values in the console
    
        try {
            const response = await fetch(`${apiUrl}/inventory`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
    
            if (!response.ok) {
                throw new Error(`Error adding item: ${response.status} ${response.statusText}`);
            }
    
            showAlert("Item added successfully!");
            fetchInventory();
            inventoryForm.reset();
        } catch (error) {
            console.error("Error adding item:", error);
            showAlert(error.message, 'danger');
        }
    });

    billForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const items = Array.from(document.querySelectorAll('.bill-item')).map(item => {
            return {
                item: item.querySelector('.bill-item-select').value,
                quantity: item.querySelector('.bill-item-quantity').value
            };
        });
        const data = { items };

        try {
            const response = await fetch(`${apiUrl}/bills`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`Error creating bill: ${response.status} ${response.statusText}`);
            }

            showAlert("Bill created successfully!");
            fetchBills();
            billForm.reset();

            // Remove dynamically added bill items
            const billItemsContainer = document.getElementById('bill-items-container');
            const dynamicBillItems = billItemsContainer.querySelectorAll('.bill-item:not(:first-of-type)');
            dynamicBillItems.forEach(item => item.remove());

        } catch (error) {
            console.error("Error creating bill:", error);
            showAlert(error.message, 'danger');
        }
    });

    // Initial fetch
    fetchInventory();
    fetchBills();
});