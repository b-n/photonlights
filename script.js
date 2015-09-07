$(document).ready(function(){

	var accessToken;

	$('#login').submit(function(e){

		var username = $("#inputEmail").val();
		var password = $("#inputPassword").val();

		e.preventDefault();

		$.ajax({
		  	type: "POST",
		  	url: "https://api.particle.io/oauth/token",
		  	contentType: "application/x-www-form-urlencoded",
		  	beforeSend: function(xhr) { xhr.setRequestHeader("Authorization", "Basic " + btoa("particle:particle")) },
		  	data: 'username=' + username + '&password=' + password + '&grant_type=password',
		  	success: function (data){
    			console.log('Success!', data);
    			accessToken = data.access_token;
    			window.location.href = "/lights.html?token=" + accessToken;
    		}
		});
	});

	if ($('#blinky').length) {

		$.urlParam = function(name){
			var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
			return results[1] || 0;
		}

		var retrievedToken = $.urlParam("token");
		var devices;

		$.ajax({
		  	type: "GET",
		  	url: "https://api.particle.io/v1/devices?access_token=" + retrievedToken,
		  	contentType: "application/x-www-form-urlencoded",
		  	success: function (data){
    			console.log('Success!', data);

				$.each(data, function(i, v){

					if (v.connected){
						$('#devices').append("<option id='" + v.id + "'>" + v.name + "</option>");
					}
					
				});
    		}
		});

		$('#blinky').submit(function(e){

			e.preventDefault();

			var deviceId = $('#devices').children(":selected").attr("id");
			var paramString = "";

			$.each($('.led'), function(i, v){

				var value = $('input:radio[name=led' + i + ']:checked').val();

				if (value !== "nc") {
					paramString += $('input:radio[name=led' + i + ']:checked').val();
				}

			});

			$.ajax({
			  	type: "POST",
			  	url: "https://api.particle.io/v1/devices/" + deviceId + "/write?access_token=" + retrievedToken,
			  	contentType: "application/x-www-form-urlencoded",
			  	data: "params=" + paramString,
			  	success: function (data){
	    			console.log('Success!', data);
	    		}
			});

		});

		Mousetrap.bind('up up down down left right left right b a enter', function() {

			var deviceId = $('#devices').children(":selected").attr("id");

		    $.ajax({
			  	type: "POST",
			  	url: "https://api.particle.io/v1/devices/" + deviceId + "/kr?access_token=" + retrievedToken,
			  	contentType: "application/x-www-form-urlencoded",
			  	data: "",
			  	success: function (data){
	    			console.log('Success!', data);
	    		}
			});
		});



	}
	

});
