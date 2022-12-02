function addToCart(proId) {
    let product = document.getElementById('product-name').innerHTML
    let size = document.getElementById('p-size')
    var proSize = size.options[size.selectedIndex].text;
        $.ajax({
            url: '/add-to-cart/' + proId,
            method: 'get',
            data: {
                size: proSize
            },
            success: (response) => {
                if (response.status) {
                    let count = $('#cart-count').html()
                    count = parseInt(count) + 1
                    $('#cart-count').html(count) 
                    $('.js-addcart-detail').each(function () {
                        swal(product, "is added to cart !", "success");
                    });
                }
                
            }
        })
}

function addToWishList(proId) {
 let product = document.getElementById('product-name').innerHTML
    $.ajax({
        url: '/add-to-wishlist/' + proId,
        method: 'get',
        success: (response) => {
            if (response.status) {
                $('.js-wish-detail').each(function () {
                    swal(product, "is added to wishlist !", "success");
                });
            } else {
                $('.js-wish-detail').each(function () {
                    swal(product, "is removed form wishlist !", "success");
                });
            }
            
        }
    })
}

function removeFromWishlist(prodId) {
    let product = document.getElementById('product-name').innerText
    $.ajax({
        url: '/remove-form-wishlist/'+ prodId,
        method: 'get',
        success: (response) => {
            $('.js-wish-detail').each(function () {
                swal(product, "is removed form wishlist !", "success");
            });
            location.reload()
        }
        
    })
}