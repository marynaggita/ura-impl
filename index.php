<?php
// Get the parameter from the URL
$param = isset($_GET['prn']) ? $_GET['prn'] : 'No prn provided';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Checkout Payment</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>

  <!-- Popup Container -->
  <div id="checkout-popup" style="display: none; position: absolute; z-index: 999;">
    <button id="close-iframe" onclick="closePopup()"
      style="z-index: 99999999999; color: red; position: fixed; right: 0; font-size: xx-large; top: 0; margin: 8px; border: none; background: none;">
      ×
    </button>
    <iframe id="checkout-form-container" name="checkout-form-container" style='
      width: 100%;
      height: 100%;
      position: fixed;
      text-align:center;
      border: none;
      top: 0;
      left: 0;
      background-color:#00151FA6;
      content:"Loading..."'>
    </iframe>
  </div>

  <div class="main_container">
    <div class="container">
      <div class="payment_detail">
        <div class="logo_banner">
          <img class="isw" src="interswitch.png" alt="Interswitch Logo">
          <img src="ura.png" alt="URA Logo">
        </div>

        <h1>Confirm Payment Details</h1>
        <p id="alert" style="color: red; display: none;"></p>
        <div class="payment-row">
          <ul class="ura-data">
            <li><h5 class="label">Name:</h5> <h5 id="ura-name" class="value">—</h5></li>
            <li><h5 class="label">Payment to:</h5> <h5 id="ura-payto" class="value">—</h5></li>
            <li><h5 class="label">Payment for:</h5> <h5 id="ura-purpose" class="value">—</h5></li>
            <li><h5 class="label">PRN:</h5> <h5 id="ura-prn" class="value ft-bold">—</h5></li>
            <li><h5 class="label">TIN:</h5> <h5 id="ura-tin" class="value ft-bold">—</h5></li>
            <li><h5 class="label">Amount:</h5> <h5 id="ura-amount" class="value ft-bold">—</h5></li>
          </ul>

          <ul class="input-data">
            <li>
              <span class="label">Email:</span>
              <input type="email" placeholder="Enter email address" id="email" onkeyup="captureAdditionalInfo('email')">
            </li>
            <li>
              <span class="label">Phone Number:</span>
              <input type="tel" placeholder="Enter phone number" id="phone" onkeyup="captureAdditionalInfo('phone')">
            </li>
             <li id="checkout-error">
               Please provide all required fields.
             </li>
          </ul>
        </div>
      </div>

      <div class="button_container">
        <button onclick="openPopup()" class="btn">Continue To Payment</button>
      </div>
      

    <div id="loading-dialog">
      <img id="loader-img" src="loader.gif" width="100px"/>
      <h3 id="loader-msg">Validating Payment Details...</h3>
      <p id="error" class="text-danger"></p>
      <button onclick="validatePRN()" id="retry-btn" class="btn btn-danger">Retry</button>
    </div>
    </div>
  </div>

  <script type="text/javascript" src="payments.js"></script>

</body>
</html>
