//environment variables
let cartID = sessionStorage.getItem("elasticCartID")
let authToken = localStorage.getItem("elasticAuthToken")
let baseUrl =  "https://useast.api.elasticpath.com/v2"
//setup headers for Cart
console.log(cartID,authToken)
let cartHeaders = new Headers();
cartHeaders.append("accept", "application/json");
cartHeaders.append("content-type", "application/json");
cartHeaders.append("Authorization", authToken);
//settings for GET cart requests
let getCartOptions = {
  method: 'GET',
  headers: cartHeaders,
  redirect: 'follow'
};
//request for items in cart
fetch(`${baseUrl}/carts/${cartID}/items`, getCartOptions)
  .then(response => response.json())
  .then(result => {
    console.log(result)
    //loop through cart data and render products to page
    result.data.forEach(product=>{
        //access data and create variables
        let {id, image,name,sku,description,value,quantity} = product
        let price = value.amount/100
        let imageSrc = image.href
        //render product components to cart page
        addCartItemsToPage(name,description,imageSrc,price,sku,id,quantity)
    })

})
  .catch(error => console.log('error', error));
//remove item from cart
  function removeFromCart(productId){
    //only if user ensures they want to delete
    if(confirm("Are you sure you want to remove from cart?")){
let deleteOptions = {
    method: 'DELETE',
    headers: cartHeaders,
    redirect: 'follow'
  };
  //Delete and reset page
  fetch(`${baseUrl}/carts/${cartID}/items/${productId}`, deleteOptions)
    .then(response => response.text())
    .then(result => {
        console.log(result)
        location.reload()
    })
    .catch(error => console.log('error', error));

  }
}

async function checkoutCart(){

let customerData = JSON.stringify({
    "data": {
      "customer": {
        "email": "andy@example.com",
        "name": "Andy Dwyer"
      },
      "billing_address": {
        "first_name": "Andy",
        "last_name": "Dwyer",
        "company_name": "Ron Swanson Enterprises",
        "line_1": "1 Sunny Street",
        "line_2": "",
        "county": "Orange",
        "region": "CA",
        "postcode": "92802",
        "country": "US"
      },
      "shipping_address": {
        "first_name": "Andy",
        "last_name": "Dwyer",
        "company_name": "Ron Swanson Enterprises",
        "line_1": "1 Sunny Street",
        "line_2": "",
        "county": "Orange",
        "region": "CA",
        "postcode": "92802",
        "country": "US"
      }
    }
  });
  
  let requestOptions = {
    method: 'POST',
    headers: cartHeaders,
    body: customerData,
    redirect: 'follow'
  };
  
  await fetch(`${baseUrl}/carts/${cartID}/checkout`, requestOptions)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        alert("Thank you. Your products are being shipped!")
    })
    .catch(error => console.log('error', error));
}

async function emptyCart(){

    //Start checkout
    checkoutCart()

        //Empty Cart
        let requestOptions = {
            method: 'DELETE',
            headers: cartHeaders,
            redirect: 'follow'
          };
          
          await fetch(`${baseUrl}/carts/${cartID}/items`, requestOptions)
            .then(response => response.text())
            .then(_ => {
                location.replace("./index.html")
            })
            .catch(error => console.log('error', error));
}