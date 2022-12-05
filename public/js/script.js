function addToCart(proId) {
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
                    Swal.fire(
                        'Added!',
                        'Product added to cart',
                        'success'
                    )
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
                Swal.fire(
                    'Added!',
                    'Product added to wishlist',
                    'success'
                )
            } 
            
        },
        error: (error) => {
            if (error) {
                Swal.fire(
                    'Removed!',
                    'Product Removed from whishlist',
                    'success'
                )
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
            Swal.fire(
                'Removed!',
                'Product remove from wishlist',
                'success'
            ).then(() => {
                location.reload()
            })
            
        }
        
    })
}