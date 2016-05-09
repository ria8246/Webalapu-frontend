function serverCall(args) {
    //TODO url csere
    var url = "http://localhost:8080/Backend/rest/";
    args.headers = args.headers || {};
    args.headers['Content-Type'] = 'application/xml';
    console.log(args.headers)
    $.ajax({
        method: args.method || 'GET',
        headers: args.headers,
        url: url + getPathParams(args),
        data: args.data
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

function xmlToJson(xml) {
    var obj = {};

    if (xml.nodeType === 1) {
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType === 3) {
        obj = xml.nodeValue;
    }
    if (xml.hasChildNodes()) {
        for (var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if (typeof (obj[nodeName]) === "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (typeof (obj[nodeName].push) === "undefined") {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    }
    function fixIt(obj) {
        if (obj['#text'] && Object.keys(obj).length === 1) {
            return obj['#text'];
        } else if (Object.keys(obj).length > 1) {
            for (var key in obj) {
                obj[key] = fixIt(obj[key]);
            }
        }
        return obj;
    }
    fixIt(obj);
    return obj;
}

