$( document ).ready(function() {
     ipLookUp();
     console.log(city);
     console.log(cityToOperator[city]);
     cityToOperator[city].forEach(operator=>{
        $('#company_names').append('<input type="radio" class="btn btn-primary " style="width: 100px;" name="company">'+operator+'</input>');
     })
    cityToInfraction[city].forEach(infraction=>{
        $('#infraction_checkbox').append('<div class="items "> <div class="info-block block-info clearfix"> <div data-toggle="buttons" class="btn-group bizmoduleselect" style="width: 100%"> <label class="btn btn-light"> <div class="itemcontent"> <input type="checkbox" class="visually-hidden" autocomplete="off" value=""> <h5>'+infraction+'</h5> </div> </label> </div> </div> </div>');
     })
});