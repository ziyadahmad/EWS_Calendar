var lather = require('lather');
var xml2js = require('xml2js');
var util = require('util');
var prefixMatch = new RegExp(/(?!xmlns)^.*:/);

var getFolder = {
    'm:GetFolder': {
        'm:FolderShape': {
            't:BaseShape': 'IdOnly'
        },
        'm:FolderIds': {
            't:DistinguishedFolderId': {
                attributes: [
                    { Id: 'calendar' }
                ]
            }
        }
    }
};

//strips prefix from xml string for parsing
function stripName(name) {
    return name.replace(prefixMatch, '');
}


module.exports.getFolderID = function(option, cb) {
    lather.up({
        body: getFolder,
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
            var folderInfo = result.Envelope.Body[0].GetFolderResponse[0].ResponseMessages[0].GetFolderResponseMessage[0]
                .Folders[0].CalendarFolder[0].FolderId[0].$;
            cb(folderInfo);
        });
    });
}