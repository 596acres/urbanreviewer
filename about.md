---
layout: default
title: About
published: true
---


# About

**Reviewing Past Urban Plans > Discovering Present Impact > Supporting Future Actions**

The City of New York has adopted over 150 master plans for our neighborhoods. You can see which areas have been affected and what those grand plans were on this site.  

Neighborhood master plans - often called “urban renewal plans” - were adopted to get federal funding for acquiring land, relocating the people living there, demolishing the structures and making way for new public and private development. Plan adoptions started in 1949 and many plans remain active today. Development in the plan areas sometimes happened, like Lincoln Center, and sometimes didn't, like many still-vacant lots in East New York and Bushwick. Areas were selected for renewal because they were considered blighted or obsolete. The "blight" designation always came from outside the communities that got that label - from inspectors working for the mayor’s Committee on Slum Clearance in the early period and Housing Preservation and Development (HPD) employees in the later period. 

These plans are not ancient history - the latest one was created in 2017 for [Downtown Far Rockaway](https://596acres.github.io/urbanreviewer/#map=17/40.6064/-73.7527&plan=Downtown+Far+Rockaway).

"The recent exhibition “Reviewing Renewal” (organized by the advocacy group 596 Acres at the Queens Museum) and the accompanying website urbanreviewer.org make one thing quite clear: In New York City, urban renewal is not a distant, pre–Jane Jacobs reality, but a current planning and development tool. Urban renewal areas are still being created to encourage investment and cohesive development, but—counter to the evil narrative—their goals can be changed over the course of their active life, which is set by New York City law as forty years... We need to see, and judge, history as if it were contemporary. After all, we don’t have a choice: The buildings exist and we need them. With very few exceptions, postwar low- or moderate-income housing developments in New York have not been demolished." 
-- Susanne Schindler, [A Belated Reveiw of Melrose D-1](http://averyreview.com/issues/7/melrose-d-1), The Avery Review 7 (April 2015).
## This Site

In 2014, 596 Acres teamed up with Partner & Partners and SmartSign to produce a comprehensive online map showing all the adopted neighborhood master plans for New York City. After being granted access to the plan documents due to a [Freedom of Information Law request](media/596URPFOILletter_take2.pdf), our team performed a meticulous translation into machine-readable spreadsheets to make this map. In 2017, the City Council passed a bill requiring HPD to make urban renewal data available to the public. See [City Council Approves Bill to Increase Transparency For Urban Renewal Areas](https://www.thelodownny.com/leslog/2017/12/city-council-approves-bill-to-increase-transparency-for-urban-renewal-areas.html), The Low-Down, Ed Litvak, 12/12/2017. The bill became [law](https://nyc.legistar1.com/nyc/attachments/f6a21032-ecd2-4197-ba05-f415caa39ecf.pdf) in January 2018 and HPD posted its [Urban Renewal database](https://www.nyc.gov/site/hpd/services-and-information/urban-renewal.page) in January 2020; as of January 2024, that database does not include specific property information, but HPD has complied with the law by posting urban renewal area boundaries and plan documents that we had to inspect in person in 2014. 
 
The plans were written with a great city in mind. Huge swaths were designated for demolition, to be paid for with federal dollars. Lots that were designated this way to justify the funding for demolition had to be included in a plan that stated what they "should" be - designations like "housing," "industrial," and "open space."

![Slum Clearance Housing Proposal](img/slum_clearance.jpg)
*Image manipulated by Andrew Tucker.*

## Methodology

These plans have existed in paper form in HPD's offices, but were inaccessible to the public until 2022 when HPD added the documents to their Urban Renewal database. 

Our request for access to the agency records was granted in 2012 and we opted for the right to inspect these records instead of having the agency make copies for us at 25 cents per page. Our team of trained volunteer records inspectors examined each plan and listed all the lots that were included in it, including the dispositions that were promised where those were available. These volunteers spent over 100 hours inspecting the records. A few plans were completely missing from the stacks that HPD provided, so our research team looked for them in community archives and on the internet.

![Stack of plan records](img/paper.jpg)

*Photo by Paula Z. Segal.*

Every property in the city has a specific number assigned to it - a borough, block and lot number (BBL). The BBLs created using the above process were mappable (using [MapPLUTO](http://www.nyc.gov/html/dcp/html/bytes/dwn_pluto_mappluto.shtml#mappluto)) only where they did not change since the plan was adopted. Many plans or other developments changed these numbers, for example, when a number of small lots were merged to become a larger lot.

In order to map those places where the BBL changed, we used the City's [Library of Tax Maps](http://gis.nyc.gov/taxmap/library.htm) to find historic maps of the blocks in question and determine which lots they had become. Where we were unable to find a lot in the Library of Tax Maps, we consulted the most recently-published compendia of urban renewal maps - an [atlas from 1984](http://www.worldcat.org/title/atlas-of-urban-renewal-project-areas-in-the-city-of-new-york/oclc/10819767&referer=brief_results) and a [progress report from 1968](http://www.worldcat.org/title/community-development-program-progress-report/oclc/10551321&referer=brief_results). By looking at the outlines of the impacted areas in those books we were able to identify which modern lots were actually the ones impacted by the plans. This process let us capture every lot that was designated for "renewal."

Where we could, we also captured what form that renewal was meant to take in the form of "dispositions," or planned uses for the land. Our map lets you search for lots that were designated for “open space,” “residential” or “commercial” uses, among others. Only some plans were this detailed, so not every lot has a specific designation. For example, some plans listed potential uses for the plan as a whole but did not assign specific uses on a lot-by-lot basis. In other plans, lot dispositions were not legible on the paper maps provided. Searches with our tool do not include lots such as these that lack specific designations. However, some lots were intentionally assigned multiple uses such as "residential and commercial," and these lots will appear in search results for both "residential" and "commercial" dispositions.

The data on this map is hosted on [CartoDB](http://cartodb.com/), and we're
grateful for the space they provided for this project. If you would like to find
data for a specific borough or plan, you can find the data on
[GitHub](https://github.com/596acres/urbanreviewer/tree/gh-pages/data/geojson/us/ny/nyc/).

## Outcomes

One of the reasons we are excited to be making the plans accessible is that they include places that were cleared with the intention of creating open public spaces. In our work through [596 Acres](http://596acres.org/), we have already found two and helped neighbors transform them into something better: 

![Keap Fourth Community Garden](img/keap_fourth.jpg)

*Sign designed by Partner & Partners. Photo by Paula Z. Segal.*
 
- The Keap Fourth Community Garden in South Williamsburg was a vacant lot two years ago that we noticed was part of an Urban Renewal Plan and designated to be Open Space. The 596 Acres team put signs on it and helped folks get together and they got no resistance from the relevant agencies. It has been transferred to Parks and there was a formal ribbon cutting on June 4, 2014, more than 20 years after the lot was planned as Open Space.

- The Edgemere Urban Renewal Plan (Queens) contains dozens of lots planned as Open Space. Last year, we put signs on the set of the lots that was designated as the Edgemere Urban Renewal Park in the plans. Today, neighbors who saw these signs are running the [Edgemere Farm](http://596acres.org/en/lot/4158370033/).

## Our Team

**Eric Brelsford**, [596 Acres](http://596acres.org/), is a computer programmer and mapmaker. He worked on most of the processing that went into the data behind this site, from cleaning the data to turning the data about each parcel into something that could be put on a map to putting the data on this map. Eric tries not to miss an opportunity to make a map that helps us understand the space around us, particularly in New York. Mapping urban renewal has been a unique opportunity to link the history of this space with the present and future of it, whether through 596 Acres or other community-driven efforts.

**Blair Brewster** is the founder and CEO of [SmartSign](http://www.smartsign.com/), a company with deep roots in Brooklyn. Blair has seen firsthand both the upside and the devastating downside to urban renewal projects. His first business - in North Adams, MA - was adjacent to a swath of commercial building blocks that were knocked down in the name of urban renewal; 40 years later, they remain largely empty. On the other hand, near his longtime home in Brooklyn Heights, the community was able to combine land held by a combination of city agencies, building a garden, playground, basketball court and Brooklyn's first community dog run. Disconnected and unloved shards of land can become invaluable community resources. Blair proudly supports 596 Acres's efforts to spread information with the power to change our cities.

**Charles Chawalko** performed digital cartography and data corrections in the production and visualization of the map. His interest in the project came from his own thesis work and struggle concerning the potential privatization of his Mitchell-Lama cooperative that was born out of the Brooklyn Bridge Southwest Urban Renewal Plan. It is with hope in unveiling these hidden histories associated with urban renewal plans that we can secure spaces while creating new futures for them.

**Matt Delsesto** has been working on this data liberation mission since the summer of 2013 when he first encountered the overwhelming stack of urban renewal plans on the 6th floor of Housing Preservation and Development offices.  He became excited when he recognized streets on pieces of paper in the windowless room, and learned that if we think our neighborhoods are missing pieces, it's because they probably are.

**DW Gibson** is the author of _Not Working: People Talk About Losing a Job and Finding Their Way in Today’s Changing Economy_. His work has appeared in such publications as _The New York Times_, _The Washington Post_, _The Daily Beast_, _The Village Voice_, and _The Caravan_. He has been a contributor to NPR’s _All Things Considered_ and is the director of the documentary, _Not Working_. His forthcoming book _The Edge Becomes the Center_, an an oral history of gentrification in New York City due out in May 2015 from Overlook Press, features voices from the 596 Acres network. www.dwgibson.net

**Jonathan Lapalme**, [596 Acres](596acres.org)

**Mariana Mogilevich** is an urban and architectural historian and native New Yorker. She writes about the design and politics of the built environment in general and on public space and open space in New York in particular, and has taught urban studies and architectural history at Harvard and New York University. 

**Greg Mihalko**, [Partner & Partners](http://partnerandpartners.com/), is the designer on the project, working on graphic and interaction design for the website and identity. He’s excited to visualize how the city has been planned, built and shaped into what it is today.

**Zach Mihalko**, [Partner & Partners](http://partnerandpartners.com/).

**Paula Z. Segal**, [596 Acres](http://596acres.org/), is the founding director of 596 Acres. For many years, she lived in a neighborhood full of holes in North Brooklyn. Now, she’s doing something about it. 

**Merran Swartwood** joined the project in November 2013 as a data-gathering robot and became part of the website team, to which she contributed much discussion and some copywriting. She misses the weekly security checks at the Department of Housing Preservation and Development and the monthly pies at 596 Acres.

& a team of **volunteer plan inspectors**: Mary Bereschka, Charles Chawalko, Matt DelSesto, Suzan Frazier, Anandi Gandhi, Sophie Maguire, Alexander Roesch, Paula Z. Segal, Zaina Shahnawaz and Merran Swartwood.
