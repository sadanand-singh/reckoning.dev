---
title: 'Sublime Text Setup'
slug: 'sublimetext'
date: 2017-11-10
tags:
  - 'Guides'
---

I have been using [Sublime text](https://www.sublimetext.com/) as my primary editor for some time
now. Here I wanted to share my current setup for the editor including all settings, packages,
shortcut keys and themes.

{% callout "action" %}
This post has been updated with my latest sublime settings.
{% endcallout %}

## Packages

First thing you will need to install is the [Package Control](https://packagecontrol.io). This can
be easily done by following the directions at their
[installation instructions](https://packagecontrol.io/installation).

Once you have installed the package manager and restarted sublime text, now you can install all
other packages using the powerful command pallet. Hit `ctrl + shift + P` and type _Install_, choose
_Package Control : Install Package_. Now you can search for any package that you wish to install,
and then press _Enter_ to install it.

![](https://res.cloudinary.com/sadanandsingh/image/upload/v1544988652/images/sublime/Settings.png)

Here is a list of packages that I currently use:

- [Alignment](https://github.com/wbond/sublime_alignment)
- [Bracket Highlighter](https://github.com/facelessuser/BracketHighlighter)
- [C++11](https://github.com/noct/sublime-cpp11)
- [Column Select](https://github.com/ehuss/Sublime-Column-Select)
- [AutoDocString](hhttps://github.com/KristoforMaynard/SublimeAutoDocstring)
- [FileIcons](https://github.com/braver/FileIcons)
- [GitGutter](https://github.com/jisaacks/GitGutter)
- [Jedi](https://github.com/srusskih/SublimeJEDI)
- [MagicPython](https://github.com/MagicStack/MagicPython)
- [Markdown Editing](https://github.com/SublimeText-Markdown/MarkdownEditing)
- [rsub](https://github.com/henrikpersson/rsub)
- [Sidebar Enhancements](https://github.com/SideBarEnhancements-org/SideBarEnhancements)
- [sublack](https://github.com/jgirardet/sublack)
- [SublimeLinter](https://github.com/SublimeLinter/SublimeLinter3)
- [SublimeLinter flake8](https://github.com/SublimeLinter/SublimeLinter-flake8)
- [SublimeLinter addon black for flake](https://github.com/kaste/SublimeLinter-addon-black-for-flake)

**Alignment** provides a simple key-binding for aligning multi-line and multiple selections.

**Bracket Highlighter**, as the name suggests, matches a variety of brackets such as:
`[], (), {}, "", '', <tag></tag>`, and even custom brackets.

**C++11** provides better coloring scheme and syntax highlighting for C++11 and beyond syntax.

**Column Select** plug-in provides an alternate behavior for Sublime keyboard column selection. The
major differences are:

- Allows reversing direction (go down too far, just go back up).
- Added PageUp/PageDown, Home/End, and mouse selection.
- Skip rows that are too short.
- If you start at the end of a line, then it will stay at the end of each line.

**AutoDocString** makes writing documentation a breeze for python code. I typically use google
docstring format, so I modify settings as follows:

```json
{
  "style": "google",
  "extra_class_newlines": false
}
```

**GitGutter** is a handy plug-in to show information about files in a git repository. Main Features
are:

- Gutter Icons indicating inserted, modified or deleted lines
- Diff Popup with details about modified lines
- Status Bar Text with information about file and repository
- Jumping Between Changes to easily navigate between modified lines

My custom settings are:

```json
// GitGutter Settings - User
{
  "show_line_annotation": "auto",
  "diff_popup_default_mode": "diff"
}
```

**Jedi** is a plugin that turns your SublimeText 3 into a rich featured Python development stack
that boost your productivity and helps you to ensure the quality and style of your code. The plugin
works out of the box with no configuration but, I prefer to specify the python interpreter
explicitly.

```json
{
  "python_interpreter": "/Users/sadanand/anaconda3/envs/py3.7-dev/bin/python3"
}
```

Please note that autocompletion doesn't work well for the import statements by default in sublime
text 3. Please follow these
[instructions](https://packagecontrol.io/packages/Jedi%20-%20Python%20autocompletion) to make it
work properly. You can download a copy of
[my completion file](https://filedn.com/lSuvfdBS7StB1VENIoS8hjj/Blog-Static-Contents/Completion%20Rules.tmPreferences).

**MagicPython** is a package with preferences and syntax highlighter for cutting edge Python 3. It
is meant to be a drop-in replacement for the default Python package. MagicPython correctly
highlights all Python 3.5 and 3.6 syntax features, including type annotations, f-strings and
regular expressions. It is built from scratch for robustness with an extensive test suite.

**sublack** is plugin to run black. [Black][black] is the uncompromising Python code formatter.
Blackened code looks the same regardless of the project you're reading. Formatting becomes
transparent after a while and you can focus on the content instead. I prefer to use a line width
of 99. By default black likes to convert all strings to double quotes, while I prefer single
quotes. Following configuration is needed for these modifications:

![](https://res.cloudinary.com/sadanandsingh/image/upload/v1544988652/images/sublime/MarkdownEditing.png)

[black]: https://github.com/ambv/black

```json
{
  // ########################
  // Black specific options #
  // ########################

  // line length
  // uses black default, if not modified
  "black_line_length": 99,

  // If --fast given, skip temporary sanity checks.
  "black_fast": false,

  // prevent black from changing single quote to double quotes
  // default is false
  // add --black_skip_string_normalization
  "black_skip_string_normalization": true,

  // Don't normalize underscores in numeric literals.
  "black_skip_numeric_underscore_normalization": false,

  // force py36 syntax mode
  "black_py36": null,

  // ##########################
  // Sublack specific options #
  // ##########################

  // full path and command to run black
  "black_command": "/Users/sadanand/anaconda3/envs/py3.7-dev/bin/black",

  // run black before saving document
  "black_on_save": true,

  // set debug mode. default is info.
  // choices : debug > info > error
  "black_log": "info",

  // default encoding for never saved file, if not specified un  first 2 lines (pep 263):
  // default is "utf-8". Change this only if you want override default behaviour.
  "black_default_encoding": "utf-8",

  // use blackd server instead of black
  "black_use_blackd": false,

  // blackd server host
  "black_blackd_host": "localhost",

  // blackd server port, default is like black, should be string
  "black_blackd_port": "45484",

  // Start blackdserver on start. shuts down at sublimetext exit.
  "black_blackd_autostart": false,

  // Use pre-commit if possible
  "black_use_precommit": false,

  // Disable formatll command
  "black_confirm_formatall": false
}
```

**rsub** is an implementation of TextMate 2's [rmate] feature for Sublime Text, allowing files to
be edited on a remote server using ssh port forwarding / tunneling. Please make sure you have
installed a version of [rmate] and are using correct
[port forwarding](https://atom.io/packages/remote-atom).

[rmate]: https://github.com/aurora/rmate

**SidebarEnhancements** Provides enhancements to the operations on Sidebar of Files and Folders for
Sublime Text. The main features are:

- Provides delete as "move to trash", open with.. and a clipboard.
- Close, move, open and restore buffers affected by a rename/move command (even on folders).
- Provides new file/folder, edit, open/run, reveal, find in selected/parent/project, cut, copy,
  paste, paste in parent, rename, move, delete, refresh etc.
- Provides copy paths as URIs, URLs, content as UTF8, content as data:uri base64 ( nice for
  embedding into CSS! ), copy as tags img/a/script/style, duplicate etc.
- Allows to display "file modified date" and "file size" on status bar.

**FileIcons** is a further enhancement to SidebarEnhancements plugin to provide fancy icons for
different types of files and folders. Please follow
[instructions](https://packagecontrol.io/packages/FileIcons) to make it work for your theme.

**SublimeLinter** and **SublimeLinter-flake8** is plug-in that provides an interface to
[flake8](https://flake8.pycqa.org/en/latest/). It will be used with files that have the `Python`
syntax. **SublimeLinter addon black for flake** is tiny add-on package to make sublack fully
compatible with flake linter.

```json
// SublimeLinter Settings - User
{
  "linters": {
    "flake8": {
      "executable": "/Users/sadanand/anaconda3/envs/py3.7-dev/bin/flake8",
      "args": ["--max-line-length=99", "--exclude=.git,__pycache__,.direnv,node_modules"]
    }
  }
}
```

**Markdown Editing** For writing markdown files, Agila theme provides alternative color schemes. We
can take advantage of them by using the Markdown Editing package and modifying the user settings of
MultiMarkdown.

```json
{
  "auto_match_enabled": true,
  "caret_extra_bottom": 3,
  "caret_extra_top": 3,
  "caret_style": "wide",
  "color_scheme": "Packages/Agila Theme/Markdown/Oceanic Next Markdown.tmTheme",
  "draw_centered": false,
  "extensions": ["mmd", "md"],
  "highlight_line": true,
  "line_numbers": true,
  "line_padding_bottom": 2,
  "line_padding_top": 2,
  "mde.auto_increment_ordered_list_number": true,
  "mde.distraction_free_mode": {
    "mde.keep_centered": true
  },
  "mde.keep_centered": false,
  "mde.keymap_disable.fold_section": false,
  "mde.keymap_disable.goto_next_heading": false,
  "mde.keymap_disable.goto_previous_heading": false,
  "mde.keymap_disable.list_back_links": true,
  "mde.keymap_disable.make_page_reference": true,
  "mde.keymap_disable.open_home_page": true,
  "mde.keymap_disable.open_journal": true,
  "mde.keymap_disable.open_page": true,
  "mde.keymap_disable.reference_jump": false,
  "mde.keymap_disable.reference_new_footnote": false,
  "mde.keymap_disable.reference_new_inline_image": false,
  "mde.keymap_disable.reference_new_inline_link": false,
  "mde.keymap_disable.reference_new_reference": false,
  "mde.keymap_disable.show_fold_all_sections": false,
  "mde.lint": {
    "disable": ["md013"],
    "md003": "any",
    "md004": "cyclic",
    "md007": 0,
    "md013": 0,
    "md026": ".,;:!",
    "md029": "any",
    "md030": {
      "ol_multi": 1,
      "ol_single": 1,
      "ul_multi": 1,
      "ul_single": 1
    },
    "mdl": {
      "additional_arguments": [],
      "executable": ""
    }
  },
  "mde.list_indent_auto_switch_bullet": true,
  "mde.list_indent_bullets": ["*", "-", "+"],
  "mde.match_header_hashes": false,
  "mde.wikilinks.homepage": "HomePage",
  "mde.wikilinks.markdown_extension": ".md",
  "mde.wikilinks.templates": {
    "default_page": "templates/PageTemplate.md"
  },
  "rulers": [100],
  "tab_size": 4,
  "translate_tabs_to_spaces": true,
  "trim_trailing_white_space_on_save": false,
  "word_wrap": true,
  "wrap_width": 99
}
```

{% signup "By the way..." %}
I'm starting an email list for people interested in AI development and programming in general.
If you enjoy that kind of stuff, you can join here and I'll notify you whenever I publish a new post.
No strings attached, unsubscribe anytime.
{% endsignup %}

## Shortcut Keys

Here is a summary of my key map:

```json
[
  { "keys": ["shift+alt+a"], "command": "find_all_under" },
  { "keys": ["control+v"], "command": "paste_and_indent" },
  { "keys": ["control+shift+v"], "command": "paste" },
  { "keys": ["ctrl+alt+;"], "command": "alignment" },
  {
    "keys": ["alt+shift+up"],
    "command": "column_select",
    "args": { "by": "lines", "forward": false }
  },
  {
    "keys": ["alt+shift+down"],
    "command": "column_select",
    "args": { "by": "lines", "forward": true }
  },
  {
    "keys": ["alt+shift+pageup"],
    "command": "column_select",
    "args": { "by": "pages", "forward": false }
  },
  {
    "keys": ["alt+shift+pagedown"],
    "command": "column_select",
    "args": { "by": "pages", "forward": true }
  },
  {
    "keys": ["alt+shift+home"],
    "command": "column_select",
    "args": { "by": "all", "forward": false }
  },
  {
    "keys": ["alt+shift+end"],
    "command": "column_select",
    "args": { "by": "all", "forward": true }
  }
]
```

## Theme and Color Scheme

I like a simple and clean UI for my editors. [guna] provides the perfect minimal theme that is
adaptive to any color scheme you prefer. I prefer color schemes from the [agila theme]. The
settings related to this can be found in my settings below.

[guna]: https://packagecontrol.io/packages/Guna
[agila theme]: https://github.com/arvi/Agila-Theme

## User Settings / Preferences

Here is my complete set of settings for Sublime Text. Please feel free to leave comments below for
any questions or suggestions.

```json
{
  "always_show_minimap_viewport": true,
  "auto_complete": true,
  "bold_folder_labels": true,
  "caret_extra_width": 1.5,
  "color_scheme": "Packages/Agila Theme/Agila Oceanic Next.tmTheme",
  "default_line_ending": "unix",
  "drag_text": false,
  "draw_white_space": "all",
  "enable_tab_scrolling": false,
  "font_face": "Roboto Mono",
  "font_options": ["directwrite", "gray_antialias", "subpixel_antialias"],
  "font_size": 16,
  "hot_exit": false,
  "ignored_packages": ["C++", "Markdown", "Vintage"],
  "indent_guide_options": ["draw_normal", "draw_active"],
  "line_padding_bottom": 3,
  "line_padding_top": 3,
  "overlay_scroll_bars": "enabled",
  "remember_open_files": false,
  "rulers": [100],
  "scroll_past_end": true,
  "soda_classic_tabs": true,
  "soda_folder_icons": true,
  "tab_completion": false,
  "tab_size": 4,
  "theme": "Guna.sublime-theme",
  "translate_tabs_to_spaces": true,
  "trim_trailing_white_space_on_save": true,
  "word_wrap": true
}
```
