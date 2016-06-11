var fInfo=require('./folderkey.js');
var calendarItem = require('./appointments.js');
var attendee = require('./attendees.js');

var appointment ={
    calendarInfo:[]
}

// Additional Namespace for SOAP EWS
var additional = ['xmlns:m="http://schemas.microsoft.com/exchange/services/2006/messages"',
    'xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types"']

var credentials={
    UserID:'',
    Password:''
};

var CalendarViewAttr={
    MaxEntriesReturned:10,
    StartDate:'2016-06-01T00:30:24.127Z',
    EndDate:'2016-06-10T17:30:24.127Z'
}

var Options = {
    URL:'https://<mail>/EWS/Exchange.asmx',
    AdditionalNamespaces:additional,
    Credentials:credentials,
    FolderKey:[],
    CalendarItemKey:[],
    CalendarViewAttr:CalendarViewAttr    
};

var result =[];

fInfo.getFolderID(Options,function(folderKey) {
    Options.FolderKey = folderKey;
    calendarItem.getAppointment(Options,function(calendarInfo) {
        appointment.calendarInfo = calendarInfo;
        attendeeCol();
    });
    
});

var attendeeCol = function(){
 for(var attributename in appointment.calendarInfo){
 
    for(var itemId in appointment.calendarInfo[attributename].ItemId){
        Options.CalendarItemKey = appointment.calendarInfo[attributename].ItemId[itemId].$;
        attendee.getAttendees(Options,function(attendee){
        result.push(attendee); 
        });
        }
    }
}
