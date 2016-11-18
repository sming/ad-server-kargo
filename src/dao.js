import * as mysql from 'mysql';

/**
 * Encapsulates all interactions with the data store (MySQL in this case). Standard Data Access Object stuff.
 */
export default class {
  constructor() {
    this.connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : 'kargopass',
      database : 'kargo',
      port     : 3306,
    });

    this.connection.connect();  // TODO this may fail. What should we do then?
  }

  getCreative(resolve, reject, id) {
    this.connection.query('SELECT * FROM ad where id=' + id, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  }

  /**
   * [getCreatives get all creatives]
   */
  getCreatives(resolve, reject) {
    this.connection.query('SELECT * FROM ad', (err, rows) => {  // removed ,fields
      if (err) reject(err);
      else resolve(rows);
    });
  }

  saveCreative(resolve, reject, creative, brandId) {
    this.connection.query('INSERT INTO ad SET ?', {creative, ad_brand_id: brandId}, (err, result) => {
      if (err) reject(err);
      else resolve(result.insertId);
    });
  }

  getCreativeByBrandId(resolve, reject, brandId) {
    this.connection.query('SELECT * FROM ad where ad_brand_id=' + brandId, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  }

  /**
   * [saveServeRequest persist the serve requests that come in. At the least it's an audit, and going forwards we could build 
   * event sourcing upon it.]
   */
  saveServeRequest(resolve, reject, date, format) {
    this.connection.query('INSERT INTO ad_serve_request SET ?', {request_date: date, request_format: format}, (err, result) => {
      if (err) reject(err);
      else resolve(result.insertId);
    });
  }

  /**
   * [getLongestSinceServedEligibleBrand basically get the eligible campaign that was shown the longest time ago ]
   */
  getLongestSinceServedEligibleCampaign(resolve, reject, date, format) {
    this.connection.query(
      `SELECT * FROM ad_campaign 
      WHERE allotted_impressions > impressions_shown
      AND '${date}' BETWEEN start_date AND end_date
      AND ad_format='${format}'
      ORDER BY last_served 
      LIMIT 1`, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
    });
  }

  /**
   * [setLastServedCampaign this campaign's just been served - effectively put this campaign to the back of the serving queue ]
   */
  setLastServedCampaign(resolve, reject, adCampaignId) {
    this.connection.query(`UPDATE ad_campaign 
      SET last_served = NOW()
      WHERE id = ${adCampaignId}`, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
  }

  /**
   * [setLastServed this campaign's just been served - effectively put this campaign to the back of the serving queue ]
   * TODO unused. Useful if multiple creatives match a request.
   * TODO possibly refactor with setLastServedCampaign
   */
  setLastServedCreative(resolve, reject, brandId) {
    this.connection.query(`UPDATE ad
      SET last_served = NOW()
      WHERE ad_brand_id = ${brandId}`, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
  }

  /**
   * [getEligibleBrands Unused but may come in handy]
   */
  getEligibleBrands(resolve, reject, date, format) {
    this.connection.query(`SELECT * FROM ad_campaign 
      WHERE allotted_impressions > impressions_shown
      AND '${date}'' BETWEEN start_date AND end_date
      AND ad_format='${format}'`, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
  }

  disconnect() {
    this.connection.end();
  }
}
