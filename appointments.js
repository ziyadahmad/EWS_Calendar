var lather = require('lather');
var xml2js = require('xml2js');
var util = require('util');
var prefixMatch = new RegExp(/(?!xmlns)^.*:/);


function stripName(name) {
    return name.replace(prefixMatch, '');
}

module.exports.getAppointment = function(option, cb) {

    var getCalendar = {
        'm:FindItem': {
            attributes: [{ Traversal: "Shallow" }],
            'm:ItemShape': {
                't:BaseShape': 'IdOnly'//,
              /*  't:AdditionalProperties': 
            [
              { 't:FieldURI':{attributes:[{FieldURI: "item:Subject"}]}},
              { 't:FieldURI':{attributes:[{FieldURI: "calendar:Start"}]}},
              { 't:FieldURI':{attributes:[{FieldURI: "calendar:End"}]}},
              { 't:FieldURI':{attributes:[{FieldURI: "meeting:ResponseType"}]}},
              { 't:FieldURI':{attributes:[{FieldURI: "calendar:IsCancelled"}]}},
              { 't:FieldURI':{attributes:[{FieldURI: "calendar:IsRecurring"}]}},
              { 't:FieldURI':{attributes:[{FieldURI: "calendar:MyResponseType"}]}},
              { 't:FieldURI':{attributes:[{FieldURI: "calendar:Organizer"}]}},
              { 't:FieldURI':{attributes:[{FieldURI: "calendar:Duration"}]}}
            ]*/
          
            },
            
            'm:CalendarView': {
                attributes: [
                    { 'MaxEntriesReturned': option.CalendarViewAttr.MaxEntriesReturned },
                    { 'StartDate': option.CalendarViewAttr.StartDate },
                    { 'EndDate': option.CalendarViewAttr.EndDate }
                ]
            },
            'm:ParentFolderIds': {
                't:FolderId': {
                    attributes: [
                        { 'Id': option.FolderKey.Id },
                        { 'ChangeKey': option.FolderKey.ChangeKey }
                    ]
                }
            }
        }
    }


    lather.up({
        body: getCalendar,
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
            var calendarInfo = result.Envelope.Body[0].FindItemResponse[0].ResponseMessages[0].FindItemResponseMessage[0]
                .RootFolder[0].Items[0].CalendarItem;
            cb(calendarInfo);
        });
    });
}