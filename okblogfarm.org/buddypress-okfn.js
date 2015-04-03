var fs = require('fs');
var csv =require('csv');

var data = fs.readFileSync('dump.csv').toString();

var output = {
	"public": {
		"@context": "ld.hackers4peace.net/contexts/plp.jsonld",
		"@graph": [
		]
	},
	"private": {
		"@context": "ld.hackers4peace.net/contexts/plp.jsonld",
		"@graph": [
		]
	}
};

csv.parse(data, {columns: true}, function(err, rows) {

	rows.forEach(function(row){
		var profile = {
			id: 'https://profiles.okfn.org/' + row["user_login"],
			type: "Person",
			name: row["Name"],
			description: row["Description/ About me"],
			address: { name: row["Location"] },
			website: row["Website"],
			sameAs: [
				{
					name: "Twitter",
					id: "https://twitter.com/" + row["Twitter"].replace('@', '')
				},
				{
					name: "Github",
					id: "https://github.com/" + row["Github Account Name"]
				}
			],
			memberOf: [
				{
					id: "http://okfn.org",
					name: "Open Knowledge"
				}
			]
		};
		output.public["@graph"].push(profile);

		var credential = {
			id: 'https://profiles.okfn.org/' + row["user_login"],
			email: row["user_email"]
		};
		output.private["@graph"].push(credential);
	});

	fs.writeFileSync('public.jsonld', JSON.stringify(output.public));
	fs.writeFileSync('private.jsonld', JSON.stringify(output.private));

});

