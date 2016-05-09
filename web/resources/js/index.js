var main = (function () {
    var backendBaseUrl = 'http://localhost:8080/Backend/';
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
    function insertItem(name, price, description, stock, image, databaseId) {
        name = name || "Placeholder name";
        price = price || 0;
        description = description || "Placeholder description";
        stock = stock || 10000;

        var $cloned = $('#itemTemplate').clone();
        $cloned.attr('id', 'item' + itemIndex);
        $cloned.find('.itemName').html(name);
        $cloned.find('.itemDescription').html(description);
        $cloned.find('.itemPrice').html(price + ' HUF');
        $cloned.find('.itemPreview>img').attr('src', backendBaseUrl + image);
        $cloned.attr('data-id', databaseId);
        $cloned.attr('data-name', name);
        $cloned.attr('data-price', price);

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
        var id = $item.attr('data-id');
        // cart[id] = cart[id] ? cart[id] + 1 : 1;
        if (cart[id]) {
            cart[id].count++
        } else {
            cart[id] = {
                name: $item.attr('data-name'),
                price: $item.attr('data-price'),
                count: 1
            }
        }
        refreshCart();
    }
    function refreshCart() {
        var $basket = $('#currentBasketContents');
        $basket.empty();
        var totalCost = 0;
        $.each(cart, function (key, item) {
            totalCost += item.count * item.price;
            $basket.append('<div>' + item.name + ': ' + item.count + '</div>');
        });
        $('#totalCost').remove();
        $basket.parent().append('<div id="totalCost">Σ:' + totalCost + ' HUF</div>');

    }
    function sendItemOrder(id, quantity) {

        serverCall({
            method: 'POST',
            service: 'order',
            data: {
                customer: {
                    //todo email dinamikus + auth token headerbe
                    email: 'admin@webshop.com'
                },
                products: {
                    entry: {
                        key: {
                            id: id
                        },
                        value: quantity
                    }
                }
            },
            success: function (res) {
                console.log('order sent for item: ', id, res);

            },
            error: function (res) {
                console.error('order failed for item: ', id, res);
            }
        });
    }
    function sendOrder() {
        $.each(cart, function (key, item) {
            sendItemOrder(key, item.count);
        });
        $('#currentBasketContents').empty();
        $('#totalCost').remove();
        cart = {};
    }
    function getAllProducts() {
        serverCall({
            method: 'GET',
            service: 'product',
            success: function (res) {
                var resObj = xmlToJson(res);
                console.log(resObj);
                $(resObj.products.product).each(function (index, product) {
                    insertItem(product.name, product.price, product.description, product.stock, product.image, product.id);
                });
            },
            error: function (res) {
                console.log('nope', res);
            }
        });
    }

    return {
        toCart: toCart,
        fillFocus: fillFocus,
        sendOrder: sendOrder
    };
})();
