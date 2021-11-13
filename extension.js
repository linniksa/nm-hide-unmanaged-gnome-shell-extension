
let handlers;
let nmApplet;
let origDeviceAdded;
let NetworkManager;
try {
    NetworkManager = imports.gi.NM;
} catch(e) {
    NetworkManager = imports.gi.NetworkManager;
}
const Network = imports.ui.status.network;
const Panel = imports.ui.panel;
const Main = imports.ui.main;


function enable() {
    //Back up the original _deviceAdded function
    origDeviceAdded = Network.NMApplet.prototype._deviceAdded;
    //Get the instance of the NMApplet class used by the GNOME Panel
    nmApplet = Main.panel.statusArea["aggregateMenu"]._network;
    handlers = {};

    let decoratedFunction = function (client, device, skipSyncDeviceNames) {
        if(!(device in handlers)) {
            //If we haven't encountered this device yet, connect to the state changed signal and refresh the devices when a device state changes
            //Also store the handlerId to remove the handler when extension gets disabled
            handlers[device] = device.connect("state-changed", function(new_state, old_state, reason) {
                if(new_state !== old_state) {
                    nmApplet._readDevices();
                }
            });
        }

        //If the device is unmanaged, don't add it
        if (device.state === NetworkManager.DeviceState.UNMANAGED) {
            return;
        }

        //Add the device
        origDeviceAdded.call(this, client, device, skipSyncDeviceNames);
    };

    //Set the _deviceAdded function to our modified version
	Network.NMApplet.prototype._deviceAdded = decoratedFunction;
}

function disable() {
    //Restore the original _deviceAdded function
    if (origDeviceAdded) {
        Network.NMApplet.prototype._deviceAdded = origDeviceAdded;
    }

    //Disconnect all our state-changed handlers
    for (const device in handlers) {
        device.disconnect(handlers[device]);
    }
}
