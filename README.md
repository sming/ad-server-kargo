## HOW TO RUN THE SOLUTION
- Set up an ES6 & Node.js environment (I used https://github.com/verekia/js-stack-from-scratch)
- `yarn start` # this builds everything and starts node amongst other things
- in a different shell:
- `curl -X POST 'localhost:3000/adcreative?creative=fred&brandId=2'` # create an ad
- `curl -X GET 'localhost:3000/adcreative'` # get all ads
- `curl -X POST 'localhost:3000/adcreative/serveAd?date=2016-10-12&format=TOP_BANNER'` # serve the next 'eligible' ad

## PROBLEM DEFINITION
This is a solution to the following interview exercise [excerpt]:

...The Ad Server should be built based on a REST API, and should support the following core functionality:

- Ability to save new ad creatives in the database that can be retrieved later on.
- Ability to serve an ad creative based on request criteria (see below for more details)

Ad servers can vary in complexity and supported features. For the purposes of this exercise, the Ad Server will be very basic, but should at a minimum, be able to 
- differentiate between ads of different formats, 
- determine which ad to show based on the current date. 
...

## HIGH-LEVEL AD-SERVING DESIGN
- ONLY use the DB as a store, do not cache anything. This means we can run multiple node instances safely*. * safely-ish.
- whenever an ad is shown, ad_campaign.last_served is updated. This drives the Round Robin serving strategy.
- no queue is maintained as such. The query in Dao.getLongestSinceServedEligibleCampaign() basically consistently returns the least-recently-served campaign that's eligible at that time. This avoids keeping and maintaining a queue completely.
- there would be multiple-update issues with multiple node's running but barring incredibly heavy traffic, Round Robin order would still be maintained (IIRC microsecond granularity is an outstanding TODO for MySQL).

##TODO
- unit tests
- "Closing Question and Task"
- refactor out a lot of common DAO code e.g. insertion code for different tables is similar
- increment ad_campaign.impressions_shown
- add missing FK's
- add indexes on join columns and queried columns (in general)
- support passing data in the POST body
