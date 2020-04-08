
let origDeviceAdded;
let NetworkManager;
try {
    NetworkManager = imports.gi.NM;
} catch(e) {
    NetworkManager = imports.gi.NetworkManager;
}
const Network = imports.ui.status.network;


function enable() {
    origDeviceAdded = Network.NMApplet.prototype._deviceAdded;

    let decoratedFunction = function (client, device, skipSyncDeviceNames) {
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
