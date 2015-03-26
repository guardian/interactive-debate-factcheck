define([
    'jquery',
    'json!data/sampleData.json',
    'text!templates/appTemplate.html',
    'text!templates/factCardTemplate.html',
    'ractive',
    'jQuery.XDomainRequest'
], function(
    $,
    sampleData,
    appTemplate,
    factCardTemplate,
    Ractive
) {
   'use strict';
    var currentFact;
    var data;
    
    function init(el, context, config, mediator) {
        

        var currenturl = document.location.href;
        if(currenturl.indexOf('fact=')>-1){
            var value = currenturl.split('fact=')[1];
            currentFact = value.split(/#|&/)[0];
        }

        // Load remote JSON data
        var url = 'http://interactive.guim.co.uk/spreadsheetdata/1LlWvsye-Aj9Q-dqzA41bs-6QcsUuO6dw1RA_9WpNvAw.json';
        $.ajax({
            url: url,
            type: 'GET',
            crossDomain: true,
            dataType: 'json',
            error: function(err) { console.error('Failed: ', err ); },
            success: function(resp) { 
                data = resp.sheets.facts.map(function(i){
                    i.additionaltext = i.additionaltext.split('\n').filter(function(p){
                        return p;
                    });
                    return i;
                }) 
                renderPage(el);
            }
        });
    }

    function renderPage(el){
        console.log(data);
        var app = new Ractive({
            el:el,
            template:appTemplate,
            partials:{
                factCard: Ractive.parse(factCardTemplate)
            },
            data:{
                facts: data,
                path: currentFact,
                embedUrl: 'http://interactive.guim.co.uk/2015/03/election-factboxes'
            }
        })

        app.on('selectUrl',function(e){
            e.node.select();
        })
    }

    return {
        init: init
    };
});
