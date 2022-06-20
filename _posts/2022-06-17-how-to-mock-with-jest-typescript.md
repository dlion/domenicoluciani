---
layout: post
title: "How to mock with Jest and Typescript"
date: 2022-06-17 08:00:00
categories: [Programming]
cover: "/assets/images/covers/mock_typescript.png"
lang: en
---


As an Extreme Programmer I used to jumping often into different engagements, each of them has challenges I need to overcome and problems I need to solve.   
This time I jumped into an engagement with a legacy codebase composed mainly by AWS lambdas written in Typescript. Language and technology I've never used before.   
How can I learn the language and at the same time being able to quickly deliver value?   
The answer in my head was clear: **let's create some tests, the rest will follow!**

----

> Disclaimer: 
> I'm still learning the language so any feedback would be very welcomed, I'm writing this article to describe my journey and what I learned so far, so any suggestion and correction will be definitely appreciated.


## Jest Testing Framework

Working on a legacy code often means you have to use whatever it's already there and in this case the testing framework that has been installed **but that I've never used before** was [Jest](https://jestjs.io/).   
Luckily most of these frameworks are quite similar but definitely have a look into the documentation, helps.

## Let me test, let me teeest!

One of the problems we have working on a legacy code is that testing it is quite tricky due the fact the code wasn't made to be tested at first place.   
So you find these gigantic classes full of large methods that are impossible to test with a lot of dependencies, a big ball of mud.   
A legacy codebase can be composed by thousands of classes, composed by hundreds of methods and lines of code, so where should we start from?

## Core Business Logic

My first step into a legacy codebase is about identifying the core business logic, the critical one. I work with the client's team to identify which part should **never** break and which part delivers value.   
Once identified, I start retrofitting some unit tests, trying to cover the main use-cases ensuring that everything work as expected and start creating my safety-net.   
Working without a safety-net is risky, will slow us down and increase the likelihood that we are going to break something.

## Mock Mock Mock

Often you have lots of dependencies you need to take care of and most of the time those dependencies are doing lot's of weird stuff you don't know anything about so the safest way to test everything without worrying how those dependencies behave is to mock them, brutally.

In the following sections you can find some snippets of code I found useful during my journey on that project, handling legacy code could be tricky and having the right snippets at the right moment could be life saver.

## Typescript, what are you doing??

I found out that compared with other languages Typescript allows you to mock an object easily thanks to the [duck-typing](https://www.geeksforgeeks.org/typescript-duck-typing/). 

Let's see an example:

```ts
const readlDependency = {
  functionIneedToMock: () => { ... },
  anotherFunctionIwantToMock: () => { ... },
}
```

We can just create a new object which reflects the same properties composition of the dependency we need to mock and that's it, Typescript compiler will identify that object as the same type automagically allowing us to use it seamless .  ✨

```ts
const mockedDependency = {
  functionIneedToMock: jest.fn(),
  anotherFunctionIwantToMock: jest.fn(),
}
```

As you can notice, I've replaced the implementation with [`jest.fn()`](https://jestjs.io/docs/jest-object#jestfnimplementation) which allows us to mock that function using jest functionality.

Let's see a more concrete example:

```ts
it("Should test something", () => {
  const mockedDependency = {
    functionIneedToMock: jest.fn(),
    anotherFunctionIwantToMock: jest.fn(),
  };

   const obj = new ClassUnderTest();
   obj.methodUnderTest(mockedDependency);

   expect(mockedDependency.functionIneedToMock)
   .toHaveBeenCalledTimes(2);
})
```

In the previous example we want to be sure to have our mocked function called 2 times. Easy right?   
How about the implementation? Easy peasy!

```ts
  const mockedDependency = {
    functionIneedToMock: jest.fn(() => "hello world"),
    anotherFunctionIwantToMock: jest.fn(),
  };
  ```

>  `jest.fn(implementation)` is a shorthand for  `jest.fn().mockImplementation(implementation)`

## Mocking imported dependencies

Everything look nice when you can inject your dependencies but in the Typescript world you can avoid passing parameters and just import whatever you need and use it wherever you want more or less, how can we mock or spy on those dependencies? Let's see an example how to do it:

```ts
import { MessageService } from "../message-service";

const messageService = new MessageService();

export class Manager {

  methodWhichUseLotsOfDependencies() {
    ....
    messageService.publishMessage("hello");
    ....
  }
}
```

and then let's try to spy on our dependency using Jest:

```ts
import { MessageService } from "../message-service";

const spiedPublishMessageService = jest.spyOn(
  MessageService.prototype,
  "publishMessage"
);


it("Should publish the message", () => {

  const manager = new Manager();
  manager.methodWhichUseLotsOfDependencies();
  
  expect(spiedPublishMessageService)
  .toHaveBeenCalledWith("hello");
}
```

Simple and clean, essentially we are spying on our dependency, specifically on the `publishMessage` method and then asserting that it receives `hello` as parameter.   
Of course we can always program the mocked dependency behaviour since the `jest.spyOn` method returns a Jest mock 🏋🏻‍♂️

## What if the class contains static methods?

Often in legacy codebases we may find multiple static methods, used improperly.   
How can we handle them with Jest?   

We have a `Mapper` class with a static `mapSomethingToSomethingElse` method that we want to mock, for instance:

```ts
export class Mapper {
  static mapSomethingToSomethingElse() { ... }
  ...
}

```

our mock:

```ts
import { Mapper } from "../mappers/mapper";

jest.mock("../mappers/mapper", () => ({
  Mapper: {
    mapSomethingToSomethingElse: jest.fn()
    .mockImplementation(() => {
      return "dummyMock";
    }),
  }
});
```

And then we can perform some assertions like:

```ts
expect(Mapper.mapSomethingToSomethingElse)
.toHaveBeenCalledTimes(1);
```

## What about AWS Lambda handlers?

Testing an AWS Lambda handler is very similar to what we already done, for instance:

```ts
export async function ApiGatewayDoSomethingWithLambdaHandler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> { ... }
```

And our test will look like something similar:   
Let say we want to spy on our AuthService providing dummy dependencies

```ts
const mockedAuthService = jest.spyOn(AuthService.prototype, "checkPermissions");

it("Should test the handler", () => {
	const dummyProxyEvent: Partial<APIGatewayProxyEvent> = {
	  headers: { Authorization: "dummyToken" },
	  body: "dummyBody",
	};
	
	const dummyContext: Partial<Context> = { 
	  awsRequestId: "dummyAwsRequestId" 
	};
	
	const response = await ApiGatewayDoSomethingWithLambdaHandler(
	  dummyProxyEvent as APIGatewayProxyEvent,
	  dummyContext as Context
	);

	expect(mockedAuthService)
  .toHaveBeenCalledTimes(1);
})

```

As you can see we used the [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html) type to avoid moking every property of those objects and then passing them to our handler, asserting that one of our mock has been called correctly.

## Just the tip of the iceberg

I still need to learn more than a bunch of things around this very powerful language and I've just scratched the top of the iceberg and I'm looking forward continuing exploring this world called Typescript.   
As an Extreme Programmer I like to explore new things, I like to try new stuff and I like to solve problems and overcome challenges and jumping from one project to another keep me pushing my self outside my comfort zone trying to learn at least something new, every day.
