# studioclock - README

STUDIOCLOCK is a simple local web implentation of the clocks used in radio and video broadcast studio environments.

## Purpose

Official clocks in this field come in many different designs - but their main purpose is a clear representation of the exact time in seconds. This is very **useful for timed shows in live broadcasting**, where the head of production communicates in countdowns in order to make the team members aware of a certain moment to trigger some actions. While watching many different monitors and video sources a central and large clock gives everyone a good orientation. Classical colors in use in broadcasting and recording environments are red on black, with some shades of white or grey for secondary information.

Basically studioclocks consist of a **large digital clock** in the middle, surrounded by a **dotted circle** representing seconds, and an additional mark every 5 seconds. The dots on the circle reflect the actual second of the current minute.

There are a bunch of **very good and reliable standalone products** in the field of studioclocks (with more features) out on the market. But they tend to be a **rather expensive investment**, especially for smaller studios.

The idea behind this project was to create a permanently powered little computer (such as a Raspberry Pi) attached to an used old 4:3 monitor that serves just the same purpose. Of course, the studioclock should be a **reliable source of exact time information**, so it's important to have an internet connection and make sure the computer syncs the system time with a time server on the internet. The computer should work as a "headless" system: after powering up, booting, connecting to the internet and setting the current time, it starts directly into a graphical environment, fires up a web browser in kiosk mode (fullscreen) and loads a locally served little website.

## Technical requirements for the project

- Working with most basic technologies served by modern web browsers: HTML, CSS3 and JS.
- No use of a webserver, just a locally served HTML file.
- No use of images in any form.
- Use of an easy to read font.
- Good readability and clever use of screen space.
- Flexible auto scaling for independence of screen size and resolution.
- Options for customization of colors, font and spacing.
- Clear and concise code documentation.

## Approach in development

The **HTML file** is the most basic part. After reading in the CSS for formating and full centering of the clock, it consists of a bunch of `<div>` elements: some pseudo blocks (invisible) for colouring through JS, the text in the center (digital clock and meta information, studio name and day) and the labels around the circle. Their naming (id) is essential, since they are manipulated through JS on loading the page. After that the drawing of the `<canvas>` (served by JS) takes place. At the very bottome of the `<body>` the javascript is loaded and starts to fire.

The **CSS file** offers some central color and font sizing customization (documented in the code) at the very beginning. By use of a container / wrapper the digital clock is horizontally and vertically centered. Remember that CSS is a static format that only styles the initial loaded state of the website. Further manipulation of the style is done using JS.

The **JS file** starts with a number of (documented) customizations at the top. After fetching the colors from the pseudo elements in the HTML - the only way to 'read in' styles from CSS into the JS - the number of dots for the inner and outer circle is defined. We then grab the width and height of the window, which serves as a basis for the following calculations. They take place in four functions using some of the customization variables from the top of the JS file:
- `initInnerClock()` ... drawing the inner circle of dots
- `initOuterClock()` ... drawing the outer circle of dots
- `initLabelsClock()` ... placing the 5 second labels around the circle accordingly
- `singleTopOuter()` ... helper function for second 00 to color just the two topmost dots
- `updateClock()` ... reads the system time and updates the digital clock as well as the dotted circles 
At the bottom of the script the initialization functions are fired up once, then the clock is updated every single second (1000 milliseconds). When the window is resized the whole page is reloaded in order to update the sizing and dimensions of all elements.

## Fonts

For best perception in a rather stressful working environment **aim for fast and easy to read fonts**. I used the free font REGISTER included in this project. For customization I would recommend to search for the keywords "monospace", "LCD", "8bit", "digital" or even "retro computing" when looking for font downloads.

## Use in a headless system

In order to get a **working studioclock on a headless system**, make sure you meet the following criteria:
1. Connect to the computer either with a temporarily attached keyboard, mouse and monitor or at least a SSH terminal and preferably file sharing (through SMB - Samba for instance).
2. Copy all the files of this project into a local directory on the machine – for instance into `~/Documents/studioclock`
3. Make sure that on boot-up the computer connects to the internet (preferably wired, or alternatively via WIFI) and updates the system time (via NTP time servers on the internet, see [NTP - Network Time Protocol](https://en.wikipedia.org/wiki/Network_Time_Protocol)), preferably several times a day in the background.
4. Let the machine boot automatically into a graphical user interface (e.g. XServer based window manager of your choice), make sure that there are no power or screen saver functions activated. Also make sure that your monitor does NOT turn off automatically (timeout). 
5. Automatically load a web browser of your choice in kiosk mode (fullscreen)
6. Set the `startpage` of the browser to the HTML file - for instance `~/Documents/studioclock/index.html`
7. Make sure that the computer powers up automatically after power loss and runs through all of the tasks mentioned above (consider using some sort of autostart script). 
8. (optional) If your environment allows for this freedom of time choice, consider automatically rebooting the system and / or reloading the website in the browser at a time, when the studio is not in use (at night). (But never assume that a late night / early morning use will never happen ;)

## Notes for use with Raspberry Pi

This is just a collection of notes and learnings for **further research about implementing the studioclock on a Raspberry Pi** (maybe outdated!) from a setup back in 10/2020:
- `sudo wicd-curses` ... comfortable setup tool for WIFI in the terminal
- `sudo nano /etc/init.d/startapp.sh` ... (or any other naming of your choice) this would be a good place to make sure that the network adapters (eth0) and (wlan0) get activated during boot
- `sudo nano /etc/wpa_suplicant/wpa_supplicant.conf` ... config file for WIFI, but will be (over)writtten by `wicd-curses` (if manual configuration fails)
- `sudo nano /etc/network/interfaces.d` ... config file for network interfaces
- `sudo nano /home/pi/.config/lxsession/LXDE-pi/autostart` (older systems)
- `sudo nano /etc/xdg/lxsession/LXDE-pi/autostart` (newser systems) ... autostart script for the applications to start on X-Server GNOME session in Raspbian
- A simple autostart script would look like this:
```
# disable mouse cursor
@unclutter
# switch off screen saver
#@xscreensaver -no-splash  
@xset s off
@xset -dpms
@xset s noblank
# start chromium web browser (kiosk, fullscreen) and open the local file 
@chromium-browser --kiosk ~/Documents/studioclock/index.html 
```