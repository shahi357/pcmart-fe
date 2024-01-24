username = $("#user_name").val();
password = $("#user_password").val();

if (username == "admin@admin" && password == "admin") {
    location.href('./admin/admindash.html');
}