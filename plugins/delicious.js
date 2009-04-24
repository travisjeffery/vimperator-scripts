// Vimperator Plugin: 'Delicious'
// Last Change: 22-Apr-2009
// License: MIT
// Maintainer: Travis Jeffery <travisjeffery@gmail.com>
// Usage: Use :delicious <tags delimited by spaces> command
// Usage: if successfully posted you will see "done" echoed

commands.addUserCommand(['delicious'], "Save page as a bookmark on Delicious",
                        function(args) {
                            var url = "https://api.del.icio.us/v1/posts/add?";
                            url += "&url=" + encodeURIComponent(buffer.URL);
                            url += "&description=" + encodeURIComponent(buffer.title);
                            url += "&tags=" + encodeURIComponent(args.string);
                            
                            var xhr = new XMLHttpRequest();
                            xhr.open("POST", url, false);
                            xhr.send(null);
                            var xml = (new DOMParser()).parseFromString(xhr.responseText, "text/xml");
                            var status = xml.getElementsByTagName('result')[0].getAttribute('code');
                            
                            liberator.echo(status);
                        });
