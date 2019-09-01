---
layout: post
title: "Incident Management 101"
date: 2019-09-01 8:00:00
categories: [Programming, Security]
cover: "/assets/images/covers/error.jpg"
lang: en
---

What's an incident? What to do in case of an incident? How to be a great incident commander? Are you a good incident responder? This is what I discover during my Incident Management workshop in @ThoughtWorks this week, let's take a look!

## What is an incident?

Universally, we can say that an incident is an occurrence that requires action or support by an _emergency squad_ to prevent or minimize loss of life or damage to property and/or natural resources.

In the IT field, we can say that is an unplanned interruption or reduction of the quality of an IT service.

But what an incident is at the end of the day is nothing more than the cost, what is comported to have that incident.

## Roles and responsibilities

In general, we can have 3 roles during an incident:

* Incident Commander: It's an authoritative role, responsible for leading the efforts to mitigate the incident.
* Communication Manager: It's a secondary role, often merged with the IC; responsible for handling communications with stakeholder and executives.
* Incident Responder: It's a member of the technical staff with clearly defined responsibilities over a specific service or groups of services, during an incident.

![staff](https://media.giphy.com/media/UePr0sPcSGPIY/giphy.gif)

## First 5 minutes

You, the Incident Commander have been waking up during the night for an incident, what to do then?

1. Gain situational awareness
2. Acknowledge the situation with your stakeholders.
3. Establish the communication channels for the response team
4. Gather the response team
5. Evaluate the situation

## Incident Severity

Every incident has severity and depends on that you should act differently, use incident levels as guidance and use your judgment when assessing the severity. When you are unsure, just select a higher incident level and downgrade it later, just be explicit when you do that.

## How to be a great IC

O captain! My captain!   
Now you are in charge of leading the team to solve the incident as fast as possible, what should you do to be a great incident commander?

> Stay calm: take your time to think and use your judgement.

![panic](https://media2.giphy.com/media/z9AUvhAEiXOqA/source.gif)

* Focus: leading **the incident is your only priority**, drop the rest.
* Create the right environment: shut-down the blame talk, funnel all communications to the outside world, remember **it's not about blaming people, it's about solving the problem.**
* Lead and command: be direct and assertive. Use your great team. You make the decisions but it's not necessary to have all the technical knowledge to be an IC, you just need to gather all the data to make decisions consciously.
* Prioritize recovery: work towards recovering service. Always prioritize recovering than the correctness of the solution.
* Document the incident: keep track of who did what and when, and what was the outcome. As IC you should document business and the technical impact of the incident.
* Run a tight shop: rely on experts but beware of heroes and lone-wolf.
* Don't make assumptions: ask questions and gather data to confirm the hypothesis. _Try to be impartial as possible._
* Communicate with the stakeholders even if there aren't updates.

## After the incident

* Inform stakeholders: it's important to specify if you fixed the incident or if the incident has been mitigated.
* Follow-up the next day: permanent fixes might be needed, make sure to loop in the necessary team.
* Write-up the incident report: Remove the names and the report should include business and technical details.
* Send out an impact analysis document.
* Run the incident review.
* Prioritize Action Items: be reasonable, don't put too much AI on the backlog, prioritize them with your BA.

![safe](https://media.giphy.com/media/QhmboW0R7eUbm/giphy.gif)

## Post-incident reviews

The post-incident document is a good occasion for the onboarding process because it explains what happened, why and how you handled that to solve the problem, it's a learning opportunity for the people of the organization.

### Analysis

It's time to write our analysis but what do we need to put inside of it?
* People involved (roles and duties).
* Impact analysis.
* Qualitative impact.
* Team impact.
* Incident trigger.
* Incident and recovery timeline, use the logs you wrote to help you to write a better timeline.

### Learnings

An incident is a good occasion to learn new things, try to think about: 

* What went well.
* What went not-so-well.
* Whose we got lucky.

Like a retrospective.

### Action Items

It's a table where to document all of the AI that you have done to mitigate the problem with a relative ticket with an owner, the type and a priority.

## Final Thoughts

Well done the incident is solved, we learned from it, our stakeholders have been informed and the team now deserve a big glass of beer to celebrate this victory but remember: we won the battle, not the war.

![welldone](https://media.giphy.com/media/l0MYCn3DDRBBqk6nS/giphy.gif)
