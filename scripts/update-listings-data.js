require('dotenv').config();

const flexIntegrationSdk = require('sharetribe-flex-integration-sdk');


// This is staging key
const integrationSdk = flexIntegrationSdk.createInstance({
  // staging
  //clientId: '1a9d652d-f2a6-47d2-89ee-280db250963e',
  //clientSecret: '601ebb5e2ae35d2d1c79df03d547496a30f50181'
  // production
  clientId: 'fc41acbd-ac66-4fb1-98ee-be97b3aaae53',
  clientSecret: 'e3e327f5b4b617d410b664be02e6b651f6847328'

});


let listings = [];
const currency = 'usd'

integrationSdk.listings
.query({page: 2})
.then(res => {
  res.data.data.forEach(
    listing => {
      listings.push(listing);
    }
  )
  let index = 1;
  listings.forEach(
    currentListing => {
        sleep(500);
        return integrationSdk.listings.update(
            {
              id: currentListing.id.uuid,
              publicData: { currency: currency },
            },
            {
              expand: true,
              include: ["images"]
            }).then(res => {
              console.log('This is res from listing ===>', res.data.data)
              console.log(index);
              index = index + 1;
            });
            
    })
})
  
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}