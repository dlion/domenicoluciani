---
layout: post
title: "Migrate a shared database with the expand/contract pattern"
date: 2020-01-01 08:00:00
categories: [Programming]
cover: "/assets/images/covers/expand_contract.png"
lang: en
---

Migrating a database is one of the most sensitive things that can happen to do at some point in our career, sometimes it is easy, sometimes it is not. Let's see how to use the expand/contract pattern to be able to do it in both cases ~

The key to evolving databases design is evolving schemas alongside the code, we should manage changes to database structure the same way we manage the source code: tested, versioned and incremental.
It allows managing changes to the schema and the code incrementally, by handling each as parts of a whole.

# Shared database

Let's say we have 3 applications that share the same relational database

![shared db](/assets/images/posts/shared-application.png)

If one of the applications need to evolve via schema change it could potentially break the other two applications.
To handle this situation we can use the expand/contract pattern adding a transition phase into the refactoring.

![transiction_phase](/assets/images/posts/expand_contract.png)

Using this pattern you can maintain both states during the refactoring allowing backward compatibility.

Let's see a small real example:

We have a `Product` table with `IdCode` column, the `IdCode` is an identification number formed by 2 things: and `internal code` and an `external code`. Our mission is to split the `IdCode` column and have the new columns to allow us to filter by `InternalCode` without breaking anything, we have different options:

![flow](/assets/images/posts/flow.png)

## No integration points and no legacy data

We don't have pre-existent data and we don't have external systems who use this table so the refactoring is pretty straightforward, we can just add both columns `InternalCode`, `ExternalCode` and drop the old `IdCode`.

## No integration points but legacy data

We have pre-existent data to migrate to new columns but we don't have external systems. We need to create a function to extract the information from the existing column to migrate the data to the new one, for example `extractInternalCodeFrom(IdCode)`.

## Integration points and legacy data

We have pre-existent data and external systems which are using our table so we need to combine the previous techniques to solve this problem combining them with a new one.   
Of course, we need to extract `InternalCode` and `ExternalCode` from the old `IdCode` column then we have to create a trigger that during the CREATE/UPDATE operations on our `Product` table does these steps:

If the new column `IdCode` is empty we can concatenate the `InternalCode` and the `ExternalCode` values that we extracted using the previous functions in order to fill the new `IdCode` column with the old notation and then if the new `IdCode` column is filled we can extract the new values from it.
It allows the old systems to find the same data and the new systems to have the new version of the data.   
Once all the systems are aligned we can drop the column or just set it as UNUSED if the deleting process is time-consuming.

## More

I discover this pattern reading the book [Building Evolutionary Architectures](https://www.oreilly.com/library/view/building-evolutionary-architectures/9781491986356/), that I heavily recommend.

The Expand/Contract technique is a subset of a pattern called `parallel change` that we can find in [Martin Fowler's blog](https://martinfowler.com/bliki/ParallelChange.html).
