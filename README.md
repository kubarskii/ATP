#ATP (Auto tracker protocol)

## Scope

TBD

## Terminology and Conventions

TBD

## Definitions

| Definitions        |                                                              | 
| ------------------ |-------------------------------------------------------------:|
| Central System     | The server that gathers and processes beacon data            |
| Beacon             | Hardware device that gathers GPS data and send it to CS      |
| Response/request   | Data transferred from Central System to Beacon or vice versa  |

## Abbreviations

| Abbreviations      |                      | 
| ------------------ |---------------------:|
| CS     | Central System                   |
| Bcn    | Beacon                           |
| HTTP(s)| Hyper Text Transfer Protocol     |
| WS     | WebSocket                        |
| ATP    | Auto tracker protocol            |


## TimeZone
Both beacon(s) and CS(s) must use UTC timeZone in order to prevent errors in speed calculations.
Also, time should be updated after ***Start Notification***.
By default, the time should be sent using UNIX timestamp.

## Response / Request structure

There are three types of requests:
1. CALL - Normally Emitted by client(Bcn).
2. CALLRESULT - Normally Emitted by Server(CS).
3. ERROR - Normally emmited by Server on operation processing errors.

CALL request Scheme: `[<MessageTypeId>, "<UniqueId>", "<Action>", {<Payload>}]`

CALLRESULT request Scheme: `[<MessageTypeId>, "<UniqueId>", {<Payload>}]`

ERROR request Scheme: `[<MessageTypeId>, "<UniqueId>", "<errorCode>", "<errorDescription>", {<errorDetails>}]
`

Response/Request consists of three main parts: 
1. `MessageTypeId` - it shows the type of the request, whether it's made by **CS** nor by **Bcn**, or it contains error.
2. `UniqueId` - indicator of the message. It is a randomly generated UUID. 
***id*** is used to track the **Bcn** request and **CS** response and match them.
   If id of response and request do not match, response must be ignored.
3. `Payload` - data of the request
4. `Action` - must be sent by Beacon. Contains the name of the operation made by *Bcn*.
5. `errorCode` - ***Action***-like string contains short *name* of the error
6. `errorDescription` - description of the error.
7. `errorDetail` - ***Payload***-like object, containing error-related data.

### Possible MessageTypeIds
1. (2) - request by beacon
2. (3) - request by Central System
3. (4) - Error

## Requests initiated by beacon

### Authorize

Authorize request should be made in order CS to allow beacon make requests,
except for `Start Notification`.

***Beacon*** Request example:
```javascript
[2 , id, "Authorize", { beaconId: "" /*preregisterd UUID*/}]
```

***CS*** Response example:
```javascript
[3 , id, { status: 'Accepted' }]
```
#### Response statuses
- Accepted - everything's ok
- Pending - beacon must stop sending any requests to the CS till ***Accepted*** status received
- Refused - beaconId wasn't found, beacon should reAuthorize


### Start Notification

When the tracking beacon is switched on it has to send *Start Notification* request to the *Central System (CS)* (Server).
***Start Notification*** must be sent each time beacon switches on / reboots.

***Beacon*** Request example:
```javascript
[2 , id, "Start Notification", 
    {
        beaconSerialNumber: "",
        imsi: "",
        iccid: "",
        firmwareVersion: "",
        vehicleVIN: "",          // optional
        vehicleLicensePlate: "", // optional
        vehicleBrand: "",        // optional 
        vehicleModel: "",        // optional
    }
]
```

***Central System*** Response example
```javascript
[3, id, { status: 'Accepted', currentTime: '', heartbeatInterval: '' }]
```

####Possible Statuses
- Accepted
- Pending
- Rejected

After successful start of the beacon, CS send back `currentTime` and `heartbeatInterval` that must be applied to the beacon config.

If error occurs:
***Central System*** Response example:
```javascript
[4, id, '', '', { status: 'Error', code: '', message: '' }]
```

### Heartbeat

Heartbeat is request that is made at the *interval*. The *interval* is set in the configuration of the Central System 
and received after ***Start Notification***. 

Heartbeat is intended to provide data about position (coordinates), current speed, time, of the beacon.
Current speed should be calculated on the beacon. If the beacon is not able to calculate current speed, then it has to
provide additional *payload* param: `{ noSpeed: true }`, by default it is `false`.

Bcn example: 
```javascript
[2, id, 'Heartbeat',{
    speed: '',
    position: ['', ''], // latitude and longitude
    noSpeed: false,     // default,
    time: '',           // UTC time UNIX timestamp
}]
```

CS should reply to the request sending `currentTime` in response payload.

CS example:
```javascript
[3, id, { currentTime: '' }]
```

Another function of the heartbeat is to check whether the connection is still alive or not.

## Operations initiated by Central System 

### Vehicle Status

TBD;

This operation is intended to ask Bcn to send ***vehicle status***.
The data that could be provided by a beacon: current speed, mileage, ignition off/on,
fuel left and etc.

##Sequence of the beacon initialization
