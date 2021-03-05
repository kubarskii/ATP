# ATP (Auto tracker protocol)

## 1. Scope

TBD

## 2. Terminology and Conventions

TBD

## 3. Definitions

| Definitions        |                                                              | 
| ------------------ |-------------------------------------------------------------:|
| Central System     | The server that gathers and processes beacon data            |
| Beacon             | Hardware device that gathers GPS data and send it to CS      |
| Response/request   | Data transferred from Central System to Beacon or vice versa |

## 4. Abbreviations

| Abbreviations      |                      | 
| ------------------ |---------------------:|
| CS     | Central System                   |
| Bcn    | Beacon                           |
| HTTP(s)| Hyper Text Transfer Protocol     |
| WS     | WebSocket                        |
| ATP    | Auto tracker protocol            |

## 5. TimeZone

Both beacon(s) and CS(s) must use GMT timeZone in order to prevent errors in speed calculations. Also, time should be
updated after ***Start Notification***. By default, the time should be sent using UNIX timestamp.

## 6. Response / Request structure

### 6.1. Basic structure

There are three types of requests:

1. CALL - Normally Emitted by a client(Bcn). CS can act as a client as well, if it sends requests to the Bcn.
2. CALLRESULT - Normally Emitted by Server(CS).
3. ERROR - Normally emitted by Server on operation processing errors.

CALL request Scheme: `[<MessageTypeId>, "<UniqueId>", "<Action>", {<Payload>}]`

CALLRESULT request Scheme: `[<MessageTypeId>, "<UniqueId>", {<Payload>}]`

ERROR request Scheme: `[<MessageTypeId>, "<UniqueId>", "<errorCode>", "<errorDescription>", {<errorDetails>}]
`

Response/Request consists of the following parts:

1. `MessageTypeId` - shows the type of the request, whether it's made by **CS** nor by **Bcn**, or it contains error.
2. `UniqueId` - indicator of the message. It is a randomly generated UUID.
   ***id*** is used to track the **Bcn** request and **CS** response and match them. If id of response and request do
   not match, response must be ignored.
3. `Payload` - data of the request
4. `Action` - must be sent by *Beacon*. Contains the name of the operation made by *Bcn*.
5. `errorCode` - ***Action***-like string contains short *name* of the error
6. `errorDescription` - description of the error.
7. `errorDetail` - ***Payload***-like object, containing error-related data.

### 6.2. Possible MessageTypeIds

- 2 - request by client
- 3 - request by server
- 4 - Error

if CS receives message type id that differs from the listed above, such a message should be ignored.

## 7. URL structure

The path, WS client (Bcn) connects to the CS must contain the name of the beacon. Name of the beacon is preregistered on
CS and stored in a database. If the name is not presented the connection would be refused.

The structure: ` <host>/<path>/<bcnName>`

## 8. Requests initiated by beacon

### 8.1. Start Notification

When the tracking beacon is switched on it has to send *Start Notification* request to the *Central System (CS)* (
Server).
***Start Notification*** must be sent each time beacon switches on / reboots. It should be made to check and update the
time to calculate speed more accurately.

***Beacon*** Request example:

```javascript
[2, id, "StartNotification",
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
[3, id, {status: 'Accepted', currentTime: '', interval: ''}]
```

#### Possible Statuses

- Accepted
- Pending
- Rejected

After successful start of the beacon, CS send back `currentTime` and `heartbeatInterval` that must be applied to the
beacon config.

If error occurs:
***Central System*** Response example:

```javascript
[4, id, '', '', {status: 'Error', code: '', message: ''}]
```

### 8.2. Heartbeat

Heartbeat is request that is made at the *interval*. The *interval* is set in the configuration of the Central System
and received after ***StartNotification***.

Heartbeat is intended to provide data about position (coordinates), current speed, time, of the beacon. Current speed
should be calculated on the beacon. If the beacon is not able to calculate current speed, then it has to provide
additional *payload* param: `{ noSpeed: true }`, by default it is `false`.

Bcn example:

```javascript
[2, id, 'Heartbeat', {
    speed: '',
    position: ['', ''], // latitude and longitude
    noSpeed: false,     // default,
    currentTime: '',           // GMT time ISOString
    previousTime: '',
    systemOfMeasures: '',
}]
```

CS should reply to the request sending `currentTime` in response payload.

CS example:

```javascript
[3, id, {currentTime: '', status: 'Accepted'}]
```

Another function of the heartbeat is to check whether the connection is still alive or not.

## 9. Operations initiated by Central System

### 9.1. Vehicle Status

TBD;

This operation is intended to ask Bcn to send ***vehicle status***. The data that could be provided by a beacon: current
speed, mileage, ignition off/on, fuel left, etc.

### 9.2. Reset

TBD;

## 10. Sequence of the beacon initialization

TBD; // Add sequence diagram

## 11. Errors

- ### NotSupported

The error type *NotImplemented* means that operation type sent by a beacon is not recognized and possibly is not
presented by ATP.

- ### NotImplemented

The error type *NotImplemented* means that operation type sent by a beacon exists and known by CS, but not implemented
by current CS.

- ### Unknown

The error occurred, but the server cannot identify the root cause of the error.