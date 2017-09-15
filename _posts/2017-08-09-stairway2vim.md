---
layout: post
title: "Stairway to vim"
date: 2017-08-09 10:00:00
categories: [Programming]
cover: "/assets/images/covers/scala.png"
lang: en
---

Today I started to work on a [Scala project](https://scala-lang.org/), I spend most of my time using vim (or in this case neovim) so I started to 
looking for plugins to write Scala using [neo]vim.

## Plugin Manager

First of all I use [Plug](https://github.com/junegunn/vim-plug) as Plugin Manager, is very easy to use and allows to manage plugins with just a few commands.

## Completion System

I use [Deoplete](https://github.com/shougo/deoplete.nvim) to enable the keyword completion system, it supports many languages.

## Linting System

I use [Ale](https://github.com/w0rp/ale), a plugin for providing linting while you edit your text files, it supports Scala too obviously, just install `scalastyle` and `scalac`.
## Scala

I use [vim-scala](https://github.com/derekwyatt/vim-scala), and if you install [FuzzyFinder](https://github.com/vim-scripts/FuzzyFinder) you will able to switch from src to
test dirs with `<leader>fs` and `<leader>ft`

I found another important piece of tools that can improve your use of scala, it's called [Ensime](http://ensime.org/), using the [vim plugin](http://ensime.org/editors/vim/) and the [sbt plugin](http://ensime.org/build_tools/sbt/) you will be able to navigate through the project, for example with `:EnDeclaration` you will able to go directly on the method declaration and using `C-X C-O` you can see the completition of it and so on.

## Misc

I also use some plugins to improve my workflow like:

* [https://github.com/sheerun/vim-polyglot](https://github.com/sheerun/vim-polyglot)
* [https://github.com/scrooloose/nerdtree](https://github.com/scrooloose/nerdtree)
* [https://github.com/majutsushi/tagbar](https://github.com/majutsushi/tagbar)
* [https://github.com/tpope/vim-fugitive](https://github.com/tpope/vim-fugitive)
* [https://github.com/ervandew/supertab](ttps://github.com/ervandew/supertab)
* [https://github.com/elzr/vim-json](https://github.com/elzr/vim-json)
* [https://github.com/tpope/vim-dispatch]([https://github.com/tpope/vim-dispatch)
* [https://github.com/airblade/vim-gitgutter]([https://github.com/airblade/vim-gitgutter)

## Screenshot

![scala](/assets/images/posts/scala.png)


