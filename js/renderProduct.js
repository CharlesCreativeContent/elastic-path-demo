

    //Render all Product Components for home page
    function addAllProductsToPage(name,description,src,price,sku,id){
        let productComponent = `
        <div class="col-lg-3 col-sm-6">
           <div class="product_box">
              <h4 class="bursh_text">${name}</h4>
              <p class="lorem_text">${description}</p>
              <a href="./${sku}.html">
                <img src="${src}" class="image_1">
              </a>
              <div class="btn_main">
                 <div class="buy_bt">
                    <ul>
                       <li class="active"><a href="./${sku}.html">View</a></li>
                       <li><a onClick="addNewProductToCart('${id}')" >Buy Now</a></li>
                    </ul>
                 </div>
                 <h3 class="price_text">Price $${price}</h3>
              </div>
           </div>
        </div>`
        document.querySelector("#productSection").innerHTML += productComponent
    
    }

    //Render Product Components with product data
    function addOneProductToPage(name,description,src,price,id){
        let productComponent = `
        <div class="col-lg-3 col-sm-6">
           <div class="product_box">
              <h4 class="bursh_text">${name}</h4>
              <p class="lorem_text">${description}</p>
                <img src="${src}" class="image_1">
              <div class="btn_main">
                 <div class="buy_bt">
                    <ul>
                       <li><a onClick="addNewProductToCart('${id}')">Buy Now</a></li>
                    </ul>
                 </div>
                 <h3 class="price_text">Price $${price}</h3>
              </div>
           </div>
        </div>`
        document.querySelector("#productSection2").innerHTML += productComponent
    
    }

    //Render Product Components for Cart page
    function addCartItemsToPage(name,description,src,price,sku,id,quantity){
        let productComponent = `
        <div class="col-lg-3 col-sm-6">
           <div class="product_box">
              <h4 class="bursh_text">${name}</h4>
              <p class="lorem_text">${description}</p>
              <a href="./${sku}.html">
                <img src="${src}" class="image_1">
              </a>
              <div class="btn_main">
                 <div class="buy_bt">
                    <ul>
                       <li class="active"><a>x ${quantity}</a></li>
                       <li><a onClick="removeFromCart('${id}')">Remove</a></li>
                    </ul>
                 </div>
                 <h3 class="price_text">Price $${price}</h3>
              </div>
           </div>
        </div>`
        document.querySelector("#productSection").innerHTML += productComponent
    
    }

    function addedToCartAlert(){
        alert("Added product to Cart!")
    }

    function RemovedFromCartAlert(){
        alert("Removed product to Cart!")
    }

