// Vimperator Plugin: 'Delicious'
// Last Change: 25-Aug-2009
// License: MIT
// Maintainer: Travis Jeffery <travisjeffery@gmail.com>
// Usage: Use :delicious "description in quotes (optional)" <tags delimited by spaces> command
// Usage: if successfully posted you will see "done" echoed
// Modified by: Egon Hyszczak <gone404@gmail.com>
// Changes made: Added private bookmarks (pvt) and Twitter functionality (for:@twitter)

commands.addUserCommand(['delicious'], "Save page as a bookmark on Delicious",
    function(args) {
        var title = buffer.title;
        var url = "https://api.del.icio.us/v1/posts/add?";
        url += "&url=" + encodeURIComponent(buffer.URL);
        url += "&description=" + encodeURIComponent(title);
        var tags;
        var statusString = '';

        var re = new RegExp(/"([^"]+)"/);
        var ext = args.string.match(re);
        if (ext) {
            url += "&extended=" + encodeURIComponent(ext[1]);
            tags = args.string.substr(ext[0].length);
        } else {
            tags = args.string;
        }

        //If the 'pvt' tag is used lock the bookmark from public access
        if(tags.match("pvt")) {
            //Replace pvt with empty string
            tags = tags.replace("pvt", "");
            url += "&shared=no";
            statusString += '[PRIVATE] ';
        } else {
            url += "&shared=yes";
        }

        //Remove superflous whitespace
        var whitespace = new RegExp(/\s{2,}/);
        tags = tags.replace(whitespace, " ");
        tags = tags.trim();

        url += "&tags=" + encodeURIComponent(tags);

        //Twitter
        if(tags.match("for:@twitter")) {
            if(title.length >= 110) {
                title = title.substr(0,110).trim();
                title += "...";
                url += "&share_msg=" + encodeURIComponent(title);
            } else {
                url += "&share_msg=" + encodeURIComponent(title);
            }
            url += "&recipients=" + encodeURIComponent("@twitter");
        }

        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, false);
        xhr.send(null);
        var xml = (new DOMParser()).parseFromString(xhr.responseText, "text/xml");
        var status = xml.getElementsByTagName('result')[0].getAttribute('code');

        if(status == "done") {
            statusString += "Added bookmark for " + buffer.URL + " [" + tags + "]";
            liberator.echo(statusString);
        } else {
            liberator.echo(status);
        }
    }
);
