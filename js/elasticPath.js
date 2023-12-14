//Environment Variables
let products = {}
let images = {}
let baseURL = "https://useast.api.elasticpath.com/v2"
let productURL = "https://useast.api.elasticpath.com/pcm"
let pricebookID = "8f7edee6-c776-49ef-8bd8-fc5365631824"
//Create request headers
let productHeaders = new Headers();
productHeaders.append("accept", "application/json");
productHeaders.append("content-type", "application/json");


async function updateAuthenticationHeaders(){
    //Setting up authentication headers and requests

    let urlencoded = new URLSearchParams();
    urlencoded.append("client_id", "I3ci78KQJuTlMSSftsaPMcywGVu0nPR7Ovl7kN2mv8");
    urlencoded.append("client_secret", "7cqwfKhL65w3LDJSHNOmYcRoiz5SfsCk7pbZun3sAC");
    urlencoded.append("grant_type", "client_credentials");
    
    let authRequestOptions = {
      method: 'POST',
      headers: productHeaders,
      body: urlencoded,
      redirect: 'follow'
    };
  
    console.clear()
    //Authenticate and get Bearer token
    await fetch("https://useast.api.elasticpath.com/oauth/access_token", authRequestOptions)
      .then(response => response.json())
      .then(result => {
        let authToken = "Bearer "+result.access_token
        //save Token to local storage
        localStorage.setItem("elasticAuthToken", authToken)
        //Add Token to request headers
        productHeaders.append("Authorization", authToken);
    })
      .catch(error => console.log('ERROR: ', error));

}

async function updateProductData(){
    //Setup product options to get all products
    var productOptions = {
        method: 'GET',
        headers: productHeaders,
        redirect: 'follow'
        };
    
        await updateAuthenticationHeaders().then(async _=>{
        
          // Get all product information
            await fetch(productURL+"/products?include=main_image", productOptions)
            .then(response => response.json())
            .then(productData => {
                //loop through productData and make id to Data key value pairs
                productData.data.forEach(productInfo=>{
                    //upload data to images object
                    let id = productInfo.relationships.main_image.data.id
                    let {description,name, slug,sku} = productInfo.attributes
                    images[id] = {description,name,slug,sku,
                    id: productInfo.id}
                })
                //loop through images and make id to url key value pairs
                productData.included.main_images.forEach(image => {
                    //upload data to images object
                    images[image.id].main_image = image.link.href
                    
                });
                
                //loop through price data to join sku with USD amount
                Object.values(images).forEach(productData=>{
                    products[productData.sku] = {...productData}
                })
            })
            .catch(error => console.log('error', error));
        
    })

}

async function updateProductPrices(){
    var productOptions = {
        method: 'GET',
        headers: productHeaders,
        redirect: 'follow'
        };
    await updateProductData().then(async _=>{
    //grab price data from pricebook
    await fetch(`${productURL}/pricebooks/${pricebookID}/prices`,productOptions)
    .then(result=>result.json())
    .then(data=>{
        //loop through price data to join sku with USD amount
        data.data.forEach(priceData=>{
            products[priceData.attributes.sku].price = priceData.attributes.currencies.USD.amount/100
        })

        //save product data to local storage
        Object.values(products).forEach(product=>localStorage.setItem(product.sku, JSON.stringify(product)));
    })
})
}

//Run product fetches then render data to page
updateProductPrices().then(_=>{
        console.log("products",products)
//Loop through product objects
    Object.values(products).forEach(productData=>{

        let{name,description,main_image,sku,price,id} = productData
        //Render Data to homepage
        addAllProductsToPage(name,description,main_image,price,sku,id)

    })

}).then(async _=> {
    //create cart if no cart ID is in local 
    if(! sessionStorage.getItem("elasticCartID")){
    await createNewCart()
    }
})
//Create a New Cart on homepage
async function createNewCart(){
    //set-up request for new cart
    var raw = JSON.stringify({
        "data": {
          "name": "Elastic Cart",
          "description": "My first Cart",
          "discount_settings": {
            "custom_discounts_enabled": false
          }
        }
      });
      
      var requestOptions = {
        method: 'POST',
        headers: productHeaders,
        body: raw,
        redirect: 'follow'
      };

      await fetch(baseURL+"/carts", requestOptions)
        .then(response => response.json())
        .then(result => {
            //Save Cart id to local storage
            sessionStorage.setItem("elasticCartID",result.data.id)
        })
        .catch(error => console.log('error', error));
}

async function addNewProductToCart (productID){
    
    var raw = JSON.stringify({
        "data": {
          "id": productID,
          "type": "cart_item",
          "quantity": 1
        }
      });
      
      var requestOptions = {
        method: 'POST',
        headers: productHeaders,
        body: raw,
        redirect: 'follow'
      };

      let cartID = sessionStorage.getItem("elasticCartID")
      
     await fetch(`${baseURL}/carts/${cartID}/items`, requestOptions)
        .then(response => response.json())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));

    //send product added alert to client
    addedToCartAlert()
}

