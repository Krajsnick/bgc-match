$(document).ready(function(){
  var $resultView = $('#result-view'),
      $matchBtn = $('#match-submit'),
      intervalID = null,
      isFetching = false,
      postData = {"bgnr": "", "orgnr": ""};


  $matchBtn.click(function() {
    if (!isFetching) {
      isFetching = true;
      startLoadingSpin();

      postData.bgnr = $('#bg-input').val();
      postData.orgnr = $('#orgnr-input').val();

      $.ajax({
        type: 'POST',
        url: '/',
        data: JSON.stringify(postData),
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: dataFetched
      });
    }
  });

  function dataFetched(result) {
    isFetching = false;
    stopLoadingSpin();

    if (result.match) {
      $resultView.css('color', '#21bf03');
      $resultView.text('MATCH');
    } else {
      $resultView.css('color', '#db0707');
      $resultView.text('NO MATCH');
    }
  }

  function startLoadingSpin() {
    $resultView.text('-');
    $resultView.css('color', '#000');
    intervalID = setInterval(function() {
      var tmpText = $resultView.text();
      tmpText = tmpText + " - -";
      $resultView.text(tmpText);
      if (tmpText.length > 55) $resultView.text('- - -')
    }, 600);
  }

  function stopLoadingSpin() {
    clearInterval(intervalID);
  }

});
