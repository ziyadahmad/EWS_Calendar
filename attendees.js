var lather = require('lather');
var xml2js = require('xml2js');
var util = require('util');
var prefixMatch = new RegExp(/(?!xmlns)^.*:/);



//strips prefix from xml string for parsing
function stripName(name) {
    return name.replace(prefixMatch, '');
}


module.exports.getAttendees = function(option, cb) {
    
    var getAttendee = {
    'm:GetItem': {
        'm:ItemShape': {
            't:BaseShape': 'AllProperties'
        },
        'm:ItemIds': {
            't:ItemId': {
                attributes: [
                    { Id: option.CalendarItemKey.Id }
                ]
            }
        }
    }
};
    
    lather.up({
        body: getAttendee,
        headers: {
            Authorization: lather.basicAuth(option.Credentials.UserID, option.Credentials.Password),
        },
        additionalNamespaces: option.AdditionalNamespaces,
        method: 'POST',
        url: option.URL,
    }, function(error, res, body) {

        var parser = new xml2js.Parser({
            tagNameProcessors: [stripName],
        });

        parser.parseString(body, function(err, result) {
            var folderInfo = result.Envelope.Body[0].GetItemResponse[0].ResponseMessages[0].GetItemResponseMessage[0]
                .Items[0].CalendarItem;
            cb(folderInfo);
        });
    });
}