---
layout: post
title: "Writing modular software using Go plugins"
date: 2018-09-19 08:00:00
categories: [programming, golang]
cover: "/assets/images/covers/gopher2.jpg"
lang: en
---

The 1.8 version of Go bring with it the ability to writing modular software using plugins, how?

Each plugin is compiled as shared object library that can be loaded at runtime, read [Vladimir Vivien's article](https://medium.com/learning-the-go-programming-language/writing-modular-go-programs-with-plugins-ec46381ee1a9) I learned how to write my own modular localization system using Go plugins!

## Preface

Currently, plugins are only supported on Linux and MacOS and with the latest build of Go (1.11 currently) are been almost deprecated by [Modules](https://github.com/golang/go/wiki/Modules).

## How build a plugin

A Go plugin is a package compiled with `go build -buildmode=plugin` command, this will produce a shared object `.so` file.   
Exported functions and variables will be exposed as symbols in the share object file.

## Writing a modular localization software

Get start with a simple project's structure:

```
 ~/go/src/github.com/dlion/modularLocalization/$:> find .
./languages/english/english.go
./main.go
```
`english.go` is our english language plugin

## Writing a plugin

```go
package main

func Speak() string {
    return "Hello World"
}
```

We just defined a `Speak` function that will be exported (pay attention to the uppercase naming convention) to return an english localized string.

Compiling with `go build -buildmode=plugin -o languages/english/english.so languages/english/english.go` will produce and `english.so` file inside our `english` directory, that is our plugin.

```
~/go/src/github.com/dlion/modularLocalization/$:> find .
./languages/english/english.so
./languages/english/english.go
./main.go
```

## How to use a plugin

Our main file:

```go
package main

import "fmt"
import "os"
import "plugin"

func main() {
        if len(os.Args) < 2 {
                fmt.Printf("usage: ./%s <language plugin>", os.Args[0])
        }

        lang := os.Args[1]

        symLanguage := lookupPlugin("./languages/"+lang+"/"+lang+".so", "Speak")

        speak, ok := symLanguage.(func() string)
        if !ok {
                fmt.Println("The function signature is different")
                os.Exit(1)
        }

        fmt.Printf("%s\n", speak())

}

func lookupPlugin(p, s string) plugin.Symbol {
        plug, err := plugin.Open(p)
        errorHandler(err)

        sym, err := plug.Lookup(s)
        errorHandler(err)
        return sym
}

func errorHandler(err error) {
        if err != nil {
                fmt.Println(err)
                os.Exit(1)
        }
}
```

It is composed by 2 parts, inside the `lookupPlugin` function and another one just after calling it.

### Open a plugin

```go
plug, err := plugin.Open(p)
errorHandler(err)
```

The signature of the `Open` method is `func Open(path string) (*Plugin, error)` so we just need to pass as paramether the path where our plugin is.

### Lookup Symbols

```go
sym, err := plug.Lookup(s)
errorHandler(err)
```
The signature of the `Lookup` function is `func (p *Plugin) Lookup(symName string) (Symbol, error)`, it will search in the shared object file our `symbol` to returns a `Symbol` type that is just an `interface{}`.

### Use the Symbol

To use our symbol we need to ensure that the type is correct, so we need to cast to it:

```go
speak, ok := symLanguage.(func() string)
if !ok {
  fmt.Println("The function signature is different")
    os.Exit(1)

}
```

if everything is fine we can call it like a normal function: `fmt.Printf("%s\n", speak())`

The output will be:

```
$:> go run main.go english
Hello World
```

## Extend our software using another plugin

Now we want to extend the localization of our software using a chinese version, let's see how!

```
~/go/src/github.com/dlion/modularLocalization/$:> find .
./languages/english/english.so
./languages/english/english.go
./languages/chinese/chinese.go
./main.go
```

and then our chinese plugin:

```go
package main

func Speak() string {
    return "你好，世界"
}
```

Compile it with `go build -buildmode=plugin -o languages/chinese/chinese.so languages/chinese/chinese.go`

And BAM!

```
$:> go run main.go chinese
你好，世界
$:> go run main.go english
Hello World
```

Without changing our `main` file we have a plugins' base localization system. Amazing, uh!?

## Even at runtime

Using Go plugins we have the ability to load our plugins at runtime, so we don't need to rebuild or kill our software, here an example:

```go
package main

import "fmt"
import "os"
import "plugin"

func main() {
        for {
                var lang string
                fmt.Print("Insert which language do you prefer: ")
                fmt.Scanf("%s", &lang)

                symLanguage := lookupPlugin("./languages/"+lang+"/"+lang+".so", "Speak")

                speak, ok := symLanguage.(func() string)
                if !ok {
                        fmt.Println("The function signature is different")
                        os.Exit(1)
                }

                fmt.Printf("%s\n", speak())
        }
}

func lookupPlugin(p, s string) plugin.Symbol {
        plug, err := plugin.Open(p)
        errorHandler(err)

        sym, err := plug.Lookup(s)
        errorHandler(err)
        return sym
}

func errorHandler(err error) {
        if err != nil {
                fmt.Println(err)
                os.Exit(1)
        }
}
```

And the output will be:

```
~/go/src/github.com/dlion/modularLocalization/$:> go run main.go
Insert which language do you prefer: english
Hello World
Insert which language do you prefer: chinese
你好，世界
```

## But Why?

Writing modular software using Go plugins allows to have a lot of benefits like:

* Single Responsability: Every plugin should do *ONE* thing.
* Plugin Independence: Every plugin is an independence piece of software
* Well-documented: Every plugin should be well-documented; to produce a working plugin you should respect the contract of the interface or the casting that we have on our main, so we need to know how it is.
* New Deployment paradigm: To extend our software we can just `push` our plugin on the right directory and *DONE*. We don't need to recompile to extend the software functionalities.

## Links

You can find the code [here](https://github.com/dlion/modularLocalization)
