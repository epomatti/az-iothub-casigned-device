// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

'use strict';

require('dotenv').config()

var iotHubTransport = require('azure-iot-device-mqtt').Mqtt;
var Client = require('azure-iot-device').Client;
var Message = require('azure-iot-device').Message;
var fs = require('fs');

var iothubHost = process.env.IOTHUB_HOST;
var registrationId = process.env.PROVISIONING_REGISTRATION_ID;
var deviceCert = {
  cert: fs.readFileSync(process.env.CERTIFICATE_FILE).toString(),
  key: fs.readFileSync(process.env.KEY_FILE).toString()
};

var connectionString = `HostName=${iothubHost};DeviceId=${registrationId};x509=true`;
var hubClient = Client.fromConnectionString(connectionString, iotHubTransport);
hubClient.setOptions(deviceCert);
hubClient.open(function (err) {
  if (err) {
    console.error('Failure opening iothub connection: ' + err.message);
  } else {
    console.log('Client connected');
    var message = new Message('Hello world');
    hubClient.sendEvent(message, function (err, res) {
      if (err) console.log('send error: ' + err.toString());
      if (res) console.log('send status: ' + res.constructor.name);
      process.exit(1);
    });
  }
});