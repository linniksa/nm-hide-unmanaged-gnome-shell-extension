
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
    origDeviceAdded = Network.NMApplet.prototype._deviceAdded;
    nmApplet = Main.panel.statusArea["aggregateMenu"]._network;
    handlers = {};

    let decoratedFunction = function (client, device, skipSyncDeviceNames) {
        if(!(device in handlers)) {
            handlers[device] = device.connect("state-changed", function(new_state, old_state, reason) {
                if(new_state !== old_state) {
                    nmApplet._readDevices();
                }
            });
        }

        if (device.state === NetworkManager.DeviceState.UNMANAGED) {
            return;
        }

        origDeviceAdded.call(this, client, device, skipSyncDeviceNames);
    };

	Network.NMApplet.prototype._deviceAdded = decoratedFunction;
}

function disable() {
    if (origDeviceAdded) {
        Network.NMApplet.prototype._deviceAdded = origDeviceAdded;
    }
}
