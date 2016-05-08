(function () {
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

        insertItem();
        insertItem();
        insertItem();
        insertItem();
        insertItem();
        insertItem();
    };

    var itemIndex = 1;
    function insertItem() {
        var $cloned = $('#itemTemplate').clone();
        $cloned.attr('id', 'item' + itemIndex);
        $cloned.find('.itemPrice')[0].innerHTML = itemIndex * 1000 + '$';
        itemIndex++;
        $('#items').append($cloned);
    }
})();
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
function serverCall(args) {
    //TODO url csere
    var url = "http://localhost:8080/Webalapu-backend2/rest/";
    $.ajax({
        method: args.method || 'GET',
        url: url + getPathParams(args)
    }).done(function (res) {
        args.success(res);
    }).fail(function (res) {
        args.error(res);
    });
}
function getPathParams(args) {
    var res = "";
    for (var key in args.pathParams) {
        res += '/' + args.pathParams[key];
    }
    return args.service + res;
}
function getAllProducts() {
    serverCall({
        method: 'GET',
        service: 'product',
        success: function (res) {
            console.log('yay', res);
        },
        error: function (res) {
            console.log('nope', res);
        }
    });
}