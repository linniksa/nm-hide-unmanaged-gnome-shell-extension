
let NetworkManager = imports.gi.NetworkManager;
if (!NetworkManager || !NetworkManager.DeviceState) {
    NetworkManager = imports.gi.NM;
}
const Network = imports.ui.status.network;

let origDeviceAdded;


function enable() {
    origDeviceAdded = Network.NMApplet.prototype._deviceAdded;

    let f = function (client, device, skipSyncDeviceNames) {
        if (device.state === NetworkManager.DeviceState.UNMANAGED) {
            return;
        }

        origDeviceAdded.call(this, client, device, skipSyncDeviceNames);
    };

    Network.NMApplet.prototype._deviceAdded = f;
}

function disable() {
    if (origDeviceAdded) {
        Network.NMApplet.prototype._deviceAdded = origDeviceAdded;
    }
}
