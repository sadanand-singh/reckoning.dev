---
title: 'My Deep Learning Workstation Setup'
date: 2018-12-31
tags:
  - Linux
  - MachineLearning
  - DeepLearning
slug: mydlsetup
featured: true
featuredImage: linux.png
featuredImageColor: '#1E2C54'
---

Lately, a lot of my friends have been asking about my deep learning workstation setup. In this post
I am going to describe my hardware, OS, and different packages that I use. In particular, based on
the question, I found that the most of the interest have been around managing different python
versions, and modules like pytorch/tensorflow libraries etc.

#### Workstation Hadware

Here are the configurations of my workstation:

- [Intel - Core i7-8700 3.2 GHz 6-Core Processor](http://ark.intel.com/products/88196)
- [MSI - Z370-A PRO ATX LGA1151 Motherboard](https://www.msi.com/Motherboard/Z370-A-PRO)
- [Corsair - Vengeance LPX 16 GB (2 x 8 GB) DDR4-3000 Memory](https://www.corsair.com/us/en/Categories/Products/Memory/vengeance-lpx-black/p/CMK16GX4M2B3000C15)
- [Samsung - 970 Evo 250 GB M.2-2280 Solid State Drive](https://www.samsung.com/us/computing/memory-storage/solid-state-drives/ssd-970-evo-nvme-m-2-250gb-mz-v7e250bw/)
- [Western Digital - Blue 4 TB 3.5" 5400RPM Internal Hard Drive](https://www.newegg.com/Product/Product.aspx?Item=N82E16822235011)
- [Nvidia Geforce GTX 1080 Ti](https://www.nvidia.com/en-us/geforce/products/10series/geforce-gtx-1080-ti/)
- [Cooler Master - MasterCase Pro 5](http://www.coolermaster.com/case/mid-tower/mastercase-5/)
- [Corsair RM750i 750w ATX PSU 80 Plus Gold Fully Modular](https://www.corsair.com/us/en/Power/Plug-Type/rmi-series-config/p/CP-9020082-NA)
- [TP-Link - Archer T9E PCI-Express x1 802.11a/b/g/n/ac Wi-Fi Adapter](https://www.tp-link.com/us/products/details/cat-5519_Archer-T9E.html)
- [Samsung 28" UE590 UHD Monitor](https://www.samsung.com/us/computing/monitors/uhd-and-wqhd/samsung-uhd-28-monitor-with-high-glossy-black-finish-lu28e590ds-za/)
- [Das 4 Professional Keyboard](https://www.daskeyboard.com/daskeyboard-4-professional/)
- [Logitech MX Master 2s Mouse](https://www.logitech.com/en-us/product/mx-master-2s-flow)

As you can see, its pretty awesome built. One thing I really love about this configuration is its
stability. Although, I have recently upgraded the GPU to 2080 Ti to test mixed precision training,
this has been a pretty stable and trustworthy build.

<div class="row">
  <div class="column">
  <figure class="extend">
    <img src="https://res.cloudinary.com/sadanandsingh/image/upload/v1546230616/gnome/activities_fsd0wm.png" style="width:90%">
    <figcaption>Gnome Activities</figcaption>
    </figure>
  </div>
  <div class="column">
  <figure class="extend">
    <img src="https://res.cloudinary.com/sadanandsingh/image/upload/v1546230615/gnome/chrome_jx6pit.png" style="width:90%">
    <figcaption>Google Chrome</figcaption>
    </figure>
  </div>
</div>

## OS Setup

I avoid any rolling release linux distribution (read Arch Linux) on my work machines, since, unlike
my regular desktop, I want to have a stable development system for my actual work. Also for
repeatability of models, all packages, libraries and modules need to be fixed. Hence, I prefer
Ubuntu LTS as my OS of choice for my workstation. In particular, I am using 18.04 LTS for this
machine.

First install the Ubuntu 18.04 LTS as you would do regularly. I use the minimal installation. Note
that as of this writing, only Nvidia drivers work properly for the 2080 Ti cards. So you would need
to install the latest dev version of the nvidia drivers:

```shell
sudo add-apt-repository ppa:graphics-drivers/ppa
sudo apt update

ubuntu-drivers devices
sudo apt install nvidia-driver-415
systemctl reboot
```

My wifi card also need a propietry driver to work. I also install `gnome-tweaks` to modify
different aspects of the desktop look. I also use few gnome extensions like `alternate-tabs` and
`caffeine`.

```shell
sudo apt install bcmwl-kernel-source
sudo apt install gnome-tweaks
sudo apt install gnome-shell-extensions gnome-shell-extension-caffeine
```

If you look at my screenshots above, I prefer to use a different look for my ubuntu machine.
Following are the themes, icons and wallpapers that I use. The GTK theme is
[canta](https://github.com/vinceliuice/Canta-theme), the Icon pack is
[Oranchelo](https://github.com/OrancheloTeam/oranchelo-icon-theme). The wallpaper above is
[Planets on Acid](https://www.deviantart.com/dpcdpc11/art/Planets-on-Acid-ALTURE-Wallpaper-5120X2880px-752965913).
You can follow the links above to install these using Gnome Tweaks.

If you also want to change the background image of the login screen, you will have to modify the
following file with the following:

```bash
# Now replace the lockDialogGroup section with the following.
# of course you would need to change the png image to something else!
---
#lockDialogGroup {
background: #2c001e url(file:///usr/share/backgrounds/solar_twins_jupiter_5120x2880.png);
background-repeat: no-repeat;
background-size: cover;
background-position: center;
---
```

<div class="row">
  <div class="column">
  <figure class="extend">
    <img src="https://res.cloudinary.com/sadanandsingh/image/upload/v1546230615/gnome/searchApps_y1tgmu.png" style="width:90%">
    <figcaption>Applications Search</figcaption>
    </figure>
  </div>
  <div class="column">
  <figure class="extend">
    <img src="https://res.cloudinary.com/sadanandsingh/image/upload/v1546230613/gnome/terminal_g3jr6j.png" style="width:90%">
    <figcaption>Terminal</figcaption>
    </figure>
  </div>
</div>

I prefer google chrome as my default web browser, and can be installed using the following ppa.

```shell
# first download and install the key
wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
# add ppa
sudo sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
# install google chrome
sudo apt-get update
sudo apt-get install google-chrome-stable
```

Some commons apps that I use can be installed as follows:

```shell
sudo apt install vim neovim
sudo apt install gpg curl
sudo apt install imagemagick
sudo apt install hdf5
sudo apt install hugo
sudo apt install gcc g++
```

## git setup

First install git using `apt install` and then setup the `$HOME/.gitconfig` file. my gitconfig
looks something like below:

```json
[user]
    name = YOUR_NAME
    email = EMAIL_ADDRESS
[color]
    ui = auto
[status]
    showuntrackedfiles = no
[alias]
    gist = log --graph --oneline --all --decorate --date-order
    find = log --graph --oneline --all --decorate --date-order --regexp-ignore-case --extended-regexp --grep
    rfind = log --graph --oneline --all --decorate --date-order --regexp-ignore-case --extended-regexp --invert-grep --grep
    search = grep --line-number --ignore-case -E -I
[pager]
    status = true
[push]
    default = matching
[merge]
    tool = meld
[diff]
    tool = meld

[help]
    autocorrect = 1
```

## Shell and Terminal

I am a big fan of `zsh` using `zprezto`. You can find my settings at
[my github repo](https://github.com/sadanand-singh/My-Zprezto) in the _ubuntu_ branch. In
particular, I use a modified version of the `paradox` theme that comes with
[zprezto](https://github.com/sorin-ionescu/prezto). In particular, I prefer the look of
[bobthefish](https://github.com/oh-my-fish/theme-bobthefish) theme from fish shell. So this
modified paradox theme is a tiny attempt to mimic certain features of the `bobthefish` theme. You
can install these by first installing zprezto, then adding my github repository as another remote
in the `$HOME/.zprezto` git repository. The details can be found in the README file of my gihub
repo.

```shell
sudo apt install zsh
# follow the instructions for the first time setup
zsh
#install zprezto
git clone --recursive https://github.com/sorin-ionescu/prezto.git "${ZDOTDIR:-$HOME}/.zprezto"
cd ~/.zprezto
git remote add personal git@github.com:sadanand-singh/My-Zprezto.git
git fetch personal
git checkout ubuntu
git merge master
setopt EXTENDED_GLOB
for rcfile in "${ZDOTDIR:-$HOME}"/.zprezto/runcoms/^README.md(.N); do
  ln -sf "$rcfile" "${ZDOTDIR:-$HOME}/.${rcfile:t}"
done

# make zsh the default shell
chsh -s /bin/zsh
```

I use the **tango dark** theme and **solarized** color scheme of the default terminal. The paradox
theme needs a powerline font to work properly. I prefer to use the
[Hack font](https://github.com/source-foundry/Hack).

```shell
sudo apt install fonts-hack-ttf
```

<div class="row">
  <div class="column">
  <figure class="extend">
    <img src="https://res.cloudinary.com/sadanandsingh/image/upload/v1546230614/gnome/gnomeTweaks_p0fkkv.png" style="width:90%">
    <figcaption>Gnome Tweaks</figcaption>
    </figure>
  </div>
  <div class="column">
  <figure class="extend">
    <img src="https://res.cloudinary.com/sadanandsingh/image/upload/v1546230615/gnome/vscode_fcsbl4.png" style="width:90%">
    <figcaption>VSCode</figcaption>
    </figure>
  </div>
</div>

By default, specially on 4K screens, terminal opens in really tiny window. This can be modified in
the terminal preferences.

## Python Setup

Now comimg to the main part of this post - maintainance of python and packages! After a lot of
trial and error, I have come up with this setup, which is I think is extremely easy to manage and
very flexible to support needs of a deep learning where one might need to support different
versions of packages, different frameworks etc.

I use [anaconda](https://www.anaconda.com/) to maintain different environments. First install
anaconda by downloading the 64-bit script from this website and run it as follows:

```shell
cd Downloads
bash Anaconda3-*-Linux-x86_64.sh
# now, just follow the prompt to complete the installation.
# I use the default location for installation $HOME/anaconda3
# and chose not to install VS Code from this.
```

This will add some modification in your bashrc to make `conda` work properly. However, as we are
using zsh in this setup, we need to copy those contents to our `$HOME/.zshrc` file. The content
will look something like this:

```bash
# added by Anaconda3 2018.12 installer
# >>> conda init >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$(CONDA_REPORT_ERRORS=false '/home/sadanand/anaconda3/bin/conda' shell.bash hook 2> /dev/null)"
if [ $? -eq 0 ]; then
    \eval "$__conda_setup"
else
    if [ -f "/home/sadanand/anaconda3/etc/profile.d/conda.sh" ]; then
        . "/home/sadanand/anaconda3/etc/profile.d/conda.sh"
        CONDA_CHANGEPS1=false conda activate base
    else
        \export PATH="/home/sadanand/anaconda3/bin:$PATH"
    fi
fi
unset __conda_setup
# <<< conda init <<<\
```

Please make sure to replace `sadanand` by your **USERNAME**.

Next we will create some conda environments for regular use. First we will create a env called
`py3.7-dev` which will be a simple clone of the base conda environment.

```shell
conda create --name py3.7-dev --clone base
```

Now we can activate this new environment and update conda:

```shell
conda activate py3.7-dev
conda update conda
conda update anaconda
```

Since this environment is going to be my default env, I simply activate this in every new shell by
adding the above line at the end of my `$HOME/.zshrc` file. The awesome paradox theme will show you
the currently active env in your prompt in white.

Anaconda by default adds an indicator in your prompt to show the current active env. As our theme
already does this more elegantly, we can disbale this by the following command:

```shell
conda config --set changeps1 False
```

If you wish, you can create new conda environments similarly.

## Installing relevant packages

Once we are inside our env, we can install packages of interest using conda command, or if only
available using the pip, then using the pip command. Please ensure that you are using the local
version of pip by running `which pip` command.

Most of relevant packages like matplotlib, pandas etc. come already installed with base version of
conda. Here, we will first install jedi, flake8, pytorch, torchvision, and opencv packages.

```shell
conda install jedi
conda install flake8
conda install -c menpo opencv
 # pytorch with cuda 10 support
 conda install pytorch torchvision cuda100 -c pytorch

 # install black using pip
 pip install black
```

Its as simple as this! If you want pytorch with say `cuda 9` support, you can create a new env that
is cloned from `base` and simply change the version of pytorch there!

{% signup "By the way..." %}
I'm starting an email list for people interested in AI development and programming in general.
If you enjoy that kind of stuff, you can join here and I'll notify you whenever I publish a new post.
No strings attached, unsubscribe anytime.
{% endsignup %}

## CUDA installation

I also need the cuda libraries for developing my own pytorch modules written in C. These can be
easily installed following these steps.

First download the
[cuda 10 runfile from nvidia for Ubuntu 18.04](https://developer.nvidia.com/compute/cuda/10.0/Prod/local_installers/cuda_10.0.130_410.48_linux).

Then run following and follow the prompt for installations:

```shell
sudo sh cuda_10.0.130_410.48_linux.run
```

I choose install only the cuda toolkit and cuda samples. Once the installation is complete, you can
check your installation by going to cuda samples directory and running `make`.

## Editors

I prefer to use `neovim` and `vim` editors on terminal. And Visual Studio Code for my regular
full-time editing needs! I used to be a big fan of [sublime text](/sublimetext). However, due to
its "abandonware" status even after paying a steep price, I had to look at something more modern
and open source. I have found [Visual Studio Code (VS Code)][code] from Microsoft to be an
extremely powerful option. It has crazy amount of extensions, themes and much more than sublime
text!

You will first need to install it using the following ppa:

```shell
# First add the MS repo ppa
curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg
sudo install -o root -g root -m 644 microsoft.gpg /etc/apt/trusted.gpg.d/
sudo sh -c 'echo "deb [arch=amd64] https://packages.microsoft.com/repos/vscode stable main" > /etc/apt/sources.list.d/vscode.list'

# Now install the editor
sudo apt-get install apt-transport-https
sudo apt-get update
sudo apt-get install code
```

I have several modifications to the editor using extensions, themes and user settings. The first
extension I want to highlight is the one that enables me to quickly replicate my setup across
machines -
[VS Code Settings Sync](https://marketplace.visualstudio.com/items?itemName=Shan.code-settings-sync).

This enables you to save your settings and extensions as a private git gist. Please follow the
above link to set this up properly and use it.

Overall my details setup can be found at this
[gist](https://gist.github.com/sadanand-singh/8fc2a9ba799c479004bcfbc41b263551/).

[code]: https://code.visualstudio.com/

So this is a summary of my full setup. Its pretty easy to get started and maintain! Let me know
your preferences in the comments below. And with that, lets all celebrate a Happy New Year!!
