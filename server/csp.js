const helmet = require('helmet');

const dev = process.env.REACT_APP_ENV === 'development';
const self = "'self'";
const unsafeInline = "'unsafe-inline'";
const unsafeEval = "'unsafe-eval'";
const data = 'data:';
const blob = 'blob:';
const devImagesMaybe = dev ? ['*.localhost:8000'] : [];
const baseUrl = process.env.REACT_APP_SHARETRIBE_SDK_BASE_URL || 'https://flex-api.sharetribe.com';

// Hello google and CSP :)
const knownGoogleDomains = [
  "*.google.com", "*.google.ac", "*.google.ad", "*.google.ae", "*.google.com.af",
  "*.google.com.ag", "*.google.com.ai", "*.google.al", "*.google.am", "*.google.co.ao",
  "*.google.com.ar", "*.google.as", "*.google.at", "*.google.com.au", "*.google.az",
  "*.google.ba", "*.google.com.bd", "*.google.be", "*.google.bf", "*.google.bg",
  "*.google.com.bh", "*.google.bi", "*.google.bj", "*.google.com.bn", "*.google.com.bo",
  "*.google.com.br", "*.google.bs", "*.google.bt", "*.google.co.bw", "*.google.by",
  "*.google.com.bz", "*.google.ca", "*.google.com.kh", "*.google.cc", "*.google.cd",
  "*.google.cf", "*.google.cat", "*.google.cg", "*.google.ch", "*.google.ci",
  "*.google.co.ck", "*.google.cl", "*.google.cm", "*.google.cn", "*.google.com.co",
  "*.google.co.cr", "*.google.com.cu", "*.google.cv", "*.google.com.cy", "*.google.cz",
  "*.google.de", "*.google.dj", "*.google.dk", "*.google.dm", "*.google.com.do",
  "*.google.dz", "*.google.com.ec", "*.google.ee", "*.google.com.eg", "*.google.es",
  "*.google.com.et", "*.google.fi", "*.google.com.fj", "*.google.fm", "*.google.fr",
  "*.google.ga", "*.google.ge", "*.google.gf", "*.google.gg", "*.google.com.gh",
  "*.google.com.gi", "*.google.gl", "*.google.gm", "*.google.gp", "*.google.gr",
  "*.google.com.gt", "*.google.gy", "*.google.com.hk", "*.google.hn", "*.google.hr",
  "*.google.ht", "*.google.hu", "*.google.co.id", "*.google.iq", "*.google.ie",
  "*.google.co.il", "*.google.im", "*.google.co.in", "*.google.io", "*.google.is",
  "*.google.it", "*.google.je", "*.google.com.jm", "*.google.jo", "*.google.co.jp",
  "*.google.co.ke", "*.google.ki", "*.google.kg", "*.google.co.kr", "*.google.com.kw",
  "*.google.kz", "*.google.la", "*.google.com.lb", "*.google.com.lc", "*.google.li",
  "*.google.lk", "*.google.co.ls", "*.google.lt", "*.google.lu", "*.google.lv",
  "*.google.com.ly", "*.google.co.ma", "*.google.md", "*.google.me", "*.google.mg",
  "*.google.mk", "*.google.ml", "*.google.com.mm", "*.google.mn", "*.google.ms",
  "*.google.com.mt", "*.google.mu", "*.google.mv", "*.google.mw", "*.google.com.mx",
  "*.google.com.my", "*.google.co.mz", "*.google.com.na", "*.google.ne", "*.google.com.nf",
  "*.google.com.ng", "*.google.com.ni", "*.google.nl", "*.google.no", "*.google.com.np",
  "*.google.nr", "*.google.nu", "*.google.co.nz", "*.google.com.om", "*.google.com.pk",
  "*.google.com.pa", "*.google.com.pe", "*.google.com.ph", "*.google.pl", "*.google.com.pg",
  "*.google.pn", "*.google.co.pn", "*.google.com.pr", "*.google.ps", "*.google.pt",
  "*.google.com.py", "*.google.com.qa", "*.google.ro", "*.google.rs", "*.google.ru",
  "*.google.rw", "*.google.com.sa", "*.google.com.sb", "*.google.sc", "*.google.se",
  "*.google.com.sg", "*.google.sh", "*.google.si", "*.google.sk", "*.google.com.sl",
  "*.google.sn", "*.google.sm", "*.google.so", "*.google.st", "*.google.sr",
  "*.google.com.sv", "*.google.td", "*.google.tg", "*.google.co.th", "*.google.com.tj",
  "*.google.tk", "*.google.tl", "*.google.tm", "*.google.to", "*.google.tn",
  "*.google.com.tr", "*.google.tt", "*.google.com.tw", "*.google.co.tz", "*.google.com.ua",
  "*.google.co.ug", "*.google.co.uk", "*.google.com", "*.google.com.uy", "*.google.co.uz",
  "*.google.com.vc", "*.google.co.ve", "*.google.vg", "*.google.co.vi", "*.google.com.vn",
  "*.google.vu", "*.google.ws", "*.google.co.za", "*.google.co.zm", "*.google.co.zw",
  "*.googlemember.com", "*.googlemembers.com", "*.com.google", "*.igoogle.com",
  "*.googleanalytics.com", "*.google-analytics.com", "*.googlecode.com", "*.googlesource.com",
  "*.googledrive.com", "*.googlearth.com", "*.googleearth.com", "*.googlemaps.com",
  "*.googlepagecreator.com", "*.googlescholar.com", "*.googlemail.com", "*.google.org",
  "*.google.net", "*.ggoogle.com", "*.googlee.com", "*.googleadservices.com",
  "*.googleapps.com", "*.googleapis.com", "*.googlebot.com", "*.googlecommerce.com",
  "*.googlesyndication.com", "*.withgoogle.com"
];

// Default CSP whitelist.
//
// NOTE: Do not change these in the customizations, make custom
// additions within the exported function in the bottom of this file.
const defaultDirectives = {
  baseUri: [self],
  defaultSrc: [self],
  childSrc: [blob],
  connectSrc: [
    self,
    baseUrl,
    'maps.googleapis.com',
    '*.tiles.mapbox.com',
    'api.mapbox.com',
    'events.mapbox.com',

    // Google Analytics
    'www.google-analytics.com',
    'stats.g.doubleclick.net',

    'sentry.io',
    '*.stripe.com',
  ],
  fontSrc: [self, data, 'assets-sharetribecom.sharetribe.com', 'fonts.gstatic.com'],
  frameSrc: [self, '*.stripe.com'],
  imgSrc: [
    self,
    data,
    blob,
    ...devImagesMaybe,
    '*.imgix.net',
    'sharetribe.imgix.net', // Safari 9.1 didn't recognize asterisk rule.

    // Styleguide placeholder images
    'lorempixel.com',
    'via.placeholder.com',

    'api.mapbox.com',
    'maps.googleapis.com',
    '*.gstatic.com',
    '*.googleapis.com',
    '*.ggpht.com',

    // Google Analytics
    'www.google.com',
    'www.google-analytics.com',
    'stats.g.doubleclick.net',

    '*.stripe.com',
  ],
  scriptSrc: [
    self,
    unsafeInline,
    unsafeEval,
    data,
    'maps.googleapis.com',
    'api.mapbox.com',
    '*.google-analytics.com',
    'js.stripe.com',
  ],
  styleSrc: [self, unsafeInline, 'fonts.googleapis.com', 'api.mapbox.com'],
};

/**
 * Middleware for creating a Content Security Policy
 *
 * @param {String} reportUri URL where the browser will POST the
 * policy violation reports
 *
 * @param {Boolean} enforceSsl When SSL is enforced, all mixed content
 * is blocked/reported by the policy
 *
 * @param {Boolean} reportOnly In the report mode, requests are only
 * reported to the report URL instead of blocked
 */
module.exports = (reportUri, enforceSsl, reportOnly) => {
  // ================ START CUSTOM CSP URLs ================ //

  // Add custom CSP whitelisted URLs here. See commented example
  // below. For format specs and examples, see:
  // https://content-security-policy.com/

  // Example: extend default img directive with custom domain
  // const { imgSrc = [self] } = defaultDirectives;
  // const exampleImgSrc = imgSrc.concat('my-custom-domain.example.com');

  const customDirectives = {
    // Example: Add custom directive override
    // imgSrc: exampleImgSrc,
    connectSrc: defaultDirectives.connectSrc.concat([
      '*.facebook.com',
      '*.googletagmanager.com',
    ]),
    frameSrc: defaultDirectives.frameSrc.concat([
      '*.doubleclick.net',
      '*.googletagmanager.com',
      '*.facebook.com',
    ]),
    imgSrc: defaultDirectives.imgSrc.concat([
      '*.facebook.com',
      '*.googletagmanager.com',
      '*.doubleclick.net',
    ]).concat(knownGoogleDomains),
    scriptSrc: defaultDirectives.scriptSrc.concat([
      '*.googletagmanager.com',
      '*.facebook.net',
      '*.facebook.com',
      '*.doubleclick.net',
    ]).concat(knownGoogleDomains),
  };

  // ================ END CUSTOM CSP URLs ================ //

  const directives = Object.assign(
    {
      reportUri,
      blockAllMixedContent: enforceSsl,
    },
    defaultDirectives,
    customDirectives
  );

  // See: https://helmetjs.github.io/docs/csp/
  return helmet.contentSecurityPolicy({
    directives,
    reportOnly,
  });
};
