var parser = new Butterfly.Parser().loadDefaultStrategies(), timeout, current;
$("#markup").keydown(function(e) {
    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }

    timeout = setTimeout(render, 200);
});

function render() {
    var text = $("#markup").val();
    if (text === current) {
        return;
    }

    current = text;

    var $html = $("#html").removeClass("error").empty();
    var startTime = new Date().getTime();
    try {
        var html = parser.parseAndReturn(text);
        $html.html(html);
    } catch (e) {
        $html.addClass("error").html("<p/>").text(e.toString());
    }

    parser.analyzer.flush();
    $("#elapsed-time").empty().text((new Date().getTime() - startTime) + "ms");

    Sunlight.highlightAll();
}

render();
