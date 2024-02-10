---
layout: post
title: "Create a WC clone with Golang"
date: 2024-01-29 08:00:00
categories: [Programming]
cover: "/assets/images/covers/wc.png"
lang: en
---
I've been using Golang in the past months, and I was very happy about it, this language makes me feel entertained and productive and the same time. Studying for me is a lifelong journey, and with that in mind, I decided to keep using it for another challenge/project that I found quite simple but interesting.   
You'll see! I spent some of my free time on it and today, I'd like to share with you which route I took to accomplish it.   
Let's start!

## Intro and Coding Challenge

Golang has always been one of my favorite languages and I've been using it for a few months so far, after my [Take 3 experience](https://domenicoluciani.com/2023/11/16/buildpacks-3-months-later.html) I decided to keep studying it during my free time, and since I like hands-on projects, I used it to create a side-pet-challenge/project.

## Coding Challenges

I recently discovered [Coding Challenges](https://codingchallenges.fyi/), a website full of hands-on coding challenges that's possible to take in different languages, I chose mine: Go.  
Sometimes I struggle to find new ideas and this website helped me a lot with that.

## WC

To start with something simple I decided to implement WC, the famous [Word Count unix tool](https://linux.die.net/man/1/wc).   
To learn more about it, run `man wc` in your terminal but what it essentially does is count words, lines, characters, and bytes of a specific file or pipe stream.   
From this very high-level point of view, it seems quite simple but digging deeper you will see that it's not as simple as you could have thought at the beginning.

## Preface

Just a friendly reminder that the process I took can be avoided, improved, and of course, wrong.   
I'm just telling my story through this project and my Golang improving journey.   
Feel free to give me feedback about it and, if it makes you learn something new or reflect on a topic you never thought about,  just let me know ☀️

### First Requirement: Count bytes

Starting from scratch in Go is quite simple, so I just created my repo, opened my IntelliJ Goland IDE, and, created a simple hello world ready to jump into my first requirement implementation.   
The first requirement is to have a small functionality, just counting the number of bytes from a specific file.   
Using the file that has been provided the result of this command should be:

```bash
>./gowc -c test.txt
  342190 test.txt
```

Let's see what we got from that:

Input:
* We have a `-c` parameter which is the way we `activate` the count bytes functionality
* We pass a `test.txt` which is the file we want to count from
Output:
* Space
* Number of bytes
* Name of the file that has been read

Through my repo's commit you can see the history of my changes, I started with something completely different (like mocking a filesystem using `testify/mock`) ending up with a bunch of simple unit tests:

```go
func TestWcBytesReader(t *testing.T) {  
    t.Run("Count reads 0 bytes", func(t *testing.T) {  
       dummyContent := make([]byte, 0)  
       r := NewWcBytesReader()  
  
       currentBytes := r.Count(dummyContent)  
  
       expected := int64(0)  
       assert.Equal(t, expected, currentBytes, "Got %d, wanted %d", currentBytes, expected)  
    })
      
    t.Run("Count reads 1 byte", func(t *testing.T) {  
       dummyContent := make([]byte, 1)  
       r := NewWcBytesReader()  
  
       currentBytes := r.Count(dummyContent)  
  
       expected := int64(1)  
       assert.Equal(t, expected, currentBytes, "Got %d, wanted %d", currentBytes, expected)  
    })
      
    t.Run("Count reads multiple bytes", func(t *testing.T) {  
       dummyContent := make([]byte, 100)  
       r := NewWcBytesReader()  
  
       currentBytes := r.Count(dummyContent)  
  
       expected := int64(100)  
       assert.Equal(t, expected, currentBytes, "Got %d, wanted %d", currentBytes, expected)  
    })
 }
```


The implementation as you can imagine wasn't a big deal for this feature:
```go
func (w WcBytesReader) Count(content []byte) int64 {  
    return int64(len(content))  
}
```

We will skip for now how I used it in the main, if you want to try out the _parameter_ part you can just use `flag` and parse that calling the Count function from there once `NewWcBytesReader` has been called.

## Second Requirement: Count Lines

The second requirement was to support the command line option `-l` that outputs the number of lines in a file.   
The CLI input/output should be:

```bash
>./gocw -l test.txt
    7145 test.txt
```

Let's see what we got from that:

Input:
* We have a `-l` parameter which is the way we `activate` the count bytes functionality
* We pass a `test.txt` which is the file we want to count from
Output:
* Space
* Number of lines
* Name of the file that has been read

Here are some unit tests I wrote:
```go
t.Run("Count returns 0 lines with an empty file", func(t *testing.T) {  
    dummyFile := []byte("")  
    r := NewWcLinesReader()  
  
    currentLines := r.Count(dummyFile)  
  
    expected := int64(0)  
    assert.Equal(t, expected, currentLines, "Got %d, wanted %d", currentLines, expected)  
})  
  
t.Run("Count returns 1 lines with just one line", func(t *testing.T) {  
    dummyFile := []byte("Dummy String")  
    r := NewWcLinesReader()  
  
    currentLines := r.Count(dummyFile)  
  
    expected := int64(1)  
    assert.Equal(t, expected, currentLines, "Got %d, wanted %d", currentLines, expected)  
})  
  
t.Run("Count returns 3 lines with a multi lines file content", func(t *testing.T) {  
    dummyFile := []byte("Line 1\nLine 2\nLine 3")  
    r := NewWcLinesReader()  
  
    currentLines := r.Count(dummyFile)  
  
    expected := int64(3)  
    assert.Equal(t, expected, currentLines, "Got %d, wanted %d", currentLines, expected)  
})  
  
t.Run("Count returns 3 lines with a multi lines file content with a trailing empty line", func(t *testing.T) {  
    dummyFile := []byte("Line 1\nLine 2\nLine 3\n")  
    r := NewWcLinesReader()  
  
    currentLines := r.Count(dummyFile)  
  
    expected := int64(3)  
    assert.Equal(t, expected, currentLines, "Got %d, wanted %d", currentLines, expected)  
})
```

And here is the implementation:

```go
func (w WcLinesReader) Count(content []byte) int64 {  
    if len(content) == 0 {  
       return int64(0)  
    }  
    lines := strings.Split(string(content), "\n")  
    if lines[len(lines)-1] == "" {  
       return int64(len(lines) - 1)  
    }  
    return int64(len(lines))  
}
```


## Third Requirement: Count Words

The third requirement was to support the command line option `-w` that outputs the number of words in a file.   
The CLI input/output should be:

```bash
>./gocw -w test.txt
   58164 test.txt
```

Let's see what we got from that:

Input:
* We have a `-w` parameter which is the way we `activate` the count words functionality
* We pass a `test.txt` which is the file we want to count from
Output:
* Space
* Number of words
* Name of the file that has been read

The unit tests I wrote:

```go
t.Run("Count returns 0 if the file doesn't have words", func(t *testing.T) {  
    dummyFile := []byte("")  
    r := NewWcWordsReader()  
  
    nWords := r.Count(dummyFile)  
  
    expected := int64(0)  
    assert.Equal(t, expected, nWords, "Got %d, wanted %d", nWords, expected)  
})  
  
t.Run("Count returns 1 if the file have just 1 word", func(t *testing.T) {  
    dummyFile := []byte("Dummy")  
    r := NewWcWordsReader()  
  
    nWords := r.Count(dummyFile)  
  
    expected := int64(1)  
    assert.Equal(t, expected, nWords, "Got %d, wanted %d", nWords, expected)  
})  
  
t.Run("Count returns 3 if the file have 3 words", func(t *testing.T) {  
    dummyFile := []byte("Dummy Word Here")  
    r := NewWcWordsReader()  
    nWords := r.Count(dummyFile)  
  
    expected := int64(3)  
    assert.Equal(t, expected, nWords, "Got %d, wanted %d", nWords, expected)  
})
```

As you can see I maintained always the same _style_, starting with a simpler scenario, and moving up to a more complex one.

The implementation:
```go
func (w WcWordsReader) Count(content []byte) int64 {  
    words := strings.Fields(string(content))  
  
    return int64(len(words))  
}
```

Here instead of spending lots of time understanding what type of words I want to support, how Golang interprets and counts them, considering corner cases, Unicode characters, etc. I decided to use the `strings.Fields` method, according to the doc:

> Fields splits the string s around each instance of one or more consecutive white space characters, as defined by unicode.IsSpace, returning a slice of substrings of s or an empty slice if s contains only white space.
> -- <cite>Golang Doc</cite>

My goal wasn't to reinvent the wheel, and in some contexts/domains (i.e. security) you shouldn't too.

## Fourth Requirement: Count Characters

The fourth requirement was to support the command line option `-m` that outputs the number of characters in a file.   
The CLI input/output should be:

```bash
>./gocw -m test.txt
  339292 test.txt
```

Let's see what we got from that:

Input:
* We have a `-m` parameter which is the way we `activate` the count chars functionality
* We pass a `test.txt` which is the file we want to count from
Output:
* Space
* Number of chars
* Name of the file that has been read

The unit tests I wrote:

```go
func TestWcCharsReader(t *testing.T) {  
    t.Run("Count reads 0 chars", func(t *testing.T) {  
       dummyFile := []byte("")  
  
       r := NewWcCharsReader()  
       nChars := r.Count(dummyFile)  
  
       expected := int64(0)  
       assert.Equal(t, expected, nChars, "Got %d, wanted %d", nChars, expected)  
    })
    
    t.Run("Count reads 1 char", func(t *testing.T) {  
       dummyFile := []byte("a")  
  
       r := NewWcCharsReader()  
       nChars := r.Count(dummyFile)  
  
       expected := int64(1)  
       assert.Equal(t, expected, nChars, "Got %d, wanted %d", nChars, expected)  
    })
      
    t.Run("Count reads multiple chars", func(t *testing.T) {  
       dummyFile := []byte("abc")  
  
       r := NewWcCharsReader()  
       nChars := r.Count(dummyFile)  
  
       expected := int64(3)  
       assert.Equal(t, expected, nChars, "Got %d, wanted %d", nChars, expected)  
    })
      
    t.Run("Count reads multiple chars included unicode ones", func(t *testing.T) {  
       dummyFile := []byte("🚀")  
  
       r := NewWcCharsReader()  
       nChars := r.Count(dummyFile)  
  
       expected := int64(1)  
       assert.Equal(t, expected, nChars, "Got %d, wanted %d", nChars, expected)  
    })
}
```

I still used the same format as before, the last test is different since it allows us to test Unicode characters (in this case an emoji). As you might know, Unicode characters are counted differently, if you want to know more about it, read this article: [https://tonsky.me/blog/unicode/](https://tonsky.me/blog/unicode/)

And the following implementation:

```go
func (w WcCharsReader) Count(content []byte) int64 {  
    return int64(utf8.RuneCount(content))  
}
```

The `utf8.RuneCount` method allows me to count the number of runes in a string considering utf-8s also.

> RuneCount returns the number of runes in p. Erroneous and short encodings are treated as single runes of width 1 byte.
> -- <cite>Golang Doc</cite>

## Fifth Requirement: Default options

In this step, we should support the default option which means: no options have been provided which will be translated as we activate the `-c`, `-l`, and `-w` options.   
The CLI input/output should be then:

```bash
>./gocw test.txt
    7145   58164  342190 test.txt
```

Since we have already implemented all functionalities we just need to rearrange the way we activate them.   
At first look, it seems that having something like:

```go
if *flagBytes == true { ... }
else if *flagLines == true { ... }
else if *flagWords == true { ... }
else { activeDefaultOptions() }
```

Might work fine but I wanted to improve it a bit, I didn't like the idea that if I wanted to add new functionality I needed to touch/duplicate lots of code.   
In the beginning, I got confused and I thought that each option needed to have a filename attached having something like this `-c filename.txt -w filename.txt`, but then I realized that my solution would lead to a very complex solution since `flag` doesn't support "empty" flags, if not passing some default values which in case of strings would have been difficult.   
So I reverted my design choice to a simpler one, using boolean flags instead.

### Parameters

I don't like having everything in the main, so I created a `parameters` dir and wrote some unit tests:

```go
func TestParameters(t *testing.T) {  
    t.Run("Parameters have been provided", func(t *testing.T) {  
       os.Args = []string{"wc", "-l", "text.txt"}  
  
       actual := HasProvided()  
  
       assert.Truef(t, actual, "expected %t, got %t", true, actual)  
    })
      
    t.Run("Parameters haven't been provided", func(t *testing.T) {  
       os.Args = []string{"wc"}  
  
       actual := HasProvided()  
  
       assert.Falsef(t, actual, "expected %t, got %t", false, actual)  
    })
      
    t.Run("Get filename from parameter provided", func(t *testing.T) {  
       os.Args = []string{"wc", "-l", "text.txt"}  
  
       actual := GetFilename()  
  
       expected := "text.txt"  
       assert.Equal(t, expected, actual, "expected %t, got %t", expected, actual)  
    })
      
    t.Run("Get true if at least one flag has been passed", func(t *testing.T) {  
       getBooleanPointer := func(b bool) *bool { return &b }  
       flags := map[string]*bool{  
          "c": getBooleanPointer(false),  
          "d": getBooleanPointer(true),  
          "e": getBooleanPointer(false),  
       }  
       actualName, actualBool := HaveBeenPassed(flags)  
  
       expectedName := "d"  
       assert.Equal(t, expectedName, actualName, "expected %t, got %t", expectedName, actualName)  
       assert.Truef(t, actualBool, "expected %t, got %t", true, actualBool)  
    })
      
    t.Run("Get false if no flags have been passed", func(t *testing.T) {  
       getBooleanPointer := func(b bool) *bool { return &b }  
       flags := map[string]*bool{  
          "c": getBooleanPointer(false),  
          "d": getBooleanPointer(false),  
          "e": getBooleanPointer(false),  
       }  
       actualName, actualBool := HaveBeenPassed(flags)  
  
       expectedName := ""  
       assert.Equal(t, expectedName, actualName, "expected %t, got %t", expectedName, actualName)  
       assert.Falsef(t, actualBool, "expected %t, got %t", true, actualBool)  
    })
 }
 ```


### Check if we've got parameters
The functions I implemented are:
```go
func HasProvided() bool {  
    return len(os.Args) > 1  
}
```
It gives to me if parameters have been provided.

### Get the filename from the command line
```go
func GetFilename() string {  
    return os.Args[len(os.Args)-1]  
}
```
It gives me the last parameter entry which should be the filename.

### Check if a specific flag has been passed

```go
func HaveBeenPassed(flags map[string]*bool) (string, bool) {  
    for flagName, flagValue := range flags {  
       if *flagValue == true {  
          return flagName, true  
       }  
    }    return "", false  
}
```
It gives me the first flag that has been activated.

### Flag initialization and parsing
To initialize and get the flags I also wrote a function:
```go
func GetFlags() map[string]*bool {  
    flags := map[string]*bool{  
       BytesFlag: flag.Bool(BytesFlag, false, "Count bytes of the file"),  
       LinesFlag: flag.Bool(LinesFlag, false, "Count lines of the file"),  
       WordsFlag: flag.Bool(WordsFlag, false, "Count words of the file"),  
       CharsFlag: flag.Bool(CharsFlag, false, "Count chars of the file"),  
    }  
    flag.Parse()  
  
    return flags  
}
```
It creates a map with strings as key (specific const variables), and a bool which is the boolean value that `flag` sets following the CLI parameters.

### Const variables
It refers to the const variables, which are the keys of the `GetFlags` map and our parameters:
```go
const (  
    BytesFlag = "c"  
    LinesFlag = "l"  
    WordsFlag = "w"  
    CharsFlag = "m"  
)
```

So if tomorrow we need to add a new parameter we can just add a new Constant, add it to our map with the respective `flag.Bool` call, and everything is encapsulated inside the `parameters.go` file.

So going back to our main we have to get the input combining the functions above:
```go
func getInput() ([]byte, string) {
	if parameters.HasProvided() {  
		 filename := parameters.GetFilename()  
		 return readFile(filename), filename  
	}
    return make([]byte, 0), EmptyString  
}
```

I created a private function to verify if some parameters have been passed, and then I got the file name and read it, returning the content.

Then after setting and getting the flags using the function `parameters.GetFlags()` I initialized my readers using the function `reader.InitializeReaders()` which instantiates all readers storing them into a map of `strings-WcReaderManager`:

```go
func InitializeReaders() map[string]WcReaderManager {  
    return map[string]WcReaderManager{  
       parameters.BytesFlag: bytesReader.NewWcBytesReader(),  
       parameters.LinesFlag: linesReader.NewWcLinesReader(),  
       parameters.WordsFlag: wordsReader.NewWcWordsReader(),  
       parameters.CharsFlag: charsReader.NewWcCharsReader(),  
    }
 }
 ```


Once initialized I verify, calling the function `parameters.HaveBeenPassed(flags)` if any parameter has been passed.

* If so, I call `reader.CountWithSpecificReader(initializedReaders[flagNamePassed], input)` which the implementation is:
```go
func CountWithSpecificReader(specificReader WcReaderManager, input []byte) int64 {  
    return specificReader.Count(input)  
}
```

It gets a specificReader due to the flag that has been passed and the input which is the content of the file.   
It calls the function `Count` returning the output.   

* Otherwise we call the function `reader.CountBytesWordsAndLines(initializedReaders, input)` which uses the initialized readers that have been saved into the map to count the input for the 3 default options: bytes, words, and lines. The implementation is:
  ```go
  func CountBytesWordsAndLines(readers map[string]WcReaderManager, input []byte) (int64, int64, int64) {  
    return readers[parameters.BytesFlag].Count(input),  
       readers[parameters.WordsFlag].Count(input),  
       readers[parameters.LinesFlag].Count(input)  
  }
  ```

I was able to accomplish that thanks to the `WcReaderManager` interface:
```go
type WcReaderManager interface {  
    Count(content []byte) int64  
}
```

If you are curious about the approach I used, have a look into the [Strategy Pattern](https://refactoring.guru/design-patterns/strategy).

## Final step

The final step is about supporting reading from standard input if no filename is specified.

The CLI input/output should be:

```bash
>cat test.txt | ./gocw -l
    7145
```

To do that I created a directory called `pipeline`, containing useful functions to solve the problem, here are the unit tests I wrote:

```go
func TestPipeline(t *testing.T) {  
    t.Run("HasInput should return false if an input hasn't come from pipeline", func(t *testing.T) {  
       actual := HasInput()  
  
       assert.Falsef(t, actual, "expected %t, got %t", true, actual)  
    })    
    
    t.Run("HasInput should truw if an input comes from pipeline", func(t *testing.T) {  
       r, w, _ := os.Pipe()  
       _, _ = w.Write([]byte("Hello"))  
       _ = w.Close()  
       os.Stdin = r  
       defer func(v *os.File) { os.Stdin = v }(os.Stdin)  
  
       actual := HasInput()  
  
       assert.Truef(t, actual, "expected %t, got %t", true, actual)  
    })
 }
 ```

And here is the implementation:
```go
func HasInput() bool {  
    f, _ := os.Stdin.Stat()  
    return (f.Mode() & os.ModeCharDevice) == 0  
}  
  
func ReadInput() []byte {  
    input, err := io.ReadAll(os.Stdin)  
    if err != nil {  
       log.Fatalf("Error reading the pipeline: %v", err)  
    }    return input  
}
```

I check if the information that we get from the standard input is coming from a pipe operator, and then I just updated the `getInput` function used before:

```go
func getInput() ([]byte, string) {  
    const EmptyString = ""  
  
    if pipeline.HasInput() {  
       return pipeline.ReadInput(), EmptyString  
    }  
  
    if parameters.HasProvided() {  
       filename := parameters.GetFilename()  
       return readFile(filename), filename  
    }  
  
    return make([]byte, 0), EmptyString  
}  
  
func readFile(filename string) []byte {  
    input, err := os.ReadFile(filename)  
    if err != nil {  
       log.Fatalf("Error reading the file: %v", err)  
    }    return input  
}
```

## Directory Structure

```txt
- gowc
	- parameters
	- pipeline
	- reader
		- bytes
		- chars
		- lines
		- words
	- testdata
```

1. In the `parameters` directory I've put everything related to parameters, which means the definition of the parameters and some helpers.
2. In the `pipeline` directory I've put everything about the way to pass information through the pipe operator and the standard input, like identifying when it happens and how to read from it
3. In the `reader` directory I have everything related to my readers, the main reader file contains the interface `WcReaderManager` which has a `Count` function, and some helpers to initialize the readers.
4. The `testdata` directory was just a place where to store the sample file.

It required a bit of refactoring to get into this shape, inside the `reader` directory there is the core of my application beginning with the `reader.go` file, it contains the `WcReaderManager` interface and a bunch of function which help me to initialize and call in specific ways my readers.   
Under each `bytes`, `chars`, `lines`, and `words` directory there is the actual implementation that will be executed when needed.

As you can see it helps me to isolate and make it clear what each function belongs to. Having calls like `parameters.HasProvided()`, `pipeline.HasInput()`, `reader.CountWithSpecificReader(...)` really improve the reading and the understanding, I like this structure for this reason.


## Final Thoughts

Of course the development process wasn't this smooth, there were trials and errors here and there, as it's supposed to be.

> Perfect is the enemy of good enough

I tried to face this coding challenge by reading one requirement after the other and doing a step-by-step evolution in my codebase.   
It means that I've had to change and adapt my code to the new requirements.   
Yeah, I faced this challenge like that it was a real scenario and this is the way I think is the best way to learn: on the job.

In the beginning, it seemed quite simple, I just needed to do some counting here and there, but then at every green test, I felt the urge to clean and refactor my codebase. 

> Friendly reminder, refactoring should be part of your definition of done.

With each iteration, my codebase evolved into something more clear and thanks to my testing strategy I could do it in no time.   
Sure, I had to move from different design decisions to others but that's normal in a codebase, consider that whenever you touch some code. Sooner or later you will need to change that and how coupled it is to other components that will make the difference in the long run.

If you want to have a look at the code, you can find it on my Github Profile: [https://github.com/dlion/gowc](https://github.com/dlion/gowc).

So what do you think about my solution?   
Did I miss something? Can I improve it? Can it be more idiomatic?

Of course this solution can be definitely improved, and the exercise wasn't about reading large files (given the example file).   
In that case I would have implemented the reader in a different way in order to not have the entire file in memory and so on.

Implement your solution and let me know what you think about this challenge.

Happy Coding!
