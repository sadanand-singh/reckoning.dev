---
title: 'Setting up Airpods Pro on Ubuntu 20.04'
date: "2021-02-27T16:20:00.000Z"
thumb: airpods.jpg
slug: airpods-pro-ubuntu
tags:
  - Linux
  - Guides
---

If you have apple airpods or airpods pro, and sometimes want to use it with your Ubuntu machines,
follow this guide! If you try to pair airpods without doing any of these steps, most likely the
pairing will never complete.

This a compilation of ideas from two askubuntu posts.[^1] [^2]

::: callout-blue
**Note:** You should use HSP/HFP profile only when you need to use the airpods as microphone for
example to make a zoom or google meet call. The sound quality in this mode can be quite terrible.
:::

To enable pairing of airpods, you will need to update the ControllerMode to `bredr` from the
default value of `dual`. This can be done by editing the file `/etc/bluetooth/main.conf`.
Then restart the Bluetooth service using `sudo /etc/init.d/bluetooth restart`

You should be able to pair your airpods now and use it as headphones!

## Enabling Airpods as Microphone

In order to have airpods work as microphones, you will need to enable HSP/HFP profile. However,
Pulseaudio by default only supports HSP. In order to make HSP/HFP work, you have to enable HFP on
pulseaudio which needs `ofono`. Here are steps to enable HFP on pulseaudio using ofono on
Ubuntu 20.04.

1. Install ofono: `sudo apt install ofono`

2. Config pulseaudio to use ofono:

    Goto `/etc/pulse/default.pa` find the line `load-module module-bluetooth-discover` and change
    it in `load-module module-bluetooth-discover headset=ofono`.

    Add the user `pulse` to group `bluetooth` to grant the permission:
    `sudo usermod -aG bluetooth pulse`

    **VERY IMPORTANT:** To grant the permission, add this to `/etc/dbus-1/system.d/ofono.conf`
    (before `</busconfig>`):

    ```xml
    <policy user="pulse">
    <allow send_destination="org.ofono"/>
    </policy>
    ```

3. Provide phonesim to ofono. In order to make ofono work, you have to provide a modem to it!
4. You can install a modem emulator called phonesim (implemented by ofono) to make it work:

    install ofono-phonesim:

    ```bash
    sudo add-apt-repository ppa:smoser/bluetooth
    sudo apt-get update
    sudo apt-get install ofono-phonesim
    ```

    Configure phonesim by adding the following lines to `/etc/ofono/phonesim.conf`:

    ```
    [phonesim]
    Driver=phonesim
    Address=127.0.0.1
    Port=12345
    ```

    Restart `ofono`:

    ```bash
    sudo systemctl restart ofono.service
    ```

    Now you will need to define and enable few services to start the ofono-phonesim.

    To run `ofono-phonesim -p 12345 /usr/share/phonesim/default.xml` on startup as a systemd unit,
    create the file `/etc/systemd/system/ofono-phonesim.service`(as root) with the following
    contents:

    ```
    [Unit]
    Description=Run ofono-phonesim in the background

    [Service]

    ExecStart=ofono-phonesim -p 12345 /usr/share/phonesim/default.xml
    Type=simple
    RemainAfterExit=yes

    [Install]

    WantedBy=multi-user.target
    ```

    After ofono-phonesim runs, you'll need to also enable and put the phonesim modem online.

    You will first need to use this githup repo:

    ```bash
    cd /tmp
    git clone git://git.kernel.org/pub/scm/network/ofono/ofono.git
    sudo mv ofono /opt/
    ```

    Now you can enable and make phonesim modem online by creating another `systemd` unit file that
    depends on the above `ofono-phonesim` `systemd` unit. Put the following contents
    in `/etc/systemd/system/phonesim-enable-modem.service`:

    ```

    [Unit]
    Description=Enable and online phonesim modem
    Requires=ofono-phonesim.service

    [Service]

    ExecStart=/opt/ofone/test/enable-modem /phonesim
    ExecStart=/opt/ofone/test/online-modem /phonesim
    Type=oneshot
    RemainAfterExit=yes

    [Install]

    WantedBy=multi-user.target
    ```

    Then run the following commands to run both daemons:

    ```bash
    sudo systemctl daemon-reload
    sudo systemctl enable ofono-phonesim.service
    sudo systemctl enable phonesim-enable-modem.service
    sudo service phonesim-enable-modem start
    ```

    Check if the service is running with

    ```bash
    sudo service phonesim-enable-modem status
    ```

Finally, restart `pulseaudio` with `pulseaudio -k`.

Now you should be able to switch to HSP/HFP profile for airpods and use it as an
input device / microphones.

[^1]: https://askubuntu.com/questions/922860/pairing-apple-airpods-as-headset
[^2]: https://askubuntu.com/questions/831331/failed-to-change-profile-to-headset-head-unit/1236379#1236379
