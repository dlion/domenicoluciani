---
layout: post
title: The Physics of Software Development
description: As a software engineer let's use a tool to discuss with business and get out from there like a boss would do.
tags:
  - work
published: true
cover: /assets/images/covers/you-are-doing-your-team-retrospective-wrong.jpg
---


As a software engineer, negotiating with the business can be tricky and sometimes stressful, especially without the right tools. So, today, I’d like to discuss a specific tool that helped me escape endless business meetings, and yet almost never gets mentioned in them.

## The Physics of Software Development

Lots of business people don't even know that behind a software project, there are actual physical laws that need to be respected to avoid ending up in situations far from reality, introducing wrong expectations, and catastrophic results.

### The Software Project Triangle


![software-project-triangle]({{ '/assets/images/posts/software_project_triangle.png' | relative_url }})


There is a very simple rule for interpreting this triangle:

> **Important**
> If one of these components changes, at least one of the others needs to change.
{: .callout .warn}

## People decrease

If, for whatever reason, **the number of people working on a project decreases**, **the scope needs to be reduced and/or the timeline increased**.


![less-people-more-scope-and-timeline]({{ '/assets/images/posts/less_people_more_scope_more_timeline.png' | relative_url }})


Some people may push the team to work extra hours, until they realize that **a tired developer is likely to introduce more bugs than a fresh one**, and I don't even want to talk about burning those people out and **eventually end up with fewer people than when you started**.

## Scope increases

Too often I see businesses wanting to increase the scope in the middle of the project because "our priorities changed", not respecting the physics of software development.

I'm sorry, Mr. Businessman, but if you **increase the scope,** then **the timeline and/or the number of people must also increase** to keep things working fine.


![more-people-more-scope-and-timeline]({{ '/assets/images/posts/more_people_timeline_scope.png' | relative_url }})

## Timeline decrease

If the **timeline deadline is moved closer**, then **the scope needs to be decreased**.
What we often see in this situation is that people will work more hours, increasing the "people" variable.

![less_timeline_less_scope_more_people]({{ '/assets/images/posts/less_timeline_less_scope_more_people.png' | relative_url }})

But be careful with that, because the [adding people](/2025/11/14/software-project-physics.html#adding-people) parenthesis is still valid, **making people work more hours can introduce bugs and make them less efficient and productive**.

### Adding people

I want to add a side note on the "adding more people" concept since this is not very clear for many. When we add a new person to an ongoing project, **that person needs to be onboarded**, and **it requires time**, time that will reduce the original planned timeline, time that hasn't been taken into consideration at the beginning of the project.

True, some projects can have tasks that can be parallelized or require very little onboarding, and in those cases it can definitely improve the timeline, but this always involves hard tradeoffs in onboarding time.

So no, doubling the number of engineers **won't** cut the time to completion in half, but if they have domain knowledge and the work can be split up enough, then it can reduce the timeline if done carefully.

---

So next time the business wants to change any of these variables without adjusting the others, remembering this principle will help you avoid paying the price in delays, bugs, frustration, or burnout.
