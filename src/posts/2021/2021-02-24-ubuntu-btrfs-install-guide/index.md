---
title: Ubuntu Desktop 20.04 with btrfs-luks full disk encryption
date: "2021-02-24T10:50:00+01:00"
thumb: ubuntu_btrfs.png
featured: true
slug: ubuntu-btrfs-guide
tags:
  - Linux
  - Guides
---

If you have followed me here, you know I am a big fan of BTRFS and luks based full disk encryption.
I used to use [Arch Linux](https://www.archlinux.org/) in [the past](/complete-setup-arch-gnome/),
however recently I have started using Ubuntu LTS as main OS mainly for simplicity and easy
availability of numerous tricks online!

The main reason I want to to take this little complex route of installation than simple easy way
that Ubuntu provides:

- A luks-based full disk encryption for data safety, specially since I work a lot with medical data!
- An un-encrypted EFI partition for the GRUB bootloader
- a btrfs-inside-luks partition for the root filesystem (including /boot) containing a subvolume
  `@` for `/` and a subvolume `@home` for `/home` with only one passphrase prompt from GRUB!
- automatic system snapshots and easy rollback similar to `zsysc` using:
  - [Timeshift](https://github.com/teejee2008/timeshift), which will regularly take (almost instant)
    snapshots of the system
  - [grub-btrfs](https://github.com/Antynea/grub-btrfs), which will automatically create GRUB
    entries for all your btrfs snapshots

This tutorial is made with [Ubuntu 20.04 Focal Fossa](http://releases.ubuntu.com/focal/) copied to
an installation media (usually a USB Flash device but may be a DVD or the ISO file attached to a
virtual machine hypervisor). This has been
[adapted from this Blog](https://mutschler.eu/linux/install-guides/ubuntu-btrfs/).

## Step 1: Boot the install, check UEFI mode and open an interactive root shell

Since most modern PCs have UEFI, I will cover only the UEFI installation. So, boot the installation
medium in UEFI mode, choose your language and click `Try Ubuntu`. Once the Live Desktop environment
has started we need to use a Terminal shell command-line to issue a series of commands to prepare
the target device before executing the installer itself.

Now, open a terminal (<kbd>CTRL</kbd>+<kbd>ALT</kbd>+<kbd>T</kbd>) and run the following command:

```bash
mount | grep efivars
# efivarfs on /sys/firmware/efi/efivars type efivarfs (rw,nosuid,nodev,noexec,relatime)
```

to detect whether we are in UEFI mode. Now switch to an interactive root session:

```bash
sudo -i
```

You might find maximizing the terminal window is helpful for working with the command-line.
Do not close this terminal window during the whole installation process until we are finished
with everything.

## Step 2: Prepare partitions manually

### Create partition table and layout

First find out the name of your drive. For me the installation target device is called `nvme01n1`:
```bash
lsblk
# NAME  MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
# loop0   7:0    0   1.9G  1 loop /rofs
# loop1   7:1    0  27.1M  1 loop /snap/snapd/7264
# loop2   7:2    0    55M  1 loop /snap/core18/1705
# loop3   7:3    0 240.8M  1 loop /snap/gnome-3-34-1804/24
# loop4   7:4    0  62.1M  1 loop /snap/gtk-common-themes/1506
# loop5   7:5    0  49.8M  1 loop /snap/snap-store/433
# sr0    11:0    1   2.5G  0 rom  /cdrom
# sr1    11:1    1  1024M  0 rom
# sr2    11:2    1  1024M  0 rom
# nvme0n1   252:0    0    991G  0 disk
```

::: callout-green
**Note:** You can also open `gparted` or have a look into the `/dev` folder to make sure what your
hard drive is called. In most cases they are called `sda` for normal SSD and HDD, whereas for NVME
storage the naming is `nvme0`. Also note that there are no partitions or data on my hard drive, you
might want to double check which partition layout fits your use case, particularly if you dual-boot
with other systems.
:::

We'll now create the following partition layout on `nvme0n1`:

1. a 512 MiB FAT32 EFI partition for the GRUB bootloader
2. a 4 GiB partition for encrypted swap use
3. a luks1 encrypted partition which will be our root btrfs filesystem

Some remarks:

- `/boot` will reside on the encrypted luks1 partition. The GRUB bootloader is able to decrypt
   `luks1` at boot time. Alternatively, you could create an encrypted `luks1` partition for `/boot`
    and a `luks2` encrypted partition for the root filesystem.
- With btrfs I do not need any other partitions for e.g. `/home`, as we will use subvolumes instead.

Let's use `parted` for this (feel free to use `gparted` accordingly):

```bash
parted /dev/nvme0n1
  mklabel gpt
  mkpart primary 1MiB 513MiB
  mkpart primary 513MiB 4609MiB
  mkpart primary 4609MiB 100%
  print
  # Model: Virtio Block Device (virtblk)
  # Disk /dev/nvme0n1: 991.7GB
  # Sector size (logical/physical): 512B/512B
  # Partition Table: gpt
  # Disk Flags:
  #
  # Number  Start   End     Size    File system  Name     Flags
  #  1      1049kB  538MB   537MB                primary
  #  2      538MB   4833MB  4295MB               primary
  #  3      4833MB  991.7GB  990.9GB             primary
  quit
```

Do not set names or flags, as in my experience the Ubiquity installer has some problems with that.

### Create luks1 partition

The default luks (Linux Unified Key Setup) format used by the cryptsetup tool has changed since the
release of Ubuntu 18.04 Bionic. 18.04 used version 1 (`luks1`) but more recent Ubuntu releases
default to version 2 (`luks2`) and check that `/boot` is not located inside an encrypted partition.
GRUB is able to decrypt luks version 1 at boot time, but Ubiquity does not allow this by default.
Note that if you want to use luks version 2 you should create an encrypted `/boot` partition
using version 1, whereas the root filesystem can then be formatted using version 2.
Either way, we need to prepare the `luks1` partition or else GRUB will not be able to unlock the
encrypted device. Note that most Linux distributions also default to version 1 if you do a full
disk encryption (e.g. Manjaro Architect).

```bash
cryptsetup luksFormat --type=luks1 /dev/nvme0n1p3
# WARNING!
# ========
# This will overwrite data on /dev/nvme0n1p3 irrevocably.
# Are you sure? (Type uppercase yes): YES
# Enter passphrase for /dev/nvme0n1p3:
# Verify passphrase:
```
Use a very good password here. Now map the encrypted partition to a device called `cryptdata`,
which will be our root filesystem:

```bash
cryptsetup luksOpen /dev/nvme0n1p3 cryptdata
# Enter passphrase for /dev/nvme0n1p3:
ls /dev/mapper/
# control  cryptdata
```

### Create filesystems for root and EFI System partitions

Create a filesystem for the EFI System partition. If there was e.g. an NTFS filesystem at the
beginning of the drive, the Ubiquity installer will be unable to mount the filesystem otherwise.

```bash
mkfs.fat -F32 /dev/nvme0n1p1
```

We need to pre-format `cryptdata` because, in my experience, the Ubiquity installer messes
something up and complains about devices with the same name being mounted twice.

```bash
mkfs.btrfs /dev/mapper/cryptdata
# btrfs-progs v5.4.1
# See http://btrfs.wiki.kernel.org for more information.
# Label:              (null)
# UUID:               4025b177-70ac-462b-9895-bdde1d6b3d0c
# Node size:          16384
# Sector size:        4096
# Filesystem size:    59.50GiB
# Block group profiles:
#   Data:             single            8.00MiB
#   Metadata:         DUP               1.00GiB
#   System:           DUP               8.00MiB
# SSD detected:       yes
# Incompat features:  extref, skinny-metadata
# Checksum:           crc32c
# Number of devices:  1
# Devices:
#    ID        SIZE  PATH
#     1    990.50GiB  /dev/mapper/cryptdata
```

`cryptdata` is our root partition which we'll use for the root filesystem.

## Step 3 (optional): Optimize mount options for SSD or NVME drives

Unfortunately, the Ubiquity installer does not set good mount options for btrfs on SSD or
NVME drives, so you should change this for optimized performance and durability.
I have found that there is some general agreement to use the following mount options:

- `ssd`: use SSD specific options for optimal use on SSD and NVME
- `noatime`: prevent frequent disk writes by instructing the Linux kernel not to store the last
   access time of files and folders
- `space_cache`: allows btrfs to store free space cache on the disk to make caching of a block
   group much quicker
- `commit=120`: time interval in which data is written to the filesystem
   (value of 120 is taken from Manjaro)
- `compress=zstd`: allows to specify the compression algorithm which we want to use.
   btrfs provides `lzo`, `zstd` and `zlib` compression algorithms. Based on some Phoronix test
   cases, `zstd` seems to be the better performing candidate.
- Lastly the pass flag for `fschk` in the `fstab` is useless for btrfs and should be set to 0.

We need to change two configuration files:

- `/usr/lib/partman/mount.d/70btrfs`
- `/usr/lib/partman/fstab.d/btrfs`

 So let's use an editor to change the following:

```bash
nano /usr/lib/partman/mount.d/70btrfs
# line 24: options="${options:+$options,}subvol=@,ssd,noatime,space_cache,commit=120,compress=zstd"
# line 31: options="${options:+$options,}subvol=@home,ssd,noatime,space_cache,commit=120,compress=zstd"

nano /usr/lib/partman/fstab.d/btrfs
# line 30: pass=0
# line 31: home_options="${options:+$options,}subvol=@home,ssd,noatime,space_cache,commit=120,compress=zstd"
# line 32: options="${options:+$options,}subvol=@,ssd,noatime,space_cache,commit=120,compress=zstd"
# line 36: pass=0
# line 37: options="${options:+$options,}subvol=@home,ssd,noatime,space_cache,commit=120,compress=zstd"
# line 40: pass=0
# line 56: echo "$home_path" "$home_mp" btrfs "$home_options" 0 0
```

## Step 4: Install Ubuntu using the Ubiquity installer without the bootloader

Now let's run the installation process, but without installing the bootloader, as we want to
put `/boot` on an encrypted partition which is actually not allowed by Ubiquity.
So we need to run the installer with:

```bash
ubiquity --no-bootloader
```

Choose the installation language, keyboard layout, Normal or Minimal installation, check the boxes
of the Other options according to your needs. In the "Installation type" options choose
"Something Else" and the manual partitioner will start:

- Select `/dev/nvme0n1p1`, press the `Change` button. Choose `Use as` 'EFI System Partition'.
- Select `/dev/nvme0n1p2`, press the `Change` button. Choose `Use as` 'swap area' to create a swap
   partition. We will encrypt this partition later in the `crypttab`.
- Select the root filesystem device for formatting (/dev/mapper/cryptdata type btrfs on top),
  press the `Change` button. Choose `Use as` 'btrfs journaling filesystem',
  check `Format the partition` and use '/' as `Mount point`.
- If you have other partitions, check their types and use; particularly, deactivate other EFI
  partitions.

Recheck everything, press the `Install Now` button to write the changes to the disk and hit
the `Continue button`. Select the time zone and fill out your user name and password.
If your installation is successful choose the `Continue Testing` option.

**DO NOT REBOOT!**, but return to your terminal.

## Step 5: Post-Installation steps

### Create a chroot environment and enter your system

Return to the terminal and create a chroot (change-root) environment to work directly inside your
newly installed operating system:

```bash
mount -o subvol=@,ssd,noatime,space_cache,commit=120,compress=zstd /dev/mapper/cryptdata /mnt
for i in /dev /dev/pts /proc /sys /run; do sudo mount -B $i /mnt$i; done
sudo cp /etc/resolv.conf /mnt/etc/
sudo chroot /mnt
```

Now you are actually inside your system, so let's mount all other partitions and have a look at
the btrfs subvolumes:

```bash
mount -av
# /                        : ignored
# /boot/efi                : successfully mounted
# /home                    : successfully mounted
# none                     : ignored

btrfs subvolume list /
# ID 256 gen 164 top level 5 path @
# ID 258 gen 30 top level 5 path @home
```

Looks great. Note that the subvolume `@` is mounted to `/`, whereas the subvolume `@home` is
mounted to `/home`.

### Create crypttab

We need to create the `crypttab` manually:

```bash
export UUID_p3=$(blkid -s UUID -o value /dev/nvme0n1p3) #this is an environmental variable
echo "cryptdata UUID=${UUID_p3} none luks" >> /etc/crypttab

cat /etc/crypttab
# cryptdata UUID=8e893c0f-4060-49e3-9d96-db6dce7466dc none luks
```

Note that the UUID is from the luks partition `/dev/nvme0n1p3`, not from the device
mapper `/dev/mapper/cryptdata`! You can get all UUID using `blkid`.


### Encrypted swap

There are many ways to encrypt the swap partition, a good reference is
[dm-crypt/Swap encryption](https://wiki.archlinux.org/index.php/Dm-crypt/Swap_encryption).
For the sake of this guide, I will only show how to set up it as an encrypted swap partition.

#### Swap partition

As I have no use for hibernation or suspend-to-disk, I will simply use a random password to decrypt
the swap partition using the `crypttab`:

```bash
export SWAPUUID=$(blkid -s UUID -o value /dev/nvme0n1p2)
echo "cryptswap UUID=${SWAPUUID} /dev/urandom swap,offset=1024,cipher=aes-xts-plain64,size=512" >> /etc/crypttab
cat /etc/crypttab
# cryptdata UUID=8e893c0f-4060-49e3-9d96-db6dce7466dc none luks
# cryptswap UUID=9cae34c0-3755-43b1-ac05-2173924fd433 /dev/urandom swap,offset=1024,cipher=aes-xts-plain64,size=512
```

We also need to adapt the fstab accordingly:

```bash
sed -i "s|UUID=${SWAPUUID}|/dev/mapper/cryptswap|" /etc/fstab
cat /etc/fstab
# /dev/mapper/cryptdata /               btrfs   defaults,subvol=@,ssd,noatime,space_cache,commit=120,compress=zstd 0       0
# UUID=01DE-F282  /boot/efi       vfat    umask=0077      0       1
# /dev/mapper/cryptdata /home           btrfs   defaults,subvol=@home,ssd,noatime,space_cache,commit=120,compress=zstd 0       0
# /dev/mapper/cryptswap none            swap    sw              0       0
```

The sed command simply replaced the UUID of your swap partition with the encrypted device
called `/dev/mapper/cryptswap`. There you go, you have an encrypted swap partition.

### Add a key-file to type luks passphrase only once (optional, but recommended)

The device holding the kernel (and the initramfs image) is unlocked by GRUB, but the root device
needs to be unlocked again at initramfs stage, regardless whether it’s the same device or not,
so you'll get a second prompt for your passphrase. This is because GRUB boots with the given
`vmlinuz` and `initramfs` images; in other words, all devices are locked, and the root device
needs to be unlocked again. To avoid extra passphrase prompts at initramfs stage, a workaround
is to unlock via key files stored into the `initramfs` image. This can also be used to unlock any
additional luks partitions you want on your disk. Since the `initramfs` image now resides on an
encrypted device, this still provides protection for data at rest. After all for luks the volume
key can already be found by user space in the Device Mapper table, so one could argue that
including key files to the `initramfs` image – created with restrictive permissions – doesn’t
change the threat model for luks devices. **Note that this is exactly what e.g. the Manjaro
architect installer does as well**.

Long story short, let's create a key-file, secure it, and add it to our luks volume:

```bash
mkdir /etc/luks
dd if=/dev/urandom of=/etc/luks/boot_os.keyfile bs=4096 count=1
# 1+0 records in
# 1+0 records out
# 4096 bytes (4.1 kB, 4.0 KiB) copied, 0.000928939 s, 4.4 MB/s
chmod u=rx,go-rwx /etc/luks
chmod u=r,go-rwx /etc/luks/boot_os.keyfile
cryptsetup luksAddKey /dev/nvme0n1p3 /etc/luks/boot_os.keyfile
# Enter any existing passphrase:
cryptsetup luksDump /dev/nvme0n1p3 | grep "Key Slot"
# Key Slot 0: ENABLED
# Key Slot 1: ENABLED
# Key Slot 2: DISABLED
# Key Slot 3: DISABLED
# Key Slot 4: DISABLED
# Key Slot 5: DISABLED
# Key Slot 6: DISABLED
# Key Slot 7: DISABLED
```

Note that "Key Slot 0" contains our passphrase, whereas "Key Slot 1" contains the key-file.
Let's restrict the pattern of keyfiles and avoid leaking key material for the initramfs hook:

```bash
echo "KEYFILE_PATTERN=/etc/luks/*.keyfile" >> /etc/cryptsetup-initramfs/conf-hook
echo "UMASK=0077" >> /etc/initramfs-tools/initramfs.conf
```
These commands will harden the security options in the `intiramfs` configuration file and hook.

Next, add the keyfile to your `crypttab`:

```bash
sed -i "s|none|/etc/luks/boot_os.keyfile|" /etc/crypttab # this replaces none with /etc/luks/boot_os.keyfile

cat /etc/crypttab
# cryptdata UUID=8e893c0f-4060-49e3-9d96-db6dce7466dc /etc/luks/boot_os.keyfile luks
# cryptswap UUID=9cae34c0-3755-43b1-ac05-2173924fd433 /dev/urandom swap,offset=1024,cipher=aes-xts-plain64,size=512
```

### Install the EFI bootloader

Now it is time to finalize the setup and install the GRUB bootloader. First we need to make it
capable to unlock luks1-type partitions by setting `GRUB_ENABLE_CRYPTODISK=y` in
`/etc/default/grub`, then install the bootloader to the device `/dev/nvme0n1` and lastly update
GRUB. Just in case, I also reinstall the generic kernel
("linux-generic" and "linux-headers-generic") and also install the Hardware Enablement
kernel ("linux-generic-hwe-20.04" "linux-headers-generic-hwe-20.04"):

```bash
echo "GRUB_ENABLE_CRYPTODISK=y" >> /etc/default/grub

apt install -y --reinstall grub-efi-amd64-signed linux-generic linux-headers-generic linux-generic-hwe-20.04 linux-headers-generic-hwe-20.04
# --- SOME APT INSTALLATION OUTPUT ---

update-initramfs -c -k all
# update-initramfs: Generating /boot/initrd.img-5.4.0-26-generic
# update-initramfs: Generating /boot/initrd.img-5.4.0-29-generic

grub-install /dev/nve0n1
# Installing for x86_64-efi platform.
# Installation finished. No error reported.

update-grub
# Sourcing file `/etc/default/grub'
# Sourcing file `/etc/default/grub.d/init-select.cfg'
# Generating grub configuration file ...
# Found linux image: /boot/vmlinuz-5.4.0-29-generic
# Found initrd image: /boot/initrd.img-5.4.0-29-generic
# Found linux image: /boot/vmlinuz-5.4.0-26-generic
# Found initrd image: /boot/initrd.img-5.4.0-26-generic
# Adding boot menu entry for UEFI Firmware Settings
# done
```

Lastly, double-check that the initramfs image has restrictive permissions and includes the keyfile:

```bash
stat -L -c "%A  %n" /boot/initrd.img
# -rw-------  /boot/initrd.img
lsinitramfs /boot/initrd.img | grep "^cryptroot/keyfiles/"
# cryptroot/keyfiles/cryptdata.key
```

Note that cryptsetup-initramfs may rename key files inside the initramfs.


## Step 6: Reboot, some checks, and update system

Now, it is time to exit the chroot - cross your fingers - and reboot the system:

```bash
exit
# exit
reboot now
```

If all went well you should see a single passphrase prompt (YAY!) from GRUB:

```
Enter the passphrase for hd0,gpt3 (some very long number):
```

where you enter the luks passphrase to unlock GRUB, which then either asks you again for your
passphrase or uses the key-file to unlock `/dev/nvme0n1p3` and map it to `/dev/mapper/cryptdata`.
If you added a key-file you need to type your password only once. Note that if you mistyped the
password for GRUB, you must restart the computer and retry.

Now let's click through the welcome screen and open up a terminal to see whether everything is
set up correctly:

```bash
sudo cat /etc/crypttab
# cryptdata UUID=8e893c0f-4060-49e3-9d96-db6dce7466dc /etc/luks/boot_os.keyfile luks
# cryptswap UUID=9cae34c0-3755-43b1-ac05-2173924fd433 /dev/urandom swap,offset=1024,cipher=aes-xts-plain64,size=512

sudo cat /etc/fstab
# /dev/mapper/cryptdata /               btrfs   defaults,subvol=@,ssd,noatime,space_cache,commit=120,compress=zstd 0       0
# UUID=01DE-F282  /boot/efi       vfat    umask=0077      0       1
# /dev/mapper/cryptdata /home           btrfs   defaults,subvol=@home,ssd,noatime,space_cache,commit=120,compress=zstd 0       0
# /dev/mapper/cryptswap none            swap    sw              0       0

sudo mount -av
# /                        : ignored
# /boot/efi                : already mounted
# /home                    : already mounted
# none                     : ignored
# /swap                    : already mounted

sudo mount -v | grep /dev/mapper
# /dev/mapper/cryptdata on / type btrfs (rw,noatime,compress=zstd:3,ssd,space_cache,commit=120,subvolid=256,subvol=/@)
# /dev/mapper/cryptdata on /home type btrfs (rw,noatime,compress=zstd:3,ssd,space_cache,commit=120,subvolid=258,subvol=/@home)

sudo swapon
# NAME           TYPE      SIZE USED PRIO
# /dev/dm-1      partition   4G   0B   -3

sudo btrfs filesystem show /
# Label: none  uuid: aa90f2d3-10d9-420b-86e2-92ffce0ece9d
# 	Total devices 1 FS bytes used 6.61GiB
# 	devid    1 size 990.50GiB used 9.02GiB path /dev/mapper/cryptdata

sudo btrfs subvolume list /
# ID 256 gen 195 top level 5 path @
# ID 258 gen 192 top level 5 path @home
```

Look's good. Note that in this tutorial I installed both a swapfile and a swap partition.
Normally you would choose one or the other.

Let's update the system and reboot one more time:

```bash
sudo apt update
sudo apt upgrade
sudo apt dist-upgrade
sudo apt autoremove
sudo apt autoclean
```

Also enable `fstrim.timer` as we did not add `discard` to the `crypttab`. This is due to the fact
that [Btrfs Async Discard Support Looks To Be Ready For Linux 5.6](https://www.phoronix.com/scan.php?page=news_item&px=Btrfs-Async-Discard)
is quite new, but 20.04 still runs kernel 5.4, it is better to enable the `fstrim.timer` systemd
service:

```bash
sudo systemctl enable fstrim.timer
```

Now reboot:

```bash
sudo reboot now
```

## Step 7: Install Timeshift and grub-btrfs

Open a terminal and install some dependencies:

```bash
sudo apt install -y btrfs-progs git make
```

Install Timeshift and configure it directly via the GUI:

```bash
sudo apt install timeshift
sudo timeshift-gtk
```

- Select “BTRFS” as the “Snapshot Type”; continue with “Next”
- Choose your BTRFS system partition as “Snapshot Location”; continue with “Next”
- "Select Snapshot Levels" (type and number of snapshots that will be automatically created and
   managed/deleted by Timeshift), my recommendations:
    - Activate "Monthly" and set it to 1
    - Activate "Weekly" and set it to 3
    - Activate "Daily" and set it to 5
    - Deactivate "Hourly"
    - Activate "Boot" and set it to 3
    - Activate "Stop cron emails for scheduled tasks"
- continue with "Next"
- I also include the `@home` subvolume (which is not selected by default). Note that when you
   restore a snapshot Timeshift you get the choice whether you want to restore it as well
   (which in most cases you don't want to).
- Click "Finish"
- "Create" a manual first snapshot & exit Timeshift

*Timeshift* will now check every hour if snapshots ("hourly", "daily", "weekly", "monthly", "boot")
need to be created or deleted. Note that "boot" snapshots will not be created directly but about
10 minutes after a system startup.

*Timeshift* puts all snapshots into `/run/timeshift/backup`. Conveniently, the real root
(subvolid 5) of your BTRFS partition is also mounted here, so it is easy to view, create,
delete and move around snapshots manually.

```bash
ls /run/timeshift/backup
# @  @home  @swap  timeshift-btrfs
```

Note that `/run/timeshift/backup/@` contains your `/` folder, `/run/timeshift/backup/@home`
contains your `/home` folder, `/run/timeshift/backup/@swap` contains your `/swap` folder.

Now let's install *timeshift-autosnap-apt* and *grub-btrfs* from GitHub

```bash
git clone https://github.com/wmutschl/timeshift-autosnap-apt.git /home/$USER/timeshift-autosnap-apt
cd /home/$USER/timeshift-autosnap-apt
sudo make install

git clone https://github.com/Antynea/grub-btrfs.git /home/$USER/grub-btrfs
cd /home/$USER/grub-btrfs
sudo make install
```

After this, optionally, make changes to the configuration files:

```bash
sudo nano /etc/timeshift-autosnap-apt.conf
sudo nano /etc/default/grub-btrfs/config
```
For example, as we don't have a dedicated /boot partition, we can set `snapshotBoot=false` in
the `timeshift-autosnap-apt-conf` file to not rsync the `/boot` directory to `/boot.backup`.
Note that the EFI partition is still rsynced into your snapshot to `/boot.backup/efi`.
For *grub-btrfs*, I change `GRUB_BTRFS_SUBMENUNAME` to "MY BTRFS SNAPSHOTS".

Check if everything is working:

```bash
sudo timeshift-autosnap-apt
# Rsyncing /boot/efi into the filesystem before the call to timeshift.
# Using system disk as snapshot device for creating snapshots in BTRFS mode
#
# /dev/dm-0 is mounted at: /run/timeshift/backup, options: rw,relatime,compress=zstd:3,ssd,space_cache,commit=120,subvolid=5,subvol=/
#
# Creating new backup...(BTRFS)
# Saving to device: /dev/dm-0, mounted at path: /run/timeshift/backup
# Created directory: /run/timeshift/backup/timeshift-btrfs/snapshots/2020-05-06_23-43-29
# Created subvolume snapshot: /run/timeshift/backup/timeshift-btrfs/snapshots/2020-05-06_23-43-29/@
# Created subvolume snapshot: /run/timeshift/backup/timeshift-btrfs/snapshots/2020-05-06_23-43-29/@home
# Created control file: /run/timeshift/backup/timeshift-btrfs/snapshots/2020-05-06_23-43-29/info.json
# BTRFS Snapshot saved successfully (0s)
# Tagged snapshot '2020-05-06_23-43-29': ondemand
# ------------------------------------------------------------------------------
# Sourcing file `/etc/default/grub'
# Sourcing file `/etc/default/grub.d/init-select.cfg'
# Generating grub configuration file ...
# Found linux image: /boot/vmlinuz-5.4.0-29-generic
# Found initrd image: /boot/initrd.img-5.4.0-29-generic
# Found linux image: /boot/vmlinuz-5.4.0-26-generic
# Found initrd image: /boot/initrd.img-5.4.0-26-generic
# Adding boot menu entry for UEFI Firmware Settings
# ###### - Grub-btrfs: Snapshot detection started - ######
# # Info: Separate boot partition not detected
# # Found snapshot: 2020-05-06 23:43:29 | timeshift-btrfs/snapshots/2020-05-06_23-43-29/@
# # Found snapshot: 2020-05-06 23:35:24 | timeshift-btrfs/snapshots/2020-05-06_23-35-24/@
# # Found 2 snapshot(s)
# ###### - Grub-btrfs: Snapshot detection ended   - ######
# done
```

Now, if you run `sudo apt install|remove|upgrade|dist-upgrade`, *timeshift-autosnap-apt* will
create a snapshot of your system with *Timeshift* and *grub-btrfs* creates the corresponding boot
menu entries (actually it creates boot menu entries for all subvolumes of your system).

For example:

```bash
sudo apt install rolldice
# Reading package lists... Done
# Building dependency tree
# Reading state information... Done
# The following NEW packages will be installed:
#   rolldice
# 0 upgraded, 1 newly installed, 0 to remove and 37 not upgraded.
# Need to get 9.628 B of archives.
# After this operation, 31,7 kB of additional disk space will be used.
# Get:1 http://de.archive.ubuntu.com/ubuntu focal/universe amd64 rolldice amd64 1.16-1build1 [9.628 B]
# Fetched 9.628 B in 0s (32,4 kB/s)
# Rsyncing /boot/efi into the filesystem before the call to timeshift.
# Using system disk as snapshot device for creating snapshots in BTRFS mode
#
# /dev/dm-0 is mounted at: /run/timeshift/backup, options: rw,relatime,compress=zstd:3,ssd,space_cache,commit=120,subvolid=5,subvol=/
#
# Creating new backup...(BTRFS)
# Saving to device: /dev/dm-0, mounted at path: /run/timeshift/backup
# Created directory: /run/timeshift/backup/timeshift-btrfs/snapshots/2020-05-06_23-45-37
# Created subvolume snapshot: /run/timeshift/backup/timeshift-btrfs/snapshots/2020-05-06_23-45-37/@
# Created subvolume snapshot: /run/timeshift/backup/timeshift-btrfs/snapshots/2020-05-06_23-45-37/@home
# Created control file: /run/timeshift/backup/timeshift-btrfs/snapshots/2020-05-06_23-45-37/info.json
# BTRFS Snapshot saved successfully (0s)
# Tagged snapshot '2020-05-06_23-45-37': ondemand
# ------------------------------------------------------------------------------
# Sourcing file `/etc/default/grub'
# Sourcing file `/etc/default/grub.d/init-select.cfg'
# Generating grub configuration file ...
# Found linux image: /boot/vmlinuz-5.4.0-29-generic
# Found initrd image: /boot/initrd.img-5.4.0-29-generic
# Found linux image: /boot/vmlinuz-5.4.0-26-generic
# Found initrd image: /boot/initrd.img-5.4.0-26-generic
# Adding boot menu entry for UEFI Firmware Settings
# ###### - Grub-btrfs: Snapshot detection started - ######
# # Info: Separate boot partition not detected
# # Found snapshot: 2020-05-06 23:45:37 | timeshift-btrfs/snapshots/2020-05-06_23-45-37/@
# # Found snapshot: 2020-05-06 23:43:29 | timeshift-btrfs/snapshots/2020-05-06_23-43-29/@
# # Found snapshot: 2020-05-06 23:35:24 | timeshift-btrfs/snapshots/2020-05-06_23-35-24/@
# # Found 3 snapshot(s)
# ###### - Grub-btrfs: Snapshot detection ended   - ######
# done
# Selecting previously unselected package rolldice.
# (Reading database ... 158308 files and directories currently installed.)
# Preparing to unpack .../rolldice_1.16-1build1_amd64.deb ...
# Unpacking rolldice (1.16-1build1) ...
# Setting up rolldice (1.16-1build1) ...
# Processing triggers for man-db (2.9.1-1) ...
```

Hopefully this is of help to some of you who want to have a stable and reliable system! Let me know
you thoughts in comments below.
