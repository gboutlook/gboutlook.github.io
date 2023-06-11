/*$(".portfolio-box").hover(function(){
    $(this).find(".box-logo").slideToggle("slow");
});*/


$('body').on('click','.actAceitarCookie', function(e){
    e.stopPropagation();
    e.preventDefault();
    $.ajax({
		url: 'https://naoexiste.grupoattos.com.br/aceita_cookie/ajax/aceita_cookie_ajax/aceitarCookie', 
		dataType: 'json',
		type: 'POST',
		data: {name: $(this).data('name')},
		success: function(retorno)
		{
		    
		    loadButton(null,false);
		    if(retorno.valid == false)
		    {   
		        $(".container-cookie").hide("clip");
		    }
		    else
		    {
		        $(".container-cookie").hide("clip");
		    }
		},
		error: function(error)
		{
		    $(".container-cookie").hide("clip");
		}
    });
});


//$('body').off('click','.actAceitarCookie');

/*Sidebar effect*/

$("#sidebar").mCustomScrollbar({theme: "minimal"});
        
$('#sidebarCollapse').on('click', function () {
    // open or close navbar
    $('#sidebar, #content').toggleClass('active');
    
    $('.collapse.in').toggleClass('in');
    $('a[aria-expanded=true]').attr('aria-expanded', 'false');
});

$('.page').click(function(){
    closeMenu();
});

// $(window).scroll(function(){
//     closeMenu();
// });

var lastScrollTop = 0;
window.addEventListener("scroll", function(){  
   var st = window.pageYOffset || document.documentElement.scrollTop;  
   if (st > lastScrollTop){
       closeMenu();
   } else {
      
   }
   lastScrollTop = st;
}, false);


function closeMenu() {
    console.log($('#sidebar').hasClass('active'))
    if($('#sidebar').hasClass('active') == true)
    {
        $('#sidebarCollapse').trigger('click');
    }
}




$('#formContato').submit(function(e) {
    e.preventDefault();
    
    
    loadButton($('.submitContato'));
    
    $data = get_form(this);
    
    
    get_ajax($data, 'landingpage/grupo_attos/envia_contato', 
        success =>{
            msgSuccess('.result-msg', success);
            $('#formContato')[0].reset();
        },
        erro =>{
            msgErro('.result-msg', erro);
            
            
        });
        
});







    //                <div class="alert alert-success alert-dismissible fade show" role="alert">
    //                    <strong>Mensagem enviada com sucesso!</strong> Em breve entraremos em contato.
    //                        <button type="button" class="close m-0" data-dismiss="alert" aria-label="Close">
    //                        <span aria-hidden="true">×</span>
    //                    </button>
    //                </div>
    //
    //                <div class="alert alert-danger alert-dismissible fade show" role="alert">
    //                    <strong>Erro!</strong> Campo nome obrigatório.
    //                        <button type="button" class="close m-0" data-dismiss="alert" aria-label="Close">
    //                        <span aria-hidden="true">×</span>
    //                    </button>
    //                </div>














function msgSuccess($div, $success){
    setAlert($div, $success.msg, 'success');
}
function msgErro($div, $erro){
    if($erro.msg != undefined)
        setAlert($div, $erro.msg, 'danger');
    else{
        //$msg = "<b>"+$($($erro.responseText)[7]).find('h1').text()+"</b>, "+$($($erro.responseText)[7]).find('p').text()
            console.log($erro.responseText);
                msg = $($($erro.responseText)[7]).find('h1').text();
            if(msg == '')
                msg = $($erro.responseText)[8].find('h1').text();
             if(msg == '')
                msg =   $($erro.responseText).find('h4').text()+'\n'+$($($erro.responseText).find('p')[1]).text();
            if(msg == '')
                msg =   "ERRO!";
                    
        setAlert($div, msg, 'danger');
    }
}
function setAlert($div, $msg, $cor){
    $html = '<div class="alert alert-'+$cor+' alert-dismissible fade show" role="alert">' +
         $msg +
    '    <button class="close m-0" type="button" data-dismiss="alert" aria-label="Close">' +
    '        <span aria-hidden="true">×</span>' +
    '    </button>' +
    '</div>';
    $($div).html($html); 
}
// VARIAVES PARA O LOAD BUTTON
var textLoad = "<i class='fa fa-circle-o-notch fa-spin'></i>";
var textButton = '';
var btn = null;
function loadButton(button = null, disabled = true)
{
    if(button != null)
        btn = button;
        
    if(disabled == true)
    {
        textButton = btn.html();
        btn.prop('disabled', true);
        btn.html(textLoad);//+' '+textButton
    }
    else
    {
	    if(btn != null){
            	btn.prop('disabled', false);
	    	btn.html(textButton);
	    	btn = null;
	    }
    }
}
function get_form($form)
{
    data = [];
    var nameRadio = [];
    
    //$($form).find('input:not([type=radio]):input:not([type=checkbox]):input:not([type=file])').each(function(key,value){
    $($form).find('input:not([type=radio]):input:not([type=checkbox]):input:not([type=file])').each(function(key,value){
        if(this.name != "")
            data.push({"name": this.name, "value": this.value});
    });
    
    $($form).find('input[type=file]').each(function(key,value){
        if(this.name != ""){
            data.push({"name": this.name, "value": $(this).data('value')});
        }
    });
    
    $($form).find('textarea').each(function(key,value){
       
        if(this.name != "")
        {
            if(typeof CKEDITOR != undefined){
                 //data.push({"name": this.name, "value": CKEDITOR.instances[this.name].getData()});
                 ckeditorValue = $($($($('#cke_'+this.id)[0])[0]).find('iframe').contents().find("body")).html();
                 
                if(ckeditorValue == undefined || ckeditorValue == 'undefined')
                    data.push({"name": this.name, "value": this.value});
                else
                    data.push({"name": this.name, "value": ckeditorValue});
            }
            else
            {
                data.push({"name": this.name, "value": this.value});
            }
        }
    });
    
    $($form).find('input[type=radio]').each(function(key,value){
        if(nameRadio[this.name] == undefined)
            nameRadio[this.name] = '';
        if($(this).is(':checked'))
            nameRadio[this.name] = this.value;
    });
    
    for(var name in nameRadio){
        data.push({"name": name, "value": nameRadio[name]});
    };
    
    $($form).find('select option:selected').each(function(key,value)    {
        if(this.parentElement.localName == 'select')
            data.push({"name": this.parentElement.name, "value": this.value});
            
        if(this.parentElement.parentElement.localName == 'select')
            data.push({"name": this.parentElement.parentElement.name, "value": this.value});
    });
    
    $($form).find('input[type=checkbox]:checked').each(function(key,value)    {
        if(this.name != "")
            data.push({"name": this.name, "value": this.value});
    });
    
    $($form).find('input[type=checkbox]:not(:checked)').each(function(key,value)    {
        if(this.name != "")
            data.push({"name": this.name, "value": ""});
    });
    
    return data;
}
/*
function get_ajax

$func = nome da funcao no php
$success = funcao Callbeck, exemplo = "retorno =>{alert('deu bom');}"
$error = funcao Callbeck
$data = objeto passado no post ajax
*/
function get_ajax($data = [], $uri, $success = null, $error = null ){
    
    if($error == null)
    {
        $error = function($erro){
            if($erro.msg != undefined)
                alert($erro.msg);
            else{
                console.log($erro.responseText);
                    msg = $($($erro.responseText)[7]).find('h1').text();
                if(msg == '')
                    msg = $($($erro.responseText)[8]).find('h1').text();
                if(msg == '')
                    msg =   $($erro.responseText).find('h4').text()+'\n'+$($($erro.responseText).find('p')[1]).text();
                if(msg == '')
                    msg =   "ERRO!";
                alert(msg);
            }
        };
    }
    
    if($success == null)
    {
        $success = function(e){
            //e);
        };
    }
    
    $.ajax({
		url: base_url+$uri, 
		dataType: 'json',
		type: 'POST',
		data: $data,
		success: function(retorno)
		{
		    loadButton(null,false);
		    if(retorno.valid == false)
		    {   
		        $error(retorno);
		    }
		    else
		    {
		        $success(retorno)
		    }
		},
		error: function(error)
		{
		    loadButton(null,false);
		    $error(error);
		}
    });
    
 }
$(window).on('load', function(){
    $(".container-cookie").delay(4000).show("clip");
});

$('body').on('click','.actAceitarCookie', function(){
    $.ajax({
		url: base_url+'aceita_cookie/ajax/aceita_cookie_ajax/aceitarCookie', 
		dataType: 'json',
		type: 'POST',
		data: {name: $(this).data('name')},
		success: function(retorno)
		{
		    loadButton(null,false);
		    if(retorno.valid == false)
		    {   
		        $(".container-cookie").hide("clip");
		    }
		    else
		    {
		        $(".container-cookie").hide("clip");
		    }
		},
		error: function(error)
		{
		    $(".container-cookie").hide("clip");
		}
    });
});

$('body').on('click','.actOpenTermos', function(){

    $('#modalPoliticaPrivacidade').modal('show');

});
