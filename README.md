# nm-hide-unmanaged

This is simple gnome shell extension that hides all unmanaged network devices from the gnome status applet (and also an example of monkey patching in gnome shell).
This is very useful when using a lot of virtual solutions such as VMware, docker, virtual box or other applications which create many network devices.

## Install

To install the extension either clone or download this project and rename the folder to `nm-hide-unmanaged@linniksa.gmail.com`.
Move the `nm-hide-unmanaged@linniksa.gmail.com` folder into `~/.local/share/gnome-shell/extensions/` and then restart gnome shell, logout and back in or restart your computer. After restarting enable the extension in the `gnome-tweak-tool`.

**It is very important that the folder name is exactly the same as `nm-hide-unmanaged@linniksa.gmail.com`. If the names do not match, the extension will not load properly.**

## Network config

This extension only hides **unmanaged** network devices. To hide unwanted network devices mark them as unmanaged in the NetworkManager config. This config can be found at `/etc/NetworkManager/NetworkManager.conf`.
To mark a network device as unmanaged add either the interface name or mac address in the config as indicated below.
```
[keyfile]
unmanaged-devices=interface-name:vmnet1,interface-name:vmnet8,mac:00:19:e0:57:86:af
```

Wild cards are also allowed

```
[keyfile]
unmanaged-devices=interface-name:vmnet*,mac:00:19:e0:57:86:*
```

This is example of a complete `/etc/NetworkManager/NetworkManager.conf`:
```
[main]
plugins=keyfile

[keyfile]
# VMWare
unmanaged-devices=interface-name:vmnet*

# Virtualbox
unmanaged-devices=interface-name:vboxnet*

# Docker
unmanaged-devices=interface-name:docker*
```

Don't forget to `reboot` to apply all changes
