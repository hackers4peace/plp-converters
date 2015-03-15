var fs = require('fs');
var path = require('path');

var directoryDataInputDir = "directory-data/"
var directoryDataOutputDir = "directory-data-output/"
var providerDataOutputDir = "provider-data-output/"

fs.readdir(directoryDataInputDir, function(err, files) {
  if (err) {
    throw err;
  }

  files.forEach(function(file) {
    console.log("%s (%s)", file, path.extname(file));

    var data = fs.readFileSync(directoryDataInputDir + file).toString();
    var profileJson = JSON.parse(data);

    if (!profileJson) {
      throw err;
    }

    var convertedProfile;

    convertedProfile = {
      id: 'http://profiles.open-steps.org/directory/' + file,
      type: 'Listing',
      about: {
        id: profileJson['about']['@id'],
        type: profileJson['about']['@type']
      }
    }

    if (profileJson['about']['name']){
      convertedProfile['about']['name'] = profileJson['about']['name'];
    }

    if (profileJson['about']['description']){
      convertedProfile['about']['description'] = profileJson['about']['description'];
    }

    if (profileJson['about']['image']){
      convertedProfile['about']['image'] = profileJson['about']['image'];
    }

    if (profileJson['about']['address'][0]){
      convertedProfile['about']['address'] = {
        streetAddress: undefined,
        postalCode: undefined,
        addressLocality: profileJson['about']['address'][0]['city'],
        addressCountry: profileJson['about']['address'][0]['country']
      }
    }

    if (profileJson['about']['contactPoint']){
      convertedProfile['about']['sameAs'] = [];
      for (index in profileJson['about']['contactPoint']){
        var contactPoint = profileJson['about']['contactPoint'][index];
        convertedProfile['about']['sameAs'].push({'name':contactPoint['type'],'url':contactPoint['id']});
      }
    }

    if (profileJson['about']['interest']){
      convertedProfile['about']['interest'] = [];
      for (index in profileJson['about']['interest']){
        var interest = profileJson['about']['interest'][index];
        convertedProfile['about']['interest'].push({'name':interest['name']});
      }
    }

    if (profileJson['about']['@type'] == "Person"){

      if (profileJson['about']['website']){
        convertedProfile['about']['url'] = profileJson['about']['website'];
      }

      if (profileJson['about']['birthDate']){
        convertedProfile['about']['birthDate'] = profileJson['about']['birthDate'];
      }

      if (profileJson['about']['nationality']){
        convertedProfile['about']['nationality'] = profileJson['about']['nationality'];
      }

      if (profileJson['about']['memberOf']){
        convertedProfile['about']['memberOf'] = [];
        for (index in profileJson['about']['memberOf']){
          var memberOf = profileJson['about']['memberOf'][index];
          convertedProfile['about']['memberOf'].push({'name':memberOf['name'],'id':memberOf['url']});
        }
      }

    }else if (profileJson['about']['@type'] == "Organization"){

      if (profileJson['about']['telephone']){
        convertedProfile['about']['telephone'] = profileJson['about']['telephone'];
      }

      if (profileJson['about']['website']){
        convertedProfile['about']['url'] = profileJson['about']['website'];
      }

      if (profileJson['about']['logo']){
        convertedProfile['about']['logo'] = profileJson['about']['logo'];
      }

      if (profileJson['about']['member']){
        convertedProfile['about']['member'] = [];
        for (index in profileJson['about']['member']){
          var member = profileJson['about']['member'][index];
          convertedProfile['about']['member'].push({'name':member['name'],'id':member['url']});
        }
      }

    }

    var convertedProfileJson = JSON.stringify(convertedProfile);
    console.log(convertedProfileJson);

    fs.writeFile(directoryDataOutputDir + file, convertedProfileJson, function(err) {
      if (err) throw err;
    });

    var splittedURL = convertedProfile['about']['id'].split("/");
    var uuidInProvider = splittedURL[splittedURL.length-1];

    fs.writeFile(providerDataOutputDir + uuidInProvider, JSON.stringify(convertedProfile['about']), function(err) {
      if (err) throw err;
    });

  });
});
