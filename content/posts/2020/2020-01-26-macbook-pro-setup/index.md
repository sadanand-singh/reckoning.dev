---
title: 'Setting up Macbook Pro for Development'
date: 2020-01-26
tags:
  - Guides
categories:
  - Tech
slug: macbook-pro-setup
author: Sadanand
lightgallery: true
toc: true
type: posts
---

I have documented my setup for [linux machines before](/blog/mydlsetup) before. However, lately I have
been working a lot on my MacBook Pro. In this post, I want to document my setup for my macbook for
my own future needs. I am always curious to see how other software developers are setting up their
development machines so I figured it would be a good opportunity to share mine.

{{< figure src="https://res.cloudinary.com/sadanandsingh/image/upload/v1580264539/2016_macbook_pro_opa89c.jpg" >}}

I am a research scientist in AI/Deep Learning and do some software development using Javascript,
markdown, etc., so most of my configuration will be around programming. My current MacBook
configuration is as follows:

- 16 inch MacBook Pro 2019
- Processor: 2.6 GHz 6-Core Intel Core i7
- Memory: 16 GB 2667 MHz DDR4
- Disk: 500 GB SSD
- Graphics: AMD Radeon Pro 5300M

After getting a new Machine, first thing I do is re-install the OS with case-sensitive APFS disk,
since by default it comes installed on a Case-insensitive APFS disk type. This can be done by
rebooting the laptop with CMD+R pressed. Once it boots, use Disk Utility to reformat disk to the
case-sensitive APFS format. Then re-install the OS that the laptop came with. Once the installation
has finished, we can continue with the setup as usual.

I usually configure anything I can here like Wi-fi & Apple ID. The rest of the instructions will
assume you made it through the setup and are on the desktop. Do not forget to select disk
encryption via FileVault during this phase of the setup.

Now, please update your OS via System Preferences.

## App Store Apps

Here is a list of App Store Apps that I use:

- 1Blocker (Ad blocker for Safari)
- Irvue (for Wallpapers)
- Bear (for taking Notes)
- Fantastical 2
- Magnet
- 1Password
- Spark Email App: Setup Spark as Defult app in the Mail App preferences.
- Amphetamine
- The Unarchiver

## Other Apps

Here are some of the other Apps that I download directly from their websites:

- [iTerm 2](https://iterm2.com/downloads/beta/iTerm2-3_3_8beta5.zip)
- [Appcleaner](https://freemacsoft.net/appcleaner/)
- [Dropbox](https://www.dropbox.com/)
- [Google Chrome](https://www.google.com/chrome/)
- [Image Optim](https://imageoptim.com/mac)
- [PDF Expert](https://pdfexpert.com/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Xee 3](https://theunarchiver.com/xee)
- [Zotero](https://www.zotero.org/)

## Command-Line Setup

I preferably use iTerm as command line tool. One thing I like to do is customize the colors and a
great resource for that is https://iterm2colorschemes.com/. In particular, I like following
colorschemas:

- ayu
- Dracula
- Monokai Vivid
- Monokai Remastered
- Oceanic Material
- [New Moon](https://github.com/taniarascia/new-moon/tree/master/iterm2)
- SpaceGray Eighties
- SpaceGray Eighties Dull
- Tomorrow Night Eighties
- Tango Adapted

Now, first thing I install is [HomeBrew](https://brew.sh/). Before you install HomeBrew though you
need to install the `Xcode` command line utilities. Open a terminal in iTerm 2 and type:

```shell {linenos=false}
xcode-select --install
```

The Command Line Tools Package is a small self-contained package available for download separately
from Xcode and that allows you to do command line development in OS X.

Now, install HomeBrew:

```shell {linenos=false}
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

Once the installation finishes, run `brew help` to get all commands, and run `brew update` to
update to the latest version.

I typically use `BrewFile` from brew bundle to maintain all things installed via HomeBrew on
different machines. You can look at my
[BrewFile here](https://github.com/sadanand-singh/yadm-dotfiles/blob/osx/.config/Brewfile).

I just run following command to install all desired things via brew:

```shell {linenos=false}
brew bundle --file ~/.config/BrewFile
```

You can save your current BrewFile at current directory using:

```shell {linenos=false}
brew dump
```

By the above bundle, I have installed all desired programs, fonts and casks like Microsoft Word,
Excel and Powerpoint.

Lastly, I make `fish` as my default shell and configure it. Please look at my
[detailed post on fish shell](/fish-shell) for this.

Few other small configurations for iTerm include:

- set FuraCode Nerd Font in Profile Text settings
- set desired ColorSchema in Profile Colors settings
- set Columns to 154 and Rows to 44, under Profile Window settings
- set Option keys to be used as Meta keys under Profile Keys settings. This is needed for ALT keys
  to work properly for fish shell.

## Miscellaneous Setup

Following are details of my other additional configurations:

### Configuring the Trackpad

To make the trackpad behave correctly, ensure that these settings are enabled:

- System Preferences -> Trackpad -> Tap to click
- System Preferences -> Accessibility -> Mouse & Trackpad -> Trackpad Options… -> Enable dragging

### git Setup

BrewFile setup above installs git. My gitconfig can be found in my dot files repo at
[yadm-dotfiles](https://github.com/sadanand-singh/yadm-dotfiles/blob/osx/.gitconfig).

### ssh Setup

First enable ssh server by checking System Preferences -> Sharing -> Remote Login. You can also
update the system hostname here.

If you do not have already from the older machine, new ssh keys can be generated as follows:

```shell {linenos=false}
ssh-keygen -t rsa
```

Also, if you have any config for connecting to different servers, you can add a `$HOME/.ssh/config`
file.

Finally, to enable password-less login to this machine, you will need to add keys of the machines
to the `$HOME/.ssh/authorized_keys` file. Similarly, to allow this machine to have password-less
access to other machines, we will need to add the public key of this machine to the
`authorized_keys` file of those machines. Also, do not forget to update the public key on github to
have password-less access to github repositories.

### dotfiles

I use [YADM](https://yadm.io/) to manage my dotfiles. My repo can be found at
[yadm-dotfiles](https://github.com/sadanand-singh/yadm-dotfiles/blob/osx/.gitconfig).

### Visual Studio Code Setup

Install VSCode from the [official website](https://code.visualstudio.com/). Add the binary location
path `/Applications/Visual Studio Code.app/Contents/Resources/app/bin/` to the PATH. This makes
`code` comand available from the command line.

I use [Settings Sync](https://marketplace.visualstudio.com/items?itemName=Shan.code-settings-sync)
extension to manage my VSCode settings across different machines. After installing VSCode, I just
install this extension and sync it via my
[github gist](https://gist.github.com/sadanand-singh/9abce7fe51c5c9ec028cd7e1bf846419). You can see
all my settings at this gist.

This concludes our setup of MacBook Pro for development. Please do let me know, if you have some
other interesting ways to setup your machine that could be useful to me and others.
