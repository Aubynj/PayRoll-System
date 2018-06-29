$(function(){
var url = new URL(document.URL);
console.log(document.URL);
var data = url.searchParams.get('email');
console.log(data);
});
