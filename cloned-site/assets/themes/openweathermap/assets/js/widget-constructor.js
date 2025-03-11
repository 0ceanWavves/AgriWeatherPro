document.addEventListener("DOMContentLoaded", function () {
  // your code here  
  var units_cookie = document.cookie.match('(^|[^;]+)\\s*' + 'units' + '\\s*=\\s*([^;]+)');
  var units = units_cookie ? units_cookie.pop() : '';
  if (units === 'metric') {
    document.getElementById('metric').style.color = '#EB6E4B';
    document.getElementById('imperial').style.color = '#48484A';

  } else {
    document.getElementById('imperial').style.color = '#EB6E4B';
    document.getElementById('metric').style.color = '#48484A';

  }
});

