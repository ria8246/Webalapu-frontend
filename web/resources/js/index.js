var main = (function () {
    window.onload = function () {
        var headLine = document.getElementById('headLine');
        var $fixedContainer = $('#fixedContainer');
        var $window = $(window);
        function changeFixedContainerTop() {
            var headLineBottom = headLine.getBoundingClientRect().bottom;
            $fixedContainer.css('top', Math.max(headLineBottom, 0));
        }
        changeFixedContainerTop();
        $window.scroll(changeFixedContainerTop);
        getAllProducts();
    };

    var itemIndex = 1;
    function insertItem(name, price, description) {
        name = name || "Placeholder name";
        price = price || "free";
        description = description || "Placeholder description";
        
        var $cloned = $('#itemTemplate').clone();
        $cloned.attr('id', 'item' + itemIndex);
        $cloned.find('.itemName').html(name);
        $cloned.find('.itemDescription').html(description);
        $cloned.find('.itemPrice').html(price);
        
        itemIndex++;
        
        $('#items').append($cloned);
    }
    function fillFocus(item) {
        document.getElementById('focusItem').innerHTML = item.outerHTML;
    }
    var cart = {};
    function toCart(item, event) {
        event.preventDefault();
        event.stopPropagation();
        var $item = $(item);
        var $body = $('body');
        while (!$item.hasClass('item') && $item !== $body) {
            $item = $item.parent();
        }
        var id = $item.attr('id');
        cart[id] = cart[id] ? cart[id] + 1 : 1;
        refreshCart();
    }
    function refreshCart() {
        var $basket = $('#currentBasketContents');
        $basket.empty();
        $.each(cart, function (item, count) {
            $basket.append('<div>' + item + ': ' + count + '</div>');
        });
    }
    function sendOrder() {
        console.log(Object.keys(cart).length + ' items');
        cart = {};
        var $basket = $('#currentBasketContents');
        $basket.empty();
        $basket.append('<div>order sent</div>');

    }

    function getAllProducts() {
        serverCall({
            method: 'GET',
            service: 'product',
            success: function (res) {
                var resObj = xmlToJson(res);
                $(resObj.products).each(function(index, product){
                    product = product.product;
                    console.log(product);
                    insertItem(product.name, product.price, product.description);
                });
            },
            error: function (res) {
                console.log('nope', res);
            }
        });
    }
    
    return {
        toCart: toCart,
        fillFocus: fillFocus
    };
})();
