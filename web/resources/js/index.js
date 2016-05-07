(function () {
    window.onload = function () {
        var headLine = document.getElementById('headLine');
        var $fixedContainer = $('#fixedContainer');
        function changeFixedContainerTop() {
            var headLineBottom = headLine.getBoundingClientRect().bottom;
            $fixedContainer.css('top', Math.max(headLineBottom, 0));
        }
        changeFixedContainerTop();
        $(window).scroll(changeFixedContainerTop);
    };
    
    var itemIndex = 0;
    function insertItem() {
        var $cloned = $('#itemTemplate').clone();
        $cloned.attr('id', 'item' + itemIndex);
        itemIndex++;
        $('#items').append($cloned);
    }
    //setInterval(insertItem, 1000);
})();
