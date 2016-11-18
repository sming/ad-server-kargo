/* eslint  class-methods-use-this: "off" */
import Dao from './dao';

/**
 * ad-server encapsulates the SERVING LOGIC of the ad-server.
 * It could be generalised and/or specialised if we wanted to implement a different serving strategy.
 */
export default class {
  /**
   * [serveAd finds a brand with a campaign that has an appropriate ad that can be shown. 
   * Then updates that campaign's 'last_served' to put it to the back of the serving queue.
   * TODO return the Ad Creative that was served, not the campaign.]
   */
  serveAd(resolve, reject, date, format, res) {
    console.log('Serving a ' + format + ' for date ' + date);

    const p = new Promise((r, rej) => {
      new Dao().getLongestSinceServedEligibleCampaign(r, rej, date, format);
    });

    p.then((campaigns) => { 
      if (!campaigns || !campaigns.length) {
        resolve('no eligible campaigns found');
      } else {
        console.log('Got ' + campaigns[0] + ' as next campaigns to serve');
        this.setLastServedCampaign(resolve, reject, campaigns[0]);
      }
    }).catch((err) => { 
      console.log('rejected:', err); 
      throw err; 
    });
  }

  /**
   * [setLastServed put this campaign to the back of the serving queue, basically. 
   * It sets the HTTP response, which it shouldn't: that should be done elsewhere. TODO.]
   * @param {[type]} campaign [description]
   */
  setLastServedCampaign(resolve, reject, campaign) {
    const dao = new Dao();
    const p = new Promise((res, rej) => {
      dao.setLastServedCampaign(res, rej, campaign.id);
    });

    p.then((res) => { 
      console.log('Updated last served (' + res + '), now getting creative for campaign ' + campaign.id);
      // OK so we updated the campaign. Now return matching ad creative.
      this.getAdCreative(resolve, reject, campaign);
    }).catch((err) => { 
      console.log('rejected:', err); 
      throw err; 
    });
  }
  
  /**
   * [getAdCreative populate the HTTP response with matching creative for the campaign]
   */
  getAdCreative(resolve, reject, campaign) {
    console.log('Getting creative for campaign ' + campaign);

    const dao = new Dao();
    const p = new Promise((res, rej) => {
      dao.getCreativeByBrandId(res, rej, campaign.ad_brand_id);
    });

    p.then((res) => { 
      resolve(res);
    }).catch((err) => { 
      console.log('rejected:', err); 
      reject(err);
    });
  }
}
