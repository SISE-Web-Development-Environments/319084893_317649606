
$(document).ready(function() {

    /*-----------------add a defalut user--------------------*/
    localStorage.setItem("p",JSON.stringify({firstname:"p",lastName:"p",username:"p",password:"p",email:"p",birthday:"18/11/1997"}));

    /*-----------------switch divs--------------------*/
	$("#menureg,#signupButton").click(function(){
		$("li").removeClass("active");
		$("#menureg").addClass("active");
		$(".screen").hide();
		$("#registerScreen").show();
	});

	$("#menuwelcome").click(function(){
		$("li").removeClass("active");
		$("#menuwelcome").addClass("active");
		$(".screen").hide();
		$("#welcomeScreen").show();
	});

	$("#menulogin,#loginButton").click(function(){
		$("li").removeClass("active");
		$("#menulogin").addClass("active");
		$(".screen").hide();
		$("#loginScreen").show();
	});

    /*----------------------log in to system-------------------------*/
    
    $("#loginSubmit").click(function(){
        if(validateUser(document.getElementById("tryUsername").value,document.getElementById("tryPassword").value))
        {
            $(".screen").hide();
            $("#optionsScreen").show();
        }
        else
        {
            alert("wrong username or password");
        }
    });

    /*------------------------sign up to system---------------------------------------*/

    //validate all fields
    $("#signupForm").validate({
        rules: {
            firstname:{
                required: true,
                noNums: true
            },
            lastname:{
                required: true,
                noNums: true
            },
            username:{
                required: true,
                minlength: 1,
                userExists: true
            },
            password: {
                required: true,
                minlength: 6,
                goodpassword: true
            },
            confirm_password: {
                required: true,
                minlength: 6,
                equalTo: "#password"
            },
            email: {
            required: true,
            email: true
            }
        }
    });

    // suggest good user name
    $("#username").focus(function(){
        let firstname=document.getElementById("firstname").value;
        let lastname=document.getElementById("lastname").value;
        if(firstname && lastname && !this.value){
            this.value=firstname+"_"+lastname;
        }
    });

    //make sure the firt and last names dont contain numeric
    jQuery.validator.addMethod("noNums", function(value) {
        return (!value.match(/[0-9]/));
      }, "The field can not contain numeric characters");

    //make sure the user name doesnt exist in the system
    jQuery.validator.addMethod("userExists", function(value) {
        return !userExsists(value);
      }, "The username already exists");

    //make sure the password contains numeric and alphabetic characters
    jQuery.validator.addMethod('goodpassword', function(value) {
        return (value.match(/[a-zA-Z]/) && value.match(/[0-9]/));
    }, 'Password must contain at least one numeric and one alphabetic character');

    //add user to local storage
    $("#regSubmit").click(function(e)
    {
        e.preventDefault();
        if($('#signupForm').valid() == true)
        {
            let firstname=document.getElementById("firstname").value;
            let lastname=document.getElementById("lastname").value;
            let username=document.getElementById("username").value;
            let password=document.getElementById("password").value;
            let email=document.getElementById("email").value;
            let birthday=document.getElementById("birthday").value;
            localStorage.setItem(username,JSON.stringify({firstname:firstname,lastName:lastname,username:username,password:password,email:email,birthday:birthday}));
            $("#firstname").val("");
            $("#lastname").val("");
            $("#username").val("");
            $("#password").val("");
            $("#confirm_password").val("");
            $("#email").val("");
            $("#birthday").val("");
            alert("registered succesfully");
        }  
    });

    /*---------------------------------------------------------------------------*/
  
});

/**
 * make sure user name and password are good
 */
function validateUser(username,password)
{
    let tempUser=JSON.parse(localStorage.getItem(username));
    if(tempUser != null)
    {
        if(tempUser.password==password)
            return true;
    }
    return false;
}

/**
 * checks if the user name exists in the system
 */
function userExsists(username)
{
    if(JSON.parse(localStorage.getItem(username))==null)
        return false;
    else
        return true;
}