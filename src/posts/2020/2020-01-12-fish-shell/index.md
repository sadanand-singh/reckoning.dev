---
title: 'From zsh to fish: A Complete Setup Guide'
date: 2020-01-12
thumb: fish.jpg
slug: fish-shell
tags:
  - Guides
  - Linux
---

I have been using [zsh](https://www.zsh.org/) for than 4 years now. I ended up with an extensive
set of my own changes/configurations on top of [zprezto](https://github.com/sorin-ionescu/prezto),
[zplug](https://github.com/zplug/zplug) plugins. You can see all of my changes/configurations in my
personal [zprezto repo](https://github.com/sadanand-singh/My-Zprezto).

The features and
improvements it makes on plain old bash are impressive. But as my needs change, so does my shell.
In this post, I will lay out my motivations for the switch, along with some details of my new
configurations and all the gotchas that I had to endure!

Fist, let me be very clear - I know that zsh+zprezto+zplug is really awesome, and you can almost
certainly configure zsh to do almost everything that you with the fish shell - well, at least
everything I am gonna describe in this post.

::: callout
**TLDR**

[fish](https://fishshell.com/) is a smart and user-friendly command line shell. This post is
about things that make fish great, all the caveats, and the plugins that I use, hoping that might
be useful to you as well! Some of my favorite fish features are:

- Inline auto-suggestions based on history
- tab completion, and web-based configuration
- Syntax Highlighting, and intuitive wildcard support
:::

## Motivation

One of the main attractions of all of my favorite products is that things "just work"! This lets me
focus on other little and important things. The features they do ship are polished, and have
**sensible defaults**, and are intentional. I rate [fish shell](https://fishshell.com/) in the same
category of my favorite products. It comes with all the sane default features:

- super fast
- Inline auto-suggestions based on history are enabled by default
- syntax highlighting
- tab completion using man pages data
- intuitive wildcard support

Lets go into details of some of these features.

![](https://res.cloudinary.com/sadanandsingh/image/upload/v1579488640/fish_screenshot_vtfe0x.png)

### Speed

fish is super fast compared to zsh - especially if you have been using plugins in zsh to get all
the features from the fish shell. The overall experience for me feels snappier and more responsive.
Since I'm using the terminal to be more efficient and get things done faster, speed is one of my
top requirements for my shell.

### Autosuggestion and Tab Completion

This is the main reason I moved to fish. I originally was using the
[zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions) which is "Fish-like
autosuggestions for zsh". The best things I liked about it is the autocomplete and suggestions are
inline and works for almost anything and its based on history and what not. For example, it works
with switches like `ls --he` and it gives you `ls --help`. While I type the prompt auto-suggests my
previous commands (by recent and most used). This is far quicker than `ctrl+r` and usually shows me
the command I want 80%+ of the time. It really saves time and it start as soon as you type the
first letter. Left arrow to auto-suggestions and tab for auto-complete. worth mentioning,
`alt+left` arrow to just take the first part of the suggestion and you can hit it until you get
there!

::: callout-blue
**ALT key on OSX**

By Default ALT keys do not work properly on OSX. I had to add following key map in my iTerm 2
profile to make it work properly in fish.

To move curser forward/backward one word

- ⌥ + ← — Send Escape Sequence: b
- ⌥ + → — Send Escape Sequence: f

To move cursor to the start/end of the line

- ⌘ + ← — Send Hex Codes: 0x01
- ⌘ + → — Send Hex Codes: 0x05
:::

`fish` comes with a rich set of tab completions, that work "out of the box." Press Tab, and fish
will attempt to complete the command, argument, or path. If there's more than one possibility, it
will list them:

```shell
$git merge pr @key{Tab} → git merge prompt_designer

$git checkout b @key{Tab}
builtin_list_io_merge (Branch) builtin_set_color (Branch) busted_events (Tag)
```

### Syntax Highlighting

Very intuitive. `fish` performs syntax highlighting as you type. Invalid commands are colored red
by default. A command may be invalid because it does not exist, or refers to a file that you cannot
execute. When the command becomes valid, it is shown in a different color. `fish` will underline
valid file paths as you type them.

## Wild Cards

`fish` supports the familiar wildcard \*. To list all JPG files:

```shell
$ ls *.JPEG
lena.jpg
meena.jpg
santa maria.jpg
```

One can also use multiple wildcards.

```shell
$ ls l*.p*
lena.png
lesson.pdf
```

Especially powerful is the recursive wildcard \*\* which searches directories recursively:

```shell
$ ls /var/**.log
/var/log/system.log
/var/run/sntp.log
```

Apart from these, there are tons and tons of features that might be of interest to you. Please take
a detailed look at the official [tutorials](https://fishshell.com/docs/current/tutorial.html) and
the [documentation](https://fishshell.com/docs/current/index.html).

## The Setup

### Installation

Installing fish is as simple as installing something from any major package managers. On a Mac, you
can install it via HomeBrew:

```shell
brew install fish
```

In order to setup it as default shell, you have to edit `/etc/shells` file to add
`/usr/local/bin/fish` as an entry to it (highlighted below in the codeblock):

```bash
# List of acceptable shells for chpass(1).
# Ftpd will not allow users to connect who are not using
# one of these shells.

/bin/bash
/bin/csh
/bin/dash
/bin/ksh
/bin/sh
/bin/tcsh
/bin/zsh
/usr/local/bin/zsh
/usr/local/bin/fish
```

Now you can change the default shell:

```shell
chsh -s /usr/local/bin/fish
```

### Configuration

As mentioned before, most of the above mentioned features should be working out of box. Keep on
reading further, if you wish to fine-tune fish further to your taste.

The primary config file for `fish` (.bashrc/.zshrc equivalent) is located at
`$HOME/.config/fish/config.fish`. You might have to create one to start with:

```shell
mkdir -p $HOME/.config/fish
touch vim $HOME/.config/fish/config.fish
```

### Additional Plugins

My preferred package manager is [Fisher][fisher].

[Fisher][fisher] is a package manager for the fish shell. It defines a common interface for package
authors to build and distribute shell scripts in a portable way. You can use it to extend your
shell capabilities, change the look of your prompt and create repeatable configurations across
different systems effortlessly. A good summary of its features are:

- Zero configuration.
- Blazing fast concurrent package downloads.
- Cached downloads—if you've installed a package before, you can install it again offline!
- Add, update and remove functions, completions, key bindings, and configuration snippets from a
  variety of sources using the command line, editing your fishfile or both.

[fisher]: https://github.com/jorgebucaran/fisher

Installation is as simple as:

```shell
curl https://git.io/fisher --create-dirs -sLo ~/.config/fish/functions/fisher.fish
```

All options for fisher to mnage packages can be seen here in the following screenshot:

![](https://res.cloudinary.com/sadanandsingh/image/upload/v1579569392/fisher_k2mkq9.png)

Here is a list of plugins that I use:

```text
oh-my-fish/theme-bobthefish
oh-my-fish/plugin-brew
oh-my-fish/plugin-extract
oh-my-fish/plugin-osx
oh-my-fish/plugin-grc
jorgebucaran/fish-bax
jethrokuan/fzf
jorgebucaran/fish-nvm
laughedelic/brew-completions
acomagu/fish-async-prompt
sadanand-singh/fish-sodope
```

#### oh-my-fish/theme-bobthefish

[Bobthefish](https://github.com/oh-my-fish/theme-bobthefish) - my favorite prompt theme that I had
tried to mimic in zprezto as well. Here this theme is a first class citizen. All I had to do was to
add following modifications to my config.fish file:

```text
set -g theme_powerline_fonts yes
set -g theme_nerd_fonts yes
set -g theme_display_git_stashed_verbose yes
set -g theme_display_git_master_branch yes
set -g theme_display_git_untracked yes
set -g theme_display_git_dirty yes
set -g theme_display_nvm yes
set -g theme_display_virtualenv yes
set -g theme_color_scheme zenburn
```

#### Some oh-my-fish plugins

Similar to the infamous [oh-my-zsh](https://ohmyz.sh/) framework for zsh,
[oh-my-fish](https://github.com/oh-my-fish/oh-my-fish) is a framework for the fish shell. However,
I feel its bloated and does not match my taste. Since fisher supports all of its plugins, I cherry
picked some of the useful plugins from it:

- [oh-my-fish/plugin-brew](https://github.com/oh-my-fish/plugin-brew): to have better support for
  HomeBrew commands, paths etc.
- [oh-my-fish/plugin-extract](https://github.com/oh-my-fish/plugin-extract): Provides `extract`
  function to Expand or extract bundled & compressed files.
- [oh-my-fish/plugin-osx](https://github.com/oh-my-fish/plugin-osx): Provides a bunch of helper
  functions to integrated shell with OSX, especially Finder, Trash, iTunes etc.
- [oh-my-fish/plugin-grc](https://github.com/oh-my-fish/plugin-grc): Built-in command colorizer.
  You will need to install [grc](https://github.com/garabik/grc) via `brew install grc`.

#### jorgebucaran/fish-bax

[Bax](https://github.com/jorgebucaran/fish-bax) is a POSIX shell execution wrapper for the fish
shell. Use it to run bash utilities, replaying environment changes in fish without leaving the
comfort of your session.

An example use case:

```shell
$ bax alias g=git
$ g init
Initialized empty Git repository in ~/Code/fish-bax/.git/
```

#### jethrokuan/fzf

Integrate [fzf](https://github.com/junegunn/fzf) functionality into the fish shell! fzf is a
general-purpose command-line fuzzy finder. It's an interactive Unix filter for command-line that
can be used with any list; files, command history, processes, hostnames, bookmarks, git commits
etc.

#### jorgebucaran/fish-nvm

[fish-nvm](https://github.com/jorgebucaran/fish-nvm) is a pure-fish, Node.js version manager! No
dependencies, no subshells, and no configuration setup - it just works. It has support for `.nvmrc`
files, and seamless TAB completion support.

#### laughedelic/brew-completions

[brew-completions](https://github.com/laughedelic/brew-completions) is a plugin for Fish shell
completions for Homebrew. Fish includes some basic completions for brew, but a lot of commands and
options are missing/outdated.

#### acomagu/fish-async-prompt

[fish-async-prompt](https://github.com/acomagu/fish-async-prompt) is plugin to make your prompt
asynchronous in Fish shell. It runs fish_prompt and fish_right_prompt functions as another process
and then, update the prompt asynchronously.

#### sadanand-singh/fish-sodope

[fish-sudope](https://github.com/sadanand-singh/fish-sodope) is my modification of the
[oh-my-fish/plugin-sudope](https://github.com/oh-my-fish/plugin-sudope) plugin. This plugin is to
prefix any command with sudo or remove sudo from it, via a key binding. In my modification, I use
ESC+ESC keys to achieve this.

### Additional Functions (aliases)

One of the philosophies of fish is all aliases are just functions. And all functions are lazy
loaded. Hence, for creating any kind of aliases (specially the ones that I have got used to from
zsh days), I ended up creating separate `ALIAS_NAME.fish` files in the
`$HOME/.config/fish/functions` folder.

Following snippets shows all of my personal aliases.

Alias for a short `ls` command using `l`:

```bash
function l
    ls -lh $argv
end
```

Alias to `nvim` using `vi` or `vim`:

```bash
function vi -d 'vi alias for nvim'
    nvim $argv
end
```

```bash
function vim -d 'vi alias for nvim'
    nvim $argv
end
```

Alias for updating the machine, including HomeBrew, fish, fisher and the App Store apps:

```bash
function update -d "update brew, fish, fisher and mac app store"
    echo 'start updating ...'

    echo 'updating homebrew'
    brew update
    brew upgrade
    brew cleanup

    echo 'updating fish shell'
    fisher
    fish_update_completions

    echo 'checking Apple Updates'
    /usr/sbin/softwareupdate -ia

    exit 0
end
```

Alias for cleaning python temp files:

```bash
function pyclean -d "Recursively clean directory from .pyc and .pyo files and python3 __pycache__ folders"
    set -l path2CLEAN

    if set -q $argv
        set path2CLEAN .
    else
        set path2CLEAN $argv
    end

    find $path2CLEAN -type f -name "*.py[co]" -delete -or -type d -name "__pycache__" -delete
end
```

Finally, an alias to manage Music app from the shell:

```bash
function music -d "Control Music. Use -h or --help for a more detailed description."
  if [ (count $argv) -gt 0 ]
    set -l opt $argv[1]
    switch $opt
      case launch play pause stop rewind resume quit
      case mute
        set opt "set mute to true"
      case unmute
        set opt "set mute to false"
      case next previous
        set opt "$opt track"
      case vol volume
        set opt "set sound volume to $argv[2]"
      case "" -h --help
        echo "Usage: itunes <option>"
        echo "option:"
        echo \t"launch, play, pause, stop, rewind, resume, quit"
        echo \t"mute, unmute    Control volume set"
        echo \t"next, previous  Play next or previous track"
        echo \t"vol             Set the volume, takes an argument from 0 to 100"
        echo \t"help            Show this message and exit"
        return 0
      case '*'
        echo "Unknown option $opt. Use -h or --help for a more detailed description."
        return 1
    end
    osascript -e "tell application \"Music\" to $opt"
  else
    echo "No arguments given. Use -h or --help for a more detailed description."
  end
end
```

## Other Caveats

Additionally, I had to encounter few other tricky situations to get everything working as per my
liking. In this section, I am going to describe some of that for particular tasks that I intended.
These might not be relevant to you, but in case you use a similar setup as mine, these might come
handy.

### vscode setup

This one is quite straight forward. In order to get `code` command working from the shell, I had to
add VSCode to the path. The best way to add anything to path in fish shell is via the
`fish_user_paths` variable.

```shell
set -U fish_user_paths $fish_user_paths "/Applications/Visual Studio Code.app/Contents/Resources/app/bin/"
```

### EDITOR, VISUAL, and PAGER

Similarly, we can setup correct VARs as:

```shell
set -Ux PAGER less
set -Ux EDITOR nvim
set -Ux VISUAL nvim
```

### anaconda setup

[anaconda](https://www.anaconda.com/) is my preferred way to setup python environment. Once
installed, I had to add the main `conda` to the path via `fish_user_paths`:

```shell
set -U fish_user_paths "$HOME/opt/anaconda3/bin" $fish_user_paths
```

Then enable fish shell integration by running the following command:

```shell
conda init fish
```

The above command ends up modifying the `$HOME/.config/fish/config.fish` file by adding following
to it:

```text
# !! Contents within this block are managed by 'conda init' !!
eval /Users/sadanand/opt/anaconda3/bin/conda "shell.fish" "hook" $argv | source
```

Last remaining issue was having conda env name being shown on the right prompt as well. This
happens since the PS1 setting `conda config --set changeps1 False` is ignored by the fish shell.

The solution to this issue is to add following to your `$HOME/.config/fish/config.fish` file:

```text
# kill the right prompt __conda_add_prompt 😠
function __conda_add_prompt
end
```

As a final note, I also disbled the base env (similar as I had done in zsh):

```shell
conda config --set auto_activate_base false
```

And, added a function to activate my personal env on demand:

```bash
function py36 -d 'activate py36-dev conda env'
    conda activate py36-dev
end
```

This brings an end to my notes on setting up fish shell. Let me know if you have any additional
comments. I would love to hear any of your suggestions that could make my setup easier and better.
Lets keep fishing!
