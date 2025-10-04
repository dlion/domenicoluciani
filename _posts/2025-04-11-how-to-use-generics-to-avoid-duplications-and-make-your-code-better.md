---
title: How to use  generics to avoid duplications and make your code better
description: I recently worked on a project that had a lot of code duplication due
  to repeated implementations of the same interfaces. I quickly realized it was a
  great opportunity to refactor…
tags:
- engineering
cover: "/assets/images/covers/go_generics.jpg"
reddit_url: "https://www.reddit.com/r/golang/comments/1jwus6c/how_to_use_generics_to_avoid_duplications_and/"
---


I recently worked on a project that had a lot of code duplication due to repeated implementations of the same interfaces. I quickly realized it was a great opportunity to refactor the code, remove the duplication and make the code more scalable and maintainable.

---

## Initial situation

Implementing external interfaces is quite common in Go projects, but sometimes we have the necessity to implement those interfaces multiple times with different struct, ending up having lots of structs implementing the same methods without really having a different behavior in place.

For example, we can have something like this into an external dependency, let's say something that helps us to return a particular response having a particular format:

```go
//External dependency, living in an external project
type JSONResponse interface {
    Name() string
    GetSomething() SomeThing
}
```

And then, we have in our code:

```go
type TypeOneResponse struct {
    ...
}


func (r *TypeOneResponse) Name() string { return r.Name }
func (r *TypeOneResponse) GetSomething() SomeThing { ..logic to return something.. }
```

Now let's imagine that we have to implement it for all our responses, we are going to have:

```go
type TypeOneResponse struct {
    ...
}


func (r *TypeOneResponse) Name() string { return r.Name }
func (r *TypeOneResponse) GetSomething() SomeThing { ..logic to return something.. }


type TypeTwoResponse struct {
    ...
}
func (r *TypeTwoResponse) Name() string { return r.Name }
func (r *TypeTwoResponse) GetSomething() SomeThing { ..logic to return something.. }

...
```

In no time we are going to have hundreds of lines of code that are just duplicated. Not nice, right?

## Generics to the rescue

Luckily Go introduced [Generics](https://go.dev/doc/tutorial/generics), which helps us to solve the problem.

Let's define a new common and generic struct:

```go
type Response[T] struct {
    Name string
    Payload T
}
```

and let's implement the methods:

```go
func (r *Response[T]) GetName() string { return r.Name }
func (r *Response[T]) GetSomething() SomeThing { ..logic to return something.. }

...
```

We can then easily reuse this generic struct to instantiate our response types without re-implementing all methods again and again.

```go
responseOne := Response[TypeOneResponse]{
    Payload: TypeOneResponse{ ... },   
}

responseTwo := Response[TypeTwoResponse]{
    Payload: TypeTwoResponse{ ... },
}

...
```

## Real scenario

Let's say we have to use [JSON:API](https://jsonapi.org/) format and we want to make sure our custom responses use it.
As I wrote above, it requires our structs to implement the [dedicated interfaces](https://github.com/manyminds/api2go?tab=readme-ov-file#marshalidentifier) every time leading to a very messy status.

Let's say I have a response like this:

```go
type TypeOneResponse struct {
    Field: value,
}
```

and I want to return it using a JSON:API format, it should result something like this:

```json
{
  "type": "something",
  "id": "1",
  "attributes": {
    "field": "value"
  },
}
```

How to achieve it for all our responses? Implementing implementing implementing. Let's avoid it using generics.

Let's create a common Response:

```go
type Common[T any] struct {
   ID string `json:"-"`
   Payload T
}
```

Then we need to implement all methods as we have seen above:

```go
func (c *Common[T]) GetID() string { return c.ID }
```

The result will be something like this:

```json
{
  "type": "something",
  "id": "1",
  "attributes": {
    "Payload": {
        "field": "value",
    }
  },
}
```

A bit different from what we expected right? We have to get rid of the `Payload` attribute and have only what it has inside. Let's fix it implementing our custom `MarshalJSON` and `UnmarshalJSON` methods!

```go
func (c *Common[T]) MarshalJSON() ([]byte, error) {
 return json.Marshal(&c.Payload)
}

func (c *Common[T]) UnmarshalJSON(v []byte) error {
 return json.Unmarshal(v, &c.Payload)
}
```

Obtaining as a result:

```json
{
  "data": [
    {
      "type": "something",
      "id": "1",
      "attributes": {
        "field": "value",
      },
    }
  ]  
}
```

Now, every time we want to return our responses, we just need to instantiate our responses in this way:

```go
resp1 := Common[TypeOneResponse]{
    Payload: TypeOneResponse{
        Field: value,
    }}

resp2 := Common[TypeTwoResponse]{
    Payload: TypeTwoResponse{
        AnotherFieldName: value,
    }}
```

Of course, we can further improve readability creating a factory function like:

```go
func NewCommon(payload T, value valueType) Common[T]
```

and create our custom types:

```go
type CommonOne Common[TypeOneResponse]
type CommonTwo Common[TypeTwoResponse]
```

and use them accordingly:

```go
resp1 := CommonOne{
    Payload: TypeOneResponse{
        Field: value,
    }}

resp2 := CommonTwo{
    Payload: TypeTwoResponse{
        AnotherFieldName: value,
    }}
```

This is just a small but very effective example about how to use generics to improve your codebase. Happy coding! :rocket:
