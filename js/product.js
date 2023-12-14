         //environment variables
         let productSKU = getItemNumber()
         let cartID = sessionStorage.getItem("elasticCartID")
         let authToken = localStorage.getItem("elasticAuthToken")
         let baseURL = "https://useast.api.elasticpath.com/v2"
         
         //grab sku data from filename in url
         function getItemNumber(){
            let url=location.href;
            let urlFilename = url.substring(url.lastIndexOf('/')+1)
            let urlFilenumber = urlFilename.slice(0,urlFilename.lastIndexOf('.'))
            return urlFilenumber
            }
            //get product info from local storage
            let productData = JSON.parse(localStorage.getItem(productSKU))
            let {name,description,main_image,price, id} = productData
            //render product info on page
            addOneProductToPage(name,description,main_image,price,id)
            console.log(productData)
            

async function addNewProductToCart (productID){
    
    let raw = JSON.stringify({
        "data": {
          "id": productID,
          "type": "cart_item",
          "quantity": 1
        }
      });

      let productHeaders = new Headers();
      productHeaders.append("accept", "application/json");
      productHeaders.append("content-type", "application/json");
      productHeaders.append("Authorization", authToken);
      
      let requestOptions = {
        method: 'POST',
        headers: productHeaders,
        body: raw,
        redirect: 'follow'
      };
      
     await fetch(`${baseURL}/carts/${cartID}/items`, requestOptions)
        .then(response => response.json())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));

    //send product added alert to client
    addedToCartAlert()
}
