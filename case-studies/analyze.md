# Analyze
**Category:** Product Design — Employer: Webflow

---

## Case Study

Web analytics is complicated, but it doesn't have to be. We designed Webflow Analyze as a robust but simple, visual-first web analytics platform — one built for everyone touching a website, not just growth teams — and it's held a 97% retention rate since launch. In a category defined by churn, Analyze made web analytics cool for designers and marketers everywhere.

Analytics tools have a churn problem: complex setup, steep learning curves, and by the time it's configured, the data you needed is already gone. Google Analytics is free and ubiquitous. To compete, we couldn't just be better — we had to be fundamentally different.

I was brought on to take Analyze from zero to launch in three months, shipping it alongside Webflow's A/B testing product at their annual conference. Both were built on one foundation: Webflow had acquired Intelimize, an A/B testing tool, and recognized that the tracking and session data underneath it could power an analytics product too. My job was to build Analyze on that foundation and make it worth paying for in a market where the default is free.

Where competitors split between slim-and-approachable or dense-and-powerful, we held both. Google Analytics is built for growth marketers; Analyze had to work for everyone touching a Webflow site — designers, writers, creative directors — often on the same team. So we made Analyze opinionated: you don't configure a dashboard, we decide what covers 80% of your needs, split across a site-wide overview and focused page- and goal-level reports. Every interactive element is tracked automatically, on by default, from day one.

The IA was built around a framework my PM brought from a previous company: Glance, Scan, Investigate. Glanceable metrics tell you whether things are working; scannable layers surface patterns — a dip in a chart, a page comparison — without everything open at once; investigative depth is available in context rather than buried in a sidebar. Underneath it, every pathway maps to a test-negative / test-positive mental model: what needs attention versus what you've found and are ready to dig into.

We also pushed back on convention. Scroll maps — the standard heat map of how far people scroll — are imprecise and rarely used. We stripped it out for a single number: exact scroll depth, to the pixel. When pressure came to add the heat map back, we built a ruler instead — a clean, interactive layer over the page. That's where I first pushed into AI-assisted prototyping, building a working Chrome extension when Figma couldn't communicate the idea — one of the first inside Webflow to use that approach.

The best feedback wasn't about a specific feature. It was this: *"Webflow just tells me what I need to worry about."* In 2025, Analyze reached $2M in annual recurring revenue and now accounts for 20% of Webflow's enterprise sales — up roughly six times from the year prior.

---

## Capabilities
0-to-1 Product Design · Visual Analytics & Data Visualization · Information Architecture · Design Systems · Competitive Analysis · AI Prototyping · Cross-functional Collaboration (PM & Engineering) · Conference Launch

---

## Collaboration
- **PM** — close partnership throughout; she brought the Glance/Scan/Investigate framework that became the backbone of the IA
- **Intelimize / acquisition team** — provided the technical foundation Analyze was built on
- **Webflow engineering** — built on the shared A/B testing infrastructure
- **Internal design teams** — ruler concept emerged in part from observing another team's exploratory work

---

## Open Items
- Confirm co-launch partner product name (Optimize / A/B testing tool)
- Any named collaborators to add?

---

## Raw Notes (verbatim)

I was brought on to Webflow to launch their analytics product Analyze, which is a visual-first web analytics tool where you can see how users are engaging with your website. They make design decisions based on that information and then make those changes right here in the canvas.
This came out of an acquisition where they bought Intelimize, which was an A/B testing tool. They were able to spin that tool off into its own standalone product, but they also recognize that everything an A/B testing tool needs is the foundation for an analytics tool as well.
I was brought on to take this idea from zero to launch in three months, in time for them to launch both of these products side by side at their Webflow conference. The other challenge was that we needed to do something that would compete with Google Analytics. This is the big name in the space. It's free, it's what everyone uses, and so we needed to do something that could compete with that as well.

I'll talk to you on this later, but I think that over the last year and a half, we were able to really succeed there:

* $2 million in annual revenue in 2025
* 20% of enterprise sales consisting of Analyze, which is up from almost six times the amount it was the year before
* 97% retention rate

A lot of these paid analytics tools have high churn because teams think they're going to use it and pay for it, but because it takes so much time to learn, use, and set up, they don't end up using it. When it comes time to reevaluate budget, they get canceled.

Analyze was different in that it was focusing on simplicity. I tell you that you have a website where you want to add a new button. With Google Analytics, you had to go and put in code. You're probably going to get it wrong, then you fix it, but it's not perfect. You have to go back and fix it more, and by the time you do that, there's a lot of missing data. The data that is there tells you when you make a different design decision, which now means we need to change that entirely.

Webflow Analyze was different in that every element you put on your site that was interactive was automatically trackable and on by default. You had data across your entire site with one click.

I want to talk about how we made certain decisions to build Analyze differently:

* We focused on relentless simplicity.
* We changed the way Webflow communicated data.
* We leaned into the visual-first experience, aligning with Webflow's ethos to build out an experience that was different than other analytics tools.

We look at competitors like Google Analytics. You have things that are very dense and complicated. Hotjar is very visual-first but very noisy. Microsoft Clarity: you can build any dashboard you want, but that comes with its own problems. Crazy Egg really focuses on a lot of special features like snapshots, recordings, surveys, A/B testing, and stuff like that. Those are basically focused on a couple different variations of itself. If it wasn't free, then it was at least some version of customized dashboards and some level of density in terms of the data. We wanted to avoid all that. We wanted to have something that was opinionated and approachable, and that's because our audience is not like their audiences. Those competitors really focus on growth marketers only. These are people whose job it is to know how to use these tools.

For us, we need to deal with everyone who is handling the website:

* web designers
* content writers
* growth marketers
* creative directors

All these different people are on a team together, so when you need to design for all those different people, you really need to think about the different levels of comprehension that those users are going to have. One designer might be more familiar with data than another one. A company may use more data than another day. Even inside a high data-rich world company, the people inside that team have different levels of experience with data.

When we looked at all the competitors, we noticed that there were really two approaches:

* You slimmed down the number of data points we're sharing to make it very approachable.
* You focused on the fidelity of the data, which meant they had a very dense platform, which meant that it was a lot of work to learn how to use it.

but we knew that we needed to balance for both of these users, and so we really focused on figuring out how to make both work. Balancing simplicity with fidelity to make sure that every piece of data we shared was very useful really came down to how we communicated data.

Up to this point, Webflow had not done any data visualizations. While we spent time building out an entire database system for them, we wanted to spend time understanding the foundation of why data should be presented a certain way. With a lot of these platforms, they focus on reports. These are things you can customize because they don't know what you're going to want, and so they sort of have a one-size-fits-all approach, which is a lot of effort and a lot of the reason why these things churn.

We instead had an opinion about what data we were showing. You don't get to choose what data we're sharing, but we are going to be able to handle 80% of your needs with the data that we have here. We did that by splitting out the two views:

* A site-wide view, which is a report that's kind of covering everything that your site has at a high level.
* Things at the page or goal level. These are really focused, in-depth reports that are geared towards helping you really understand the thing that you're looking at, but in a very simple, very manageable way.

When you look at something in Google Analytics, trying to figure out the bounce rate on a feature page means filtering through a bunch of different items on a sidebar and then trying to find the page you want. That still doesn't help you really understand the full picture.
With Analyze, you simply go to that page, that new feature page, and find the bounce rate. That new bounce rate might be a little high, but you're able to quickly understand why because most of the visitors are new. This is where context and holding these things together is helpful, and we have to develop a framework for how and when we want to use some of these things.
Our product manager I worked very closely with on this brought a framework that she had from a previous company called Glance, Scan, and Investigate. This is a way to design the screen very differently based on the different jobs someone needs to do and to recognize that there are a lot of different jobs happening on one page. How do you think about doing this?
With glanceable information, it's really there to help you quickly understand if everything's working right and help you know if you need to dive into something a little deeper. There are big metrics that are placed at the top and given visual prominence, but they're very simple: they're simple numbers with a label. Information also needs to be scannable, so you might notice a dip in a chart or need to compare something to another page. Being able to think about how and when we allow you to scan things versus everything being open at all times for these different things allows us to focus in and help you understand context when an item is important. Investigating allows you to dig in. There are moments where you might want to learn a little bit more. It doesn't help to always expose all the data points, and helping you quickly get into the piece that you need to do and scale that information up is helpful.
That last part is important because it's around the task. There's another piece we run in, which is this mental model of test-negative/test-positive. That defined how and when we design things: test-negative is when you are seeing what needs attention, and test-positive is when you would have something to work on and you're digging into understanding something. We designed the pathways to make sure everything's interactive and connected, so that became really easy to quickly become task-positive and dive in.
An example of this is our audiences, specifically the ads that you might be understanding traffic coming from certain areas. We needed to be able to show a lot of different things in here. There's a lot we need to be able to show in here. We need to balance people who have low data maturity, who just need to know that LinkedIn is their biggest ad, and being able to show the highest-converting link here, all of that, while also being able to allow for those higher-data people who need to know the marketing information, the audience, and the campaign it came from. with just one click, they're able to click in and see that specifically. I spent a lot of time talking about how I've made things simpler. That might seem a little bit irrelevant, given that a lot of our jobs as designers is to make things easier to understand. I think the thing that I've noticed in all of this is that constraint isn't easy. It's very easy to follow what everyone else is doing or to get pressure from leadership to just put the feature in.
What we learned from this is that we needed to ignore the loudest feedback. When you have to appeal to everyone, the loudest people giving feedback are not your only customers. People who are being the loudest are going to be the data nerds, the ones who care about what's on a dashboard. By appealing to them, you're going to alienate a large proportion of your audience.

And a good example of that is this last part, with how we really lean into the visual-first experience. Analytics has always been a noisy, confusing experience. I think this is most clear with scroll maps. Scroll maps are basically just a heat map of how far someone scrolled on their site.
We looked at this, and we found that it was not something that worked very well. It doesn't work. It's imprecise, and people disagree about what yellow means. It takes a lot of time to get value when they ask people if they used it. They're like, "Yeah, it's there. I don't really touch it because it takes a lot of time to understand it and just really slows down."
Really, all you need to know is the numbers: how far did someone scroll? We ripped everything out and simplified this down so that we showed just these raw numbers. You can see exactly, to the pixel, how far someone scrolled down. People, specifically, wanted this experience in here, so we had to approach it like salesware. We tacked it in, plugged it into the site, and something that someone could turn on, but it felt wrong. It didn't feel right. It didn't feel fully polished in the way that we had been working on all these other decisions.
We pushed back and said, "No, let's take another swing at this." We had seen another team working on an idea that included some kind of ruler, and that kind of clicked, given that scroll maps are just measuring how far down someone scrolls on a page. We're able to design this entire experience, put all of these in here, and this ruler lets you see just how far someone scrolled down. Interact with it, and the color pops out. All of this stuff.
This is also where I started AI prototyping. This was a tool where I needed to really explore and communicate the ideas in a way that Figma wasn't giving me the tool power for. This is before cursor code, Claude Code, and cursor. I was using just AI chat to get an extension put together that I can plug into Chrome, pushing that for getting access to this tool. I was able to get cursor and actually fully develop out the idea, being one of the first prototypers inside of Webflow.
I think the numbers speak for themselves, but I think the biggest thing is that the best quote we had was that Webflow just tells me what I need to worry about: the secret weapon for success, the secret recipe for success. I think that's the best quote because we said that we didn't want people to have to analyze the data that we're giving them. I should do the analysis for you and just tell you what you need to do.

That's it, I really want this to focus on the high polish, the fidelity, and making analytics something that's approachable for everyone.
