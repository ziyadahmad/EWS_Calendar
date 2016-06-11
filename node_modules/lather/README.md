# Lather

A terrible library to convert a JS object to XML and wrap it in a SOAP envelope

## Usage

Standalone conversion of a javascript object to XML:

```js
  lather.body(object);
```

To send a SOAP Request:

```js
  lather.up({
    body : jsObject,
    headers : { Authorization : lather.basicAuth(username, password) },
    additionalNamespaces : additionalNamespaces,
    method : method,
    url : url,
  }, function(error, response, body) {
    ...
  });
```

## Examples

This was built to work with Exchange Web Services so here are some examples

### EWS Calendar GetUserAvailability

```js
var lather = require('lather');

var getUserAvailabilityRequest = {
  GetUserAvailabilityRequest : {
    attributes : [
      { xmlns : 'http://schemas.microsoft.com/exchange/services/2006/messages' },
      { 'xmlns:t' : 'http://schemas.microsoft.com/exchange/services/2006/types' },
    ],
    't:TimeZone' : {
      attributes : [
        { xmlns : 'http://schemas.microsoft.com/exchange/services/2006/types' },
      ],
      Bias : '480',
      StandardTime : {
        Bias : '0',
        Time : '02:00:00',
        DayOrder : '5',
        Month : '10',
        DayOfWeek : 'Sunday',
      },
      DaylightTime : {
        Bias : '-60',
        Time : '02:00:00',
        DayOrder : '1',
        Month : '4',
        DayOfWeek : 'Sunday',
      },
    },
    MailboxDataArray : [
      {
        't:MailboxData' : {
          't:Email' : {
            't:Address' : 'email@domain.com',
          },
          't:AttendeeType' : 'Required',
          't:ExcludeConflicts' : 'false',
        },
      },
    ],
    't:FreeBusyViewOptions' : {
      't:TimeWindow' : {
        't:StartTime' : '2015-03-16T00:00:00',
        't:EndTime' : '2015-05-16T23:59:59',
      },
      't:MergedFreeBusyIntervalInMinutes' : '60',
      't:RequestedView' : 'DetailedMerged',
    },
  },
};

lather.up({
  body : getUserAvailabilityRequest,
  headers : {
    Authorization : lather.basicAuth(exchangeUsername, exchangePassword),
  },
  method : 'POST',
  url : 'https://outlook.office365.com/EWS/Exchange.asmx',
}, function(error, res, body) {
  ...
});
```

### EWS Calendar Add Event (m:createItem)

```js
var lather = require('lather');

var createCalendarEvent = {
  'm:CreateItem' : {
    attributes : [
      { SendMeetingInvitations : 'SendToAllAndSaveCopy' },
    ],
    'm:Items' : [
      {
        't:CalendarItem' : {
          't:Subject' : 'Meeting in ThinkTank',
          't:Body' : {
            attributes : [
              { BodyType : 'Text' },
            ],
            value : 'Discuss ways to move away from SOAP',
          },
          't:Start' : '2015-06-02T00:00:00Z',
          't:End' : '2015-06-03T00:00:00Z',
          't:Location' : 'Conf Room',
          't:RequiredAttendees' : [
            {
              't:Attendee' : {
                't:Mailbox' : {
                  't:EmailAddress' : 'email@domain.com',
                },
              },
            },
          ],
        },
      },
    ],
  },
};

lather.up({
  body : createCalendarEvent,
  headers : {
    Authorization : lather.basicAuth(exchangeUserName, exchangePassword),
  },
  additionalNamespaces : [
    'xmlns:m="http://schemas.microsoft.com/exchange/services/2006/messages"',
    'xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types"',
  ],
  method : 'POST',
  url : 'https://outlook.office365.com/EWS/Exchange.asmx',
}, function(error, res, body) {
  ...
});

```

### EWS Calendar Remove Event (m:DeleteItem)

```js
var lather = require('lather');

var removeCalendarEvent = {
  'm:DeleteItem' : {
    attributes : [
      { DeleteType : 'MoveToDeletedItems' },
      { SendMeetingCancellations : 'SendToAllAndSaveCopy' },
    ],
    'm:ItemIds' : [
      {
        't:ItemId' : {
          attributes : [
            { Id : ItemId.Id },
            { ChangeKey : ItemId.ChangeKey },
          ],
        },
      },
    ],
  },
};

lather.up({
  body : removeCalendarEvent,
  headers : {
    Authorization : lather.basicAuth(exchangeUsername, exchangePassword),
  },
  additionalNamespaces : [
    'xmlns:m="http://schemas.microsoft.com/exchange/services/2006/messages"',
    'xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types"',
  ],
  method : 'POST',
  url : 'https://outlook.office365.com/EWS/Exchange.asmx',
}, function(error, res, body) {
  ...
});

```
