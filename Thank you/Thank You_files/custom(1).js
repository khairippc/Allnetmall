



let productPrice = 0.00;
let shippingCost = 0.00;


$('.area-selection').change(function() {

  var areaId = $(this).attr('data-id');

  $(".fg").hide();

  $(".fg-" + areaId).show();
  shippingCost = $(".fg-" + areaId).find('input').attr('data-price');
  shippingCost = new Number(parseFloat(shippingCost)).toFixed(2);

  $("#shipping_cost").val( parseInt( shippingCost ) );
  updateTotalAmount();
});

function loadShippingCost()
{
  shippingCost = $('.shipping-cost-selected [type="radio"]').attr('data-price');
  shippingCost = new Number(parseFloat(shippingCost)).toFixed(2);
}

function loadProductPrice()
{
  tmpProductPrice = $('input[type=radio][name=quantity]:checked').attr('data-price');
  tmpProductPrice = new Number(parseFloat(tmpProductPrice)).toFixed(2);

  if(! isNaN(tmpProductPrice)){
    productPrice = tmpProductPrice;
  }

}

$('input[type=radio][name=quantity]').change(function() {

  productPrice = $(this).attr('data-price');
  productPrice = new Number(parseFloat(productPrice)).toFixed(2);

  $("#product_price").val( parseInt( productPrice ) );

  let unitLabel = $(this).attr('data-label');
  $("#unit_label").val( unitLabel );


  updateTotalAmount();

});

$('#quantity').change(function() {

  var amount = $(this).find(":selected").attr('data-price');

  $('#amount').attr('value', amount);


});

function getTotalAmount(){
  if(isNaN(shippingCost)){
    shippingCost = 0;
  }
  
  var total = parseFloat(productPrice) + parseFloat(shippingCost);
  return total.toFixed(2);

}

function updateTotalAmount(){
  $('#amount').attr('value', parseInt(getTotalAmount()));
  $('.total-amount').val(getTotalAmount());
}

$('.sel-color').change(function() {

  const qty = $('[name="quantity"]:checked').val();
  const selected = $('.sel-color:checked').length;

  if( $(this).prop('checked')) {

    if(qty < selected){
      $('.sel-color:checked').not(this).first().prop('checked', false).parent().find('.sel-box').removeClass('selected');
    }

    if(!$(this).parent().find('.sel-box').hasClass('selected'))
    {
      $(this).parent().find('.sel-box').addClass('selected');
    }

  }else {
    $(this).parent().find('.sel-box').removeClass('selected');
  }
});

$( document ).ready(function() {

  productPrice = $('input[type=radio][name=quantity]:checked').attr('data-price');
  productPrice = new Number(parseFloat(productPrice)).toFixed(2);


    var areaId = $('.area-selection:checked').attr('data-id');

    $(".fg").hide();

    $(".fg-" + areaId).show();
    // shippingCost = $(".fg-" + areaId).find('input').attr('data-price');
    // shippingCost = new Number(parseFloat(shippingCost)).toFixed(2);
  if(areaId === 'area1'){
    shippingCost = 10;
  }else{
    shippingCost = 15;
  }

 loadShippingCost();
    updateTotalAmount();


  if(typeof PAGE !== 'undefined'){



    let pageUrl = location.protocol + '//' + location.host + location.pathname;

    switch (PAGE) {
      case 'product':

        $.ajax({
          url: pageUrl,
          type: "GET",
          data: {
            ajax: 1
          }
        });



        break;
    }


  }

 
  //
  // let tmpAmount = $("#amount").val();
  // console.log(tmpAmount);
  // if(tmpAmount > 1){
  //   $(".total-amount").text( tmpAmount );
  // }
  //
  // // tmpProductPrice = $('input[type=radio][name=quantity]').is(":checked");
  // // console.log(tmpProductPrice);
  // // if($('input:first').val().length !== 0){
  // //   if(tmpAmount > 1){
  // //     $(".total-amount").text( tmpAmount );
  // //   }
  // // }
  //
  // console.log($("#product_price").val());


});


//

// loadProductPrice();
// console.log(productPrice);
// if(! isNaN( productPrice )){
//   updateTotalAmount();
// }



$("#upsale-update-order").on('click', function (){

  let selectedProducts = [];
  let $thisBtn = $(this);
  $(".upsale-item").each(function(index, element) {

    let $this = $(this);
    let pId = $this.attr('data-pid');
    let isCustomPrice = $this.attr('data-is-custom-price') === '1';
    let colors = $this.find('input[name="color[]"]:checked').val();
    let sizes = $this.find('input[name="size[]"]:checked').map(function() {
      return this.value;
    }).get();

    if(typeof colors === "undefined") {
      colors = '';
    }
    if(typeof sizes === "undefined") {
      sizes = [];
    }

    if(! isCustomPrice){
      let v = $this.find('input.quantity:checked').val();
      if(v){

        selectedProducts.push({
          pid: pId,
          qty: v,
          colors: colors,
          sizes: sizes,
        });

      }
    }else{
      let v = $this.find('input[name="pselected"]:checked').val();
      if(v){
        selectedProducts.push({
          pid: pId,
          qty: 1,
          colors: colors,
          sizes: sizes,
        });
      }
    }

  });


  if(selectedProducts.length === 0){
    alert('Please select product to update order!');
    return;
  }

  $thisBtn.attr('disabled', 'disabled');

  $.ajax({
    url: './action-upsale',
    method: 'POST',
    data: {
      products: selectedProducts
    },
    success: function (response){
      if(response.success){
        window.location.href = response.data;
      }else{
        alert('Something went wrong, try again later!');
        $thisBtn.removeAttr('disabled');
      }
    },

  });


});
