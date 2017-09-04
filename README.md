# nm-hide-unmanaged

This is simple gnome shell extension that hide all unmanaged network devices from gnome status applet (and also an example of monkey patching in gnome shell).
This is very usefull when using a lot of virtual solutions, such as docker or virtual box, that creates many network devices.

To install just place this extension into `~/.local/share/gnome-shell/extensions/` folder and relogin. 
Use `gnome-tweak-tool` to enable the extension.

This is example of my `/etc/NetworkManager/NetworkManager.conf`:
```
[main]
plugins=keyfile

[keyfile]
unmanaged-devices=interface-name:vmnet*,interface-name:docker*,interface-name:br-*,interface-name:veth*,interface-name:virbr*

```

Don't forget to `reboot` to apply all changes
