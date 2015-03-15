var fs = require('fs');
var csv =require('csv');

var data = fs.readFileSync('elfpavlik.csv').toString();


csv.parse(data, {columns: true}, function(err, obj) {
  var o = obj[0];
  // TODO o["user_email"]
  var profile = {
    id: 'https://profiles.okfn.org/' + o["user_login"],
    type: "Person",
    name: o["Name"],
    description: o["Description/ About me"],
    address: { name: o["Location"] },
    website: o["Website"],
    sameAs: [
      {
        name: "Twitter",
        id: "https://twitter.com/" + o["Twitter"].replace('@', '')
      },
      {
        name: "Github",
        id: "https://github.com/" + o["Github Account Name"]
      }
    ],
    memberOf: [
      {
        id: "http://okfn.org",
        name: "Open Knowledge",
        image: "https://d22739b8qd5enr.cloudfront.net/assets/img/okf-logo-header-2x.png?b459a280a50a"
      }
    ]
  };

  console.log(JSON.stringify(profile));
});


