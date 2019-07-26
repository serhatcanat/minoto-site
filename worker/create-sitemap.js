const sm = require('sitemap');
const pathToRegexp = require('path-to-regexp');
const fs = require('fs');

const sitemapDir = './public/sitemap';

var routes = require('../src/data/routes');

var urls = [];
var pagesXML = false;


/// PAGES
Object.keys(routes).forEach(function(groupKey){
	var group = routes[groupKey];

	Object.keys(group).forEach(function(routeKey){
		var add = false;
		var route = group[routeKey];

		if(route.path){
			var keys = [];
			var reg = pathToRegexp(route.path, keys);

			if(route.excludeFromSitemap !== true) {
				add = keys.reduce(function(state, key){
					return !state ? false : key.optional;
				}, true);
			}
		}
		

		if(add){
			urls.push({
				url: route.path.split(':')[0],
				changefreq: 'daily',
				priority: 0.9,
			});
		}
	});
});

var sitemap = sm.createSitemap({
	hostname: 'https://minoto.com',
	cacheTime: 600000, // 600 sec - cache purge period
	urls: urls,
	//[{ url: '/page-2/', changefreq: 'monthly', priority: 0.7 }]
});

sitemap.toXML(function(err, xml) { if (!err) {
	pagesXML = xml.toString();

	fs.writeFile(sitemapDir + "/pages.xml", xml.toString(), function(err) {
	    if(err) {
	        return console.log(err);
	    }
	    console.log("Pages XML Saved!");
	}); 
} });
/// END PAGES
