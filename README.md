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
- refactor out a lot of common DAO code
- increment ad_campaign.impressions_shown
