
let devices;
let nmApplet;
let origDeviceAdded;
let NetworkManager;
let enabled;
try {
    NetworkManager = imports.gi.NM;
} catch(e) {
    NetworkManager = imports.gi.NetworkManager;
}
const Network = imports.ui.status.network;
const Panel = imports.ui.panel;
const Main = imports.ui.main;
const GObject = imports.gi.GObject;


function enable() {
    enabled = true;
    devices = [];

    //Get the instance of the NMApplet class used by the GNOME Panel
    nmApplet = Main.panel.statusArea["aggregateMenu"]._network;

    //Back up the original _deviceAdded function
    origDeviceAdded = Network.NMApplet.prototype._deviceAdded;

    let decoratedFunction = function (client, device, skipSyncDeviceNames) {
        //The decorated function somehow still gets called even when the extension is disabled, so we suppress it's behaviour when not enabled
        if(enabled)
        {
            if(!(devices.includes(device))) {
                //If we haven't encountered this device yet, connect to the state changed signal and refresh the devices when a device state changes
                //Also store the handlerId to remove the handler when extension gets disabled
                device.handlerId = device.connect("state-changed", function(new_state, old_state, reason) {
                    if(new_state !== old_state) {
                        nmApplet._readDevices();
                    }
                });
                devices.push(device);
            }

            //If the device is unmanaged, don't add it
            if (device.state === NetworkManager.DeviceState.UNMANAGED) {
                return;
            } 
        }

        //Add the device
        origDeviceAdded.call(this, client, device, skipSyncDeviceNames);
    };

    //Set the _deviceAdded function to our modified version
	Network.NMApplet.prototype._deviceAdded = decoratedFunction;
}

function disable() {
    enabled = false;

    //Restore the original _deviceAdded function
    if (origDeviceAdded) {
        Network.NMApplet.prototype._deviceAdded = origDeviceAdded;
    }

    //Disconnect all our state-changed handlers
    for (let i=0; i<devices.length; i++) {
        if(devices[i].handlerId) {
            GObject.Object.prototype.disconnect.call(devices[i], devices[i].handlerId);
        }
    }
}
