enyo.kind({  name: "App",  kind: enyo.FittableRows,  classes: "losungen-background",  components: [    {name: "getXML", kind: "WebService",      onResponse: "gotXML",      onFailure: "gotError",      handleAs: "xml"    },    {kind: "Scroller", fit: true, touch: true, horizontal: "hidden", components: [        {name: "packer", kind: "FittableRows", pack: "center", align: "center", components: [            {name: "container", kind: "FittableRows", showing: false, classes: "losungen-container", components: [                {kind: "onyx.Toolbar", style: "background-color: transparent;", layoutKind: "FittableColumnsLayout", components: [                    {kind: "onyx.IconButton", src: "assets/menu-icon-back.png", onclick: "goBack", style: "height: 32px;"},                    {classes: "icon-container", fit: true, components: [                        {kind: "Image", src: "assets/date.png", classes: "losungen-icons", onclick: "openPopup"},                        {kind: "Image", src: "assets/info.png", classes: "losungen-icons", onclick: "openAbout"}                    ]},                    {kind: "onyx.IconButton", src: "assets/menu-icon-forward.png", onclick: "goForward", style: "height: 32px; margin: 10px;"}                ]},                {classes: "losungen-content", components: [                    {name: "header", classes: "losungen-header"},                    {name: "sonntag", classes: "losungen-sonntag"},                    {name: "monatsSpruch", kind: "FittableRows", showing: false, components: [                        {content: "Monatsspruch", classes: "losung-caption"},                        {name: "mSpruch", classes: "losung-text"},                        {name: "mVers", classes: "losung-stelle"}                    ]},                    {name: "wochenSpruch", kind: "FittableRows", showing: false, components: [                        {content: "Spruch", classes: "losung-caption"},                        {name: "wSpruch", classes: "losung-text"},                        {name: "wVers", classes: "losung-stelle"}                    ]},                    {content: "Losungstext", classes: "losung-caption"},                        {name: "losText", classes: "losung-text"},                        {name: "losStelle", classes: "losung-stelle"},                    {content: "Lehrtext", classes: "losung-caption"},                        {name: "lehrText", classes: "losung-text"},                        {name: "lehrStelle", classes: "losung-stelle"},                    {name: "meta", classes: "losungen-meta", kind: "FittableRows", components: [                        {name: "predigt", allowHtml: true},                        {name: "tagesText", allowHtml: true},                        {name: "fortlaufenderText", allowHtml: true},                        {name: "psalm", allowHtml: true},                        {name: "lied", allowHtml: true},                        {name: "farbe", allowHtml: true}                    ]}                ]}            ]},            {name: "info", allowHtml: true, content: "&copy; <a href='http://www.ebu.de' target='_blank'>Evangelische Br&uuml;der-Unit&auml;t</a> - Herrnhuter Br&uuml;dergemeine. Mehr Informationen gibt es <a href='http://www.losungen.de' target='_blank'>hier</a>.", classes: "losung-info"}        ]}    ]},    {name: "datePopup", scrim: true, centered: true, kind: "onyx.Popup", components: [        {kind: "FittableRows", align: "center", pack: "center", components: [            {content: "Bitte Datum auswählen", style: "text-align: center;"},            {kind: "onyx.IconButton", src: "assets/cancel.png", onclick: "handleClose", style: "position: absolute; top: -10px; right: -10px; z-Index: 20000000"},            {name: "datePicker", kind: "onyx.DatePicker", label: "", minYear: 2013, maxYear: 2013, onChange: "changeDate", style: "clear: both"}        ]}    ]},    {name: "losAbout", scrim: true, centered: true, kind: "onyx.Popup", style: "min-width: 300px", components: [        {kind: "FittableRows", align: "center", pack: "center", components: [            {kind: "onyx.IconButton", src: "assets/cancel.png", onclick: "handleClose", style: "position: absolute; top: -10px; right: -10px; z-Index: 20000000"},            {name: "title", content: "Über Losungen", classes: "popup-title"},            {name: "version", classes: "popup-version"},            {allowHtml: true, content: "&copy; 2010-2013 by <a href='http://zefanjas.de' target='_blank'>zefanjas.de</a><p><a href='https://github.com/zefanja/losungen' target='_blank'>Source code on GitHub</a><p>", classes: "popup-info"},            {style: "text-align: center", components: [                {kind: "onyx.Button", content: $L("Send eMail"), style: "margin-top: 10px;", onclick: "sendMail"}            ]}        ]}    ]}    //{name: "losAbout", kind: "Losungen.About"}  ],    create: function () {        this.inherited(arguments);        this.date = new Date();        this.year = this.date.getFullYear();        //this.addStyles("font-size: 20px;");        if(!enyo.platform.firefoxOS) {            this.$.container.addStyles("border: 1px solid;");        }        var obj = api.get("yearImported");        if (!obj || obj.year !== this.year) {            console.log(obj);            var url = "assets/misc/" + this.year + ".xml";            this.$.getXML.setUrl(url);            this.$.getXML.send();        } else {            this.getToday();        }    },    rendered: function () {        this.inherited(arguments);        var request = window.navigator.mozApps.getSelf();        request.onsuccess = enyo.bind(this, function() {            if (request.result) {                if (request.result.manifest.version)                    this.$.version.setContent("Version " + request.result.manifest.version);                if (request.result.manifest.name)                    this.$.title.setContent("Über " + request.result.manifest.name);            }        });    },    getToday: function (date) {        date = (date) ? date: this.date;        this.date = date;        var tag = date.getDate();        var monat = date.getMonth() + 1;        if (monat < 10) { monat = "0" + monat;}        if (tag < 10) { tag = "0" + tag;}        var key = date.getFullYear() + "-" + monat + "-" + tag + "T00:00:00";        var obj = api.get(key);        if (obj) {            this.$.header.setContent(obj.wTag + ", " + tag + "." + monat + "." + this.date.getFullYear());            this.$.losText.setContent(obj.losungsText);            this.$.losStelle.setContent(obj.losungsVers);            this.$.lehrText.setContent(obj.lehrText);            this.$.lehrStelle.setContent(obj.lehrVers);            if (obj.spruch !== "") {                this.$.wSpruch.setContent(obj.spruch);                this.$.wVers.setContent(obj.spruchVers);                this.$.wochenSpruch.show();            } else {                this.$.wochenSpruch.hide();            }            if (obj.monatsSpruch !== "") {                this.$.mSpruch.setContent(obj.monatsSpruch);                this.$.mVers.setContent(obj.monatsVers);                this.$.monatsSpruch.show();            } else {                this.$.monatsSpruch.hide();            }            this.$.predigt.setContent((obj.predigt !== "") ? "<b>Predigt:</b> " + obj.predigt : "");            this.$.psalm.setContent((obj.psalm !== "") ? "<b>Psalm:</b> " + obj.psalm : "");            this.$.lied.setContent((obj.lied !== "") ? "<b>Lied:</b> " + obj.lied : "");            this.$.farbe.setContent((obj.farbe !== "") ? "<b>Liturgische Farbe:</b> " + obj.farbe : "");            this.$.tagesText.setContent((obj.tagesText !== "") ? "<b>Tagestext:</b> " + obj.tagesText : "");            this.$.fortlaufenderText.setContent((obj.fortlaufenderText !== "") ? "<b>fortlaufender Text:</b> " + obj.fortlaufenderText : "");            this.$.sonntag.setContent((obj.sonntag !== "") ? obj.sonntag : "");            //Show Data            this.$.container.show();        }    },    gotXML: function (inSender, inEvent) {    //console.log("gotXML", inEvent);    var xmlobject = (new DOMParser()).parseFromString(inEvent.ajax.xhrResponse.body, "text/xml");    for (var i=0;i<xmlobject.getElementsByTagName("Losungen").length; i++) {        api.set(xmlobject.getElementsByTagName("Losungen")[i].getElementsByTagName("Datum")[0].firstChild.nodeValue,            {                losungsText: xmlobject.getElementsByTagName("Losungen")[i].getElementsByTagName("Losungstext")[0].firstChild.nodeValue,                lehrText: xmlobject.getElementsByTagName("Losungen")[i].getElementsByTagName("Lehrtext")[0].firstChild.nodeValue,                losungsVers: xmlobject.getElementsByTagName("Losungen")[i].getElementsByTagName("Losungsvers")[0].firstChild.nodeValue,                lehrVers: xmlobject.getElementsByTagName("Losungen")[i].getElementsByTagName("Lehrtextvers")[0].firstChild.nodeValue,                wTag: xmlobject.getElementsByTagName("Losungen")[i].getElementsByTagName("Wtag")[0].firstChild.nodeValue,                sonntag: (xmlobject.getElementsByTagName("Losungen")[i].getElementsByTagName("Sonntag")[0].firstChild) ? xmlobject.getElementsByTagName("Losungen")[i].getElementsByTagName("Sonntag")[0].firstChild.nodeValue : "",                tagesText: (xmlobject.getElementsByTagName("Losungen")[i].getElementsByTagName("Tagestext")[0].firstChild) ? xmlobject.getElementsByTagName("Losungen")[i].getElementsByTagName("Tagestext")[0].firstChild.nodeValue : "",                fortlaufenderText: (xmlobject.getElementsByTagName("Losungen")[i].getElementsByTagName("Fortlaufendertext")[0].firstChild) ? xmlobject.getElementsByTagName("Losungen")[i].getElementsByTagName("Fortlaufendertext")[0].firstChild.nodeValue : "",                spruch: (xmlobject.getElementsByTagName("Losungen")[i].getElementsByTagName("Spruch")[0].firstChild) ? xmlobject.getElementsByTagName("Losungen")[i].getElementsByTagName("Spruch")[0].firstChild.nodeValue : "",                spruchVers: (xmlobject.getElementsByTagName("Losungen")[i].getElementsByTagName("Spruchvers")[0].firstChild) ? xmlobject.getElementsByTagName("Losungen")[i].getElementsByTagName("Spruchvers")[0].firstChild.nodeValue : "",                lied: (xmlobject.getElementsByTagName("Losungen")[i].getElementsByTagName("Lied")[0].firstChild) ? xmlobject.getElementsByTagName("Losungen")[i].getElementsByTagName("Lied")[0].firstChild.nodeValue : "",                predigt: (xmlobject.getElementsByTagName("Losungen")[i].getElementsByTagName("Predigt")[0].firstChild) ? xmlobject.getElementsByTagName("Losungen")[i].getElementsByTagName("Predigt")[0].firstChild.nodeValue : "",                psalm: (xmlobject.getElementsByTagName("Losungen")[i].getElementsByTagName("Psalm")[0].firstChild) ? xmlobject.getElementsByTagName("Losungen")[i].getElementsByTagName("Psalm")[0].firstChild.nodeValue : "",                farbe: (xmlobject.getElementsByTagName("Losungen")[i].getElementsByTagName("LiturgischeFarbe")[0].firstChild) ? xmlobject.getElementsByTagName("Losungen")[i].getElementsByTagName("LiturgischeFarbe")[0].firstChild.nodeValue : "",                monatsSpruch: (xmlobject.getElementsByTagName("Losungen")[i].getElementsByTagName("Monatsspruch")[0].firstChild) ? xmlobject.getElementsByTagName("Losungen")[i].getElementsByTagName("Monatsspruch")[0].firstChild.nodeValue : "",                monatsVers: (xmlobject.getElementsByTagName("Losungen")[i].getElementsByTagName("Monatsspruchvers")[0].firstChild) ? xmlobject.getElementsByTagName("Losungen")[i].getElementsByTagName("Monatsspruchvers")[0].firstChild.nodeValue : ""            }        );    }    api.set("yearImported", {year: this.year});    this.getToday();    },    gotError: function (inSender, inResponse, inRequest) {        if (inResponse !== null) {            this.gotXML(inSender, inResponse, inRequest);        } else {            this.$.info.setContent("Failure...");        }    },    goBack: function () {        this.date.setDate(this.date.getDate()-1);        this.getToday(this.date);    },    goForward: function () {        this.date.setDate(this.date.getDate()+1);        this.getToday(this.date);    },    openPopup: function () {        this.$.datePopup.show();    },    handleClose: function (inSender, inEvent) {        this.$.datePopup.hide();        this.$.losAbout.hide();    },    openAbout: function ()  {        this.$.losAbout.show();    },    changeDate: function (inSender) {        this.getToday(inSender.getValue());    },    sendMail: function () {        window.location = "mailto:info@zefanjas.de";    }});