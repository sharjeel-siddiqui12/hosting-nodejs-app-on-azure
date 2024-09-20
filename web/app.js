
const url = window.location.href;
let baseUrl = "";

if (url.split(":")[0] === 'https') {
    baseUrl = '';
} else {
    baseUrl = 'http://localhost:5001';
}

let addProduct = () => {
    let name = document.querySelector("#name").value;
    let price = document.querySelector("#price").value;
    let cat = document.querySelector("#cat").value;
    let desc = document.querySelector("#desc").value;

    if (currentProductId) {
        // Update the product if currentProductId is set
        axios.put(`${baseUrl}/product/${currentProductId}`, {
            name: name,
            price: price,
            category: cat,
            description: desc
        })
        .then(function (response) {
            console.log("Product updated successfully:", response.data);
            document.querySelector("#result").innerHTML = response.data.message;

            // Clear the form and reset the state
            document.querySelector("#name").value = '';
            document.querySelector("#price").value = '';
            document.querySelector("#cat").value = '';
            document.querySelector("#desc").value = '';
            currentProductId = null;
            document.querySelector("form button").innerText = "Add Product";

            getAllProducts();
        })
        .catch(function (error) {
            console.log(error);
            document.querySelector("#result").innerHTML = error.message;
        });
    } else {
        // Create a new product
        axios.post(`${baseUrl}/product`, {
            name: name,
            price: price,
            category: cat,
            description: desc
        })
        .then(function (response) {
            console.log("Product added successfully:", response.data);
            document.querySelector("#result").innerHTML = response.data.message;

            // Clear the form
            document.querySelector("#name").value = '';
            document.querySelector("#price").value = '';
            document.querySelector("#cat").value = '';
            document.querySelector("#desc").value = '';

            getAllProducts();
        })
        .catch(function (error) {
            console.log(error);
            document.querySelector("#result").innerHTML = error.message;
        });
    }
}


let getAllProducts = () => {
    console.log("get all products ======>");
    axios.get(`${baseUrl}/products`)
        .then(function (response) {
            // handle success
            console.log("response is success");
            console.log(response.data.data);
            document.querySelector("#productList").innerHTML = ""

            response?.data?.data.map((eachProduct, index) => {
                document.querySelector("#productList").innerHTML +=
                    `
                    <div>
                        <h1>${eachProduct.name} </h1>
                        <p>${eachProduct.price} </p>
                        <p>${eachProduct.category} </p>
                        <p>${eachProduct.description} </p>
                        <button class="btn" onclick="deleteProduct('${eachProduct._id}')">Delete</button>
                        <button class="btn" onclick="editProduct('${eachProduct._id}')">Edit</button>
                    </div>
                    `
            })
        })
        .catch(function (error) {
            // handle error
            console.log(error);
            document.querySelector("#result").innerHTML =
                error.data.message
        })
}

let currentProductId = null;

let editProduct = (id) => {
    axios.get(`${baseUrl}/product/${id}`)
        .then(function (response) {
            // Fill the form with product details
            let product = response.data.data;
            document.querySelector("#name").value = product.name;
            document.querySelector("#price").value = product.price;
            document.querySelector("#cat").value = product.category;
            document.querySelector("#desc").value = product.description;

            // Store the current product ID to update it later
            currentProductId = product._id;

            // Change button text to "Update Product"
            document.querySelector("form button").innerText = "Update Product";
        })
        .catch(function (error) {
            console.log(error);
            document.querySelector("#result").innerHTML = error.message;
        });
}


let deleteProduct = (id) => {

    axios.delete(`${baseUrl}/product/${id}`)
        .then(function (response) {
            // handle success
            console.log("response is success");
            console.log(response.data);

            document.querySelector("#result").innerHTML =
                response.data.message

            getAllProducts();

        })
        .catch(function (error) {
            // handle error
            console.log(error);
            document.querySelector("#result").innerHTML =
                error.data.message
        })


}


